import path from "path";
import fs from "fs";
import crypto from "crypto";
import { 
  initPostgres,
  saveConfigPg,
  saveRiderPg,
  deleteRiderPg,
  saveDriverPg,
  deleteDriverPg,
  saveTripPg,
  deleteTripPg,
  saveSupportTicketPg,
  deleteSupportTicketPg,
  saveSubscriptionTransactionPg,
  saveMessagePg,
  deleteMessagePg,
  getPgPool,
  getIsPgConnected
} from "./postgres";

export const globalTrips: any[] = [];
export const globalMessages: any[] = [];
export const globalDrivers: Record<string, any> = {};
export const globalRiders: Record<string, any> = {};
export const globalSearches: any[] = [];
export const globalTickets: any[] = [];
export const globalSubscriptionTransactions: any[] = [];
export const globalSupportChats: Record<string, any[]> = {};
export const globalReviews: any[] = [];
export const globalBlogs: any[] = [];
export const globalFaqs: any[] = [];
export const globalErrors: any[] = [];
export const globalMediaLibrary: any[] = [];
export const globalAlerts: any[] = [];
export let globalConfig: any = null;

export const configPath = path.join(process.cwd(), "config.json");
export const subscriptionTransactionsPath = path.join(process.cwd(), "subscription_transactions.json");

export async function initDb() {
  // Populate default test users as fallbacks
  
  globalRiders["RID26HYM57P8Z1K"] = {
    id: "RID26HYM57P8Z1K",
    driverId: "DRV26HYM57P8Z1K",
    name: "Kabir Malhotra",
    email: "driver_rider@test.com",
    phone: "+91 8877665544",
    password: crypto.createHash("sha256").update("driver123").digest("hex"),
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    trips: 12,
    rating: 4.92,
    wallet: 2850.00,
    emergencyContactName: "Meera Malhotra (Wife)",
    emergencyContactPhone: "+91 98765 00112",
    governmentIdType: "Aadhaar Card",
    governmentIdNumber: "7712 8849 0192",
    idFrontPhoto: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    defaultPaymentMethod: "UPI (PhonePe)",
    preferredLanguage: "English & Hindi",
    applicationStatus: "Active",
    age: 34,
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    bloodGroup: "B+",
    isConvertedDriver: true,
    createdAt: new Date().toISOString()
  };

globalRiders["RID26HYK89W3X4N"] = { 
    id: "RID26HYK89W3X4N", 
    name: "Aryan Singhania", 
    email: "rider@test.com", 
    phone: "+91 9988776655", 
    password: crypto.createHash("sha256").update("rider123").digest("hex"),
    status: "Active", 
    avatar: "https://i.pravatar.cc/150?u=sarah",
    trips: 18, 
    rating: 4.95, 
    wallet: 1450.00,
    emergencyContactName: "Rajesh Singhania (Father)",
    emergencyContactPhone: "+91 98220 11223",
    governmentIdType: "Aadhaar Card",
    governmentIdNumber: "8890 1234 5678",
    idFrontPhoto: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    profilePhoto: "https://i.pravatar.cc/150?u=sarah",
    defaultPaymentMethod: "UPI (Google Pay)",
    preferredLanguage: "English & Hindi",
    applicationStatus: "Active",
    age: 28,
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    bloodGroup: "O+",
    createdAt: new Date().toISOString() 
  };

  const extraDummyRiders = [
    { id: 'RID26MU501K8Q1W', riderId: 'RID26MU501K8Q1W', name: 'Aarav Sharma', phone: '+91 98765 12345', email: 'aarav.sharma@example.com', status: 'Active', wallet: 1500, rating: 4.9, createdAt: '2026-07-15', isVerified: true, city: 'Mumbai', state: 'Maharashtra', country: 'India', governmentIdType: 'Aadhaar Card', governmentIdNumber: '8890 1234 5678', emergencyContactName: 'Rajesh Sharma (Father)', emergencyContactPhone: '+91 98765 54321', preferredLanguage: 'English & Hindi', defaultPaymentMethod: 'UPI (PhonePe)', age: 28, bloodGroup: 'O+' },
    { id: 'RID26DL502M4QWX', riderId: 'RID26DL502M4QWX', name: 'Priya Patel', phone: '+91 91234 56789', email: 'priya.patel@example.com', status: 'Active', wallet: 850, rating: 4.85, createdAt: '2026-07-20', isVerified: true, city: 'Delhi NCR', state: 'Delhi', country: 'India', governmentIdType: 'Aadhaar Card', governmentIdNumber: '9921 4455 6677', emergencyContactName: 'Suresh Patel (Brother)', emergencyContactPhone: '+91 91234 98765', preferredLanguage: 'Hindi & English', defaultPaymentMethod: 'UPI (Google Pay)', age: 26, bloodGroup: 'B+' },
    { id: 'RID26BL503K7Q2M', riderId: 'RID26BL503K7Q2M', name: 'Rohan Verma', phone: '+91 99887 11223', email: 'rohan.verma@example.com', status: 'Active', wallet: 2100, rating: 4.95, createdAt: '2026-08-01', isVerified: true, city: 'Bengaluru', state: 'Karnataka', country: 'India', governmentIdType: 'Aadhaar Card', governmentIdNumber: '4455 6677 8899', emergencyContactName: 'Sunita Verma (Mother)', emergencyContactPhone: '+91 99887 33221', preferredLanguage: 'Kannada & English', defaultPaymentMethod: 'Paytm Wallet', age: 31, bloodGroup: 'A+' }
  ];

  extraDummyRiders.forEach(r => {
    globalRiders[r.id] = r;
  });

  // Dedicated Activated Driver Account for 9550723823
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
    vehicleExteriorPhoto: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400",
    dlNumber: "TS-09-2023955072",
    dlFrontPhoto: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80",
    dlBackPhoto: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400",
    aadhaarNumber: "9550 7238 2300",
    aadhaarFrontPhoto: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    aadhaarBackPhoto: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    identitySelfiePhoto: "https://i.pravatar.cc/150?u=softvares",
    applicationStatus: "Approved",
    driver_kyc_status: "Approved",
    kycApproved: true,
    isVerified: true,
    age: 30,
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    bloodGroup: "O+",
    earnings: 45200,
    isConvertedDriver: true,
    hasDriverRole: true,
    hasRiderRole: true,
    roles: ["driver", "rider"],
    role: "driver",
    onboardingStep: 7,
    createdAt: new Date().toISOString(),
    lastSeen: Date.now(),
    type: 'CAR'
  };

  globalRiders["RID9550723823"] = {
    id: "RID9550723823",
    driverId: "DRV9550723823",
    name: "Softvares Test Driver",
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

  globalDrivers["DRV26HYK89W3X4N"] = {
    id: "DRV26HYK89W3X4N",
    riderId: "RID26HYK89W3X4N",
    name: "Aryan Singhania",
    email: "rider@test.com",
    phone: "+91 9988776655",
    password: crypto.createHash("sha256").update("rider123").digest("hex"),
    status: "Active",
    trips: 42,
    rating: 4.90,
    vehicle: "Maruti Swift Dzire VXi (TS09 EN 9988)",
    vehicleCategory: "Car",
    vehicleBrand: "Maruti Suzuki",
    vehicleModel: "Swift Dzire VXi 2025",
    vehicleColor: "Pearl Arctic White",
    numberPlate: "TS 09 EN 9988",
    vehicleExteriorPhoto: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400",
    dlNumber: "TS-09-2022091234",
    dlFrontPhoto: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80",
    dlBackPhoto: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400",
    aadhaarNumber: "8890 1234 5678",
    aadhaarFrontPhoto: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    aadhaarBackPhoto: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    identitySelfiePhoto: "https://i.pravatar.cc/150?u=sarah",
    applicationStatus: "Approved",
    age: 28,
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    bloodGroup: "O+",
    earnings: 28400,
    isConvertedDriver: true,
    createdAt: new Date().toISOString(),
    lastSeen: Date.now(),
    type: 'CAR',
    isVerified: true
  };

globalDrivers["DRV26HYM57P8Z1K"] = { 
    id: "DRV26HYM57P8Z1K", 
    name: "Kabir Malhotra", 
    email: "driver@test.com", 
    phone: "+91 8877665544", 
    password: crypto.createHash("sha256").update("driver123").digest("hex"),
    status: "Active", 
    trips: 142, 
    rating: 4.92, 
    vehicle: "Maruti Swift Dzire (MH12 AB 1234)", 
    vehicleCategory: "Car",
    vehicleBrand: "Maruti Suzuki",
    vehicleModel: "Swift Dzire VXi 2025",
    vehicleColor: "Pearl Arctic White",
    numberPlate: "MH 12 AB 1234",
    vehicleExteriorPhoto: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400",
    dlNumber: "MH-12-2021004921",
    dlFrontPhoto: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80",
    dlBackPhoto: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400",
    aadhaarNumber: "7712 8849 0192",
    aadhaarFrontPhoto: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    aadhaarBackPhoto: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    identitySelfiePhoto: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    applicationStatus: "Approved",
    age: 34,
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    bloodGroup: "B+",
    earnings: 34200, 
    createdAt: new Date().toISOString(), 
    lastSeen: Date.now(), 
    coords: [17.3850, 78.4867], // Hyderabad fallback center
    type: 'CAR',
    licenseUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80",
    rcUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400",
    selfieUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    vehiclePhotoUrl: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=400",
    aadhaarUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    isVerified: true
  };

  globalDrivers["DRV26PUR48X2B1D"] = { 
    id: "DRV26PUR48X2B1D", 
    name: "Ramesh Auto", 
    email: "driver_pune@test.com", 
    phone: "+91 8877665533", 
    status: "Active", 
    trips: 98, 
    rating: 4.85, 
    vehicle: "Bajaj RE Compact 4S (MH14 CC 5678)", 
    vehicleCategory: "Auto",
    vehicleBrand: "Bajaj",
    vehicleModel: "RE Compact 4S CNG",
    vehicleColor: "Golden Yellow & Black",
    numberPlate: "MH 14 CC 5678",
    vehicleExteriorPhoto: "https://images.unsplash.com/photo-1566008885218-90abf9200ddb?auto=format&fit=crop&q=80&w=400",
    dlNumber: "MH-14-2018001290",
    dlFrontPhoto: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80",
    dlBackPhoto: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80",
    aadhaarNumber: "9012 3341 8820",
    aadhaarFrontPhoto: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    aadhaarBackPhoto: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    identitySelfiePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    applicationStatus: "Approved",
    age: 41,
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    bloodGroup: "A+",
    earnings: 21500, 
    createdAt: new Date().toISOString(), 
    lastSeen: Date.now(), 
    coords: [18.5204, 73.8567], // Pune center
    type: 'AUTO',
    takesLocalOnly: true,
    licenseUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80",
    rcUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400",
    selfieUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    vehiclePhotoUrl: "https://images.unsplash.com/photo-1566008885218-90abf9200ddb?auto=format&fit=crop&q=80&w=400",
    aadhaarUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    isVerified: true
  };

  globalDrivers["DRV26HYT92W1Z4B"] = { 
    id: "DRV26HYT92W1Z4B", 
    name: "Anil Bike Rider", 
    email: "driver_bike@test.com", 
    phone: "+91 8877665522", 
    status: "Active", 
    trips: 64, 
    rating: 4.90, 
    vehicle: "Royal Enfield Classic 350 (TS09 EN 9012)", 
    vehicleCategory: "Motorcycle",
    vehicleBrand: "Royal Enfield",
    vehicleModel: "Classic 350 Chrome",
    vehicleColor: "Stealth Black",
    numberPlate: "TS 09 EN 9012",
    vehicleExteriorPhoto: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=400",
    dlNumber: "TS-09-2022008812",
    dlFrontPhoto: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80",
    dlBackPhoto: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80",
    aadhaarNumber: "6654 2210 9901",
    aadhaarFrontPhoto: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    aadhaarBackPhoto: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    identitySelfiePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    applicationStatus: "Approved",
    age: 29,
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    bloodGroup: "AB+",
    earnings: 14800, 
    createdAt: new Date().toISOString(), 
    lastSeen: Date.now(), 
    coords: [17.3980, 78.4710], // Hyderabad bike
    type: 'BIKE',
    takesLocalOnly: true,
    licenseUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80",
    rcUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=400",
    selfieUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    vehiclePhotoUrl: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=400",
    aadhaarUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    isVerified: true
  };

  globalDrivers["DRV26HYN15X2P8R"] = { 
    id: "DRV26HYN15X2P8R", 
    name: "Siddharth Khanna", 
    email: "driver_prime@test.com", 
    phone: "+91 8877665511", 
    status: "Active", 
    trips: 210, 
    rating: 4.98, 
    vehicle: "Toyota Camry Hybrid (MH12 PR 4321)", 
    vehicleCategory: "Car",
    vehicleBrand: "Toyota",
    vehicleModel: "Camry Hybrid 2026",
    vehicleColor: "Attitude Black Metallic",
    numberPlate: "MH 12 PR 4321",
    vehicleExteriorPhoto: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400",
    dlNumber: "MH-12-2019003310",
    dlFrontPhoto: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80",
    dlBackPhoto: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80",
    aadhaarNumber: "4412 8890 5512",
    aadhaarFrontPhoto: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    aadhaarBackPhoto: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    identitySelfiePhoto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    applicationStatus: "Approved",
    age: 38,
    city: "Pune",
    state: "Maharashtra",
    country: "India",
    bloodGroup: "O+",
    earnings: 58900, 
    createdAt: new Date().toISOString(), 
    lastSeen: Date.now(), 
    coords: [17.4485, 78.3741], // Hi-Tech City, Hyderabad
    type: 'SEDAN',
    takesLocalOnly: false,
    licenseUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80",
    rcUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80",
    selfieUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    vehiclePhotoUrl: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&q=80&w=400",
    aadhaarUrl: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
    isVerified: true
  };

  globalDrivers["DRV26PUA48M9Z1E"] = {
    id: "DRV26PUA48M9Z1E",
    name: "Pune Red Cross (Ambulance)",
    email: "ambulance_pune@test.com",
    phone: "+91 8877665501",
    status: "Active",
    trips: 12,
    rating: 5.0,
    vehicle: "Force Emergency Ambulance (MH12 AM 911)",
    earnings: 0,
    createdAt: new Date().toISOString(),
    lastSeen: Date.now(),
    coords: [18.5240, 73.8580], // Pune
    type: 'AMBULANCE',
    takesLocalOnly: true
  };

  globalDrivers["DRV26PUP19S8X4O"] = {
    id: "DRV26PUP19S8X4O",
    name: "Pune Police Patrol",
    email: "police_pune@test.com",
    phone: "+91 8877665502",
    status: "Active",
    trips: 24,
    rating: 4.9,
    vehicle: "Mahindra Bolero Patrol (MH12 PL 100)",
    earnings: 0,
    createdAt: new Date().toISOString(),
    lastSeen: Date.now(),
    coords: [18.5170, 73.8520], // Pune
    type: 'POLICE',
    takesLocalOnly: true
  };

  globalDrivers["DRV26HYA38K9P2W"] = {
    id: "DRV26HYA38K9P2W",
    name: "Hyderabad Trauma Care",
    email: "ambulance_hyd@test.com",
    phone: "+91 8877665503",
    status: "Active",
    trips: 15,
    rating: 5.0,
    vehicle: "Tata Winger Ambulance (TS09 AM 911)",
    earnings: 0,
    createdAt: new Date().toISOString(),
    lastSeen: Date.now(),
    coords: [17.3910, 78.4750], // Hyderabad
    type: 'AMBULANCE',
    takesLocalOnly: true
  };

  globalDrivers["DRV26HYP48T2C1N"] = {
    id: "DRV26HYP48T2C1N",
    name: "Hyderabad City Police",
    email: "police_hyd@test.com",
    phone: "+91 8877665504",
    status: "Active",
    trips: 30,
    rating: 4.85,
    vehicle: "Maruti Gypsy Patrol (TS09 PL 100)",
    earnings: 0,
    createdAt: new Date().toISOString(),
    lastSeen: Date.now(),
    coords: [17.4020, 78.4680], // Hyderabad
    type: 'POLICE',
    takesLocalOnly: true
  };

  // Load local config from backend's persistent config.json first (as fallback)
  try {
    if (fs.existsSync(configPath)) {
      globalConfig = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      if (!globalConfig.map?.tileLayerUrl || (globalConfig.map.tileLayerUrl.includes('cartocdn.com') && !globalConfig.map.tileLayerUrl.includes('api_key')) || globalConfig.map.tileLayerUrl.includes('World_Street_Map')) {
        globalConfig.map = globalConfig.map || {};
        globalConfig.map.tileLayerUrl = 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';
      }
      if (!globalConfig.chatSettings) {
        globalConfig.chatSettings = {
          autoDeleteEnabled: true,
          autoDeleteIntervalMinutes: 1440,
          allowAttachments: false
        };
      } else {
        if (globalConfig.chatSettings.autoDeleteEnabled === undefined) {
          globalConfig.chatSettings.autoDeleteEnabled = true;
        }
        if (globalConfig.chatSettings.autoDeleteIntervalMinutes === undefined) {
          globalConfig.chatSettings.autoDeleteIntervalMinutes = 1440;
        }
        if (globalConfig.chatSettings.allowAttachments === undefined) {
          globalConfig.chatSettings.allowAttachments = false;
        }
      }
      console.log("[SERVER] Loaded local fallback config.json");
    }
  } catch (e) {
    console.warn("[SERVER WARNING] Could not read config.json fallback:", e);
  }

  // Load local subscription transactions fallback
  try {
    if (fs.existsSync(subscriptionTransactionsPath)) {
      const txs = JSON.parse(fs.readFileSync(subscriptionTransactionsPath, "utf-8"));
      globalSubscriptionTransactions.length = 0;
      globalSubscriptionTransactions.push(...txs);
      console.log(`[SERVER] Loaded ${txs.length} fallback subscription transactions from disk`);
    }
  } catch (e) {
    console.warn("[SERVER WARNING] Could not read subscription_transactions.json fallback:", e);
  }

  // Populate default test tickets if empty
  if (globalTickets.length === 0) {
    globalTickets.push(
      { id: 'TKT26G8B9N1V4C5', subject: 'Lost My Wallet in vehicle DL 1C 4920', user: 'Ananya S.', userId: 'RID26HYK89W3X4N', userRole: 'Rider', status: 'Open', priority: 'High', date: '2 hrs ago', comment: 'I left my brown leather wallet on the backseat.', screenshot: '' },
      { id: 'TKT26P3X2Y8Z9W7', subject: 'Wrong toll charges calculated on Delhi-Noida highway', user: 'Rohan P.', userId: 'RID26HYK89W3X4N', userRole: 'Rider', status: 'Pending', priority: 'Medium', date: 'Yesterday', comment: 'The app charged me double the standard toll rate.', screenshot: '' },
      { id: 'TKT26D4M5N2Q8K3', subject: 'Inability to upload PAN card on verification page', user: 'Karan Patil', userId: 'DRV26HYM57P8Z1K', userRole: 'Driver', status: 'Closed', priority: 'Low', date: '3 days ago', comment: 'Getting network error when clicking submit.', screenshot: '' }
    );
  }

  // Populate default test trips
  if (globalTrips.length === 0) {
    globalTrips.push(
      {
        id: "TRP26HYM01D2R4K",
        ownerId: "RID26HYK89W3X4N",
        riderId: "RID26HYK89W3X4N",
        driverId: "DRV26HYM57P8Z1K",
        customerName: "Aryan Singhania",
        customerPhone: "+91 99887 76655",
        driverName: "Kabir Malhotra (Dual-Role Partner)",
        driverPhone: "+91 88776 65544",
        pickup: { name: "Cyber Towers, Hi-Tech City, Hyderabad", coords: [17.4504, 78.3808] },
        dropoff: { name: "Rajiv Gandhi Intl Airport (HYD), Hyderabad", coords: [17.2403, 78.4294] },
        price: 780,
        fare: 780,
        status: "Completed",
        otp: "4829",
        onDemand: true,
        isOnDemand: true,
        isInstant: true,
        tripType: "Airport Express",
        vehicle: "Toyota Etios (TS 09 EV 4021)",
        createdAt: "2026-08-04T08:30:00.000Z",
        updatedAt: "2026-08-04T09:15:00.000Z",
        completedAt: "2026-08-04T09:15:00.000Z",
        isRiderFinished: true,
        isRiderReviewed: true,
        isDriverFinished: true,
        isDriverReviewed: true,
        isReviewed: true,
        isPaid: true,
        paymentId: "TXN26HY8A2P9W1X",
        paymentMethod: "UPI (PhonePe)"
      },
      {
        id: "TRP26BL502M7K9W",
        ownerId: "RID26MU501K8Q1W",
        riderId: "RID26MU501K8Q1W",
        driverId: "DRV26HYM57P8Z1K",
        customerName: "Aarav Sharma",
        customerPhone: "+91 98765 12345",
        driverName: "Kabir Malhotra (Dual-Role Partner)",
        driverPhone: "+91 88776 65544",
        pickup: { name: "Bandra Kurla Complex (BKC), Mumbai", coords: [19.0657, 72.8687] },
        dropoff: { name: "Chhatrapati Shivaji Maharaj Intl Airport (BOM), Mumbai", coords: [19.0896, 72.8656] },
        price: 520,
        fare: 520,
        status: "Completed",
        otp: "1930",
        onDemand: true,
        isOnDemand: true,
        isInstant: true,
        tripType: "Instant Ride",
        vehicle: "Toyota Etios (TS 09 EV 4021)",
        createdAt: "2026-08-04T14:15:00.000Z",
        updatedAt: "2026-08-04T14:45:00.000Z",
        completedAt: "2026-08-04T14:45:00.000Z",
        isRiderFinished: true,
        isRiderReviewed: true,
        isDriverFinished: true,
        isDriverReviewed: true,
        isReviewed: true,
        isPaid: true,
        paymentId: "TXN26PU4B9C8W2N",
        paymentMethod: "Razorpay"
      },
      {
        id: "TRP26DL503K2M8P",
        ownerId: "RID26HYM57P8Z1K",
        riderId: "RID26HYM57P8Z1K",
        driverId: "DRV26HYT92W1Z4B",
        customerName: "Kabir Malhotra (Dual-Role User)",
        customerPhone: "+91 88776 65544",
        driverName: "Rajesh Kumar (Dedicated Driver)",
        driverPhone: "+91 98123 45678",
        pickup: { name: "Connaught Place Block M, Delhi NCR", coords: [28.6315, 77.2167] },
        dropoff: { name: "DLF Cyber City Phase 3, Gurugram", coords: [28.4950, 77.0895] },
        price: 410,
        fare: 410,
        status: "Completed",
        otp: "8294",
        onDemand: false,
        isOnDemand: false,
        isInstant: false,
        tripType: "Intercity",
        vehicle: "Maruti Swift Dzire (DL 01 AB 8812)",
        createdAt: "2026-08-05T11:00:00.000Z",
        updatedAt: "2026-08-05T11:10:00.000Z",
        completedAt: "2026-08-05T11:40:00.000Z",
        isRiderFinished: true,
        isRiderReviewed: true,
        isDriverFinished: true,
        isDriverReviewed: true,
        isReviewed: true,
        isPaid: true,
        paymentMethod: "UPI (Google Pay)"
      },
      {
        id: "TRP26MU504Q8W1X",
        ownerId: "RID26DL502M4QWX",
        riderId: "RID26DL502M4QWX",
        driverId: "DRV26HYK89W3X4N",
        customerName: "Priya Patel",
        customerPhone: "+91 91234 56789",
        driverName: "Aryan Singhania (Dual-Role Partner)",
        driverPhone: "+91 99887 76655",
        pickup: { name: "Sector 18 Market, Noida", coords: [28.5708, 77.3261] },
        dropoff: { name: "Indira Gandhi Intl Airport T3, New Delhi", coords: [28.5562, 77.1000] },
        price: 640,
        fare: 640,
        status: "Completed",
        otp: "3510",
        onDemand: true,
        isOnDemand: true,
        isInstant: true,
        tripType: "Instant Ride",
        vehicle: "Hyundai Xcent (MH 02 CZ 9021)",
        createdAt: "2026-08-03T18:00:00.000Z",
        updatedAt: "2026-08-03T18:40:00.000Z",
        completedAt: "2026-08-03T18:40:00.000Z",
        isRiderFinished: true,
        isRiderReviewed: true,
        isDriverFinished: true,
        isDriverReviewed: true,
        isReviewed: true,
        isPaid: true,
        paymentMethod: "Cash"
      },
      {
        id: "TRP26PU505K7M3N",
        ownerId: "RID26BL503K7Q2M",
        riderId: "RID26BL503K7Q2M",
        driverId: "DRV26PUR48X2B1D",
        customerName: "Rohan Verma",
        customerPhone: "+91 99887 11223",
        driverName: "Vikram Singh (Dedicated Driver)",
        driverPhone: "+91 98987 65432",
        pickup: { name: "MG Road Metro Station, Bengaluru", coords: [12.9756, 77.6066] },
        dropoff: { name: "Electronic City Phase 1, Bengaluru", coords: [12.8399, 77.6770] },
        price: 350,
        fare: 350,
        status: "Completed",
        otp: "5512",
        onDemand: false,
        isOnDemand: false,
        isInstant: false,
        tripType: "Scheduled Ride",
        vehicle: "Tata Tigor EV (KA 01 EV 1001)",
        createdAt: "2026-08-02T09:00:00.000Z",
        updatedAt: "2026-08-02T09:35:00.000Z",
        completedAt: "2026-08-02T09:35:00.000Z",
        isRiderFinished: true,
        isRiderReviewed: true,
        isDriverFinished: true,
        isDriverReviewed: true,
        isReviewed: true,
        isPaid: true,
        paymentMethod: "Razorpay"
      },
      {
        id: "TRP26HY506M2K1R",
        ownerId: "RID26HYK89W3X4N",
        riderId: "RID26HYK89W3X4N",
        driverId: "DRV26PUR48X2B1D",
        customerName: "Aryan Singhania (Dual-Role User)",
        customerPhone: "+91 99887 76655",
        driverName: "Vikram Singh (Dedicated Driver)",
        driverPhone: "+91 98987 65432",
        pickup: { name: "Jubilee Hills Check Post, Hyderabad", coords: [17.4325, 78.4073] },
        dropoff: { name: "Gachibowli Financial District, Hyderabad", coords: [17.4156, 78.3428] },
        price: 280,
        fare: 280,
        status: "Completed",
        otp: "9041",
        onDemand: false,
        isOnDemand: false,
        isInstant: false,
        tripType: "Scheduled Ride",
        vehicle: "Tata Tigor EV (KA 01 EV 1001)",
        createdAt: "2026-08-05T15:00:00.000Z",
        updatedAt: "2026-08-05T15:45:00.000Z",
        completedAt: "2026-08-05T15:45:00.000Z",
        isRiderFinished: true,
        isRiderReviewed: true,
        isDriverFinished: true,
        isDriverReviewed: true,
        isReviewed: true,
        isPaid: true,
        paymentMethod: "UPI (Google Pay)"
      }
    );
  }

  // Attempt to initialize and hydrate from PostgreSQL
  try {
    const isPgConnected = await initPostgres(
      globalRiders,
      globalDrivers,
      globalTrips,
      globalConfig,
      setConfig,
      globalTickets,
      globalSubscriptionTransactions,
      globalMessages
    );
    if (isPgConnected) {
      console.log("[SERVER] Database synchronized with PostgreSQL successfully.");
    }
  } catch (err: any) {
    console.error("[SERVER ERROR] PostgreSQL init failed:", err.message);
  }

  // Set up background chat auto-deletion interval (checks once per minute)
  setInterval(() => {
    autoDeleteOldMessages().catch(err => console.error("[AUTO-DELETE ERROR] Failed to run auto-delete:", err));
  }, 60 * 1000);

  // Pre-seed realistic user searches for analytics metrics if currently empty
  if (globalSearches.length === 0) {
    const seedSearches = [
      { id: "s1", from: "Delhi NCR", to: "Jaipur Highway", tripType: "Intercity", ageGroup: "25-34", device: "Android", timestamp: "2026-06-25T09:15:00Z" },
      { id: "s2", from: "Mumbai Terminal 2", to: "Pune Lonavala", tripType: "Intercity", ageGroup: "18-24", device: "iOS", timestamp: "2026-06-25T08:30:00Z" },
      { id: "s3", from: "Bangalore Whitefield", to: "Mysore Palace", tripType: "Intercity", ageGroup: "35-44", device: "Android", timestamp: "2026-06-25T07:45:00Z" },
      { id: "s4", from: "Hyderabad Gachibowli", to: "Secunderabad", tripType: "Local", ageGroup: "25-34", device: "Web", timestamp: "2026-06-25T09:22:00Z" },
      { id: "s5", from: "Pune Hinjewadi", to: "Mumbai Dadar", tripType: "Intercity", ageGroup: "25-34", device: "iOS", timestamp: "2026-06-25T09:02:00Z" },
      { id: "s6", from: "Delhi Airport T3", to: "Gurugram Cyber City", tripType: "Local", ageGroup: "45+", device: "iOS", timestamp: "2026-06-25T06:12:00Z" },
      { id: "s7", from: "Chennai Central", to: "Pondicherry Beach", tripType: "Intercity", ageGroup: "18-24", device: "Android", timestamp: "2026-06-25T05:40:00Z" },
      { id: "s8", from: "Mumbai Dadar", to: "Pune Hinjewadi", tripType: "Intercity", ageGroup: "35-44", device: "Android", timestamp: "2026-06-24T22:15:00Z" },
      { id: "s9", from: "Kolkata Salt Lake", to: "Digha Beach", tripType: "Intercity", ageGroup: "18-24", device: "iOS", timestamp: "2026-06-24T21:10:00Z" },
      { id: "s10", from: "Ahmedabad", to: "Vadodara Express", tripType: "Intercity", ageGroup: "45+", device: "Android", timestamp: "2026-06-24T19:30:00Z" },
      { id: "s11", from: "Delhi NCR", to: "Agra Yamuna Expressway", tripType: "Intercity", ageGroup: "25-34", device: "iOS", timestamp: "2026-06-24T18:45:00Z" },
      { id: "s12", from: "Bangalore Whitefield", to: "Electronic City", tripType: "Local", ageGroup: "25-34", device: "Android", timestamp: "2026-06-24T17:15:00Z" },
      { id: "s13", from: "Hyderabad Gachibowli", to: "Vijayawada Highway", tripType: "Intercity", ageGroup: "35-44", device: "iOS", timestamp: "2026-06-24T16:00:00Z" },
      { id: "s14", from: "Pune Hinjewadi", to: "Mahabaleshwar", tripType: "Intercity", ageGroup: "18-24", device: "Android", timestamp: "2026-06-24T14:20:00Z" },
      { id: "s15", from: "Chandigarh", to: "Shimla Mall Road", tripType: "Intercity", ageGroup: "45+", device: "iOS", timestamp: "2026-06-24T11:10:00Z" },
      { id: "s16", from: "Coimbatore", to: "Ooty Botanical", tripType: "Intercity", ageGroup: "25-34", device: "Android", timestamp: "2026-06-24T09:00:00Z" },
    ];
    globalSearches.push(...seedSearches);
  }

  // Pre-seed FAQs if empty
  if (globalFaqs.length === 0) {
    globalFaqs.push(
      { id: "faq-1", category: "rider", question: "How do I book an instant or scheduled ride?", answer: "Choose your pickup & dropoff on the homepage, select vehicle type, apply promo codes if any, and tap 'Confirm Ride'.", createdAt: new Date().toISOString() },
      { id: "faq-2", category: "rider", question: "What payment methods are supported?", answer: "We support UPI (PhonePe, Google Pay, Paytm), Credit/Debit Cards, Razorpay, and Cash payments directly to the driver.", createdAt: new Date().toISOString() },
      { id: "faq-3", category: "driver", question: "How do I complete driver KYC verification?", answer: "Navigate to the Driver Verification tab, upload your Driving License, Aadhaar Card, Selfie, and RC documents. Admin will review within minutes.", createdAt: new Date().toISOString() },
      { id: "faq-4", category: "driver", question: "When and how do driver payouts work?", answer: "Earnings accumulate directly in your driver wallet. You can withdraw instantly to your linked UPI ID or bank account anytime.", createdAt: new Date().toISOString() },
      { id: "faq-5", category: "general", question: "Is safety support available 24/7?", answer: "Yes! Use the 24/7 Emergency SOS button or live support desk chat anytime for immediate admin assistance and live trip tracking.", createdAt: new Date().toISOString() }
    );
  }

  // Pre-seed Blogs if empty
  if (globalBlogs.length === 0) {
    globalBlogs.push(
      { id: "blog-1", title: "Top 10 Tips for Safe & Eco-Friendly City Rides", category: "Safety & Community", author: "CityMobility Team", date: "2026-08-01", coverImage: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=800&q=80", content: "Learn how shared rides, regular vehicle maintenance, and eco-driving techniques cut urban emissions while saving fare costs for daily commuters.", tags: ["Eco-Friendly", "Safety", "Guide"] },
      { id: "blog-2", title: "Maximizing Driver Earnings with Peak Surge Mapping", category: "Driver Insights", author: "Fleet Analytics", date: "2026-08-04", coverImage: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80", content: "A deep dive into surge pricing algorithms, heatmaps, and airport queue optimization to help driver partners boost hourly revenues by up to 35%.", tags: ["Earnings", "Drivers", "Surge"] },
      { id: "blog-3", title: "Understanding Our 100% Verified Driver KYC Desk", category: "Trust & Security", author: "Verification Desk", date: "2026-08-07", coverImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80", content: "How our multi-point Aadhaar, DL, and facial recognition checks keep every passenger and driver safe across all intercity & local trips.", tags: ["KYC", "Security", "Trust"] }
    );
  }

  // Pre-seed Reviews if empty
  if (globalReviews.length === 0) {
    globalReviews.push(
      { id: "rev-1", riderName: "Aryan Singhania", driverName: "Kabir Malhotra", rating: 5, comment: "Punctual arrival, clean sedan with air conditioning, and super smooth driving!", date: "2026-08-05", tripId: "TRP26BL502M7K9W" },
      { id: "rev-2", riderName: "Aarav Sharma", driverName: "Ramesh Auto", rating: 5, comment: "Quick auto pickup during heavy traffic! Safe driving and friendly driver.", date: "2026-08-04", tripId: "TRP26PU505K7M3N" },
      { id: "rev-3", riderName: "Priya Patel", driverName: "Anil Bike Rider", rating: 4, comment: "Fast bike ride, helmet provided. Arrived 10 minutes early for my meeting.", date: "2026-08-03", tripId: "TRP26HY506M2K1R" }
    );
  }

  // Pre-seed Media Library if empty
  if (globalMediaLibrary.length === 0) {
    globalMediaLibrary.push(
      { id: "med-1", name: "Driver DL Front - Kabir.jpg", url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80", category: "Verification", uploaderName: "Kabir Malhotra", uploaderRole: "Driver", uploadedAt: "2026-08-01T10:00:00Z", size: "1.2 MB" },
      { id: "med-2", name: "Innova Exterior Photo.jpg", url: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80", category: "Vehicle", uploaderName: "Softvares Test Driver", uploaderRole: "Driver", uploadedAt: "2026-08-02T11:30:00Z", size: "2.4 MB" },
      { id: "med-3", name: "Rider ID Front - Aryan.jpg", url: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80", category: "Aadhaar", uploaderName: "Aryan Singhania", uploaderRole: "Rider", uploadedAt: "2026-08-03T14:15:00Z", size: "1.8 MB" }
    );
  }

  // Pre-seed System Alerts if empty
  if (globalAlerts.length === 0) {
    globalAlerts.push(
      { id: "alt-1", type: "KYC_SUBMISSION", title: "New Driver KYC Submitted", message: "Kabir Malhotra submitted Aadhaar & Driving License for verification.", timestamp: "2026-08-09T10:00:00Z", isRead: false },
      { id: "alt-2", type: "REGISTRATION", title: "New Rider Registered", message: "Aarav Sharma completed phone verification and profile setup.", timestamp: "2026-08-09T09:30:00Z", isRead: false }
    );
  }
}

let dbIo: any = null;
export function setDbIo(io: any) {
  dbIo = io;
}

export function saveConfig(newConfig: any) {
  globalConfig = newConfig;
  try {
    fs.writeFileSync(configPath, JSON.stringify(globalConfig, null, 2), "utf-8");
    console.log("[SERVER] Successfully saved config.json to disk");
    
    // Broadcast immediately to all connected clients (rider, driver, admin)
    if (dbIo) {
      dbIo.emit("config_updated", globalConfig);
    }
    
    // Async synchronize to Postgres
    saveConfigPg(newConfig).catch(err => console.error("[POSTGRES] Config sync error:", err));
    
    return true;
  } catch (e) {
    console.error("[SERVER ERROR] Could not save config.json:", e);
    return false;
  }
}

export function setConfig(newConfig: any) {
  globalConfig = newConfig;
}

// Database Synchronizer Wrappers
export async function syncConfig(config: any) {
  await saveConfigPg(config);
}

export async function syncRider(rider: any) {
  await saveRiderPg(rider);
}

export async function removeRider(id: string) {
  await deleteRiderPg(id);
}

export async function syncDriver(driver: any) {
  await saveDriverPg(driver);
}

export async function removeDriver(id: string) {
  await deleteDriverPg(id);
}

export async function syncTrip(trip: any) {
  await saveTripPg(trip);
}

export async function removeTrip(id: string) {
  await deleteTripPg(id);
}

export async function syncTicket(tkt: any) {
  await saveSupportTicketPg(tkt);
}

export async function removeTicket(id: string) {
  await deleteSupportTicketPg(id);
}

export function saveSubscriptionTransaction(tx: any) {
  const idx = globalSubscriptionTransactions.findIndex(t => t.id === tx.id);
  if (idx !== -1) {
    globalSubscriptionTransactions[idx] = { ...globalSubscriptionTransactions[idx], ...tx };
  } else {
    globalSubscriptionTransactions.push(tx);
  }

  try {
    fs.writeFileSync(subscriptionTransactionsPath, JSON.stringify(globalSubscriptionTransactions, null, 2), "utf-8");
    // Async synchronize to Postgres
    saveSubscriptionTransactionPg(tx).catch(err => console.error("[POSTGRES] Subscription txn sync error:", err));
    return true;
  } catch (e) {
    console.error("[SERVER ERROR] Could not save subscription transaction:", e);
    return false;
  }
}

export async function syncMessage(msg: any) {
  const exists = globalMessages.find(m => m.id === msg.id);
  if (!exists) {
    globalMessages.push(msg);
  }
  await saveMessagePg(msg);
}

export async function removeMessage(id: string) {
  const idx = globalMessages.findIndex(m => m.id === id);
  if (idx !== -1) {
    globalMessages.splice(idx, 1);
  }
  await deleteMessagePg(id);
}

export async function autoDeleteOldMessages() {
  const chatSettings = globalConfig?.chatSettings || {};
  const isEnabled = chatSettings.autoDeleteEnabled ?? true;
  const intervalMinutes = chatSettings.autoDeleteIntervalMinutes ?? 1440; // 24 hours default
  if (!isEnabled || !intervalMinutes || intervalMinutes <= 0) return;

  const thresholdTime = new Date(Date.now() - intervalMinutes * 60 * 1000);
  let deletedCountPg = 0;

  // 1. Delete from PostgreSQL
  const p = getPgPool();
  const isConnected = getIsPgConnected();
  if (p && isConnected) {
    try {
      const res = await p.query("DELETE FROM messages WHERE created_at < $1", [thresholdTime]);
      if (res.rowCount && res.rowCount > 0) {
        deletedCountPg = res.rowCount;
        console.log(`[AUTO-DELETE] Deleted ${res.rowCount} expired messages from database (threshold: ${intervalMinutes} mins / ${intervalMinutes / 60} hrs).`);
      }
    } catch (err: any) {
      console.error("[AUTO-DELETE ERROR] Failed to delete expired messages from DB:", err.message);
    }
  }

  // 2. Delete from Memory State
  const initialLength = globalMessages.length;
  for (let i = globalMessages.length - 1; i >= 0; i--) {
    const msg = globalMessages[i];
    const msgTime = msg.createdAt ? new Date(msg.createdAt) : (msg.time ? new Date(msg.time) : new Date());
    if (msgTime < thresholdTime) {
      globalMessages.splice(i, 1);
    }
  }
  const deletedCountMem = initialLength - globalMessages.length;
  if (deletedCountMem > 0) {
    console.log(`[AUTO-DELETE] Deleted ${deletedCountMem} expired messages from memory state.`);
  }

  if (dbIo && (deletedCountMem > 0 || deletedCountPg > 0)) {
    dbIo.emit("messages_purged", { 
      thresholdTime: thresholdTime.toISOString(),
      deletedCount: deletedCountMem + deletedCountPg
    });
  }
}

export async function deleteThreadMessages(threadId: string) {
  if (!threadId) return 0;
  let deletedCountPg = 0;

  // 1. Delete from PostgreSQL
  const p = getPgPool();
  const isConnected = getIsPgConnected();
  if (p && isConnected) {
    try {
      const res = await p.query("DELETE FROM messages WHERE thread_id = $1 OR trip_id = $1", [threadId]);
      deletedCountPg = res.rowCount || 0;
    } catch (err: any) {
      console.error("[DELETE THREAD PG ERROR]", err.message);
    }
  }

  // 2. Delete from Memory State
  const initialLength = globalMessages.length;
  for (let i = globalMessages.length - 1; i >= 0; i--) {
    const msg = globalMessages[i];
    if (msg.threadId === threadId || msg.tripId === threadId || msg.id === threadId) {
      globalMessages.splice(i, 1);
    }
  }
  const deletedCountMem = initialLength - globalMessages.length;

  if (dbIo) {
    dbIo.emit("thread_messages_deleted", { threadId, deletedCount: deletedCountMem + deletedCountPg });
  }

  return deletedCountMem + deletedCountPg;
}
