import {
  commonCities,
  commonPlaces,
  spellingCorrectionsMap,
} from "../data/placesData";

export const correctSpellingInQuery = (query: string): string => {
  if (!query) return "";
  let corrected = query.toLowerCase().trim();

  const multiWordTypos = [
    { typo: "jubli hills", correct: "jubilee hills" },
    { typo: "jublee hills", correct: "jubilee hills" },
    { typo: "hitech city", correct: "hitec city" },
    { typo: "kukatpalli main road", correct: "kukatpally main road" },
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
  const correctedWords = words.map((word) => {
    const cleanWord = word.replace(/[^a-zA-Z0-9]/g, "");
    const typoCorrection = spellingCorrectionsMap[cleanWord];
    if (typoCorrection) {
      return word.replace(cleanWord, typoCorrection);
    }
    return word;
  });

  const finalQuery = correctedWords.join(" ");
  return finalQuery.replace(/\b\w/g, (c) => c.toUpperCase());
};

export const getLevenshteinDistance = (a: string, b: string): number => {
  const tmp: number[][] = [];
  for (let i = 0; i <= a.length; i++) {
    tmp[i] = [i];
  }
  for (let j = 0; j <= b.length; j++) {
    tmp[0][j] = j;
  }
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      tmp[i][j] = Math.min(
        tmp[i - 1][j] + 1,
        tmp[i][j - 1] + 1,
        tmp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      );
    }
  }
  return tmp[a.length][b.length];
};

export const getFuzzyMatches = (query: string, places: any[]): any[] => {
  const qClean = (query || "").toLowerCase().trim();
  if (!qClean) return [];
  const correctedQuery = (correctSpellingInQuery(qClean) || "").toLowerCase();
  const scored = (places || [])
    .filter((place) => place && place.label)
    .map((place) => {
      const labelLower = (place.label || "").toLowerCase();
      let score = 0;
      if (labelLower.includes(correctedQuery)) {
        score += 1000 - labelLower.indexOf(correctedQuery);
      } else if (labelLower.includes(qClean)) {
        score += 800 - labelLower.indexOf(qClean);
      } else {
        const qWords = correctedQuery.split(/\s+/);
        const labelWords = labelLower.split(/[\s,.-]+/);
        let matchedWordsCount = 0;
        for (const qw of qWords) {
          if (qw.length < 3) continue;
          if (labelWords.some((lw) => lw === qw || lw.startsWith(qw))) {
            matchedWordsCount += 2;
          } else {
            for (const lw of labelWords) {
              if (lw.length < 3) continue;
              const dist = getLevenshteinDistance(qw, lw);
              const maxAllowedDist = qw.length > 5 ? 2 : 1;
              if (dist <= maxAllowedDist) {
                matchedWordsCount += 1;
                break;
              }
            }
          }
        }
        if (matchedWordsCount > 0) {
          score += matchedWordsCount * 100;
        }
      }
      return { place, score };
    });

  return scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.place);
};

export const generateIntelligentFallbackMockResults = (
  query: string
): any[] => {
  const q = query.trim();
  const qLower = q.toLowerCase();
  const mainWord = q.split(" ")[0];
  const capitalized = mainWord.charAt(0).toUpperCase() + mainWord.slice(1);

  if (
    qLower.includes("london") ||
    qLower.includes("uk") ||
    qLower.includes("heathrow") ||
    qLower.includes("piccadilly") ||
    qLower.includes("soho") ||
    qLower.includes("wembley")
  ) {
    return [
      {
        label: `${capitalized} Heathrow Airport Terminal 5, Longford, Hounslow, London, TW6 2GA, United Kingdom`,
        lat: 51.47,
        lon: -0.4543,
        type: "point",
      },
      {
        label: `${capitalized} Piccadilly Circus Station, Soho, London, W1D 7ET, United Kingdom`,
        lat: 51.5101,
        lon: -0.1349,
        type: "point",
      },
      {
        label: `${capitalized} Westminster Palace, Parliament Square, London, SW1A 0AA, United Kingdom`,
        lat: 51.4993,
        lon: -0.1248,
        type: "point",
      },
      {
        label: `${capitalized} Wembley Stadium Area, Wembley, London, HA9 0WS, United Kingdom`,
        lat: 51.556,
        lon: -0.2796,
        type: "point",
      },
      {
        label: `${capitalized} High Street Kensington, Kensington, London, W8 5SA, United Kingdom`,
        lat: 51.5015,
        lon: -0.1923,
        type: "point",
      },
    ];
  }

  if (
    qLower.includes("new york") ||
    qLower.includes("nyc") ||
    qLower.includes("manhattan") ||
    qLower.includes("brooklyn") ||
    qLower.includes("jfk") ||
    qLower.includes("times square") ||
    qLower.includes("broadway")
  ) {
    return [
      {
        label: `${capitalized} John F. Kennedy International Airport (JFK), Queens, New York, NY, 11430, USA`,
        lat: 40.6413,
        lon: -73.7781,
        type: "point",
      },
      {
        label: `${capitalized} Times Square, Manhattan, New York, NY 10036, USA`,
        lat: 40.758,
        lon: -73.9855,
        type: "point",
      },
      {
        label: `${capitalized} Central Park South, Manhattan, New York, NY 10019, USA`,
        lat: 40.766,
        lon: -73.9772,
        type: "point",
      },
      {
        label: `${capitalized} Grand Central Terminal, 89 E 42nd St, New York, NY 10017, USA`,
        lat: 40.7527,
        lon: -73.9772,
        type: "point",
      },
    ];
  }

  return [
    {
      label: `${capitalized} Main Road Junction, City Center`,
      lat: 17.385,
      lon: 78.4867,
      type: "point",
    },
    {
      label: `${capitalized} Metro Station, Line 1`,
      lat: 17.4474,
      lon: 78.3762,
      type: "point",
    },
    {
      label: `${capitalized} Railway Station Gate 1`,
      lat: 17.4344,
      lon: 78.5017,
      type: "point",
    },
  ];
};

export const getCoordinatesForLabel = (
  label: string,
  defaultRecommendations: any[] = []
): [number, number] | null => {
  if (!label) return null;
  const cleanLabel = label.trim().toLowerCase();

  const allPlaces = [
    ...commonCities,
    ...commonPlaces,
    ...defaultRecommendations,
  ];

  const match = allPlaces.find(
    (place) =>
      place.label.toLowerCase().includes(cleanLabel) ||
      cleanLabel.includes(place.label.toLowerCase())
  );

  if (match) {
    return [match.lat, match.lon || (match as any).lng];
  }

  const words = cleanLabel.split(/[\s,]+/).filter((w) => w.length >= 3);
  for (const w of words) {
    if (
      [
        "railway",
        "station",
        "stop",
        "area",
        "bus",
        "near",
        "road",
        "main",
        "junction",
        "telangana",
        "india",
        "500001",
      ].includes(w)
    )
      continue;
    const tokenMatch = allPlaces.find((place) =>
      place.label.toLowerCase().includes(w)
    );
    if (tokenMatch) {
      return [tokenMatch.lat, tokenMatch.lon || (tokenMatch as any).lng];
    }
  }
  return null;
};
