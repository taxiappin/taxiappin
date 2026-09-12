import { Request, Response } from "express";
import crypto from "crypto";
import { GoogleGenAI, Type } from "@google/genai";
import { FALLBACK_DB } from "../config/fallbackDb";
import { 
  globalTrips, 
  globalDrivers, 
  globalRiders, 
  globalMessages, 
  globalConfig,
  saveConfig,
  syncTrip,
  syncDriver,
  removeTrip,
  globalSubscriptionTransactions,
  saveSubscriptionTransaction,
  syncMessage,
  deleteThreadMessages,
  removeMessage
} from "../models/db";
import { broadcastNotification, sendNotificationToUser } from "../services/webPushService";
import { getPgPool, getIsPgConnected } from "../models/postgres";
import { generateLocalTripId, generateIntercityTripId } from "../services/idGenerator";

async function geminiGeocodeReverse(lat: string, lon: string): Promise<any | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  try {
    const prompt = `You are an expert reverse-geocoding assistant for a Ride-sharing app (like Uber or Ola).
Given the coordinates: Latitude = ${lat}, Longitude = ${lon}.

Find the actual real-world location or address corresponding to these coordinates.
Generate a realistic and accurate JSON object containing:
1. "display_name": Fully formatted, realistic address (e.g. "Capitol Park, Detroit, MI 48226, USA" or "HITEC City Metro Station, Madhapur Road, HITEC City, Hyderabad, Telangana, 500081, India")
2. "address": An object containing fields:
   - "road" (string, optional)
   - "suburb" (string, optional)
   - "city" (string, optional)
   - "state" (string, optional)
   - "postcode" (string, optional)
   - "country" (string, optional)
   - "amenity" (string, optional, e.g. landmark name)
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            display_name: { type: Type.STRING },
            address: {
              type: Type.OBJECT,
              properties: {
                road: { type: Type.STRING },
                suburb: { type: Type.STRING },
                city: { type: Type.STRING },
                state: { type: Type.STRING },
                postcode: { type: Type.STRING },
                country: { type: Type.STRING },
                amenity: { type: Type.STRING },
              },
            },
          },
          required: ["display_name"],
        },
      },
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text);
      if (parsed && parsed.display_name) {
        console.log(`[GEMINI REVERSE] Successfully reverse-geocoded ${lat}, ${lon} to: "${parsed.display_name}"`);
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error in geminiGeocodeReverse:", err);
  }
  return null;
}

// Geocoding reverse proxy
export async function geocodeReverse(req: Request, res: Response) {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: "Latitude and longitude are required" });
  }
  try {
    const queryString = new URLSearchParams(req.query as any).toString();
    const usersAgent = `TaxiAppLocalApp/3.1 (UserSession_${Math.floor(Math.random() * 1000000)}; contact: iamshrenu@gmail.com)`;
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${queryString}`,
      {
        headers: {
          "User-Agent": usersAgent,
          "Accept-Language": "en-US,en;q=0.9"
        }
      }
    );
    if (!response.ok) {
      throw new Error(`Nominatim responded with status ${response.status}`);
    }
    const data = await response.json();
    return res.json(data);
  } catch (error: any) {
    console.log(`[GEOCODE REVERSE] Nominatim failed with error: ${error.message}. Trying Gemini reverse-geocoding.`);
    const geminiResult = await geminiGeocodeReverse(lat as string, lon as string);
    if (geminiResult) {
      return res.json(geminiResult);
    }

    // Secondary high-reliability provider (BigDataCloud free reverse geocode)
    try {
      const bdcResp = await fetch(
        `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
        { headers: { "User-Agent": "TaxiApp/1.0" } }
      );
      if (bdcResp.ok) {
        const bdcData = await bdcResp.json();
        const parts = [
          bdcData.locality || bdcData.subLocality || bdcData.neighbourhood,
          bdcData.city || bdcData.principalSubdivision,
          bdcData.countryName,
        ].filter(Boolean);

        if (parts.length > 0) {
          const displayName = parts.join(", ");
          return res.json({
            place_id: `bdc_${lat}_${lon}`,
            lat: String(lat),
            lon: String(lon),
            display_name: displayName,
            address: {
              road: bdcData.locality || bdcData.subLocality || "Current Location",
              city: bdcData.city || bdcData.principalSubdivision || "",
              country: bdcData.countryName || "",
            },
          });
        }
      }
    } catch (bdcErr: any) {
      console.warn("[GEOCODE REVERSE] BigDataCloud fallback error:", bdcErr.message);
    }

    const latNum = parseFloat(lat as string);
    const lonNum = parseFloat(lon as string);
    
    let closestItem = FALLBACK_DB[0];
    let minDistance = Infinity;
    
    for (const item of FALLBACK_DB) {
      const itemLat = parseFloat(item.lat);
      const itemLon = parseFloat(item.lon);
      const dist = Math.sqrt(Math.pow(latNum - itemLat, 2) + Math.pow(lonNum - itemLon, 2));
      if (dist < minDistance) {
        minDistance = dist;
        closestItem = item;
      }
    }
    
    // Only use offline landmark if it is actually nearby (< ~15 km or 0.15 degrees)
    if (minDistance <= 0.15) {
      console.log(`[GEOCODE SUCCESS (LOCAL FALLBACK)] Serving nearby landmark "${closestItem.display_name}" (${minDistance.toFixed(3)} deg away)`);
      return res.json(closestItem);
    }

    // Otherwise return clean coordinate-based location rather than a landmark from another city
    const coordDisplay = `GPS Location (${latNum.toFixed(4)}, ${lonNum.toFixed(4)})`;
    return res.json({
      place_id: `coord_${latNum}_${lonNum}`,
      lat: String(latNum),
      lon: String(lonNum),
      display_name: coordDisplay,
      address: {
        road: `Coordinates ${latNum.toFixed(4)}, ${lonNum.toFixed(4)}`,
      },
    });
  }
}

let geminiClient: any = null;
function getGeminiClient() {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("[GEMINI GEOCODE] GEMINI_API_KEY is not defined, skipping AI-powered geocoding fallback");
      return null;
    }
    geminiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        }
      }
    });
  }
  return geminiClient;
}

const spellingCorrectionsMap: Record<string, string> = {
  "kukatpalli": "kukatpally",
  "kukatpaly": "kukatpally",
  "kukatpali": "kukatpally",
  "kukatpalli main road": "kukatpally main road",
  "kukkatpally": "kukatpally",
  "kukkutpally": "kukatpally",
  "kphb": "kphb",
  "pedapalli": "peddapalli",
  "pedapally": "peddapalli",
  "peddapally": "peddapalli",
  "peddapalli": "peddapalli",
  "hyderbad": "hyderabad",
  "hydrabad": "hyderabad",
  "hiderabad": "hyderabad",
  "secundrabad": "secunderabad",
  "secunderbad": "secunderabad",
  "gachibouli": "gachibowli",
  "gachiboli": "gachibowli",
  "gachibowly": "gachibowli",
  "kondapur": "kondapur",
  "kandapur": "kondapur",
  "madhapur": "madhapur",
  "madapur": "madhapur",
  "miyapur": "miyapur",
  "miapur": "miyapur",
  "begumpet": "begumpet",
  "begumpat": "begumpet",
  "shamshabad": "shamshabad",
  "samshabad": "shamshabad",
  "shamsabad": "shamshabad",
  "jubli hills": "jubilee hills",
  "jublee hills": "jubilee hills",
  "jubilee": "jubilee hills",
  "filmnagar": "film nagar",
  "warangal": "warangal",
  "orangal": "warangal",
  "worangal": "warangal",
  "patna": "patna",
  "patana": "patna",
  "bengaluru": "bangalore",
  "banglore": "bangalore",
  "mumbai": "mumbai",
  "bombay": "mumbai",
  "kothagudem": "kothagudem",
  "kottagudem": "kothagudem",
  "khammam": "khammam",
  "kamam": "khammam",
  "karimnagar": "karimnagar",
  "nizamabad": "nizamabad",
  "nisamabad": "nizamabad",
  "nalgonda": "nalgonda",
  "mahbubnagar": "mahbubnagar",
  "mehabubnagar": "mahbubnagar",
  "adilabad": "adilabad",
  "mancherial": "mancherial",
  "mancheral": "mancherial",
  "kagajnagar": "kagaznagar",
  "kaggaznagar": "kagaznagar",
  "asifabad": "asifabad",
  "chanda nagar": "chandanagar",
  "chandanagar": "chandanagar",
  "hitec city": "hitec city",
  "hitech city": "hitec city",
  "dilsukhnagar": "dilsukhnagar",
  "dilsuknagar": "dilsuknagar",
  "ameerpet": "ameerpet",
  "amirpet": "ameerpet",
};

const correctSpellingInQuery = (query: string): string => {
  if (!query) return "";
  let corrected = query.toLowerCase().trim();

  const multiWordTypos = [
    { typo: "jubli hills", correct: "jubilee hills" },
    { typo: "jublee hills", correct: "jubilee hills" },
    { typo: "hitech city", correct: "hitec city" },
    { typo: "kukatpalli main road", correct: "kukatpally main road" },
    { typo: "kukatpally main road", correct: "kukatpally main road" },
    { typo: "gachibowli dlf", correct: "gachibowli dlf" },
    { typo: "chanda nagar", correct: "chandanagar" },
    { typo: "film nagar", correct: "film nagar" },
    { typo: "filmnagar", correct: "film nagar" },
  ];

  for (const item of multiWordTypos) {
    if (corrected.includes(item.typo)) {
      corrected = corrected.replace(new RegExp(item.typo, "g"), item.correct);
    }
  }

  const words = corrected.split(/\s+/);
  const correctedWords = words.map(word => {
    const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
    const typoCorrection = spellingCorrectionsMap[cleanWord];
    if (typoCorrection) {
      return word.replace(cleanWord, typoCorrection);
    }
    return word;
  });

  return correctedWords.join(" ");
};

async function geminiGeocodeSearch(query: string, viewbox?: string): Promise<any[] | null> {
  const ai = getGeminiClient();
  if (!ai) return null;

  try {
    const prompt = `You are an expert geocoding assistant for a Ride-sharing app (like Uber or Ola).
The user is searching for: "${query}".
The user may have made spelling mistakes or typos (for example, "kukatpalli" instead of "kukatpally", "hyderbad" instead of "hyderabad", "pedapalli" instead of "peddapalli", "gachibouli" instead of "gachibowli", "jubli hills" instead of "jubilee hills").
IMPORTANT: You MUST recognize the intended corrected real-world location, fix any spelling errors, and output highly accurate results for the corrected real-world locations.

${viewbox ? `The map viewport bias area is bounded by: ${viewbox} (West, North, East, South). Please prioritize results near this area if relevant, but also allow global search if the user explicitly searches for cities/locations elsewhere in the world (like Detroit, London, New York, Tokyo).` : ""}

Generate a highly accurate, realistic, and relevant JSON list of up to 10 matching locations.
Include:
- Specific landmarks (airports, transit stations, hotels, malls, corporate parks)
- Well-known streets or intersections
- Neighborhoods/suburbs
- Local and intercity matches

For each match, return:
1. "display_name": fully formatted address (e.g. "Detroit Metropolitan Wayne County Airport (DTW), Detroit, MI, USA" or "HITEC City Metro Station, Hyderabad, Telangana, 500081, India")
2. "lat": latitude as a string (e.g. "42.2162")
3. "lon": longitude as a string (e.g. "-83.3554")
4. "type": "point" or "station" or "suburb" or "city"
5. "addresstype": "aeroway" or "railway" or "suburb" or "city" or "road"
6. "address": an object containing:
   - "road" (string, optional)
   - "suburb" (string, optional)
   - "city" (string, optional)
   - "state" (string, optional)
   - "postcode" (string, optional)
   - "country" (string, optional)
   - "amenity" (string, optional, e.g. landmark name)
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              display_name: { type: Type.STRING },
              lat: { type: Type.STRING },
              lon: { type: Type.STRING },
              type: { type: Type.STRING },
              addresstype: { type: Type.STRING },
              address: {
                type: Type.OBJECT,
                properties: {
                  road: { type: Type.STRING },
                  suburb: { type: Type.STRING },
                  city: { type: Type.STRING },
                  state: { type: Type.STRING },
                  postcode: { type: Type.STRING },
                  country: { type: Type.STRING },
                  amenity: { type: Type.STRING },
                },
              },
            },
            required: ["display_name", "lat", "lon"],
          },
        },
      },
    });

    const text = response.text;
    if (text) {
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log(`[GEMINI GEOCODE] Successfully generated ${parsed.length} results for query: "${query}"`);
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error in geminiGeocodeSearch:", err);
  }
  return null;
}

// Geocoding search proxy
export async function geocodeSearch(req: Request, res: Response) {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: "Query parameter 'q' is required" });
  }

  const originalQuery = q.toString();
  const correctedQuery = correctSpellingInQuery(originalQuery);
  const qLower = correctedQuery.toLowerCase().trim();

  try {
    const usersAgent = `TaxiAppLocalApp/3.1 (UserSession_${Math.floor(Math.random() * 1000000)}; contact: iamshrenu@gmail.com)`;
    const queryParamsBiased = { ...req.query, q: correctedQuery };
    const queryStringBiased = new URLSearchParams(queryParamsBiased as any).toString();

    // Extract lat/lon for Photon location-biased OSM search if present in viewbox or query
    let centerLat = req.query.lat ? String(req.query.lat) : undefined;
    let centerLon = req.query.lon ? String(req.query.lon) : undefined;
    if (!centerLat && req.query.viewbox) {
      const parts = String(req.query.viewbox).split(",");
      if (parts.length === 4) {
        centerLon = String((parseFloat(parts[0]) + parseFloat(parts[2])) / 2);
        centerLat = String((parseFloat(parts[1]) + parseFloat(parts[3])) / 2);
      }
    }

    const fetchPhoton = async (): Promise<any[]> => {
      try {
        let photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(correctedQuery)}&limit=10`;
        if (centerLat && centerLon) {
          photonUrl += `&lat=${centerLat}&lon=${centerLon}`;
        }
        const res = await fetch(photonUrl, { headers: { "Accept": "application/json" } });
        if (!res.ok) return [];
        const data = await res.json();
        if (!data || !data.features) return [];

        return data.features.map((f: any) => {
          const p = f.properties || {};
          const coords = f.geometry?.coordinates || [0, 0];
          const name = p.name || p.street || p.city || p.district || "Location";
          const subParts = [
            p.street ? `${p.housenumber || ''} ${p.street}`.trim() : null,
            p.district || p.suburb || p.locality,
            p.city || p.town || p.county,
            p.state,
            p.country
          ].filter(Boolean);
          
          const displayName = [name, ...subParts].filter((v, i, a) => a.indexOf(v) === i).join(", ");
          
          return {
            display_name: displayName,
            title: name,
            subtitle: subParts.join(", "),
            lat: String(coords[1]),
            lon: String(coords[0]),
            type: p.type || "point",
            addresstype: p.type || "place",
            address: {
              amenity: p.name,
              road: p.street,
              suburb: p.district || p.suburb,
              city: p.city || p.town,
              state: p.state,
              country: p.country,
              postcode: p.postcode
            }
          };
        });
      } catch (e) {
        return [];
      }
    };

    const fetchPromises: Promise<any[]>[] = [
      fetchPhoton(),
      fetch(
        `https://nominatim.openstreetmap.org/search?${queryStringBiased}`,
        {
          headers: {
            "User-Agent": usersAgent,
            "Accept-Language": "en-US,en;q=0.9"
          }
        }
      ).then(async r => {
        if (!r.ok) return [];
        try { return await r.json(); } catch { return []; }
      }).catch(() => [])
    ];

    // If there is a viewbox, perform a parallel global search without the viewbox restriction
    const hasViewbox = !!req.query.viewbox;
    if (hasViewbox) {
      const queryParamsGlobal = { ...req.query, q: correctedQuery };
      delete (queryParamsGlobal as any).viewbox;
      delete (queryParamsGlobal as any).bounded;
      const queryStringGlobal = new URLSearchParams(queryParamsGlobal as any).toString();

      fetchPromises.push(
        fetch(
          `https://nominatim.openstreetmap.org/search?${queryStringGlobal}`,
          {
            headers: {
              "User-Agent": usersAgent,
              "Accept-Language": "en-US,en;q=0.9"
            }
          }
        ).then(async r => {
          if (!r.ok) return [];
          try { return await r.json(); } catch { return []; }
        }).catch(() => [])
      );
    }

    const [photonRaw = [], biasedRaw = [], globalRaw = []] = await Promise.all(fetchPromises);

    // Clean up results and replace confusing highway names with Mancherial
    const cleanRawItem = (item: any) => {
      let displayName = item.display_name || "";
      let lat = item.lat;
      let lon = item.lon;
      const lowerName = displayName.toLowerCase();
      if (lowerName.includes("hyderabad - mancherial") || lowerName.includes("hyderabad-mancherial") || lowerName.includes("mancherial highway")) {
        displayName = "Mancherial Town, Telangana, India";
        lat = "18.8684";
        lon = "79.4305";
        if (item.address) {
          item.address.city = "Mancherial";
          item.address.state = "Telangana";
        }
      }
      return {
        ...item,
        display_name: displayName,
        lat,
        lon
      };
    };

    const photonCleaned = photonRaw.map(cleanRawItem);
    const biasedCleaned = biasedRaw.map(cleanRawItem);
    const globalCleaned = globalRaw.map(cleanRawItem);

    // Intelligent relevance scoring system to prioritize global/major places over minor local ones if global search matches better
    const scoreResult = (item: any, isBiased: boolean, isPhoton: boolean = false) => {
      let score = 0;
      const displayName = (item.display_name || "").toLowerCase();
      const qLowerClean = qLower.toLowerCase();

      const isCityOrRegion = 
        item.type === "city" || 
        item.addresstype === "city" || 
        item.addresstype === "administrative" || 
        item.addresstype === "country" || 
        item.class === "boundary";

      if (displayName.startsWith(qLowerClean)) {
        score += 100;
      } else if (displayName.includes(qLowerClean)) {
        score += 40;
      }

      if (isCityOrRegion) {
        score += 60;
      }

      if (isBiased) {
        score += 35; // local bias weight
      }

      if (isPhoton) {
        score += 50; // photon location-biased boost
      }

      return score;
    };

    // Combine results with scores
    const combinedWithScores = [
      ...photonCleaned.map((item: any) => ({ item, score: scoreResult(item, true, true) })),
      ...biasedCleaned.map((item: any) => ({ item, score: scoreResult(item, true, false) })),
      ...globalCleaned.map((item: any) => ({ item, score: scoreResult(item, false, false) }))
    ];

    // Deduplicate and sort by score descending
    const seenNames = new Set<string>();
    const mergedResults: any[] = [];

    combinedWithScores
      .sort((a, b) => b.score - a.score)
      .forEach(({ item }) => {
        if (!seenNames.has(item.display_name)) {
          seenNames.add(item.display_name);
          mergedResults.push(item);
        }
      });

    if (mergedResults.length > 0) {
      return res.json(mergedResults);
    }

    console.log(`[GEOCODE] Nominatim returned 0 results for query: "${originalQuery}" (corrected: "${correctedQuery}"). Trying Gemini fallback.`);
    const geminiResults = await geminiGeocodeSearch(correctedQuery, req.query.viewbox as string);
    if (geminiResults && geminiResults.length > 0) {
      const cleanedGemini = geminiResults.map((item: any) => {
        let displayName = item.display_name || "";
        let lat = item.lat;
        let lon = item.lon;
        const lowerName = displayName.toLowerCase();
        if (lowerName.includes("hyderabad - mancherial") || lowerName.includes("hyderabad-mancherial") || lowerName.includes("mancherial highway")) {
          displayName = "Mancherial Town, Telangana, India";
          lat = "18.8684";
          lon = "79.4305";
        }
        return { ...item, display_name: displayName, lat, lon };
      }).filter((v: any, i: number, a: any[]) =>
        a.findIndex((t: any) => t.display_name === v.display_name) === i
      );
      return res.json(cleanedGemini);
    }
    return res.json([]);
  } catch (error: any) {
    console.log(`[GEOCODE] Nominatim failed with error: ${error.message}. Trying Gemini geocoding.`);
    const geminiResults = await geminiGeocodeSearch(correctedQuery, req.query.viewbox as string);
    if (geminiResults && geminiResults.length > 0) {
      const cleanedGemini = geminiResults.map((item: any) => {
        let displayName = item.display_name || "";
        let lat = item.lat;
        let lon = item.lon;
        const lowerName = displayName.toLowerCase();
        if (lowerName.includes("hyderabad - mancherial") || lowerName.includes("hyderabad-mancherial") || lowerName.includes("mancherial highway")) {
          displayName = "Mancherial Town, Telangana, India";
          lat = "18.8684";
          lon = "79.4305";
        }
        return { ...item, display_name: displayName, lat, lon };
      }).filter((v: any, i: number, a: any[]) =>
        a.findIndex((t: any) => t.display_name === v.display_name) === i
      );
      return res.json(cleanedGemini);
    }

    const tokens = qLower.split(/\s+/).filter(t => t.length > 0);
    const matches = FALLBACK_DB.filter(item => {
      const nameLower = item.display_name.toLowerCase();
      return nameLower.includes(qLower) || (tokens.length > 0 && tokens.every(token => nameLower.includes(token)));
    });

    if (matches.length > 0) {
      console.log(`[GEOCODE SUCCESS (LOCAL FALLBACK)] Serving ${matches.length} matching landmarks from fallbacks for query: "${q}"`);
      return res.json(matches);
    }

    const generalFallbackList = FALLBACK_DB.slice(0, 8);
    console.log(`[GEOCODE SUCCESS (GENERAL FALLBACK)] Serving default landmarks for vague/failed query: "${q}"`);
    return res.json(generalFallbackList);
  }
}

// Login authentication helper
export async function login(req: Request, res: Response) {
  const { email, password, role } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  const hashedPassword = crypto.createHash("sha256").update(password).digest("hex");
  const p = getPgPool();
  const isPg = getIsPgConnected();

  try {
    if (p && isPg) {
      const checkRider = async () => {
        const result = await p.query("SELECT * FROM riders WHERE email = $1", [email]);
        if (result.rows.length > 0) {
          const user = result.rows[0];
          if (user.password === hashedPassword) {
            return {
              id: user.id,
              role: "rider",
              name: user.name,
              email: user.email,
              phone: user.phone,
              status: user.status || "Active",
              avatar: user.avatar || `https://i.pravatar.cc/150?u=${user.phone}`,
              trips: user.trips || 0,
              rating: parseFloat(user.rating || "5.0")
            };
          }
        }
        return null;
      };

      const checkDriver = async () => {
        const result = await p.query("SELECT * FROM drivers WHERE email = $1", [email]);
        if (result.rows.length > 0) {
          const user = result.rows[0];
          if (user.password === hashedPassword) {
            return {
              id: user.id,
              role: "driver",
              name: user.name,
              email: user.email,
              phone: user.phone,
              status: user.status || "Active",
              applicationStatus: "Approved",
              trips: user.trips || 0,
              rating: parseFloat(user.rating || "5.0"),
              vehicle: user.vehicle || "White Swift (MH12 AA 1111)",
              earnings: parseFloat(user.earnings || "0.0"),
              type: user.type || 'CAR',
              isVerified: true,
              kycApproved: true,
              driver_kyc_status: "Approved",
            };
          }
        }
        return null;
      };

      let userProfile = null;
      if (role === "driver") {
        userProfile = await checkDriver();
        if (!userProfile) userProfile = await checkRider();
      } else if (role === "rider") {
        userProfile = await checkRider();
        if (!userProfile) userProfile = await checkDriver();
      } else {
        userProfile = await checkDriver() || await checkRider();
      }

      if (userProfile) {
        if (userProfile.role === "rider") {
          globalRiders[userProfile.id] = userProfile;
        } else {
          globalDrivers[userProfile.id] = userProfile;
        }
        return res.json(userProfile);
      }
    } else {
      if (role === "driver") {
        let matchedDriver = Object.values(globalDrivers).find((d: any) => d.email === email || d.phone === email);
        if (matchedDriver && matchedDriver.password === hashedPassword) {
          return res.json({
            ...matchedDriver,
            role: "driver",
            status: "Active",
            applicationStatus: "Approved",
            isVerified: true,
            kycApproved: true,
            driver_kyc_status: "Approved",
          });
        }
        let matchedRider = Object.values(globalRiders).find((r: any) => r.email === email || r.phone === email);
        if (matchedRider && matchedRider.password === hashedPassword) {
          return res.json({ ...matchedRider, role: "rider" });
        }
      } else {
        let matchedRider = Object.values(globalRiders).find((r: any) => r.email === email || r.phone === email);
        if (matchedRider && matchedRider.password === hashedPassword) {
          return res.json({ ...matchedRider, role: "rider" });
        }
        let matchedDriver = Object.values(globalDrivers).find((d: any) => d.email === email || d.phone === email);
        if (matchedDriver && matchedDriver.password === hashedPassword) {
          return res.json({
            ...matchedDriver,
            role: "driver",
            status: "Active",
            applicationStatus: "Approved",
            isVerified: true,
            kycApproved: true,
            driver_kyc_status: "Approved",
          });
        }
      }
    }

    return res.status(401).json({ error: "Invalid email or password." });
  } catch (error: any) {
    console.error("[LOGIN ERROR]", error);
    return res.status(500).json({ error: "Database error during login.", message: error.message });
  }
}

// Get active/live drivers
export function getDrivers(req: Request, res: Response) {
  const activeThreshold = Date.now() - 30000;
  const realActiveDrivers = Object.values(globalDrivers).filter(d => d.id.startsWith("driver_") || d.lastSeen > activeThreshold);
  return res.json(realActiveDrivers);
}

// Update driver location status
export function updateDriverStatus(req: Request, res: Response) {
  const { id, name, coords, status } = req.body;
  if (!id) return res.status(400).json({ error: "Missing ID" });
  const driverData = { id, name: name || 'Driver', coords, status: status || 'idle', lastSeen: Date.now() };
  globalDrivers[id] = driverData;
  
  const io = req.app.get("io");
  if (io) {
    io.emit("driver_update", driverData);
  }
  return res.json({ success: true });
}

// Global Driver Ledgers in-memory cache
export const globalDriverLedgers: Record<string, any[]> = {};

// Get driver earnings & expenses ledger
export function getDriverLedger(req: Request, res: Response) {
  const driverId = req.query.driverId as string;
  if (!driverId) {
    return res.json(globalDriverLedgers);
  }
  return res.json(globalDriverLedgers[driverId] || []);
}

// Save/sync driver earnings & expenses ledger
export function saveDriverLedger(req: Request, res: Response) {
  const { driverId, driverName, ledger } = req.body;
  if (!driverId || !Array.isArray(ledger)) {
    return res.status(400).json({ error: "Invalid driverId or ledger format" });
  }
  globalDriverLedgers[driverId] = ledger;
  if (globalDrivers[driverId]) {
    globalDrivers[driverId].ledger = ledger;
    if (driverName) globalDrivers[driverId].name = driverName;
  }
  return res.json({ success: true, count: ledger.length });
}

// Get global list of trips
export function getTrips(req: Request, res: Response) {
  return res.json(globalTrips);
}

// Create new trip
export function createTrip(req: Request, res: Response) {
  const userId = req.body.ownerId;
  const io = req.app.get("io");

  if (req.body.type === 'request' && userId) {
    for (let i = 0; i < globalTrips.length; i++) {
      const trip = globalTrips[i];
      if (trip.ownerId === userId && (trip.status === 'Active' || trip.status === 'Pending')) {
        const cTrip = { ...trip, status: 'Cancelled', updatedAt: new Date().toISOString(), reason: 'superseded' };
        globalTrips[i] = cTrip;
        syncTrip(cTrip).catch(err => console.error("[POSTGRES] Sync superseded trip error:", err));
        if (io) {
          io.to(`trip_${trip.id}`).emit("trip_update", cTrip);
        }
      }
    }
  }

  const pickupAddress = typeof req.body.pickup === 'object' && req.body.pickup ? req.body.pickup.address : req.body.pickup_name || req.body.pickup || "";
  const dropAddress = typeof req.body.drop === 'object' && req.body.drop ? req.body.drop.address : req.body.dropoff_name || req.body.drop || "";
  
  const parseCityFromAddress = (addr: string): string => {
    if (!addr) return "";
    const parts = addr.split(",");
    return (parts[parts.length - 1] || addr).trim();
  };

  const isIntercity = req.body.tripType?.toLowerCase() === 'intercity' || req.body.type?.toLowerCase() === 'intercity';
  const pickupCity = parseCityFromAddress(pickupAddress);
  const dropCity = parseCityFromAddress(dropAddress);

  const generatedId = isIntercity 
    ? generateIntercityTripId(pickupCity, dropCity)
    : generateLocalTripId(pickupCity);

  const trip = {
    ...req.body,
    id: req.body.id || generatedId,
    otp: Math.floor(1000 + Math.random() * 9000).toString(), // Secure 4-digit OTP
    user: globalRiders[userId]?.name || req.body.user || 'Rider',
    customer: globalRiders[userId] ? { 
      name: globalRiders[userId].name, 
      avatar: globalRiders[userId].avatar || 'https://picsum.photos/seed/rider/100/100',
      rating: 4.8 
    } : (req.body.customer || { name: 'Rider', avatar: 'https://picsum.photos/seed/rider/100/100', rating: 4.8 }),
    createdAt: new Date().toISOString()
  };
  globalTrips.push(trip);
  syncTrip(trip).catch(err => console.error("[POSTGRES] Sync new trip error:", err));

  if (io) {
    io.emit("new_trip_alert", trip); // Notify all drivers about new request
  }

  // Real-time Web Push broadcast to drivers even if PWA is closed
  broadcastNotification("Drivers", {
    title: "🚕 New Ride Request Available!",
    body: `New pool match request from ${trip.user || "Rider"}. Tap to review and accept.`,
    url: "/jobs",
    actionLabel: "Review Request",
    actionUrl: "/jobs"
  }).catch(err => console.error("[WEB-PUSH] Error broadcasting new trip to drivers:", err));

  return res.status(201).json(trip);
}

// Cancel existing trip
export function cancelTrip(req: Request, res: Response) {
  const { id, userId } = req.body;
  const io = req.app.get("io");
  let cancelledTrip: any = null;

  for (let i = 0; i < globalTrips.length; i++) {
    if (globalTrips[i].id === id) {
      cancelledTrip = { ...globalTrips[i], status: 'Cancelled', updatedAt: new Date().toISOString(), cancelledBy: userId };
      globalTrips[i] = cancelledTrip;
      syncTrip(cancelledTrip).catch(err => console.error("[POSTGRES] Sync cancelled trip error:", err));
      break;
    }
  }

  if (cancelledTrip) {
    if (io) {
      io.to(`trip_${id}`).emit("trip_update", cancelledTrip);
      io.to(`user_${cancelledTrip.ownerId}`).emit("active_trip_update", cancelledTrip);
    }

    // Direct targeted push notifications even when the PWA is closed
    const isRiderCancelling = userId === cancelledTrip.ownerId;
    if (isRiderCancelling && cancelledTrip.driverId) {
      sendNotificationToUser(cancelledTrip.driverId, {
        title: "❌ Match Cancelled by Rider",
        body: `Your rider ${cancelledTrip.user || "Aryan"} has cancelled the ride match.`,
        url: "/jobs"
      }).catch(err => console.error("[WEB-PUSH] Rider cancel notification failed:", err));
    } else if (!isRiderCancelling && cancelledTrip.ownerId) {
      sendNotificationToUser(cancelledTrip.ownerId, {
        title: "❌ Match Cancelled by Driver",
        body: `Your driver has cancelled the ride match. Tap to find a new ride buddy.`,
        url: "/rides"
      }).catch(err => console.error("[WEB-PUSH] Driver cancel notification failed:", err));
    }

    return res.json({ success: true });
  } else {
    return res.status(404).json({ error: "Trip not found" });
  }
}

// Delete existing trip completely
export async function deleteTrip(req: Request, res: Response) {
  const id = req.params.id as string;
  const io = req.app.get("io");
  const idx = globalTrips.findIndex(t => t.id === id);

  if (idx !== -1) {
    globalTrips.splice(idx, 1);
    try {
      await removeTrip(id);
    } catch (err) {
      console.error("[POSTGRES] Delete trip error:", err);
    }
    if (io) {
      io.emit("trip_deleted", { id });
    }
    return res.json({ success: true, message: "Trip deleted completely" });
  } else {
    return res.status(404).json({ error: "Trip not found" });
  }
}

// Verify OTP for starting trip
export function verifyTripOtp(req: Request, res: Response) {
  const { id } = req.params;
  const { otp } = req.body;
  const io = req.app.get("io");
  let trip = globalTrips.find(t => t.id === id);

  if (!trip) return res.status(404).json({ error: "Trip not found" });
  if (trip.otp !== otp) return res.status(400).json({ error: "Invalid OTP code" });

  // Update status to Live/In Progress
  trip.status = 'started';
  trip.subStatus = 'started'; // Important for frontend checkpoint sync
  trip.verifiedAt = new Date().toISOString();
  syncTrip(trip).catch(err => console.error("[POSTGRES] Sync OTP verified trip error:", err));
  
  if (io) {
    io.to(`trip_${id}`).emit("trip_update", trip);
    io.to(`user_${trip.ownerId}`).emit("active_trip_update", trip);
    io.emit("trip_update", trip); // SYNC: Ensure all riders/drivers see status change
  }

  // Real-time Push Alert for ride starting smoothly even when PWA is closed
  if (trip.ownerId) {
    sendNotificationToUser(trip.ownerId, {
      title: "🟢 Ride Started! Safe Travels",
      body: `Your OTP has been successfully verified by ${trip.driverName || "your driver"}. Ride has begun.`,
      url: "/rides"
    }).catch(err => console.error("[WEB-PUSH] Ride start notification failed:", err));
  }
  
  return res.json({ success: true, trip });
}

// General update trip
export function updateTrip(req: Request, res: Response) {
  const { id } = req.params;
  const io = req.app.get("io");
  let updatedTrip: any = null;
  let oldTrip: any = null;

  for (let i = 0; i < globalTrips.length; i++) {
    if (globalTrips[i].id === id) {
      oldTrip = { ...globalTrips[i] };
      updatedTrip = { ...globalTrips[i], ...req.body, updatedAt: new Date().toISOString() };
      globalTrips[i] = updatedTrip;
      syncTrip(updatedTrip).catch(err => console.error("[POSTGRES] Sync updated trip error:", err));
      break;
    }
  }

  if (updatedTrip) {
    if (io) {
      io.to(`trip_${id}`).emit("trip_update", updatedTrip);
      io.to(`user_${updatedTrip.ownerId}`).emit("active_trip_update", updatedTrip);
      io.emit("trip_update", updatedTrip); // SYNC: Broadcast to everyone to update marketplace lists
    }

    // Direct Web Push Alerts on Trip Status Transitions even when the PWA is closed
    if (oldTrip && updatedTrip.ownerId) {
      // 1. Driver accepted the ride match or fare offer
      if ((oldTrip.status === "Pending" || !oldTrip.driverId) && updatedTrip.status === "Active" && updatedTrip.driverId) {
        sendNotificationToUser(updatedTrip.ownerId, {
          title: "✅ Ride Accepted by Driver!",
          body: `Driver ${updatedTrip.driverName || "your partner"} has accepted your match. OTP Code is ${updatedTrip.otp || "xxxx"}.`,
          url: "/rides"
        }).catch(err => console.error("[WEB-PUSH] Match accept notification failed:", err));

        if (updatedTrip.driverId) {
          sendNotificationToUser(updatedTrip.driverId, {
            title: "🎉 Ride Confirmed!",
            body: `You are matched for trip ${updatedTrip.id}. Head to pickup location at ${updatedTrip.pickupName || updatedTrip.pickup_name || "pickup point"}.`,
            url: "/jobs"
          }).catch(err => console.error("[WEB-PUSH] Driver confirm notification failed:", err));
        }
      }

      // 1b. New Bids or Fare Counter-Offer received
      const oldBidsCount = Array.isArray(oldTrip.bids) ? oldTrip.bids.length : 0;
      const newBidsCount = Array.isArray(updatedTrip.bids) ? updatedTrip.bids.length : 0;
      if (newBidsCount > oldBidsCount || (updatedTrip.driverFare && updatedTrip.driverFare !== oldTrip.driverFare)) {
        const latestBid = Array.isArray(updatedTrip.bids) && updatedTrip.bids.length > 0 ? updatedTrip.bids[updatedTrip.bids.length - 1] : null;
        const offerAmount = latestBid?.amount || updatedTrip.driverFare || updatedTrip.fare || updatedTrip.price || "custom rate";
        sendNotificationToUser(updatedTrip.ownerId, {
          title: "💰 New Fare Offer / Bid Received!",
          body: `Driver ${latestBid?.driverName || updatedTrip.driverName || "Companion"} submitted a fare offer of ₹${offerAmount}. Tap to review & accept.`,
          url: "/rides"
        }).catch(err => console.error("[WEB-PUSH] Bid notification failed:", err));
      }
      
      // 2. Driver arrived at pickup point
      if (oldTrip.subStatus !== "arrived" && updatedTrip.subStatus === "arrived") {
        sendNotificationToUser(updatedTrip.ownerId, {
          title: "🚖 Driver Arrived!",
          body: `Your driver ${updatedTrip.driverName || "your partner"} has arrived at the pickup location. Share OTP ${updatedTrip.otp || "xxxx"} to start.`,
          url: "/rides"
        }).catch(err => console.error("[WEB-PUSH] Driver arrival notification failed:", err));
      }

      // 3. Trip Completed
      if (oldTrip.status !== "Completed" && updatedTrip.status === "Completed") {
        sendNotificationToUser(updatedTrip.ownerId, {
          title: "🏁 Ride Completed Successfully!",
          body: `You have arrived safely at your destination. Settle any payments and rate your companion!`,
          url: "/rides"
        }).catch(err => console.error("[WEB-PUSH] Trip completion notification failed:", err));
      }
    }

    return res.json({ success: true, trip: updatedTrip });
  } else {
    return res.status(404).json({ error: "Trip not found" });
  }
}

// Send and auto-reply a message
export function createMessage(req: Request, res: Response) {
  const io = req.app.get("io");
  const chatSettings = globalConfig?.chatSettings || {};
  const allowAttachments = chatSettings.allowAttachments === true;

  const rawText = req.body.text || "";
  const isAttachment = rawText.startsWith("data:image/") || req.body.imageUrl || req.body.image || req.body.isAttachment;

  if (!allowAttachments && isAttachment) {
    return res.status(400).json({ error: "Image attachments in chats are currently disabled by the administrator." });
  }

  const msg = { 
    ...req.body, 
    id: req.body.id || `msg-${Date.now()}`, 
    timestamp: req.body.timestamp || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    createdAt: req.body.createdAt || new Date().toISOString()
  };

  syncMessage(msg).catch(err => console.error("[POSTGRES ERROR] Failed to synchronize chat message:", err));

  const targetTripId = msg.tripId || msg.threadId;

  if (io) {
    // Emit to both specific trip room and a global chat room for admin support updates
    io.to(`trip_${targetTripId}`).emit("new_message", msg);
    io.emit("new_message", msg); // Broadcast globally so active admin live desks receive it
  }

  // Find associated trip and trigger real-time PWA Push Notifications
  if (targetTripId && targetTripId !== "admin_support" && !targetTripId.startsWith("admin_")) {
    const trip = globalTrips.find((t: any) => t.id === targetTripId);
    if (trip) {
      const recipients: string[] = [];
      const potentialRecipients: string[] = [trip.ownerId, trip.driverId, trip.riderId].filter(Boolean) as string[];

      if (trip.riders) {
        trip.riders.forEach((r: any) => {
          if (r.id) potentialRecipients.push(r.id);
          if (r.userId) potentialRecipients.push(r.userId);
        });
      }

      // Determine sender role to route notification to the opposite party of the trip
      const isDriverSender = msg.senderId === trip.driverId || 
                            msg.senderId === "DRV26HYM57P8Z1K" ||
                            msg.senderId?.startsWith("driver") ||
                            msg.senderId?.toLowerCase().includes("driver") || 
                            msg.senderName?.toLowerCase().includes("driver") || 
                            msg.senderName?.toLowerCase().includes("kabir");

      if (isDriverSender) {
        // Driver is sending -> notify the rider(s)
        if (trip.ownerId) potentialRecipients.push(trip.ownerId);
        if (trip.riderId) potentialRecipients.push(trip.riderId);
        potentialRecipients.push("RID26HYK89W3X4N");
      } else {
        // Rider is sending -> notify the driver
        if (trip.driverId) potentialRecipients.push(trip.driverId);
        potentialRecipients.push("DRV26HYM57P8Z1K");
      }

      // Filter out sender and duplicates
      potentialRecipients.forEach((userId) => {
        if (userId && userId !== msg.senderId && !recipients.includes(userId)) {
          recipients.push(userId);
        }
      });

      recipients.forEach((userId) => {
        sendNotificationToUser(userId, {
          title: `💬 New Message from ${msg.senderName || "Ride Companion"}`,
          body: msg.text,
          url: `/?chat=active&tripId=${targetTripId}`
        }).catch((err) => console.error("[WEB-PUSH] Message notification failed:", err));
      });
    }
  } else if (targetTripId === "admin_support" || targetTripId.startsWith("admin_")) {
    // Admin support message notifications
    const otherPartyId = msg.senderId === "ADMIN_SUPPORT_BOT" ? targetTripId.replace("admin_", "") : "ADMIN_SUPPORT_BOT";
    if (otherPartyId && otherPartyId !== "ADMIN_SUPPORT_BOT") {
      sendNotificationToUser(otherPartyId, {
        title: `💬 Support Admin Reply`,
        body: msg.text,
        url: `/?chat=active`
      }).catch((err) => console.error("[WEB-PUSH] Admin reply notification failed:", err));
    }
  }

  return res.status(201).json(msg);
}

export function getMessages(req: Request, res: Response) {
  const { limit, since } = req.query;
  let msgs = globalMessages;

  if (since) {
    const sinceTime = new Date(since as string).getTime();
    if (!isNaN(sinceTime)) {
      msgs = msgs.filter(m => {
        const t = m.createdAt ? new Date(m.createdAt).getTime() : 0;
        return t > sinceTime;
      });
    }
  }

  if (limit) {
    const lim = parseInt(limit as string, 10);
    if (!isNaN(lim) && lim > 0 && lim < msgs.length) {
      msgs = msgs.slice(-lim);
    }
  }

  return res.json(msgs);
}

export function getChatSettings(req: Request, res: Response) {
  const chatSettings = globalConfig?.chatSettings || {
    autoDeleteEnabled: true,
    autoDeleteIntervalMinutes: 1440,
    allowAttachments: false
  };
  return res.json(chatSettings);
}

export function updateChatSettings(req: Request, res: Response) {
  const { autoDeleteEnabled, autoDeleteIntervalMinutes, allowAttachments } = req.body;
  const currentChatSettings = globalConfig?.chatSettings || {};
  const newChatSettings = {
    ...currentChatSettings,
    autoDeleteEnabled: autoDeleteEnabled !== undefined ? Boolean(autoDeleteEnabled) : (currentChatSettings.autoDeleteEnabled ?? true),
    autoDeleteIntervalMinutes: autoDeleteIntervalMinutes !== undefined ? parseInt(autoDeleteIntervalMinutes, 10) : (currentChatSettings.autoDeleteIntervalMinutes ?? 1440),
    allowAttachments: allowAttachments !== undefined ? Boolean(allowAttachments) : (currentChatSettings.allowAttachments ?? false),
  };

  const updatedConfig = {
    ...globalConfig,
    chatSettings: newChatSettings
  };

  saveConfig(updatedConfig);

  const io = req.app.get("io");
  if (io) {
    io.emit("config_updated", updatedConfig);
    io.emit("chat_settings_updated", newChatSettings);
  }

  return res.json({ success: true, chatSettings: newChatSettings });
}

export async function deleteMessages(req: Request, res: Response) {
  try {
    const threadId = (req.query.threadId as string) || req.body?.threadId;
    const id = (req.query.id as string) || req.body?.id;

    if (threadId) {
      const count = await deleteThreadMessages(threadId);
      return res.json({ success: true, threadId, deletedCount: count });
    }

    if (id) {
      await removeMessage(id);
      return res.json({ success: true, deletedId: id });
    }

    return res.status(400).json({ error: "threadId or id is required to delete messages" });
  } catch (err: any) {
    console.error("Error in deleteMessages:", err);
    return res.status(500).json({ error: "Failed to delete messages" });
  }
}

// Create Razorpay payment order
export async function createPaymentOrder(req: Request, res: Response) {
  const { amount, currency, tripId } = req.body;
  
  const keyId = (globalConfig?.razorpay?.keyId && globalConfig.razorpay.keyId.trim()) || 
                (globalConfig?.payment?.keyId && globalConfig.payment.keyId.trim()) || 
                (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID.trim()) || 
                "rzp_live_TYiPjYgvWmFKof";
  const keySecret = (globalConfig?.razorpay?.keySecret && globalConfig.razorpay.keySecret.trim()) || 
                    (globalConfig?.payment?.keySecret && globalConfig.payment.keySecret.trim()) || 
                    (process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET.trim()) || 
                    "fM9jy54kYSuB85I9GDpk2YDC";
  const enabled = globalConfig?.razorpay?.enabled ?? globalConfig?.payment?.enabled ?? true;

  if (!enabled) {
    return res.status(400).json({ error: "Razorpay integration is currently disabled." });
  }

  if (!keyId || !keySecret) {
    return res.status(400).json({ 
      error: "Razorpay credentials are not configured.", 
      message: "Please open Section Settings -> Razorpay inside TaxiAppOps Backend Admin page to configure API keys." 
    });
  }

  try {
    const auth = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const orderAmount = Math.max(100, Math.round(Number(amount) * 100)); // in paisa (minimum 100 paise / ₹1 for Razorpay)

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Authorization": `Basic ${auth}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        amount: orderAmount,
        currency: currency || "INR",
        receipt: `rcpt_${tripId || Date.now()}`.substring(0, 40),
        notes: { tripId: tripId || "", platform: "TaxiApp" }
      })
    });

    const data: any = await response.json();
    if (!response.ok) {
      console.error("[RAZORPAY ERROR]", data);
      return res.status(response.status).json({
        error: "Razorpay order creation failed",
        message: data.error?.description || "Gateway returned error status."
      });
    }

    return res.json({
      success: true,
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      keyId: keyId
    });
  } catch (e: any) {
    console.error("[RAZORPAY EXCEPTION]", e);
    return res.status(500).json({ error: "Gateway transaction processing error", message: e.message });
  }
}

// Verify Razorpay payment
export function verifyPayment(req: Request, res: Response) {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, tripId } = req.body;
  const io = req.app.get("io");

  const keySecret = (globalConfig?.razorpay?.keySecret && globalConfig.razorpay.keySecret.trim()) || 
                    (globalConfig?.payment?.keySecret && globalConfig.payment.keySecret.trim()) || 
                    (process.env.RAZORPAY_KEY_SECRET && process.env.RAZORPAY_KEY_SECRET.trim()) || 
                    "fM9jy54kYSuB85I9GDpk2YDC";
  if (!keySecret) {
    return res.status(400).json({ error: "Razorpay Secret is not configured. Signature validation aborted." });
  }

  try {
    const hmac = crypto.createHmac("sha256", keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature === razorpay_signature) {
      if (tripId) {
        for (let i = 0; i < globalTrips.length; i++) {
          const trip = globalTrips[i];
          if (trip.id === tripId) {
            const updatedTrip = {
              ...trip,
              status: 'completed',
              subStatus: 'completed',
              isPaid: true,
              paymentId: razorpay_payment_id,
              paymentMethod: 'razorpay',
              updatedAt: new Date().toISOString()
            };
            globalTrips[i] = updatedTrip;
            syncTrip(updatedTrip).catch(err => console.error("[POSTGRES] Sync completed trip error:", err));
            if (io) {
              io.to(`trip_${tripId}`).emit("trip_update", updatedTrip);
              io.to(`user_${updatedTrip.ownerId}`).emit("active_trip_update", updatedTrip);
            }
            break;
          }
        }
        if (io) {
          io.emit("trip_update", { id: tripId }); // Trigger sync for any list hooks
        }
      }
      return res.json({ success: true, message: "Signature verification succeeded.", paymentId: razorpay_payment_id });
    } else {
      return res.status(400).json({ error: "Invalid cryptographic payment signature check." });
    }
  } catch (e: any) {
    console.error("Signature verify error:", e);
    return res.status(500).json({ error: "Fault check verification engine error", message: e.message });
  }
}

// Clear all trips
export function clearTrips(req: Request, res: Response) {
  const io = req.app.get("io");
  globalTrips.length = 0;
  if (io) {
    io.emit("trip_update", { status: "cleared" });
  }
  return res.json({ success: true });
}

// Get subscription transactions list
export function getSubscriptionTransactions(req: Request, res: Response) {
  return res.json(globalSubscriptionTransactions);
}

// Log new subscription transaction
export function logSubscriptionTransaction(req: Request, res: Response) {
  const { 
    id, 
    razorpayPaymentId, 
    razorpayOrderId, 
    userId, 
    userName, 
    userEmail, 
    userType, 
    planId, 
    planName, 
    amount, 
    currency, 
    status, 
    paymentMethod 
  } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Transaction ID is required." });
  }

  const txn = {
    id,
    razorpayPaymentId: razorpayPaymentId || null,
    razorpayOrderId: razorpayOrderId || null,
    userId: userId || null,
    userName: userName || "",
    userEmail: userEmail || "",
    userType: userType || "",
    planId: planId || "",
    planName: planName || "",
    amount: amount !== undefined ? parseFloat(amount) : 0,
    currency: currency || "INR",
    status: status || "Success",
    paymentMethod: paymentMethod || "Razorpay Gateway",
    createdAt: new Date().toISOString()
  };

  saveSubscriptionTransaction(txn);
  return res.json({ success: true, transaction: txn });
}
