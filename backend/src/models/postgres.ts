import { Pool } from "pg";
import fs from "fs";
import path from "path";
import crypto from "crypto";

let pool: Pool | null = null;
let isPgConnected = false;

// Check for database credentials in environment variables
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
const host = process.env.PGHOST || process.env.POSTGRES_HOST;

export function getPgPool() {
  if (pool) return pool;

  if (dbUrl) {
    console.log("[POSTGRES] Initializing connection pool via connection string...");
    pool = new Pool({
      connectionString: dbUrl,
      ssl: dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1") ? false : { rejectUnauthorized: false }
    });
  } else if (host) {
    console.log("[POSTGRES] Initializing connection pool via environment parameters...");
    pool = new Pool({
      host: host,
      port: parseInt(process.env.PGPORT || "5432"),
      user: process.env.PGUSER || process.env.POSTGRES_USER,
      password: process.env.PGPASSWORD || process.env.POSTGRES_PASSWORD,
      database: process.env.PGDATABASE || process.env.POSTGRES_DATABASE,
      ssl: host === "localhost" || host === "127.0.0.1" ? false : { rejectUnauthorized: false }
    });
  } else {
    console.log("[POSTGRES] No DATABASE_URL or PGHOST found in environment. Running in memory-only mode with local disk persistence.");
  }

  return pool;
}

export async function initPostgres(
  globalRiders: any,
  globalDrivers: any,
  globalTrips: any,
  globalConfig: any,
  setConfig: (c: any) => void,
  globalTickets?: any[],
  globalSubscriptionTransactions?: any[],
  globalMessages?: any[]
) {
  const p = getPgPool();
  if (!p) {
    return false;
  }

  try {
    // Attempt to connect and run a simple query to verify the connection
    const client = await p.connect();
    console.log("[POSTGRES] Connected successfully to PostgreSQL database.");
    client.release();
    isPgConnected = true;

    // Create required tables
    await createTables();

    // Hydrate memory state from PostgreSQL or seed database if empty
    await syncAndHydrate(
      globalRiders,
      globalDrivers,
      globalTrips,
      globalConfig,
      setConfig,
      globalTickets,
      globalSubscriptionTransactions,
      globalMessages
    );

    return true;
  } catch (err: any) {
    console.error("[POSTGRES ERROR] Failed to connect or initialize PostgreSQL database:", err.message);
    console.log("[POSTGRES WARNING] Falling back to memory-only mode with local disk backup.");
    isPgConnected = false;
    pool = null;
    return false;
  }
}

async function createTables() {
  const p = getPgPool();
  if (!p) return;

  console.log("[POSTGRES] Ensuring database tables exist...");

  // System Configuration Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS system_config (
      key VARCHAR(50) PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Riders Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS riders (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100),
      phone VARCHAR(50),
      password VARCHAR(200),
      status VARCHAR(20) DEFAULT 'Active',
      avatar TEXT,
      trips INT DEFAULT 0,
      rating NUMERIC(3, 2) DEFAULT 5.0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Drivers Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS drivers (
      id VARCHAR(100) PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100),
      phone VARCHAR(50),
      password VARCHAR(200),
      status VARCHAR(20) DEFAULT 'Active',
      trips INT DEFAULT 0,
      rating NUMERIC(3, 2) DEFAULT 5.0,
      vehicle TEXT,
      earnings NUMERIC(12, 2) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_seen BIGINT,
      coords_lat NUMERIC(10, 6),
      coords_lng NUMERIC(10, 6),
      type VARCHAR(20) DEFAULT 'CAR',
      takes_local_only BOOLEAN DEFAULT FALSE,
      license_url TEXT,
      rc_url TEXT,
      selfie_url TEXT,
      work_city VARCHAR(100),
      plate VARCHAR(100),
      is_verified BOOLEAN DEFAULT FALSE,
      rejection_reason TEXT,
      vehicle_photo_url TEXT,
      aadhaar_url TEXT
    );
  `);

  // Ensure columns exist for backward compatibility
  await p.query(`ALTER TABLE drivers ADD COLUMN IF NOT EXISTS vehicle_photo_url TEXT;`);
  await p.query(`ALTER TABLE drivers ADD COLUMN IF NOT EXISTS aadhaar_url TEXT;`);

  // Trips Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS trips (
      id VARCHAR(100) PRIMARY KEY,
      owner_id VARCHAR(100),
      rider_id VARCHAR(100),
      driver_id VARCHAR(100),
      pickup_name TEXT,
      pickup_lat NUMERIC(10, 6),
      pickup_lng NUMERIC(10, 6),
      dropoff_name TEXT,
      dropoff_lat NUMERIC(10, 6),
      dropoff_lng NUMERIC(10, 6),
      price NUMERIC(10, 2),
      fare NUMERIC(10, 2),
      status VARCHAR(50) DEFAULT 'Pending',
      otp VARCHAR(10),
      on_demand BOOLEAN DEFAULT TRUE,
      is_on_demand BOOLEAN DEFAULT TRUE,
      is_instant BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      route_coords TEXT,
      driver_coords TEXT,
      is_rider_finished BOOLEAN DEFAULT FALSE,
      is_rider_reviewed BOOLEAN DEFAULT FALSE,
      is_driver_finished BOOLEAN DEFAULT FALSE,
      is_driver_reviewed BOOLEAN DEFAULT FALSE,
      is_reviewed BOOLEAN DEFAULT FALSE
    );
  `);

  // ALTER TABLE for existing databases
  try {
    await p.query(`ALTER TABLE riders ADD COLUMN IF NOT EXISTS password VARCHAR(200)`);
    await p.query(`ALTER TABLE riders ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE`);
    await p.query(`ALTER TABLE riders ADD COLUMN IF NOT EXISTS selfie_url TEXT`);
    await p.query(`ALTER TABLE riders ADD COLUMN IF NOT EXISTS rejection_reason TEXT`);
    await p.query(`ALTER TABLE riders ADD COLUMN IF NOT EXISTS aadhaar_number VARCHAR(50)`);

    await p.query(`ALTER TABLE drivers ADD COLUMN IF NOT EXISTS password VARCHAR(200)`);
    await p.query(`ALTER TABLE drivers ADD COLUMN IF NOT EXISTS license_url TEXT`);
    await p.query(`ALTER TABLE drivers ADD COLUMN IF NOT EXISTS rc_url TEXT`);
    await p.query(`ALTER TABLE drivers ADD COLUMN IF NOT EXISTS selfie_url TEXT`);
    await p.query(`ALTER TABLE drivers ADD COLUMN IF NOT EXISTS work_city VARCHAR(100)`);
    await p.query(`ALTER TABLE drivers ADD COLUMN IF NOT EXISTS plate VARCHAR(100)`);
    await p.query(`ALTER TABLE drivers ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE`);
    await p.query(`ALTER TABLE drivers ADD COLUMN IF NOT EXISTS rejection_reason TEXT`);
    await p.query(`ALTER TABLE trips ADD COLUMN IF NOT EXISTS is_rider_finished BOOLEAN DEFAULT FALSE`);
    await p.query(`ALTER TABLE trips ADD COLUMN IF NOT EXISTS is_rider_reviewed BOOLEAN DEFAULT FALSE`);
    await p.query(`ALTER TABLE trips ADD COLUMN IF NOT EXISTS is_driver_finished BOOLEAN DEFAULT FALSE`);
    await p.query(`ALTER TABLE trips ADD COLUMN IF NOT EXISTS is_driver_reviewed BOOLEAN DEFAULT FALSE`);
    await p.query(`ALTER TABLE trips ADD COLUMN IF NOT EXISTS is_reviewed BOOLEAN DEFAULT FALSE`);
    await p.query(`ALTER TABLE trips ADD COLUMN IF NOT EXISTS rider_rating_given INT`);
    await p.query(`ALTER TABLE trips ADD COLUMN IF NOT EXISTS rider_comment_given TEXT`);
    await p.query(`ALTER TABLE trips ADD COLUMN IF NOT EXISTS driver_rating_given INT`);
    await p.query(`ALTER TABLE trips ADD COLUMN IF NOT EXISTS driver_comment_given TEXT`);
  } catch (err: any) {
    console.warn("[POSTGRES] ALTER TABLE columns alert bypassed:", err.message);
  }

  // Support Tickets Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS support_tickets (
      id VARCHAR(100) PRIMARY KEY,
      subject TEXT,
      comment TEXT,
      screenshot TEXT,
      user_name VARCHAR(100),
      user_id VARCHAR(100),
      user_role VARCHAR(20),
      status VARCHAR(20) DEFAULT 'Open',
      priority VARCHAR(20) DEFAULT 'Medium',
      date VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Push Subscriptions Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id SERIAL PRIMARY KEY,
      endpoint TEXT UNIQUE NOT NULL,
      p256dh TEXT NOT NULL,
      auth TEXT NOT NULL,
      role VARCHAR(50) NOT NULL,
      user_id VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Subscription Transactions Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS subscription_transactions (
      id VARCHAR(100) PRIMARY KEY,
      razorpay_payment_id VARCHAR(100),
      razorpay_order_id VARCHAR(100),
      user_id VARCHAR(100),
      user_name VARCHAR(100),
      user_email VARCHAR(100),
      user_type VARCHAR(50),
      plan_id VARCHAR(100),
      plan_name VARCHAR(100),
      amount NUMERIC(10, 2),
      currency VARCHAR(10) DEFAULT 'INR',
      status VARCHAR(50) DEFAULT 'Success',
      payment_method VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Chat Messages Table
  await p.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id VARCHAR(100) PRIMARY KEY,
      thread_id VARCHAR(100) NOT NULL,
      text TEXT NOT NULL,
      sender_id VARCHAR(100) NOT NULL,
      sender_name VARCHAR(100),
      sender_role VARCHAR(50),
      timestamp VARCHAR(50),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log("[POSTGRES] All database tables are ready.");
}

async function syncAndHydrate(
  globalRiders: any,
  globalDrivers: any,
  globalTrips: any,
  globalConfig: any,
  setConfig: (c: any) => void,
  globalTickets?: any[],
  globalSubscriptionTransactions?: any[],
  globalMessages?: any[]
) {
  const p = getPgPool();
  if (!p) return;

  // 1. Hydrate Config
  const configRes = await p.query("SELECT value FROM system_config WHERE key = 'admin_config'");
  if (configRes.rows.length > 0) {
    try {
      const dbConfig = JSON.parse(configRes.rows[0].value);
      if (
        !dbConfig.map?.tileLayerUrl ||
        dbConfig.map.tileLayerUrl.includes('openstreetmap.fr/hot') ||
        (dbConfig.map.tileLayerUrl.includes('cartocdn.com') && !dbConfig.map.tileLayerUrl.includes('api_key')) ||
        dbConfig.map.tileLayerUrl.includes('World_Street_Map')
      ) {
        dbConfig.map = dbConfig.map || {};
        dbConfig.map.tilePreset = 'esri-gray';
        dbConfig.map.tileLayerUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}';
      }
      const mergedConfig = {
        ...globalConfig,
        ...dbConfig,
        marquees: dbConfig.marquees !== undefined ? dbConfig.marquees : (globalConfig.marquees || []),
        appSettings: { ...(globalConfig.appSettings || {}), ...(dbConfig.appSettings || {}) },
        branding: { ...(globalConfig.branding || {}), ...(dbConfig.branding || {}) },
        enabledFeatures: { ...(globalConfig.enabledFeatures || {}), ...(dbConfig.enabledFeatures || {}) },
        modules: { ...(globalConfig.modules || {}), ...(dbConfig.modules || {}) },
        chatSettings: {
          autoDeleteEnabled: true,
          autoDeleteIntervalMinutes: 1440,
          allowAttachments: false,
          ...((globalConfig && globalConfig.chatSettings) || {}),
          ...((dbConfig && dbConfig.chatSettings) || {})
        }
      };
      setConfig(mergedConfig);
      console.log("[POSTGRES] Hydrated application configuration from DB and merged with fallback.");
      // Fire-and-forget saving the merged configuration back to database and file
      saveConfigPg(mergedConfig).catch(err => console.error("[POSTGRES] Config update error:", err));
      try {
        fs.writeFileSync(path.join(process.cwd(), "config.json"), JSON.stringify(mergedConfig, null, 2), "utf-8");
      } catch (e) {
        console.error("[POSTGRES WARNING] Could not write config.json on hydration merge:", e);
      }
    } catch (e) {
      console.error("[POSTGRES] Failed to parse config from DB:", e);
    }
  } else if (globalConfig) {
    // If PG is empty but we have local memory config, save to PG
    await saveConfigPg(globalConfig);
  }

  // 2. Hydrate Riders
  const ridersRes = await p.query("SELECT * FROM riders");
  if (ridersRes.rows.length > 0) {
    // Clear initial mock riders and load from DB
    Object.keys(globalRiders).forEach(k => delete globalRiders[k]);
    ridersRes.rows.forEach(r => {
      globalRiders[r.id] = {
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        password: r.password,
        status: r.status,
        avatar: r.avatar,
        trips: r.trips,
        rating: parseFloat(r.rating || "5.0"),
        createdAt: r.created_at ? new Date(r.created_at).toISOString() : new Date().toISOString()
      };
    });
    console.log(`[POSTGRES] Hydrated ${ridersRes.rows.length} riders from DB.`);
  } else {
    // If PG is empty, seed it with memory's initial riders
    console.log("[POSTGRES] Seeding PostgreSQL with initial rider accounts...");
    for (const rider of Object.values(globalRiders)) {
      await saveRiderPg(rider);
    }
  }

  // Ensure 9550723823 test rider exists in PG & globalRiders
  if (!globalRiders["RID9550723823"]) {
    globalRiders["RID9550723823"] = {
      id: "RID9550723823",
      driverId: "DRV9550723823",
      name: "Softvares Test Rider",
      email: "softvares.official@gmail.com",
      phone: "+91 9550723823",
      password: crypto.createHash("sha256").update("password123").digest("hex"),
      status: "Active",
      trips: 20,
      rating: 5.0,
      wallet: 1500,
      avatar: "https://i.pravatar.cc/150?u=softvares",
      isConvertedDriver: true,
      hasDriverRole: true,
      hasRiderRole: true,
      roles: ["driver", "rider"],
      role: "rider",
      createdAt: new Date().toISOString()
    };
    await saveRiderPg(globalRiders["RID9550723823"]);
  }

  // 3. Hydrate Drivers
  const driversRes = await p.query("SELECT * FROM drivers");
  if (driversRes.rows.length > 0) {
    // Clear initial mock drivers and load from DB
    Object.keys(globalDrivers).forEach(k => delete globalDrivers[k]);
    driversRes.rows.forEach(d => {
      globalDrivers[d.id] = {
        id: d.id,
        name: d.name,
        email: d.email,
        phone: d.phone,
        password: d.password,
        status: d.status,
        trips: d.trips,
        rating: parseFloat(d.rating || "5.0"),
        vehicle: d.vehicle,
        earnings: parseFloat(d.earnings || "0.0"),
        createdAt: d.created_at ? new Date(d.created_at).toISOString() : new Date().toISOString(),
        lastSeen: d.last_seen ? parseInt(d.last_seen) : Date.now(),
        coords: (d.coords_lat && d.coords_lng) ? [parseFloat(d.coords_lat), parseFloat(d.coords_lng)] : undefined,
        type: d.type || 'CAR',
        takesLocalOnly: d.takes_local_only,
        licenseUrl: d.license_url,
        rcUrl: d.rc_url,
        selfieUrl: d.selfie_url,
        vehiclePhotoUrl: d.vehicle_photo_url,
        aadhaarUrl: d.aadhaar_url,
        workCity: d.work_city,
        plate: d.plate,
        isVerified: d.is_verified,
        rejectionReason: d.rejection_reason
      };
    });
    console.log(`[POSTGRES] Hydrated ${driversRes.rows.length} drivers from DB.`);
  } else {
    // If PG is empty, seed it with memory's initial drivers
    console.log("[POSTGRES] Seeding PostgreSQL with initial driver accounts...");
    for (const driver of Object.values(globalDrivers)) {
      await saveDriverPg(driver);
    }
  }

  // Ensure 9550723823 test driver exists in PG & globalDrivers
  if (!globalDrivers["DRV9550723823"]) {
    globalDrivers["DRV9550723823"] = {
      id: "DRV9550723823",
      riderId: "RID9550723823",
      name: "Softvares Test Driver",
      email: "softvares.official@gmail.com",
      phone: "+91 9550723823",
      password: crypto.createHash("sha256").update("password123").digest("hex"),
      status: "Active",
      trips: 88,
      rating: 4.95,
      vehicle: "Toyota Innova Crysta (TS 09 SF 9550)",
      vehicleCategory: "Car",
      vehicleBrand: "Toyota",
      vehicleModel: "Innova Crysta VX 2025",
      vehicleColor: "Super White",
      numberPlate: "TS 09 SF 9550",
      dlNumber: "TS-09-2023955072",
      aadhaarNumber: "9550 7238 2300",
      isVerified: true,
      hasDriverRole: true,
      hasRiderRole: true,
      roles: ["driver", "rider"],
      role: "driver",
      createdAt: new Date().toISOString()
    };
    await saveDriverPg(globalDrivers["DRV9550723823"]);
  }

  // 4. Hydrate Trips
  const oldTripIds = ["TRP26HYM4N5P8X1K", "TRP26PUR48T2Z1D", "TRPMUPUR8W3C5N2", "TRPHYBL4V9S8X1P", "TRP26DL503K2M8P"];
  const tripsRes = await p.query("SELECT * FROM trips ORDER BY created_at ASC");
  const hasOldTrips = tripsRes.rows.some(t => oldTripIds.includes(t.id));

  if (tripsRes.rows.length > 0 && !hasOldTrips) {
    globalTrips.length = 0; // Clear globalTrips array
    tripsRes.rows.forEach(t => {
      let parsedRoute = undefined;
      let parsedDriverCoords = undefined;
      try {
        if (t.route_coords) parsedRoute = JSON.parse(t.route_coords);
      } catch {}
      try {
        if (t.driver_coords) parsedDriverCoords = JSON.parse(t.driver_coords);
      } catch {}

      globalTrips.push({
        id: t.id,
        ownerId: t.owner_id,
        riderId: t.rider_id,
        driverId: t.driver_id,
        pickup: { name: t.pickup_name, coords: [parseFloat(t.pickup_lat), parseFloat(t.pickup_lng)] },
        dropoff: { name: t.dropoff_name, coords: [parseFloat(t.dropoff_lat), parseFloat(t.dropoff_lng)] },
        price: parseFloat(t.price),
        fare: parseFloat(t.fare),
        status: t.status,
        otp: t.otp,
        onDemand: t.on_demand,
        isOnDemand: t.is_on_demand,
        isInstant: t.is_instant,
        createdAt: t.created_at ? new Date(t.created_at).toISOString() : new Date().toISOString(),
        updatedAt: t.updated_at ? new Date(t.updated_at).toISOString() : new Date().toISOString(),
        routeCoords: parsedRoute,
        driverCoords: parsedDriverCoords,
        isRiderFinished: !!t.is_rider_finished,
        isRiderReviewed: !!t.is_rider_reviewed,
        isDriverFinished: !!t.is_driver_finished,
        isDriverReviewed: !!t.is_driver_reviewed,
        isReviewed: !!t.is_reviewed,
        riderRatingGiven: t.rider_rating_given ? parseInt(t.rider_rating_given) : null,
        riderCommentGiven: t.rider_comment_given || null,
        driverRatingGiven: t.driver_rating_given ? parseInt(t.driver_rating_given) : null,
        driverCommentGiven: t.driver_comment_given || null
      });
    });
    console.log(`[POSTGRES] Hydrated ${tripsRes.rows.length} trips from DB.`);
  } else {
    if (hasOldTrips) {
      console.log("[POSTGRES] Clearing old sample trips and re-seeding with updated trips...");
      try { await p.query("DELETE FROM trips"); } catch (err) {}
    }
    // If PG is empty or had old trips, seed it with memory's initial trips
    console.log("[POSTGRES] Seeding PostgreSQL with initial trips...");
    for (const trip of globalTrips) {
      await saveTripPg(trip);
    }
  }

  // 5. Hydrate Support Tickets
  if (globalTickets) {
    const ticketsRes = await p.query("SELECT * FROM support_tickets ORDER BY created_at DESC");
    if (ticketsRes.rows.length > 0) {
      globalTickets.length = 0; // Clear initial memory list
      ticketsRes.rows.forEach(t => {
        globalTickets.push({
          id: t.id,
          subject: t.subject,
          comment: t.comment,
          screenshot: t.screenshot,
          user: t.user_name,
          userId: t.user_id,
          userRole: t.user_role,
          status: t.status,
          priority: t.priority,
          date: t.date,
          createdAt: t.created_at ? new Date(t.created_at).toISOString() : new Date().toISOString()
        });
      });
      console.log(`[POSTGRES] Hydrated ${ticketsRes.rows.length} support tickets from DB.`);
    } else {
      // Seed DB with initial tickets if any
      console.log("[POSTGRES] Seeding PostgreSQL with initial support tickets...");
      for (const tkt of globalTickets) {
        await saveSupportTicketPg(tkt);
      }
    }
  }

  // 6. Hydrate Subscription Transactions
  if (globalSubscriptionTransactions) {
    const txsRes = await p.query("SELECT * FROM subscription_transactions ORDER BY created_at DESC");
    if (txsRes.rows.length > 0) {
      globalSubscriptionTransactions.length = 0; // Clear initial memory list
      txsRes.rows.forEach(t => {
        globalSubscriptionTransactions.push({
          id: t.id,
          razorpayPaymentId: t.razorpay_payment_id,
          razorpayOrderId: t.razorpay_order_id,
          userId: t.user_id,
          userName: t.user_name,
          userEmail: t.user_email,
          userType: t.user_type,
          planId: t.plan_id,
          planName: t.plan_name,
          amount: parseFloat(t.amount || "0.0"),
          currency: t.currency || "INR",
          status: t.status,
          paymentMethod: t.payment_method,
          createdAt: t.created_at ? new Date(t.created_at).toISOString() : new Date().toISOString()
        });
      });
      console.log(`[POSTGRES] Hydrated ${txsRes.rows.length} subscription transactions from DB.`);
    } else {
      // Seed DB with memory fallbacks if any
      console.log("[POSTGRES] Seeding PostgreSQL with initial subscription transactions...");
      for (const tx of globalSubscriptionTransactions) {
        await saveSubscriptionTransactionPg(tx);
      }
    }
  }

  // 7. Hydrate Messages
  if (globalMessages) {
    const messagesRes = await p.query("SELECT * FROM messages ORDER BY created_at ASC");
    if (messagesRes.rows.length > 0) {
      globalMessages.length = 0; // Clear memory list
      messagesRes.rows.forEach(m => {
        globalMessages.push({
          id: m.id,
          threadId: m.thread_id,
          text: m.text,
          senderId: m.sender_id,
          senderName: m.sender_name,
          senderRole: m.sender_role,
          timestamp: m.timestamp,
          createdAt: m.created_at ? new Date(m.created_at).toISOString() : new Date().toISOString()
        });
      });
      console.log(`[POSTGRES] Hydrated ${messagesRes.rows.length} messages from DB.`);
    }
  }
}

// Write Helpers (Async but fire-and-forget/safe-fail patterns)

export async function saveConfigPg(config: any) {
  const p = getPgPool();
  if (!p || !isPgConnected) return;

  try {
    await p.query(
      `INSERT INTO system_config (key, value, updated_at) 
       VALUES ('admin_config', $1, CURRENT_TIMESTAMP) 
       ON CONFLICT (key) DO UPDATE SET value = $1, updated_at = CURRENT_TIMESTAMP`,
      [JSON.stringify(config)]
    );
  } catch (err: any) {
    console.error("[POSTGRES ERROR] Failed to save config to DB:", err.message);
  }
}

export async function saveRiderPg(rider: any) {
  const p = getPgPool();
  if (!p || !isPgConnected) return;

  try {
    await p.query(
      `INSERT INTO riders (id, name, email, phone, password, status, avatar, trips, rating, created_at, is_verified, selfie_url, rejection_reason, aadhaar_number) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
       ON CONFLICT (id) DO UPDATE SET 
         name = $2, email = $3, phone = $4, password = $5, status = $6, avatar = $7, trips = $8, rating = $9, is_verified = $11, selfie_url = $12, rejection_reason = $13, aadhaar_number = $14`,
      [
        rider.id,
        rider.name || "",
        rider.email || null,
        rider.phone || null,
        rider.password || null,
        rider.status || "Active",
        rider.avatar || null,
        rider.trips || 0,
        rider.rating || 5.0,
        rider.createdAt ? new Date(rider.createdAt) : new Date(),
        rider.isVerified === true || rider.status === 'Active' || false,
        rider.selfieUrl || null,
        rider.rejectionReason || null,
        rider.aadhaarNumber || null
      ]
    );
  } catch (err: any) {
    console.error("[POSTGRES ERROR] Failed to save rider to DB:", err.message);
  }
}

export async function deleteRiderPg(id: string) {
  const p = getPgPool();
  if (!p || !isPgConnected) return;

  try {
    await p.query("DELETE FROM riders WHERE id = $1", [id]);
  } catch (err: any) {
    console.error("[POSTGRES ERROR] Failed to delete rider from DB:", err.message);
  }
}

export async function saveDriverPg(driver: any) {
  const p = getPgPool();
  if (!p || !isPgConnected) return;

  try {
    const lat = driver.coords ? driver.coords[0] : null;
    const lng = driver.coords ? driver.coords[1] : null;

    await p.query(
      `INSERT INTO drivers (id, name, email, phone, password, status, trips, rating, vehicle, earnings, created_at, last_seen, coords_lat, coords_lng, type, takes_local_only, license_url, rc_url, selfie_url, vehicle_photo_url, aadhaar_url, work_city, plate, is_verified, rejection_reason) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25) 
       ON CONFLICT (id) DO UPDATE SET 
         name = $2, email = $3, phone = $4, password = $5, status = $6, trips = $7, rating = $8, vehicle = $9, earnings = $10, 
         last_seen = $12, coords_lat = $13, coords_lng = $14, type = $15, takes_local_only = $16,
         license_url = $17, rc_url = $18, selfie_url = $19, vehicle_photo_url = $20, aadhaar_url = $21, work_city = $22, plate = $23, is_verified = $24, rejection_reason = $25`,
      [
        driver.id,
        driver.name || "",
        driver.email || null,
        driver.phone || null,
        driver.password || null,
        driver.status || "Active",
        driver.trips || 0,
        driver.rating || 5.0,
        driver.vehicle || null,
        driver.earnings || 0,
        driver.createdAt ? new Date(driver.createdAt) : new Date(),
        driver.lastSeen || Date.now(),
        lat,
        lng,
        driver.type || "CAR",
        driver.takesLocalOnly || false,
        driver.licenseUrl || null,
        driver.rcUrl || null,
        driver.selfieUrl || null,
        driver.vehiclePhotoUrl || null,
        driver.aadhaarUrl || null,
        driver.workCity || null,
        driver.plate || null,
        driver.isVerified || false,
        driver.rejectionReason || null
      ]
    );
  } catch (err: any) {
    console.error("[POSTGRES ERROR] Failed to save driver to DB:", err.message);
  }
}

export async function deleteDriverPg(id: string) {
  const p = getPgPool();
  if (!p || !isPgConnected) return;

  try {
    await p.query("DELETE FROM drivers WHERE id = $1", [id]);
  } catch (err: any) {
    console.error("[POSTGRES ERROR] Failed to delete driver from DB:", err.message);
  }
}

export async function saveTripPg(trip: any) {
  const p = getPgPool();
  if (!p || !isPgConnected) return;

  try {
    const pickupName = trip.pickup ? trip.pickup.name : "";
    const pickupLat = trip.pickup && trip.pickup.coords ? trip.pickup.coords[0] : null;
    const pickupLng = trip.pickup && trip.pickup.coords ? trip.pickup.coords[1] : null;

    const dropoffName = trip.dropoff ? trip.dropoff.name : "";
    const dropoffLat = trip.dropoff && trip.dropoff.coords ? trip.dropoff.coords[0] : null;
    const dropoffLng = trip.dropoff && trip.dropoff.coords ? trip.dropoff.coords[1] : null;

    const routeCoordsStr = trip.routeCoords ? JSON.stringify(trip.routeCoords) : null;
    const driverCoordsStr = trip.driverCoords ? JSON.stringify(trip.driverCoords) : null;

    await p.query(
      `INSERT INTO trips (id, owner_id, rider_id, driver_id, pickup_name, pickup_lat, pickup_lng, dropoff_name, dropoff_lat, dropoff_lng, price, fare, status, otp, on_demand, is_on_demand, is_instant, created_at, updated_at, route_coords, driver_coords, is_rider_finished, is_rider_reviewed, is_driver_finished, is_driver_reviewed, is_reviewed, rider_rating_given, rider_comment_given, driver_rating_given, driver_comment_given) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30) 
       ON CONFLICT (id) DO UPDATE SET 
         owner_id = $2, rider_id = $3, driver_id = $4, pickup_name = $5, pickup_lat = $6, pickup_lng = $7, 
         dropoff_name = $8, dropoff_lat = $9, dropoff_lng = $10, price = $11, fare = $12, status = $13, otp = $14, 
         on_demand = $15, is_on_demand = $16, is_instant = $17, updated_at = $19, route_coords = $20, driver_coords = $21,
         is_rider_finished = $22, is_rider_reviewed = $23, is_driver_finished = $24, is_driver_reviewed = $25, is_reviewed = $26,
         rider_rating_given = $27, rider_comment_given = $28, driver_rating_given = $29, driver_comment_given = $30`,
      [
        trip.id,
        trip.ownerId || null,
        trip.riderId || null,
        trip.driverId || null,
        pickupName,
        pickupLat,
        pickupLng,
        dropoffName,
        dropoffLat,
        dropoffLng,
        trip.price || 0,
        trip.fare || 0,
        trip.status || "Pending",
        trip.otp || null,
        trip.onDemand !== false,
        trip.isOnDemand !== false,
        trip.isInstant || false,
        trip.createdAt ? new Date(trip.createdAt) : new Date(),
        trip.updatedAt ? new Date(trip.updatedAt) : new Date(),
        routeCoordsStr,
        driverCoordsStr,
        trip.isRiderFinished || false,
        trip.isRiderReviewed || false,
        trip.isDriverFinished || false,
        trip.isDriverReviewed || false,
        trip.isReviewed || false,
        trip.riderRatingGiven || null,
        trip.riderCommentGiven || null,
        trip.driverRatingGiven || null,
        trip.driverCommentGiven || null
      ]
    );
  } catch (err: any) {
    console.error("[POSTGRES ERROR] Failed to save trip to DB:", err.message);
  }
}

export async function deleteTripPg(id: string) {
  const p = getPgPool();
  if (!p || !isPgConnected) return;

  try {
    await p.query("DELETE FROM trips WHERE id = $1", [id]);
  } catch (err: any) {
    console.error("[POSTGRES ERROR] Failed to delete trip from DB:", err.message);
  }
}

export async function saveSupportTicketPg(tkt: any) {
  const p = getPgPool();
  if (!p || !isPgConnected) return;

  try {
    await p.query(
      `INSERT INTO support_tickets (id, subject, comment, screenshot, user_name, user_id, user_role, status, priority, date, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
       ON CONFLICT (id) DO UPDATE SET 
         subject = $2, comment = $3, screenshot = $4, user_name = $5, user_id = $6, user_role = $7, status = $8, priority = $9, date = $10`,
      [
        tkt.id,
        tkt.subject || "",
        tkt.comment || "",
        tkt.screenshot || "",
        tkt.user || "",
        tkt.userId || null,
        tkt.userRole || null,
        tkt.status || "Open",
        tkt.priority || "Medium",
        tkt.date || "",
        tkt.createdAt ? new Date(tkt.createdAt) : new Date()
      ]
    );
  } catch (err: any) {
    console.error("[POSTGRES ERROR] Failed to save support ticket to DB:", err.message);
  }
}

export async function deleteSupportTicketPg(id: string) {
  const p = getPgPool();
  if (!p || !isPgConnected) return;

  try {
    await p.query("DELETE FROM support_tickets WHERE id = $1", [id]);
  } catch (err: any) {
    console.error("[POSTGRES ERROR] Failed to delete support ticket from DB:", err.message);
  }
}

export async function saveSubscriptionTransactionPg(tx: any) {
  const p = getPgPool();
  if (!p || !isPgConnected) return;

  try {
    await p.query(
      `INSERT INTO subscription_transactions (id, razorpay_payment_id, razorpay_order_id, user_id, user_name, user_email, user_type, plan_id, plan_name, amount, currency, status, payment_method, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
       ON CONFLICT (id) DO UPDATE SET 
         razorpay_payment_id = $2, razorpay_order_id = $3, user_id = $4, user_name = $5, user_email = $6, user_type = $7, plan_id = $8, plan_name = $9, amount = $10, currency = $11, status = $12, payment_method = $13, created_at = $14`,
      [
        tx.id,
        tx.razorpayPaymentId || tx.razorpay_payment_id || null,
        tx.razorpayOrderId || tx.razorpay_order_id || null,
        tx.userId || tx.user_id || null,
        tx.userName || tx.user_name || "",
        tx.userEmail || tx.user_email || "",
        tx.userType || tx.user_type || "",
        tx.planId || tx.plan_id || "",
        tx.planName || tx.plan_name || "",
        tx.amount !== undefined ? parseFloat(tx.amount) : 0,
        tx.currency || "INR",
        tx.status || "Success",
        tx.paymentMethod || tx.payment_method || "",
        tx.createdAt ? new Date(tx.createdAt) : new Date()
      ]
    );
  } catch (err: any) {
    console.error("[POSTGRES ERROR] Failed to save subscription transaction to DB:", err.message);
  }
}

export async function saveMessagePg(msg: any) {
  const p = getPgPool();
  if (!p || !isPgConnected) return;

  try {
    await p.query(
      `INSERT INTO messages (id, thread_id, text, sender_id, sender_name, sender_role, timestamp, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
       ON CONFLICT (id) DO UPDATE SET 
         thread_id = $2, text = $3, sender_id = $4, sender_name = $5, sender_role = $6, timestamp = $7`,
      [
        msg.id,
        msg.threadId || msg.tripId || "admin_support",
        msg.text || "",
        msg.senderId || "system",
        msg.senderName || "",
        msg.senderRole || "",
        msg.timestamp || "",
        msg.createdAt ? new Date(msg.createdAt) : new Date()
      ]
    );
  } catch (err: any) {
    console.error("[POSTGRES ERROR] Failed to save message to DB:", err.message);
  }
}

export async function deleteMessagePg(id: string) {
  const p = getPgPool();
  if (!p || !isPgConnected) return;

  try {
    await p.query("DELETE FROM messages WHERE id = $1", [id]);
  } catch (err: any) {
    console.error("[POSTGRES ERROR] Failed to delete message from DB:", err.message);
  }
}

export function getIsPgConnected() {
  return isPgConnected;
}
