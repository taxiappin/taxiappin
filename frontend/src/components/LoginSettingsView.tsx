import React, { useState } from "react";
import {
  Save,
  Globe,
  Sliders,
  User,
  Car,
  FileText,
  Users,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  ImageIcon,
  ShieldAlert,
  ShieldCheck,
  Lock
} from "lucide-react";
import { BrandingTab } from "./login-settings/BrandingTab";
import { RiderFieldsTab } from "./login-settings/RiderFieldsTab";
import { DriverSectionTab } from "./login-settings/DriverSectionTab";
import { LocationDatabaseTab } from "./login-settings/LocationDatabaseTab";
import { LegalPolicyTab } from "./login-settings/LegalPolicyTab";
import { SubscribersTab } from "./login-settings/SubscribersTab";
import { SessionSecurityTab } from "./login-settings/SessionSecurityTab";
import { LiveFlowPreview } from "./login-settings/LiveFlowPreview";

import {
  CountryItem,
  StateItem,
  CityItem,
  RiderFieldItem,
  DriverStepItem,
  DriverFieldItem,
  VehicleBrandItem,
  SampleDocumentItem,
  SubscriberItem,
  LegalPolicySettings,
  SessionSecuritySettings
} from "./login-settings/types";

const INDIAN_STATES_AND_UTS = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana",
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

const DEFAULT_INITIAL_STATES: StateItem[] = [
  ...INDIAN_STATES_AND_UTS.map((st, idx) => ({
    id: `st_in_${idx + 1}`,
    name: st,
    countryName: "India",
    code: st.substring(0, 2).toUpperCase(),
    active: true
  })),
  { id: "st_us_1", name: "California", countryName: "United States", code: "CA", active: true },
  { id: "st_us_2", name: "New York", countryName: "United States", code: "NY", active: true },
  { id: "st_us_3", name: "Texas", countryName: "United States", code: "TX", active: true },
  { id: "st_us_4", name: "Florida", countryName: "United States", code: "FL", active: true },
  { id: "st_ca_1", name: "Ontario", countryName: "Canada", code: "ON", active: true },
  { id: "st_ca_2", name: "Quebec", countryName: "Canada", code: "QC", active: true },
  { id: "st_gb_1", name: "England", countryName: "United Kingdom", code: "ENG", active: true },
  { id: "st_gb_2", name: "Scotland", countryName: "United Kingdom", code: "SCO", active: true },
  { id: "st_ae_1", name: "Dubai", countryName: "United Arab Emirates", code: "DXB", active: true },
  { id: "st_ae_2", name: "Abu Dhabi", countryName: "United Arab Emirates", code: "AUH", active: true },
  { id: "st_sa_1", name: "Riyadh", countryName: "Saudi Arabia", code: "RUH", active: true },
  { id: "st_au_1", name: "New South Wales", countryName: "Australia", code: "NSW", active: true },
  { id: "st_de_1", name: "Bavaria", countryName: "Germany", code: "BY", active: true }
];

const DEFAULT_INITIAL_CITIES: CityItem[] = [
  { id: "cty_1", name: "Pune", stateName: "Maharashtra", countryName: "India", tier: "Tier 1", localAreas: ["Baner", "Hinjawadi", "Kothrud", "Viman Nagar", "Wakad", "Hadapsar", "Aundh"], active: true },
  { id: "cty_2", name: "Mumbai", stateName: "Maharashtra", countryName: "India", tier: "Tier 1", localAreas: ["Andheri", "Bandra", "Powai", "Thane", "Navi Mumbai", "Borivali", "Dadar"], active: true },
  { id: "cty_3", name: "Delhi NCR", stateName: "Delhi", countryName: "India", tier: "Tier 1", localAreas: ["Connaught Place", "Gurgaon Sec 29", "Noida Sec 18", "Dwarka", "Rohini"], active: true },
  { id: "cty_4", name: "Bengaluru", stateName: "Karnataka", countryName: "India", tier: "Tier 1", localAreas: ["Indiranagar", "Koramangala", "Whitefield", "HSR Layout", "Electronic City"], active: true },
  { id: "cty_5", name: "Hyderabad", stateName: "Telangana", countryName: "India", tier: "Tier 1", localAreas: ["Gachibowli", "HITECH City", "Banjara Hills", "Jubilee Hills", "Madhapur"], active: true },
  { id: "cty_6", name: "Chennai", stateName: "Tamil Nadu", countryName: "India", tier: "Tier 1", localAreas: ["T. Nagar", "Velachery", "Anna Nagar", "Adyar", "OMR"], active: true },
  { id: "cty_7", name: "Kolkata", stateName: "West Bengal", countryName: "India", tier: "Tier 1", localAreas: ["Salt Lake", "Park Street", "New Town", "Howrah"], active: true },
  { id: "cty_8", name: "Ahmedabad", stateName: "Gujarat", countryName: "India", tier: "Tier 2", localAreas: ["SG Highway", "Satellite", "Bodakdev", "Vastrapur"], active: true },
  { id: "cty_9", name: "Surat", stateName: "Gujarat", countryName: "India", tier: "Tier 2", localAreas: ["Vesu", "Adajan", "Varachha"], active: true },
  { id: "cty_10", name: "Jaipur", stateName: "Rajasthan", countryName: "India", tier: "Tier 2", localAreas: ["Malviya Nagar", "Vaishali Nagar", "C-Scheme"], active: true },
  { id: "cty_11", name: "Los Angeles", stateName: "California", countryName: "United States", tier: "Tier 1", localAreas: ["Hollywood", "Downtown LA", "Santa Monica", "Beverly Hills"], active: true },
  { id: "cty_12", name: "San Francisco", stateName: "California", countryName: "United States", tier: "Tier 1", localAreas: ["SOMA", "Financial District", "Mission District"], active: true },
  { id: "cty_13", name: "New York City", stateName: "New York", countryName: "United States", tier: "Tier 1", localAreas: ["Manhattan", "Brooklyn", "Queens"], active: true },
  { id: "cty_14", name: "London", stateName: "England", countryName: "United Kingdom", tier: "Tier 1", localAreas: ["Westminster", "Camden", "Canary Wharf"], active: true },
  { id: "cty_15", name: "Dubai", stateName: "Dubai", countryName: "United Arab Emirates", tier: "Tier 1", localAreas: ["Downtown Dubai", "Dubai Marina", "Business Bay", "JBR"], active: true },
  { id: "cty_16", name: "Toronto", stateName: "Ontario", countryName: "Canada", tier: "Tier 1", localAreas: ["Downtown Toronto", "Yorkville", "North York"], active: true }
];

interface LoginSettingsViewProps {
  config: any;
  updateConfig: (newConfig: any) => void;
  setToast: (toast: { show: boolean; message: string; type: "success" | "error" | "info" }) => void;
}

export const LoginSettingsView: React.FC<LoginSettingsViewProps> = ({
  config,
  updateConfig,
  setToast
}) => {
  const [activeTab, setActiveTab] = useState<"branding" | "rider" | "driver" | "country" | "legal" | "subscribers" | "security">("branding");

  // Live Canvas Preview Controls
  const [previewFlow, setPreviewFlow] = useState<"login" | "rider" | "driver" | "reset">("login");
  const [previewRiderStep, setPreviewRiderStep] = useState<number>(1);
  const [previewDriverStep, setPreviewDriverStep] = useState<number>(1);

  // Session & Anti-Fraud Security Settings
  const [sessionSettings, setSessionSettings] = useState<SessionSecuritySettings>(
    config.sessionSettings || config.loginSettings?.sessionSettings || {
      sessionTimeoutMinutes: config.loginSettings?.sessionTimeoutMinutes ?? 1440,
      inactivityTimeoutMinutes: config.loginSettings?.inactivityTimeoutMinutes ?? 0,
      enableFraudPrevention: config.loginSettings?.enableFraudPrevention ?? true,
      allowStayLoggedIn: config.loginSettings?.allowStayLoggedIn ?? true,
      maxActiveSessionsPerUser: config.loginSettings?.maxActiveSessionsPerUser ?? 1,
      logoutMessage: config.loginSettings?.logoutMessage || "Your session has ended for security and anti-fraud protection. Please log in again."
    }
  );

  // Branding State
  const [promoTickerText, setPromoTickerText] = useState(config.branding?.promoTickerText || "Use promo code WELCOME50 to get flat ₹50 off on your very first ride booking! Travel safe with our premium certified hatchback and sedan partners.");
  const [logoText, setLogoText] = useState(config.branding?.logoText || config.branding?.textLogo || "TaxiApp");
  const [riderTextLogo, setRiderTextLogo] = useState(config.branding?.riderTextLogo || config.branding?.textLogo || "TaxiApp");
  const [riderTagline, setRiderTagline] = useState(config.branding?.riderTagline || "Rider");
  const [driverTextLogo, setDriverTextLogo] = useState(config.branding?.driverTextLogo || config.branding?.textLogo || "TaxiApp");
  const [driverTagline, setDriverTagline] = useState(config.branding?.driverTagline || "Driver");
  const [logoUrl, setLogoUrl] = useState(config.branding?.logoUrl || "");
  const [darkLogoUrl, setDarkLogoUrl] = useState(config.branding?.darkLogoUrl || "");
  const [riderLogoUrl, setRiderLogoUrl] = useState(config.branding?.riderLogoUrl || "");
  const [riderDarkLogoUrl, setRiderDarkLogoUrl] = useState(config.branding?.riderDarkLogoUrl || "");
  const [driverLogoUrl, setDriverLogoUrl] = useState(config.branding?.driverLogoUrl || "");
  const [driverDarkLogoUrl, setDriverDarkLogoUrl] = useState(config.branding?.driverDarkLogoUrl || "");
  const [loginTitle, setLoginTitle] = useState(config.branding?.title || "Login");
  const [loginSubtext, setLoginSubtext] = useState(config.branding?.subtext || "Book rides, plan trips, or drive — all in one account");
  const [bookRightsText, setBookRightsText] = useState(config.branding?.bookRightsText || "© 2026 TaxiApp Inc. All rights reserved. Book rights reserved.");

  // Quick Demo Fill Accounts
  const [quickDemoEnabled, setQuickDemoEnabled] = useState(config.branding?.quickDemoEnabled ?? true);
  const [quickDemoRiderEmail, setQuickDemoRiderEmail] = useState(config.branding?.quickDemoRiderEmail || "rider@taxiapp.com");
  const [quickDemoRiderPhone, setQuickDemoRiderPhone] = useState(config.branding?.quickDemoRiderPhone || "9876543210");
  const [quickDemoRiderPassword, setQuickDemoRiderPassword] = useState(config.branding?.quickDemoRiderPassword || "Rider123!");
  const [quickDemoDriverEmail, setQuickDemoDriverEmail] = useState(config.branding?.quickDemoDriverEmail || "driver@taxiapp.com");
  const [quickDemoDriverPhone, setQuickDemoDriverPhone] = useState(config.branding?.quickDemoDriverPhone || "9876543211");
  const [quickDemoDriverPassword, setQuickDemoDriverPassword] = useState(config.branding?.quickDemoDriverPassword || "Driver123!");

  // OTP Verification Engine Mode
  const [otpMode, setOtpMode] = useState<"simulated" | "sms">(
    config.loginSettings?.otpMode === "sms" ? "sms" : "simulated"
  );

  // Rider Registration Fields
  const [riderFields, setRiderFields] = useState<Record<string, RiderFieldItem>>(
    config.riderFields || {
      fullName: { key: "fullName", enabled: true, mandatory: true, label: "Full Name", helper: "Enter legal first & last name", type: "text", stepId: 2 },
      operatingCity: { key: "operatingCity", enabled: true, mandatory: true, label: "Operating City", helper: "Select home operating city", type: "text", stepId: 2 },
      dob: { key: "dob", enabled: true, mandatory: true, label: "Date of Birth", helper: "Must be 18+ years of age", type: "date", stepId: 2 },
      gender: { key: "gender", enabled: true, mandatory: false, label: "Gender", helper: "Male / Female / Other", type: "text", stepId: 2 },
      emergencyContact: { key: "emergencyContact", enabled: true, mandatory: false, label: "Emergency Contact", helper: "Mobile number for SOS alerts", type: "tel", stepId: 2 },
      referralCode: { key: "referralCode", enabled: true, mandatory: false, label: "Referral Promo Code", helper: "Optional invite promo code", type: "text", stepId: 2 }
    }
  );

  // Driver Registration Steps & Fields
  const [driverSteps, setDriverSteps] = useState<Record<string, DriverStepItem>>(
    config.driverSteps || {
      step1: { id: 1, key: "step1", enabled: true, label: "Mobile & Email Setup", description: "Verify phone number & create password" },
      step2: { id: 2, key: "step2", enabled: true, label: "Personal Information", description: "Full name, DOB, address & emergency contact" },
      step3: { id: 3, key: "step3", enabled: true, label: "Vehicle Category & Model", description: "Select class (Sedan/SUV), brand & plate number" },
      step4: { id: 4, key: "step4", enabled: true, label: "Driving License Photo", description: "Upload front & back driving license copy" },
      step5: { id: 5, key: "step5", enabled: true, label: "Vehicle RC Document", description: "Upload official registration certificate" },
      step6: { id: 6, key: "step6", enabled: true, label: "Vehicle Insurance Copy", description: "Upload valid vehicle commercial insurance policy" },
      step7: { id: 7, key: "step7", enabled: true, label: "Aadhaar / National ID Verification", description: "Government identity verification & biometric photo" }
    }
  );

  const [driverFields, setDriverFields] = useState<Record<string, DriverFieldItem>>(
    config.driverFields || {
      fullName: { key: "fullName", enabled: true, mandatory: true, label: "Driver Full Name", stepId: 2, helper: "As listed on driving license", type: "text" },
      country: { key: "country", enabled: true, mandatory: true, label: "Operating Country", stepId: 2, helper: "Select operating country", type: "select" },
      state: { key: "state", enabled: true, mandatory: true, label: "Operating State", stepId: 2, helper: "Select operating state/province", type: "select" },
      city: { key: "city", enabled: true, mandatory: true, label: "Operating City", stepId: 2, helper: "Select primary operating city", type: "select" },
      dob: { key: "dob", enabled: true, mandatory: true, label: "Date of Birth", stepId: 2, helper: "Must be at least 21 years old", type: "date" },
      vehicleClass: { key: "vehicleClass", enabled: true, mandatory: true, label: "Vehicle Category", stepId: 3, helper: "Sedan, SUV, Hatchback, Auto, Bike", type: "text" },
      vehiclePlate: { key: "vehiclePlate", enabled: true, mandatory: true, label: "Vehicle Registration Plate", stepId: 3, helper: "Commercial registration number", type: "text" },
      licenseFront: { key: "licenseFront", enabled: true, mandatory: true, label: "Driving License Copy", stepId: 4, helper: "Clear photo of original DL", type: "file" },
      rcFront: { key: "rcFront", enabled: true, mandatory: true, label: "Vehicle RC Certificate", stepId: 5, helper: "Valid RC document copy", type: "file" },
      insuranceCopy: { key: "insuranceCopy", enabled: true, mandatory: true, label: "Insurance Policy Copy", stepId: 6, helper: "Active insurance certificate", type: "file" },
      nationalIdCopy: { key: "nationalIdCopy", enabled: true, mandatory: true, label: "National ID / Aadhaar", stepId: 7, helper: "Front & back government ID", type: "file" }
    }
  );

  // Vehicle Brands Catalog
  const [vehicleBrands, setVehicleBrands] = useState<VehicleBrandItem[]>(
    config.vehicleBrands || [
      { id: "b1", brandName: "Maruti Suzuki", category: "Sedan", models: ["Dzire", "Ciaz", "Tour S", "Swift"], enabled: true },
      { id: "b2", brandName: "Hyundai", category: "Hatchback", models: ["i20", "Grand i10", "Aura", "Exter"], enabled: true },
      { id: "b3", brandName: "Toyota", category: "SUV", models: ["Innova Crysta", "Innova Hycross", "Fortuner", "Glanza"], enabled: true },
      { id: "b4", brandName: "Tata Motors", category: "Sedan", models: ["Tigor EV", "Nexon EV", "Punch", "Harrier"], enabled: true },
      { id: "b5", brandName: "Mahindra", category: "SUV", models: ["XUV700", "Scorpio Classic", "Bolero Neo"], enabled: true }
    ]
  );

  // Sample Documents Admin
  const [sampleDocuments, setSampleDocuments] = useState<SampleDocumentItem[]>(
    config.sampleDocuments || [
      {
        id: "s1",
        docType: "driving_license",
        title: "Sample Driving License",
        sampleUrl: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80",
        frontSampleUrl: "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=600&q=80",
        backSampleUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
        instructions: "Ensure front and back driving license text and QR code are clearly legible without glare.",
        required: true
      },
      {
        id: "s2",
        docType: "vehicle_rc",
        title: "Sample Vehicle Registration (RC)",
        sampleUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
        frontSampleUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
        backSampleUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
        instructions: "Original commercial registration certificate image (front vehicle details & back owner info).",
        required: true
      },
      {
        id: "s3",
        docType: "vehicle_insurance",
        title: "Sample Insurance Policy",
        sampleUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
        frontSampleUrl: "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=600&q=80",
        backSampleUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
        instructions: "Policy number, insured name, and expiry date must be clearly legible on policy schedule.",
        required: true
      },
      {
        id: "s4",
        docType: "national_id",
        title: "Sample National ID / Aadhaar",
        sampleUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
        frontSampleUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80",
        backSampleUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80",
        instructions: "Government photo ID card with front photo/UID and back address details.",
        required: true
      }
    ]
  );

  // World Country Master (12 Default Countries)
  const [countries, setCountries] = useState<CountryItem[]>(
    config.countries || [
      { id: "c_in", name: "India", code: "+91", isoCode: "IN", flag: "🇮🇳", maxDigits: 10, example: "9876543210", active: true },
      { id: "c_us", name: "United States", code: "+1", isoCode: "US", flag: "🇺🇸", maxDigits: 10, example: "2025550143", active: true },
      { id: "c_ca", name: "Canada", code: "+1", isoCode: "CA", flag: "🇨🇦", maxDigits: 10, example: "4165550198", active: true },
      { id: "c_gb", name: "United Kingdom", code: "+44", isoCode: "GB", flag: "🇬🇧", maxDigits: 10, example: "7911123456", active: true },
      { id: "c_ae", name: "United Arab Emirates", code: "+971", isoCode: "AE", flag: "🇦🇪", maxDigits: 9, example: "501234567", active: true },
      { id: "c_sa", name: "Saudi Arabia", code: "+966", isoCode: "SA", flag: "🇸🇦", maxDigits: 9, example: "501234567", active: true },
      { id: "c_au", name: "Australia", code: "+61", isoCode: "AU", flag: "🇦🇺", maxDigits: 9, example: "412345678", active: true },
      { id: "c_de", name: "Germany", code: "+49", isoCode: "DE", flag: "🇩🇪", maxDigits: 11, example: "15123456789", active: true },
      { id: "c_fr", name: "France", code: "+33", isoCode: "FR", flag: "🇫🇷", maxDigits: 9, example: "612345678", active: true },
      { id: "c_sg", name: "Singapore", code: "+65", isoCode: "SG", flag: "🇸🇬", maxDigits: 8, example: "81234567", active: true },
      { id: "c_my", name: "Malaysia", code: "+60", isoCode: "MY", flag: "🇲🇾", maxDigits: 10, example: "123456789", active: true },
      { id: "c_qa", name: "Qatar", code: "+974", isoCode: "QA", flag: "🇶🇦", maxDigits: 8, example: "33123456", active: true }
    ]
  );

  // World States & Provinces Master Database
  const [states, setStates] = useState<StateItem[]>(
    config.states || DEFAULT_INITIAL_STATES
  );

  // Operating Cities & Local Areas Master Database
  const [cities, setCities] = useState<CityItem[]>(
    config.cities || DEFAULT_INITIAL_CITIES
  );

  // Legal Policies Settings
  const [policySettings, setPolicySettings] = useState<LegalPolicySettings>(
    config.policySettings || {
      rulesUrl: "/rules-regulations",
      rulesTitle: "Rules & Regulations Policy",
      termsUrl: "/terms-and-conditions",
      termsTitle: "Terms & Conditions",
      privacyUrl: "/privacy-policy",
      privacyTitle: "Privacy Policy",
      minAgeRequired: 18
    }
  );

  // Subscribers
  const [subscribers, setSubscribers] = useState<SubscriberItem[]>(
    config.subscribers || [
      { id: "sub_1", name: "Rahul Sharma", email: "rahul.sharma@gmail.com", phone: "+919876543210", role: "rider", promoSubscribed: true, subscribedAt: "2026-08-01" },
      { id: "sub_2", name: "Priya Patel", email: "priya.patel@yahoo.com", phone: "+919812345678", role: "rider", promoSubscribed: true, subscribedAt: "2026-08-03" },
      { id: "sub_3", name: "Vikram Singh", email: "vikram.driver@gmail.com", phone: "+919765432109", role: "driver", promoSubscribed: true, subscribedAt: "2026-08-05" },
      { id: "sub_4", name: "Michael Scott", email: "m.scott@dundermifflin.com", phone: "+12025550143", role: "rider", promoSubscribed: true, subscribedAt: "2026-08-06" }
    ]
  );

  // Logo File Upload Handlers
  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setLogoUrl(url);
        setToast({ show: true, message: "Main Logo image uploaded successfully!", type: "success" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDarkLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setDarkLogoUrl(url);
        setToast({ show: true, message: "Dark Mode Logo uploaded successfully!", type: "success" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRiderLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setRiderLogoUrl(url);
        setToast({ show: true, message: "Rider Mode Logo uploaded successfully!", type: "success" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRiderDarkLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setRiderDarkLogoUrl(url);
        setToast({ show: true, message: "Rider Dark Mode Logo uploaded successfully!", type: "success" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDriverLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setDriverLogoUrl(url);
        setToast({ show: true, message: "Driver Mode Logo uploaded successfully!", type: "success" });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDriverDarkLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setDriverDarkLogoUrl(url);
        setToast({ show: true, message: "Driver Dark Mode Logo uploaded successfully!", type: "success" });
      };
      reader.readAsDataURL(file);
    }
  };

  // Global Save Master Settings
  const handleSaveAllSettings = () => {
    const newConfig = {
      ...config,
      branding: {
        ...(config.branding || {}),
        promoTickerText,
        logoText,
        textLogo: logoText,
        logoUrl,
        darkLogoUrl,
        riderLogoUrl,
        riderDarkLogoUrl,
        driverLogoUrl,
        driverDarkLogoUrl,
        riderTextLogo,
        riderTagline,
        driverTextLogo,
        driverTagline,
        title: loginTitle,
        subtext: loginSubtext,
        bookRightsText,
        quickDemoEnabled,
        quickDemoRiderEmail,
        quickDemoRiderPhone,
        quickDemoRiderPassword,
        quickDemoDriverEmail,
        quickDemoDriverPhone,
        quickDemoDriverPassword
      },
      loginSettings: {
        ...(config.loginSettings || {}),
        otpMode,
        sessionTimeoutMinutes: sessionSettings.sessionTimeoutMinutes,
        inactivityTimeoutMinutes: sessionSettings.inactivityTimeoutMinutes,
        allowStayLoggedIn: sessionSettings.allowStayLoggedIn,
        enableFraudPrevention: sessionSettings.enableFraudPrevention,
        maxActiveSessionsPerUser: sessionSettings.maxActiveSessionsPerUser,
        logoutMessage: sessionSettings.logoutMessage,
        sessionSettings
      },
      sessionSettings,
      riderFields,
      driverSteps,
      driverFields,
      vehicleBrands,
      sampleDocuments,
      countries,
      states,
      cities,
      policySettings,
      subscribers
    };

    updateConfig(newConfig);
    setToast({ show: true, message: "Login, Session & Security settings saved successfully!", type: "success" });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Sliders className="text-slate-800" size={24} />
            <span>Login & Sign-Up Settings</span>
          </h2>
        </div>

        <button
          type="button"
          onClick={handleSaveAllSettings}
          className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-500/50 shrink-0 active:scale-95"
        >
          <Save size={16} />
          <span>Save Settings</span>
        </button>
      </div>

      {/* TOP NAVIGATION TABS BAR - Standardized White Background with Yellow Highlight */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveTab("branding")}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "branding"
              ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <ImageIcon size={16} className={activeTab === "branding" ? "text-slate-950" : "text-amber-500"} />
          <span>Logo & Identity</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("rider")}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "rider"
              ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <User size={16} className={activeTab === "rider" ? "text-slate-950" : "text-amber-500"} />
          <span>Rider Registry (3 Steps)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("driver")}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "driver"
              ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Car size={16} className={activeTab === "driver" ? "text-slate-950" : "text-amber-500"} />
          <span>Driver Registration & Catalog</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("country")}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "country"
              ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Globe size={16} className={activeTab === "country" ? "text-slate-950" : "text-amber-500"} />
          <span>Country, State & City Database</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("legal")}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "legal"
              ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <FileText size={16} className={activeTab === "legal" ? "text-slate-950" : "text-amber-500"} />
          <span>Rules & Regulate Links</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("subscribers")}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "subscribers"
              ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Users size={16} className={activeTab === "subscribers" ? "text-slate-950" : "text-amber-500"} />
          <span>Subscribers ({subscribers.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("security")}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === "security"
              ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <ShieldAlert size={16} className={activeTab === "security" ? "text-slate-950" : "text-amber-500"} />
          <span>Session & Fraud Security</span>
        </button>
      </div>

      {/* TWO-COLUMN GRID: MAIN CONTENT (LEFT) & REAL-TIME PREVIEW (RIGHT) */}
      {(() => {
        const showPreview = activeTab === "branding" || activeTab === "rider" || activeTab === "driver";
        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT COLUMN: EDITING FORM TAB CONTENT */}
            <div className={showPreview ? "lg:col-span-7 space-y-6" : "lg:col-span-12 space-y-6"}>
              {activeTab === "branding" && (
                <BrandingTab
                  otpMode={otpMode}
                  setOtpMode={setOtpMode}
                  promoTickerText={promoTickerText}
                  setPromoTickerText={setPromoTickerText}
                  logoText={logoText}
                  setLogoText={setLogoText}
                  logoUrl={logoUrl}
                  setLogoUrl={setLogoUrl}
                  darkLogoUrl={darkLogoUrl}
                  setDarkLogoUrl={setDarkLogoUrl}
                  riderLogoUrl={riderLogoUrl}
                  setRiderLogoUrl={setRiderLogoUrl}
                  riderDarkLogoUrl={riderDarkLogoUrl}
                  setRiderDarkLogoUrl={setRiderDarkLogoUrl}
                  driverLogoUrl={driverLogoUrl}
                  setDriverLogoUrl={setDriverLogoUrl}
                  driverDarkLogoUrl={driverDarkLogoUrl}
                  setDriverDarkLogoUrl={setDriverDarkLogoUrl}
                  riderTextLogo={riderTextLogo}
                  setRiderTextLogo={setRiderTextLogo}
                  riderTagline={riderTagline}
                  setRiderTagline={setRiderTagline}
                  driverTextLogo={driverTextLogo}
                  setDriverTextLogo={setDriverTextLogo}
                  driverTagline={driverTagline}
                  setDriverTagline={setDriverTagline}
                  loginTitle={loginTitle}
                  setLoginTitle={setLoginTitle}
                  loginSubtext={loginSubtext}
                  setLoginSubtext={setLoginSubtext}
                  bookRightsText={bookRightsText}
                  setBookRightsText={setBookRightsText}
                  quickDemoEnabled={quickDemoEnabled}
                  setQuickDemoEnabled={setQuickDemoEnabled}
                  quickDemoRiderEmail={quickDemoRiderEmail}
                  setQuickDemoRiderEmail={setQuickDemoRiderEmail}
                  quickDemoRiderPhone={quickDemoRiderPhone}
                  setQuickDemoRiderPhone={setQuickDemoRiderPhone}
                  quickDemoRiderPassword={quickDemoRiderPassword}
                  setQuickDemoRiderPassword={setQuickDemoRiderPassword}
                  quickDemoDriverEmail={quickDemoDriverEmail}
                  setQuickDemoDriverEmail={setQuickDemoDriverEmail}
                  quickDemoDriverPhone={quickDemoDriverPhone}
                  setQuickDemoDriverPhone={setQuickDemoDriverPhone}
                  quickDemoDriverPassword={quickDemoDriverPassword}
                  setQuickDemoDriverPassword={setQuickDemoDriverPassword}
                  handleLogoFileUpload={handleLogoFileUpload}
                  handleDarkLogoFileUpload={handleDarkLogoFileUpload}
                  handleRiderLogoFileUpload={handleRiderLogoFileUpload}
                  handleRiderDarkLogoFileUpload={handleRiderDarkLogoFileUpload}
                  handleDriverLogoFileUpload={handleDriverLogoFileUpload}
                  handleDriverDarkLogoFileUpload={handleDriverDarkLogoFileUpload}
                />
              )}

              {activeTab === "rider" && (
                <RiderFieldsTab
                  riderFields={riderFields}
                  setRiderFields={setRiderFields}
                  setPreviewFlow={setPreviewFlow}
                  setPreviewRiderStep={setPreviewRiderStep}
                  setToast={setToast}
                />
              )}

              {activeTab === "driver" && (
                <DriverSectionTab
                  driverSteps={driverSteps}
                  setDriverSteps={setDriverSteps}
                  driverFields={driverFields}
                  setDriverFields={setDriverFields}
                  vehicleBrands={vehicleBrands}
                  setVehicleBrands={setVehicleBrands}
                  sampleDocuments={sampleDocuments}
                  setSampleDocuments={setSampleDocuments}
                  setPreviewFlow={setPreviewFlow}
                  setPreviewDriverStep={setPreviewDriverStep}
                  setToast={setToast}
                />
              )}

              {activeTab === "country" && (
                <LocationDatabaseTab
                  countries={countries}
                  setCountries={setCountries}
                  states={states}
                  setStates={setStates}
                  cities={cities}
                  setCities={setCities}
                  setToast={setToast}
                />
              )}

              {activeTab === "legal" && (
                <LegalPolicyTab
                  policySettings={policySettings}
                  setPolicySettings={setPolicySettings}
                  setToast={setToast}
                />
              )}

              {activeTab === "subscribers" && (
                <SubscribersTab
                  subscribers={subscribers}
                  setSubscribers={setSubscribers}
                  setToast={setToast}
                />
              )}

              {activeTab === "security" && (
                <SessionSecurityTab
                  sessionSettings={sessionSettings}
                  setSessionSettings={setSessionSettings}
                  setToast={setToast}
                />
              )}
            </div>

            {/* RIGHT COLUMN: REAL-TIME LIVE CANVAS PREVIEW */}
            {showPreview && (
              <div className="lg:col-span-5">
                <LiveFlowPreview
                  previewFlow={previewFlow}
                  setPreviewFlow={setPreviewFlow}
                  previewRiderStep={previewRiderStep}
                  setPreviewRiderStep={setPreviewRiderStep}
                  previewDriverStep={previewDriverStep}
                  setPreviewDriverStep={setPreviewDriverStep}
                  promoTickerText={promoTickerText}
                  logoText={logoText}
                  logoUrl={logoUrl}
                  loginTitle={loginTitle}
                  loginSubtext={loginSubtext}
                  bookRightsText={bookRightsText}
                  quickDemoEnabled={quickDemoEnabled}
                  quickDemoRiderEmail={quickDemoRiderEmail}
                  quickDemoRiderPhone={quickDemoRiderPhone}
                  quickDemoDriverEmail={quickDemoDriverEmail}
                  quickDemoDriverPhone={quickDemoDriverPhone}
                  countries={countries}
                  riderFields={riderFields}
                  driverSteps={driverSteps}
                  driverFields={driverFields}
                  vehicleBrands={vehicleBrands}
                  sampleDocuments={sampleDocuments}
                  policySettings={policySettings}
                  onSelectSection={(targetTab, step) => {
                    setActiveTab(targetTab);
                    if (targetTab === "rider" && step) setPreviewRiderStep(step);
                    if (targetTab === "driver" && step) setPreviewDriverStep(step);
                  }}
                />
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
};
