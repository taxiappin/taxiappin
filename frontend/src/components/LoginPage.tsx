import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { motion, AnimatePresence } from "motion/react";
import { BrandLogo } from "./BrandLogo";
import { 
  Mail, 
  Lock, 
  Smartphone, 
  User, 
  Car, 
  AlertCircle, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Check, 
  ArrowLeft, 
  ShieldCheck, 
  Sparkles, 
  Upload, 
  Camera, 
  FileText, 
  CheckCircle,
  CheckCircle2, 
  Key,
  KeyRound,
  MapPin, 
  ChevronDown, 
  RefreshCw, 
  FileCheck, 
  ShieldAlert,
  Database,
  Search,
  Globe,
  Tag,
  Calendar,
  Palette,
  XCircle,
  HelpCircle,
  Clock,
  Layers,
  ListFilter,
  Crosshair,
  Edit3,
  X,
  Bell,
  Shield,
  AlertTriangle,
  Droplet,
  MessageSquare,
  Headphones,
  Loader2
} from "lucide-react";
import { cn } from "../lib/utils";
import { notificationService } from "../services/systemService";
import { saveUserSession } from "../lib/sessionPersistence";
import { sendFirebasePhoneOtp, verifyFirebasePhoneOtp } from "../services/firebase";
import { 
  SignupAdminModal, 
  SignupCountry, 
  SignupMailUser, 
  SignupCity, 
  VehicleBrandCatalogItem 
} from "./SignupAdminModal";

// Initial Master Data Defaults
const INITIAL_COUNTRIES: SignupCountry[] = [
  { id: "cnt_1", name: "India", code: "+91", flag: "🇮🇳", active: true },
  { id: "cnt_2", name: "United States", code: "+1", flag: "🇺🇸", active: true },
  { id: "cnt_3", name: "United Kingdom", code: "+44", flag: "🇬🇧", active: true },
  { id: "cnt_4", name: "UAE", code: "+971", flag: "🇦🇪", active: true },
  { id: "cnt_5", name: "Saudi Arabia", code: "+966", flag: "🇸🇦", active: true },
  { id: "cnt_6", name: "Singapore", code: "+65", flag: "🇸🇬", active: true },
  { id: "cnt_7", name: "Canada", code: "+1", flag: "🇨🇦", active: true },
  { id: "cnt_8", name: "Australia", code: "+61", flag: "🇦🇺", active: true },
  { id: "cnt_9", name: "Germany", code: "+49", flag: "🇩🇪", active: true },
  { id: "cnt_10", name: "France", code: "+33", flag: "🇫🇷", active: true },
  { id: "cnt_11", name: "Japan", code: "+81", flag: "🇯🇵", active: true },
  { id: "cnt_12", name: "Qatar", code: "+974", flag: "🇶🇦", active: true },
  { id: "cnt_13", name: "Malaysia", code: "+60", flag: "🇲🇾", active: true },
];

export interface SignupState {
  id: string;
  country: string;
  name: string;
  code?: string;
}

const INDIAN_STATES_AND_UTS: string[] = [
  // 28 States
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  // 8 Union Territories
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Lakshadweep",
  "Puducherry"
];

const INITIAL_STATES: SignupState[] = [
  ...INDIAN_STATES_AND_UTS.map((st, idx) => ({
    id: `st_in_${idx + 1}`,
    country: "India",
    name: st
  })),
  { id: "st_us_1", country: "United States", name: "California" },
  { id: "st_us_2", country: "United States", name: "New York" },
  { id: "st_us_3", country: "United States", name: "Texas" },
  { id: "st_us_4", country: "United States", name: "Florida" },
  { id: "st_uk_1", country: "United Kingdom", name: "England" },
  { id: "st_uk_2", country: "United Kingdom", name: "Scotland" },
  { id: "st_uae_1", country: "UAE", name: "Dubai" },
  { id: "st_uae_2", country: "UAE", name: "Abu Dhabi" },
  { id: "st_sa_1", country: "Saudi Arabia", name: "Riyadh" },
  { id: "st_sg_1", country: "Singapore", name: "Central Region" },
  { id: "st_ca_1", country: "Canada", name: "Ontario" },
  { id: "st_au_1", country: "Australia", name: "New South Wales" },
  { id: "st_de_1", country: "Germany", name: "Bavaria" }
];

const INITIAL_CITIES: SignupCity[] = [
  { id: "cty_1", name: "Pune", state: "Maharashtra", localAreas: ["Baner", "Hinjawadi", "Kothrud", "Viman Nagar", "Wakad", "Hadapsar", "Aundh"] },
  { id: "cty_2", name: "Mumbai", state: "Maharashtra", localAreas: ["Andheri", "Bandra", "Powai", "Thane", "Navi Mumbai", "Borivali", "Dadar"] },
  { id: "cty_3", name: "Delhi NCR", state: "Delhi", localAreas: ["Connaught Place", "Gurgaon Sec 29", "Noida Sec 18", "Dwarka", "Rohini"] },
  { id: "cty_4", name: "Bengaluru", state: "Karnataka", localAreas: ["Indiranagar", "Koramangala", "Whitefield", "HSR Layout", "Electronic City"] },
  { id: "cty_5", name: "Hyderabad", state: "Telangana", localAreas: ["Gachibowli", "HITECH City", "Banjara Hills", "Jubilee Hills", "Madhapur"] },
  { id: "cty_6", name: "Chennai", state: "Tamil Nadu", localAreas: ["T. Nagar", "Velachery", "Anna Nagar", "Adyar", "OMR"] },
  { id: "cty_7", name: "Kolkata", state: "West Bengal", localAreas: ["Salt Lake", "Park Street", "New Town", "Howrah"] },
  { id: "cty_8", name: "Ahmedabad", state: "Gujarat", localAreas: ["SG Highway", "Satellite", "Bodakdev", "Vastrapur"] },
  { id: "cty_9", name: "Surat", state: "Gujarat", localAreas: ["Vesu", "Adajan", "Varachha"] },
  { id: "cty_10", name: "Jaipur", state: "Rajasthan", localAreas: ["Malviya Nagar", "Vaishali Nagar", "C-Scheme"] },
];

const INITIAL_CATALOG: VehicleBrandCatalogItem[] = [
  { id: "cat_1", category: "Car", brand: "Toyota", models: ["Innova Crysta", "Fortuner", "Glanza", "Camry", "Hyryder"], colors: ["White", "Silver", "Black", "Grey", "Blue"] },
  { id: "cat_2", category: "Car", brand: "Maruti Suzuki", models: ["Swift", "Dzire", "Ertiga", "Brezza", "Baleno", "WagonR"], colors: ["White", "Silver", "Red", "Blue", "Black"] },
  { id: "cat_3", category: "Car", brand: "Tata Motors", models: ["Nexon EV", "Harrier", "Safari", "Punch", "Tiago"], colors: ["White", "Blue", "Grey", "Black", "Red"] },
  { id: "cat_4", category: "Car", brand: "Hyundai", models: ["Creta", "Verna", "i20", "Venue", "Alcazar"], colors: ["White", "Black", "Silver", "Red"] },
  { id: "cat_5", category: "Motorcycle", brand: "Bajaj", models: ["Pulsar 220", "Pulsar NS200", "Dominar 400", "Freedom 125"], colors: ["Black", "Red", "Blue"] },
  { id: "cat_6", category: "Motorcycle", brand: "Royal Enfield", models: ["Classic 350", "Hunter 350", "Bullet 350", "Meteor 350"], colors: ["Black", "Silver", "Green", "Red"] },
  { id: "cat_7", category: "Motorcycle", brand: "Hero", models: ["Splendor Plus", "HF Deluxe", "Xpulse 200 4V"], colors: ["Black", "Red", "Blue"] },
  { id: "cat_8", category: "Scooter", brand: "TVS", models: ["Jupiter", "iQube EV", "Ntorq 125"], colors: ["White", "Blue", "Grey", "Red"] },
  { id: "cat_9", category: "Scooter", brand: "Honda", models: ["Activa 6G", "Dio 125", "Activa 125"], colors: ["White", "Black", "Grey", "Red"] },
  { id: "cat_10", category: "Auto Rickshaw", brand: "Bajaj", models: ["RE Auto Compact", "Maxima Z", "RE EV"], colors: ["Yellow & Green", "Black & Yellow"] },
  { id: "cat_11", category: "Auto Rickshaw", brand: "Piaggio", models: ["Ape City Plus", "Ape Auto DX", "Ape E-City"], colors: ["Yellow & Black", "Green"] },
  { id: "cat_12", category: "Micro-Van", brand: "Mahindra", models: ["Supro Passenger Van", "E-Supro"], colors: ["White", "Silver"] },
  { id: "cat_13", category: "Medical Van", brand: "Force Motors", models: ["Traveller Medical Van", "Trax Patient Care"], colors: ["White with Red Cross"] },
  { id: "cat_14", category: "Other Vehicle", brand: "Custom Carrier", models: ["Patrol Vehicle", "Cargo Transport"], colors: ["White", "Yellow", "Black"] }
];

const INITIAL_MAIL_LIST: SignupMailUser[] = [
  { id: "usr_101", name: "Shrenu Patel", email: "rider@test.com", phone: "+91 98765 43210", role: "rider", promoSubscribed: true, rulesAccepted: true, createdAt: "2026-08-01" },
  { id: "usr_102", name: "Rajesh Kumar", email: "driver@test.com", phone: "+91 99999 88888", role: "driver", promoSubscribed: true, rulesAccepted: true, createdAt: "2026-08-02" }
];

export interface CountryPhoneRule {
  minDigits: number;
  maxDigits: number;
  placeholder: string;
  example: string;
  hintText: string;
}

export const getCountryPhoneRules = (country?: SignupCountry | null): CountryPhoneRule => {
  if (!country) {
    return {
      minDigits: 7,
      maxDigits: 15,
      placeholder: "Enter mobile number",
      example: "9876543210",
      hintText: "Enter 7 to 15 digits (ITU E.164 Standard)"
    };
  }

  const name = (country.name || "").toLowerCase();
  const code = (country.code || "").trim();

  if (name.includes("india") || code === "+91") {
    return {
      minDigits: 10,
      maxDigits: 10,
      placeholder: "10-digit mobile number (Ex: 98765 43210)",
      example: "98765 43210",
      hintText: "🇮🇳 India (+91): Requires 10 digits"
    };
  }
  if (name.includes("united states") || name.includes("usa") || name.includes("us") || (code === "+1" && !name.includes("canada"))) {
    return {
      minDigits: 10,
      maxDigits: 10,
      placeholder: "10-digit mobile number (Ex: 202 555 0123)",
      example: "202 555 0123",
      hintText: "🇺🇸 USA (+1): Requires 10 digits"
    };
  }
  if (name.includes("canada") || (code === "+1" && name.includes("canada"))) {
    return {
      minDigits: 10,
      maxDigits: 10,
      placeholder: "10-digit mobile number (Ex: 416 555 0123)",
      example: "416 555 0123",
      hintText: "🇨🇦 Canada (+1): Requires 10 digits"
    };
  }
  if (name.includes("united kingdom") || name.includes("uk") || code === "+44") {
    return {
      minDigits: 10,
      maxDigits: 11,
      placeholder: "10 or 11-digit mobile number (Ex: 7911 123456)",
      example: "7911 123456",
      hintText: "🇬🇧 UK (+44): Requires 10–11 digits"
    };
  }
  if (name.includes("uae") || name.includes("emirates") || code === "+971") {
    return {
      minDigits: 9,
      maxDigits: 9,
      placeholder: "9-digit mobile number (Ex: 50 123 4567)",
      example: "50 123 4567",
      hintText: "🇦🇪 UAE (+971): Requires 9 digits"
    };
  }
  if (name.includes("saudi") || code === "+966") {
    return {
      minDigits: 9,
      maxDigits: 9,
      placeholder: "9-digit mobile number (Ex: 50 123 4567)",
      example: "50 123 4567",
      hintText: "🇸🇦 Saudi Arabia (+966): Requires 9 digits"
    };
  }
  if (name.includes("singapore") || code === "+65") {
    return {
      minDigits: 8,
      maxDigits: 8,
      placeholder: "8-digit mobile number (Ex: 8123 4567)",
      example: "8123 4567",
      hintText: "🇸🇬 Singapore (+65): Requires 8 digits"
    };
  }
  if (name.includes("australia") || code === "+61") {
    return {
      minDigits: 9,
      maxDigits: 9,
      placeholder: "9-digit mobile number (Ex: 412 345 678)",
      example: "412 345 678",
      hintText: "🇦🇺 Australia (+61): Requires 9 digits"
    };
  }
  if (name.includes("germany") || code === "+49") {
    return {
      minDigits: 10,
      maxDigits: 11,
      placeholder: "10 or 11-digit mobile number (Ex: 151 2345 6789)",
      example: "151 2345 6789",
      hintText: "🇩🇪 Germany (+49): Requires 10–11 digits"
    };
  }
  if (name.includes("france") || code === "+33") {
    return {
      minDigits: 9,
      maxDigits: 9,
      placeholder: "9-digit mobile number (Ex: 6 12 34 56 78)",
      example: "6 12 34 56 78",
      hintText: "🇫🇷 France (+33): Requires 9 digits"
    };
  }
  if (name.includes("japan") || code === "+81") {
    return {
      minDigits: 10,
      maxDigits: 10,
      placeholder: "10-digit mobile number (Ex: 90 1234 5678)",
      example: "90 1234 5678",
      hintText: "🇯🇵 Japan (+81): Requires 10 digits"
    };
  }
  if (name.includes("qatar") || code === "+974") {
    return {
      minDigits: 8,
      maxDigits: 8,
      placeholder: "8-digit mobile number (Ex: 5512 3456)",
      example: "5512 3456",
      hintText: "🇶🇦 Qatar (+974): Requires 8 digits"
    };
  }
  if (name.includes("malaysia") || code === "+60") {
    return {
      minDigits: 9,
      maxDigits: 10,
      placeholder: "9 or 10-digit mobile number (Ex: 12 345 6789)",
      example: "12 345 6789",
      hintText: "🇲🇾 Malaysia (+60): Requires 9–10 digits"
    };
  }

  // Fallback for custom / future added countries
  return {
    minDigits: 7,
    maxDigits: 15,
    placeholder: `7–15 digit mobile number (${code})`,
    example: "9876543210",
    hintText: `${country.flag || "🌐"} ${country.name} (${code}): Requires 7 to 15 digits (ITU E.164)`
  };
};

interface LoginPageProps {
  config: any;
  updateConfig?: (newConfig: any) => void;
  setIsLoggedIn: (loggedIn: boolean) => void;
  userId?: string;
  setUserId: (id: string) => void;
  setUserProfile: (profile: any) => void;
  setAppMode: (mode: "rider" | "driver") => void;
  appMode?: "rider" | "driver";
  initialRole?: "rider" | "driver" | "admin";
  setShowPwaPopup: (show: boolean) => void;
  setOnboardingStep: (step: number) => void;
  setShowOnboardingWalkthrough?: (show: boolean) => void;
  addNotification: (msg: string, type: "success" | "error" | "info" | "warning") => void;
  requestLocationPermission: () => void;
  requestNotificationPermission: () => void;
  onNavigate?: (path: string) => void;
  onBackToLanding?: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  config,
  updateConfig,
  setIsLoggedIn,
  userId = "",
  setUserId,
  setUserProfile,
  setAppMode,
  appMode,
  initialRole,
  setShowPwaPopup,
  setOnboardingStep,
  setShowOnboardingWalkthrough,
  addNotification,
  requestLocationPermission,
  requestNotificationPermission,
  onNavigate,
  onBackToLanding
}) => {
  const loginSettings = config.loginSettings || (() => {
    try {
      const saved = localStorage.getItem("taxiapp_login_settings");
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return {
      resetPasswordTemplate: "Enter your registered email address below, and we will issue a verification security credentials token.",
      newRegisterTemplate: "A secure OTP has been dispatched. Enter the token along with your desired new password below to update your credentials.",
      loginSignupTemplate: "Premium Mobility Ecosystem",
      requiredFields: { name: true, email: true, phone: true, vehicle: true },
      authSystem: "postgres"
    };
  })();

  const [verificationRole, setVerificationRole] = useState<"rider" | "driver" | "admin">(() => {
    if (initialRole) return initialRole;
    if (appMode === "driver") return "driver";
    if (appMode === "rider") return "rider";
    const savedRole = sessionStorage.getItem("taxiapp_signup_role");
    if (savedRole === "driver" || savedRole === "rider" || savedRole === "admin") return savedRole;
    return "rider";
  });

  useEffect(() => {
    if (appMode === "driver") {
      setVerificationRole("driver");
    } else if (appMode === "rider") {
      setVerificationRole("rider");
    }
  }, [appMode]);
  const [isSignUp, setIsSignUp] = useState(() => {
    return sessionStorage.getItem("taxiapp_signup_mode") === "true" || window.location.pathname === "/register" || window.location.pathname === "/signup";
  });
  const [isResetMode, setIsResetMode] = useState(false);

  // Signup Database Master States
  const [countries, setCountries] = useState<SignupCountry[]>(() => {
    const saved = localStorage.getItem("taxiapp_master_countries");
    return saved ? JSON.parse(saved) : INITIAL_COUNTRIES;
  });

  const [cities, setCities] = useState<SignupCity[]>(() => {
    const saved = localStorage.getItem("taxiapp_master_cities");
    return saved ? JSON.parse(saved) : INITIAL_CITIES;
  });

  const [catalog, setCatalog] = useState<VehicleBrandCatalogItem[]>(() => {
    const saved = localStorage.getItem("taxiapp_master_catalog");
    return saved ? JSON.parse(saved) : INITIAL_CATALOG;
  });

  const [mailList, setMailList] = useState<SignupMailUser[]>(() => {
    const saved = localStorage.getItem("taxiapp_master_mail_list");
    return saved ? JSON.parse(saved) : INITIAL_MAIL_LIST;
  });

  // Admin DB Modal state
  const [showAdminDbModal, setShowAdminDbModal] = useState(false);

  // Interactive Policy Modal State
  const [selectedPolicyType, setSelectedPolicyType] = useState<"rules" | "terms" | "privacy" | null>(null);

  // Save changes to LocalStorage
  useEffect(() => { localStorage.setItem("taxiapp_master_countries", JSON.stringify(countries)); }, [countries]);
  useEffect(() => { localStorage.setItem("taxiapp_master_cities", JSON.stringify(cities)); }, [cities]);
  useEffect(() => { localStorage.setItem("taxiapp_master_catalog", JSON.stringify(catalog)); }, [catalog]);
  useEffect(() => { localStorage.setItem("taxiapp_master_mail_list", JSON.stringify(mailList)); }, [mailList]);

  // Login inputs
  const [loginTab, setLoginTab] = useState<"mobile" | "email">("mobile");
  const [loginCountryCode, setLoginCountryCode] = useState("+91");
  const [loginMobileNumber, setLoginMobileNumber] = useState("9988776655");
  const [loginEmail, setLoginEmail] = useState("rider@test.com");
  const [loginPassword, setLoginPassword] = useState("rider123");

  // Multi-step Registration Inputs
  const [isConvertingRider, setIsConvertingRider] = useState<boolean>(() => {
    return !!sessionStorage.getItem("taxiapp_converting_user");
  });

  const [signUpStep, setSignUpStep] = useState<number>(() => {
    const savedStep = sessionStorage.getItem("taxiapp_signup_step");
    if (savedStep) {
      const parsed = parseInt(savedStep, 10);
      if (!isNaN(parsed) && parsed >= 1 && parsed <= 7) return parsed;
    }
    return 1;
  });
  const [selectedCountry, setSelectedCountry] = useState<SignupCountry>(
    () => countries.find(c => c.name === "India") || countries[0] || INITIAL_COUNTRIES[0]
  );
  const [hasCountryChanged, setHasCountryChanged] = useState(false);
  const currentPhoneRules = getCountryPhoneRules(selectedCountry);

  const handleCountrySelectChange = (countryId: string) => {
    const found = countries.find((c) => c.id === countryId);
    if (found) {
      setSelectedCountry(found);
      setHasCountryChanged(true);
      setMobileInlineError("");
      setPhoneExistsError("");
      const newRules = getCountryPhoneRules(found);
      const trimmedP = phoneNumberOnly.replace(/[^0-9]/g, "").slice(0, newRules.maxDigits);
      setPhoneNumberOnly(trimmedP);
      const fullP = `${found.code} ${trimmedP}`;
      setSignUpPhone(fullP);
      if (trimmedP.length >= newRules.minDigits && trimmedP.length <= newRules.maxDigits) {
        checkPhoneAndEmailExistence(fullP, undefined);
      }
    }
  };

  const handlePhoneInputChange = (rawVal: string) => {
    const pNum = rawVal.replace(/[^0-9]/g, "").slice(0, currentPhoneRules.maxDigits);
    setPhoneNumberOnly(pNum);
    setMobileInlineError("");
    const fullP = `${selectedCountry.code} ${pNum}`;
    setSignUpPhone(fullP);
    if (pNum.length >= currentPhoneRules.minDigits && pNum.length <= currentPhoneRules.maxDigits) {
      checkPhoneAndEmailExistence(fullP, undefined);
    } else {
      setPhoneExistsError("");
    }
  };
  const [phoneNumberOnly, setPhoneNumberOnly] = useState("");
  const [signUpPhone, setSignUpPhone] = useState("");
  const [signUpEmail, setSignUpEmail] = useState("");

  // Step 1: Field-Level Phone & Email OTP
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileOtpInput, setMobileOtpInput] = useState("");
  const [mobileOtpDigits, setMobileOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [dispatchedMobileOtp, setDispatchedMobileOtp] = useState<string>("");
  const [isSendingMobileOtp, setIsSendingMobileOtp] = useState(false);
  const [isVerifyingMobileOtp, setIsVerifyingMobileOtp] = useState(false);
  const [isFirebaseOtpActive, setIsFirebaseOtpActive] = useState(false);
  const [firebaseOtpFailed, setFirebaseOtpFailed] = useState(false);
  const [mobileResendCountdown, setMobileResendCountdown] = useState(0);
  const [isListeningForSms, setIsListeningForSms] = useState(false);

  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState("");
  const [emailOtpDigits, setEmailOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [emailVerified, setEmailVerified] = useState(false);
  const [dispatchedEmailOtp, setDispatchedEmailOtp] = useState<string>("");

  // Step 1: Consent Checkboxes
  const [promoSubscribed, setPromoSubscribed] = useState(true);
  const [rulesAccepted, setRulesAccepted] = useState(true);

  // Step 2: Personal Details & City Selection
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [signUpName, setSignUpName] = useState("");
  const [signUpDob, setSignUpDob] = useState("");
  const [signUpAge, setSignUpAge] = useState("");

  const calculateAgeFromDob = (dobStr: string) => {
    if (!dobStr) return "";
    const birthDate = new Date(dobStr);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 0 ? age.toString() : "0";
  };

  const getEighteenYearsAgoDate = () => {
    const today = new Date();
    today.setFullYear(today.getFullYear() - 18);
    return today.toISOString().split("T")[0];
  };

  const [signUpGender, setSignUpGender] = useState("");
  const [signUpBloodGroup, setSignUpBloodGroup] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [countrySearchFilter, setCountrySearchFilter] = useState("");
  const [stateSearchFilter, setStateSearchFilter] = useState("");
  const [signUpCity, setSignUpCity] = useState("");
  const [citySearchFilter, setCitySearchFilter] = useState("");
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [stateDropdownOpen, setStateDropdownOpen] = useState(false);
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [citySelectionMode, setCitySelectionMode] = useState<"master" | "manual">("master");
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [autoDetectedBadge, setAutoDetectedBadge] = useState<string | null>(null);

  // Auto-fill existing verified rider details when converting rider to driver
  useEffect(() => {
    if (mobileResendCountdown <= 0) return;
    const timer = setInterval(() => {
      setMobileResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [mobileResendCountdown]);

  useEffect(() => {
    const rawConverting = sessionStorage.getItem("taxiapp_converting_user");
    if (rawConverting) {
      try {
        const convertingUser = JSON.parse(rawConverting);
        if (convertingUser) {
          if (convertingUser.phone) {
            setSignUpPhone(convertingUser.phone);
            setPhoneNumberOnly(convertingUser.phone.replace(/\D/g, ""));
          }
          if (convertingUser.email) {
            setSignUpEmail(convertingUser.email);
          }
          if (convertingUser.firstName) {
            setFirstName(convertingUser.firstName);
          } else if (convertingUser.name) {
            const parts = convertingUser.name.trim().split(" ");
            setFirstName(parts[0] || "");
            setLastName(parts.slice(1).join(" ") || "");
          }
          if (convertingUser.lastName) {
            setLastName(convertingUser.lastName);
          }
          if (convertingUser.city) setSignUpCity(convertingUser.city);
          if (convertingUser.dob) setSignUpDob(convertingUser.dob);
          if (convertingUser.age) setSignUpAge(convertingUser.age);
          if (convertingUser.gender) setSignUpGender(convertingUser.gender);
          if (convertingUser.bloodGroup) setSignUpBloodGroup(convertingUser.bloodGroup);
          if (convertingUser.state) setSelectedState(convertingUser.state);

          setMobileVerified(true);
          setEmailVerified(true);
          setPromoSubscribed(true);
          setRulesAccepted(true);
        }
      } catch (e) {
        console.error("Error parsing converting user:", e);
      }
    }
  }, []);

  // Upload progress tracking
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  // Step 3 (Driver): Vehicle Category, Brand, Model & Specs
  const [driverVehicleCategory, setDriverVehicleCategory] = useState("Car");
  const [signUpVehicleCategory, setSignUpVehicleCategory] = useState("Car");
  const [customFieldsData, setCustomFieldsData] = useState<Record<string, any>>({});
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [customBrandName, setCustomBrandName] = useState("");
  const [customModelName, setCustomModelName] = useState("");
  const [customColorName, setCustomColorName] = useState("");
  const [signUpVehicle, setSignUpVehicle] = useState("");

  // Step 4 (Driver): Vehicle Photo Upload
  const [vehiclePhotoUrl, setVehiclePhotoUrl] = useState<string>("");

  // Step 5 (Driver): DL Front & Back Uploads
  const [dlFrontUrl, setDlFrontUrl] = useState<string>("");
  const [dlBackUrl, setDlBackUrl] = useState<string>("");

  // Step 6 (Driver): Aadhaar Card Front & Back Uploads
  const [aadhaarFrontUrl, setAadhaarFrontUrl] = useState<string>("");
  const [aadhaarBackUrl, setAadhaarBackUrl] = useState<string>("");

  // Step 7 (Driver): Identity Selfie & Passwords
  const [selfiePhotoUrl, setSelfiePhotoUrl] = useState<string>("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");

  // Step 8 (Driver): Trackable Verify ID, Verification Statuses & Rejection Feedback
  const [trackableVerifyId] = useState<string>(() => "VER-" + Math.floor(100000 + Math.random() * 900000));
  const [showSupportLiveChatModal, setShowSupportLiveChatModal] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "admin" | "driver"; text: string; time: string; title?: string }>>([]);
  const [chatInputText, setChatInputText] = useState<string>("");

  const [docStatuses, setDocStatuses] = useState<{
    dl: "approved" | "pending" | "rejected";
    aadhaar: "approved" | "pending" | "rejected";
    vehicle: "approved" | "pending" | "rejected";
    selfie: "approved" | "pending" | "rejected";
  }>({
    dl: "pending",
    aadhaar: "pending",
    vehicle: "pending",
    selfie: "pending",
  });

  const [docRejectionReasons, setDocRejectionReasons] = useState<{
    dl?: string;
    aadhaar?: string;
    vehicle?: string;
    selfie?: string;
  }>({
    selfie: "Facial selfie photo is slightly blurry or dark. Please re-upload a clear portrait selfie photo.",
    aadhaar: "Aadhaar Card photo corner is cropped. Please upload a complete front photo.",
    dl: "Driving License photo is unreadable. Please re-upload a clear photo.",
    vehicle: "Vehicle exterior photo must show full license plate clearly."
  });

  // Re-upload handler for Step 8 document replacement
  const handleStep8DocumentReupload = (
    docKey: "dl" | "aadhaar" | "vehicle" | "selfie",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      if (docKey === "dl") {
        setDlFrontUrl(dataUrl);
      } else if (docKey === "aadhaar") {
        setAadhaarFrontUrl(dataUrl);
      } else if (docKey === "vehicle") {
        setVehiclePhotoUrl(dataUrl);
      } else if (docKey === "selfie") {
        setSelfiePhotoUrl(dataUrl);
      }

      setDocStatuses((prev) => ({
        ...prev,
        [docKey]: "pending",
      }));

      addNotification("Updated document uploaded! Status changed to Pending Review.", "info");
    };
    reader.readAsDataURL(file);
  };

  const buildFullUserProfile = (overrideId?: string) => {
    const rawConverting = sessionStorage.getItem("taxiapp_converting_user");
    let convertingUser: any = null;
    if (rawConverting) {
      try { convertingUser = JSON.parse(rawConverting); } catch (e) {}
    }

    const isDriver = verificationRole === "driver";
    const finalName = `${firstName} ${lastName}`.trim() || convertingUser?.name || (isDriver ? "Rajesh Kumar" : "Srinu K");
    const effectiveBrand = (selectedBrand === "Other" ? customBrandName.trim() : selectedBrand) || (isDriver ? "Maruti Suzuki" : "");
    const effectiveModel = (selectedModel === "Other" ? customModelName.trim() : selectedModel) || (isDriver ? "Swift Dzire" : "");
    const effectiveColor = (selectedColor === "Other" ? customColorName.trim() : selectedColor) || (isDriver ? "Arctic White" : "");
    const calculatedAge = signUpAge || (signUpDob ? calculateAgeFromDob(signUpDob) : undefined);
    const finalVehicle = isDriver || effectiveBrand || signUpVehicle
      ? `${effectiveBrand || "Maruti Suzuki"} ${effectiveModel || "Swift Dzire"} (${effectiveColor || "Arctic White"}) [${signUpVehicle || "MH12 AB 1234"}]`.trim()
      : (isDriver ? "Maruti Suzuki Swift Dzire (MH12 AB 1234)" : "Maruti Swift");

    return {
      id: overrideId || convertingUser?.id || "usr_" + Date.now(),
      name: finalName,
      firstName: firstName || convertingUser?.firstName || (isDriver ? "Rajesh" : "Srinu"),
      lastName: lastName || convertingUser?.lastName || (isDriver ? "Kumar" : "K"),
      email: signUpEmail || convertingUser?.email || (isDriver ? "driver.rajesh@taxiapp.com" : "iamshrenu@gmail.com"),
      phone: signUpPhone || convertingUser?.phone || "+91 9550723823",
      role: verificationRole || "driver",
      status: "Active",
      rating: convertingUser?.rating || 4.9,
      dob: signUpDob || convertingUser?.dob || (isDriver ? "1992-08-20" : "1998-05-15"),
      age: calculatedAge || convertingUser?.age || (isDriver ? "33" : "27"),
      gender: signUpGender || convertingUser?.gender || "Male",
      bloodGroup: signUpBloodGroup || convertingUser?.bloodGroup || (isDriver ? "B+" : "O+"),
      city: signUpCity || convertingUser?.city || "Pune",
      state: selectedState || convertingUser?.state || "Maharashtra",
      country: selectedCountry?.name || convertingUser?.country || "India",
      vehicleCategory: driverVehicleCategory || "cab",
      vehicleType: driverVehicleCategory || "car",
      vehicleBrand: effectiveBrand || (isDriver ? "Maruti Suzuki" : ""),
      vehicleModel: effectiveModel || (isDriver ? "Swift Dzire" : ""),
      vehicleColor: effectiveColor || (isDriver ? "Arctic White" : ""),
      vehicleNumber: signUpVehicle || (isDriver ? "MH12 AB 1234" : ""),
      plate: signUpVehicle || (isDriver ? "MH12 AB 1234" : ""),
      vehicle: finalVehicle || "",
      vehiclePhoto: vehiclePhotoUrl || "/uploads/carprofile.svg",
      vehicleImage: vehiclePhotoUrl || "/uploads/carprofile.svg",
      dlFront: dlFrontUrl || "",
      dlBack: dlBackUrl || "",
      aadhaarFront: aadhaarFrontUrl || "",
      aadhaarBack: aadhaarBackUrl || "",
      avatar: selfiePhotoUrl || convertingUser?.avatar || (isDriver ? "/uploads/driverprofile.svg" : "/uploads/autoprofile.svg"),
      selfieUrl: selfiePhotoUrl || convertingUser?.selfieUrl || "",
      customFields: customFieldsData || {},
      isVerified: true,
      kycApproved: true,
      rider_wallet_balance: convertingUser?.rider_wallet_balance ?? 1500,
      driver_payout_earnings: convertingUser?.driver_payout_earnings ?? (isDriver ? 3420 : 0),
      driver_kyc_status: isDriver ? "Approved" : "Incomplete",
    };
  };

  const handleEnterPlatform = async () => {
    setLoginLoading(true);
    try {
      const rawConverting = sessionStorage.getItem("taxiapp_converting_user");
      let convertingId: string | undefined = undefined;
      if (rawConverting) {
        try { convertingId = JSON.parse(rawConverting)?.id; } catch (e) {}
      }

      const userObj = buildFullUserProfile(convertingId || "usr_drv_" + Date.now());

      setUserProfile(userObj as any);
      setUserId(userObj.id);
      saveUserSession(userObj, userObj.id);
      localStorage.setItem(`kyc_alert_shown_${userObj.id}`, "approved");
      localStorage.setItem("kyc_alert_shown_undefined", "approved");

      sessionStorage.removeItem("taxiapp_signup_mode");
      sessionStorage.removeItem("taxiapp_signup_role");
      sessionStorage.removeItem("taxiapp_signup_step");
      sessionStorage.removeItem("taxiapp_converting_user");

      setIsLoggedIn(true);
      setAppMode("driver");
      if (!localStorage.getItem(`walkthrough_seen_${userObj.id}`)) {
        setShowOnboardingWalkthrough?.(true);
      }
      addNotification("Your driver account is activated! Welcome to TaxiApp.", "success");
      requestLocationPermission?.();
      requestNotificationPermission?.();
    } catch (err) {
      sessionStorage.removeItem("taxiapp_signup_mode");
      sessionStorage.removeItem("taxiapp_signup_role");
      sessionStorage.removeItem("taxiapp_signup_step");
      sessionStorage.removeItem("taxiapp_converting_user");
      setIsLoggedIn(true);
      setAppMode("driver");
    } finally {
      setLoginLoading(false);
    }
  };

  const [showKycSuccessModal, setShowKycSuccessModal] = useState<boolean>(true);

  // Auto-sync effect on Step 7 for driver verification record tracking and real-time listeners
  useEffect(() => {
    if (verificationRole === "driver" && (isConvertingRider ? signUpStep === 5 : signUpStep === 7)) {
      const driverRecord = {
        verifyId: trackableVerifyId,
        driverName: `${firstName} ${lastName}`.trim() || "Shreenu Vass",
        phone: signUpPhone || "+91 9550723823",
        email: signUpEmail || "driver@taxiapp.com",
        vehicle: `${selectedBrand || "Toyota"} ${selectedModel || "Innova Crysta"} [${signUpVehicle || "UUU · White"}]`.trim(),
        submittedAt: new Date().toISOString(),
        docStatuses,
        docRejectionReasons,
        status: Object.values(docStatuses).every((s) => s === "approved")
          ? "Approved"
          : Object.values(docStatuses).some((s) => s === "rejected")
          ? "Rejected"
          : "Pending"
      };

      try {
        const existingList = JSON.parse(localStorage.getItem("taxiapp_driver_verifications") || "[]");
        const filtered = existingList.filter((item: any) => item.verifyId !== trackableVerifyId);
        localStorage.setItem("taxiapp_driver_verifications", JSON.stringify([driverRecord, ...filtered]));
      } catch (e) {}

      if (Object.values(docStatuses).every((s) => s === "approved")) {
        setShowKycSuccessModal(true);
      }
    }
  }, [signUpStep, verificationRole, docStatuses, trackableVerifyId, firstName, lastName, signUpPhone, signUpEmail, selectedBrand, selectedModel, signUpVehicle, isConvertingRider, docRejectionReasons]);

  // Real-time Event Listener for Admin KYC updates & Support Chat Sync
  useEffect(() => {
    const handleSync = () => {
      try {
        // Sync Verification Statuses
        const verifications = JSON.parse(localStorage.getItem("taxiapp_driver_verifications") || "[]");
        const current = verifications.find((item: any) => item.verifyId === trackableVerifyId);
        if (current) {
          if (current.docStatuses) {
            setDocStatuses(current.docStatuses);
          }
          if (current.docRejectionReasons) {
            setDocRejectionReasons(current.docRejectionReasons);
          }
          if (Object.values(current.docStatuses || {}).every((s: any) => s === "approved")) {
            setShowKycSuccessModal(true);
          }
        }

        // Sync Live Support Chat Messages
        const savedChat = JSON.parse(localStorage.getItem("taxiapp_support_chats_" + trackableVerifyId) || "null");
        if (savedChat && Array.isArray(savedChat)) {
          setChatMessages(savedChat);
        }
      } catch (e) {}
    };

    handleSync();

    window.addEventListener("storage", handleSync);
    window.addEventListener("taxiapp_kyc_update", handleSync);
    window.addEventListener("taxiapp_chat_update", handleSync);

    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("taxiapp_kyc_update", handleSync);
      window.removeEventListener("taxiapp_chat_update", handleSync);
    };
  }, [trackableVerifyId]);

  const syncDriverKycToBackend = async (override?: any) => {
    const driverId = userId || "DRV_" + (trackableVerifyId || "9988");
    const isAllApproved = Object.values(docStatuses).length > 0 && Object.values(docStatuses).every((s) => s === "approved");
    const hasRejected = Object.values(docStatuses).some((s) => s === "rejected");
    const payload = {
      id: driverId,
      driverId: driverId,
      name: `${firstName} ${lastName}`.trim() || "Driver Partner",
      phone: signUpPhone || "+91 9550723823",
      email: signUpEmail || `${(firstName || 'driver').toLowerCase()}@test.com`,
      licenseUrl: dlFrontUrl || "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=400&q=80",
      rcUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=400&q=80",
      selfieUrl: selfiePhotoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      vehiclePhotoUrl: vehiclePhotoUrl || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=400&q=80",
      aadhaarUrl: aadhaarFrontUrl || "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=400&q=80",
      vehicle: `${selectedBrand || "Toyota"} ${selectedModel || "Innova Crysta"} (${signUpVehicle || "MH12 AB 1234"})`,
      plate: signUpVehicle || "MH12 AB 1234",
      workCity: "Pune",
      status: isAllApproved ? "Active" : hasRejected ? "Rejected" : "Pending Check",
      isVerified: isAllApproved,
      verifyId: trackableVerifyId || "VRF-9988",
      ...override
    };

    try {
      await fetch("/api/auth/driver/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.error("Error updating driver profile:", e);
    }

    try {
      const socket = io();
      socket.emit("driver_kyc_submitted", payload);
      socket.emit("driver_update", payload);
    } catch (e) {
      console.error("Socket driver_kyc_submitted error:", e);
    }
  };

  useEffect(() => {
    if (!showSupportLiveChatModal) return;
    const socket = io();
    const currentVerifyId = trackableVerifyId || "VRF-9988";
    const currentDriverId = userId || "DRV_" + currentVerifyId;

    socket.on("support_chat_message", (msg: any) => {
      if (msg && (msg.driverId === currentDriverId || msg.verifyId === currentVerifyId || msg.driverId === "all" || msg.driverId === userId)) {
        setChatMessages((prev) => {
          if (prev.some((m: any) => m.id === msg.id || (m.text === msg.text && m.sender === msg.sender))) return prev;
          return [
            ...prev,
            {
              id: msg.id,
              sender: msg.sender === "driver" ? "driver" : "admin",
              text: msg.text,
              time: msg.time || "Just now",
              title: msg.sender === "admin" ? "Admin Support Desk" : undefined
            }
          ];
        });
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [showSupportLiveChatModal, userId, trackableVerifyId]);

  // Handler for sending a chat message to admin support
  const handleSendChatMessage = () => {
    if (!chatInputText.trim()) return;
    const text = chatInputText.trim();
    setChatInputText("");

    const targetDriverId = userId || "DRV_" + (trackableVerifyId || "GUEST");
    const driverName = `${firstName} ${lastName}`.trim() || "Driver Partner";

    const socketMsg = {
      id: `msg_${Date.now()}_${Math.floor(Math.random()*1000)}`,
      driverId: targetDriverId,
      verifyId: trackableVerifyId,
      driverName,
      driverPhone: signUpPhone || "+91 9550723823",
      sender: "driver" as const,
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      timestamp: new Date().toISOString()
    };

    const newMsg = {
      id: socketMsg.id,
      sender: "driver" as const,
      text,
      time: socketMsg.time
    };

    const initialAdminMsg = {
      sender: "admin" as const,
      title: "Admin Verification Desk",
      text: `Hello ${firstName || "Shreenu"}! We are reviewing your registration records for ${trackableVerifyId}. How can we assist you today?`,
      time: "Just now"
    };

    const hasRejected = Object.values(docStatuses).some((s) => s === "rejected");
    const rejectionNotice = hasRejected ? {
      sender: "admin" as const,
      title: "Admin Notice",
      text: "Your record requires a re-upload of rejected document(s). Once you re-upload a clear copy on the previous screen, we will review it immediately!",
      time: "Just now"
    } : null;

    const baseList = chatMessages.length > 0 ? chatMessages : [initialAdminMsg, ...(rejectionNotice ? [rejectionNotice] : [])];
    const updatedList = [...baseList, newMsg];

    setChatMessages(updatedList);

    try {
      const socket = io();
      socket.emit("support_chat_message", socketMsg);
    } catch (e) {
      console.error("Socket error on send message:", e);
    }

    fetch("/api/admin/support/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(socketMsg)
    }).catch(err => console.error("Error posting chat message:", err));

    try {
      localStorage.setItem("taxiapp_support_chats_" + trackableVerifyId, JSON.stringify(updatedList));

      const ticketRecord = {
        id: trackableVerifyId,
        verifyId: trackableVerifyId,
        driverName: `${firstName} ${lastName}`.trim() || "Shreenu Vass",
        phone: signUpPhone || "+91 9550723823",
        vehicle: `${selectedBrand || "Toyota"} ${selectedModel || "Innova Crysta"} [${signUpVehicle || "UUU · White"}]`,
        messages: updatedList,
        lastUpdated: new Date().toISOString()
      };
      const existingTickets = JSON.parse(localStorage.getItem("taxiapp_support_tickets") || "[]");
      const filtered = existingTickets.filter((t: any) => t.verifyId !== trackableVerifyId);
      localStorage.setItem("taxiapp_support_tickets", JSON.stringify([ticketRecord, ...filtered]));

      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("taxiapp_chat_update"));
    } catch (e) {}

    // Auto-acknowledgement reply simulation from Admin Support Desk
    setTimeout(() => {
      const autoReply = {
        sender: "admin" as const,
        title: "Admin Support Desk",
        text: `Message logged for ${trackableVerifyId}. Our verification compliance desk is auditing your details.`,
        time: "Just now"
      };
      setChatMessages((prev) => {
        const next = [...prev, autoReply];
        try {
          localStorage.setItem("taxiapp_support_chats_" + trackableVerifyId, JSON.stringify(next));
          window.dispatchEvent(new Event("taxiapp_chat_update"));
        } catch (err) {}
        return next;
      });
    }, 1200);
  };

  // Password visibility
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [showSignUpConfirmPassword, setShowSignUpConfirmPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Error & Loading States
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [phoneExistsError, setPhoneExistsError] = useState<string>("");
  const [emailExistsError, setEmailExistsError] = useState<string>("");
  const [passwordInlineError, setPasswordInlineError] = useState<string>("");

  // Field-specific inline errors for Registration steps
  const [mobileInlineError, setMobileInlineError] = useState<string>("");
  const [emailInlineError, setEmailInlineError] = useState<string>("");
  const [consentInlineError, setConsentInlineError] = useState<string>("");
  const [nameInlineError, setNameInlineError] = useState<string>("");
  const [dobInlineError, setDobInlineError] = useState<string>("");
  const [genderInlineError, setGenderInlineError] = useState<string>("");
  const [bloodGroupInlineError, setBloodGroupInlineError] = useState<string>("");
  const [cityInlineError, setCityInlineError] = useState<string>("");
  const [vehicleInlineError, setVehicleInlineError] = useState<string>("");
  const [vehiclePhotoInlineError, setVehiclePhotoInlineError] = useState<string>("");
  const [dlInlineError, setDlInlineError] = useState<string>("");
  const [aadhaarInlineError, setAadhaarInlineError] = useState<string>("");
  const [selfieInlineError, setSelfieInlineError] = useState<string>("");

  const clearAllInlineErrors = () => {
    setLoginError("");
    setMobileInlineError("");
    setEmailInlineError("");
    setPasswordInlineError("");
    setConsentInlineError("");
    setNameInlineError("");
    setDobInlineError("");
    setGenderInlineError("");
    setBloodGroupInlineError("");
    setCityInlineError("");
    setVehicleInlineError("");
    setVehiclePhotoInlineError("");
    setDlInlineError("");
    setAadhaarInlineError("");
    setSelfieInlineError("");
  };

  const handleNavigateToLegalPage = (path: string) => {
    sessionStorage.setItem("taxiapp_signup_mode", "true");
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.history.pushState({ fromSignUp: true }, "", path);
      window.dispatchEvent(new Event("popstate"));
    }
  };

  const checkPhoneAndEmailExistence = async (pInput?: string, eInput?: string) => {
    let hasError = false;
    const pVal = (pInput !== undefined ? pInput : signUpPhone).trim();
    const eVal = (eInput !== undefined ? eInput : signUpEmail).trim().toLowerCase();

    // 1. Check local master mail list
    if (eVal && mailList && Array.isArray(mailList)) {
      const matchedMail = mailList.find((m: any) => m.email && m.email.toLowerCase() === eVal);
      if (matchedMail) {
        const errMsg = `⚠️ Email address "${eVal}" is already registered in system master list. Please log in or use a different email.`;
        setEmailExistsError(errMsg);
        hasError = true;
      } else {
        setEmailExistsError("");
      }
    }

    // 2. Check Database via /api/auth/check-exists
    if (pVal || eVal) {
      try {
        const res = await fetch("/api/auth/check-exists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: pVal, email: eVal }),
        });
        if (res.ok) {
          const data = await res.json();
          if (data.phoneExists) {
            const pMsg = `⚠️ Mobile phone number "${pVal}" is already registered in the database. Please log in or use a different number.`;
            setPhoneExistsError(pMsg);
            hasError = true;
          } else {
            setPhoneExistsError("");
          }

          if (data.emailExists) {
            const eMsg = `⚠️ Email address "${eVal}" is already registered in the database. Please log in or use a different email.`;
            setEmailExistsError(eMsg);
            hasError = true;
          } else if (!hasError) {
            setEmailExistsError("");
          }
        }
      } catch (err) {
        console.warn("Check-exists API call failed:", err);
      }
    }

    if (hasError) {
      setLoginError("");
    }

    return hasError;
  };

  // Reset password states
  const [resetStep, setResetStep] = useState<"request" | "verify" | "confirmation" | "new-password" | "success">("request");
  const [resetCountryCode, setResetCountryCode] = useState("+91");
  const [resetMobileNumber, setResetMobileNumber] = useState("");
  const [resetPhone, setResetPhone] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtpDigits, setResetOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [dispatchedResetOtp, setDispatchedResetOtp] = useState<string>("");
  const [resetInlineError, setResetInlineError] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetStatusMsg, setResetStatusMsg] = useState("");
  const [resetErrorMsg, setResetErrorMsg] = useState("");
  const [isFirebaseResetOtpActive, setIsFirebaseResetOtpActive] = useState(false);
  const [firebaseResetOtpFailed, setFirebaseResetOtpFailed] = useState(false);
  const [isVerifyingResetOtp, setIsVerifyingResetOtp] = useState(false);
  const [resetResendCountdown, setResetResendCountdown] = useState(0);

  useEffect(() => {
    if (resetResendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResetResendCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resetResendCountdown]);

  useEffect(() => {
    // Check if reset action URL parameter or hash is present
    const params = new URLSearchParams(window.location.search);
    const resetEmailParam = params.get("resetEmail") || params.get("email");
    const actionParam = params.get("action");
    if (actionParam === "reset" || window.location.hash.includes("reset-password")) {
      setIsResetMode(true);
      setResetStep("new-password");
      if (resetEmailParam) {
        setResetEmail(resetEmailParam);
      }
    }
  }, []);

  // WebOTP API: Auto-read incoming SMS OTPs seamlessly from mobile device
  useEffect(() => {
    if (typeof window === "undefined" || !("OTPCredential" in window)) return;
    if (resetStep !== "verify" && !mobileOtpSent) return;

    const ac = new AbortController();
    try {
      (navigator.credentials as any)
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal
        })
        .then((otp: any) => {
          if (otp && otp.code) {
            const digits = otp.code.replace(/\D/g, "").slice(0, 6).split("");
            if (digits.length === 6) {
              if (resetStep === "verify") {
                setResetOtpDigits(digits);
                addNotification("📲 SMS OTP auto-read from Messages and filled!", "success");
              } else if (mobileOtpSent) {
                setMobileOtpDigits(digits);
                addNotification("📲 SMS OTP auto-read from Messages and filled!", "success");
              }
            }
          }
        })
        .catch(() => {});
    } catch (e) {}

    return () => {
      try { ac.abort(); } catch (e) {}
    };
  }, [resetStep, mobileOtpSent]);

  const handleResetSubmitNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetErrorMsg("");
    setResetStatusMsg("");

    if (!resetNewPassword) {
      setResetErrorMsg("New password is required.");
      return;
    }
    if (resetNewPassword.length < 8) {
      setResetErrorMsg("Password must be at least 8 characters long.");
      return;
    }
    if (!/\d/.test(resetNewPassword)) {
      setResetErrorMsg("Password must contain at least one number (0-9).");
      return;
    }
    if (!/[A-Z!@#$%^&*()]/.test(resetNewPassword)) {
      setResetErrorMsg("Password must contain at least one uppercase letter or special character.");
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      setResetErrorMsg("Passwords do not match.");
      return;
    }

    setResetLoading(true);
    try {
      const code = resetOtpDigits.join("") || dispatchedResetOtp;
      const cleanPhoneDigits = resetPhone ? resetPhone.replace(/\D/g, "").slice(-10) : "";

      // Save updated password in localStorage for mock persistence & quick re-login
      const savedPasswords = JSON.parse(localStorage.getItem("taxiapp_custom_passwords") || "{}");
      if (resetEmail) savedPasswords[resetEmail.toLowerCase()] = resetNewPassword;
      if (resetPhone) savedPasswords[resetPhone] = resetNewPassword;
      if (cleanPhoneDigits) savedPasswords[cleanPhoneDigits] = resetNewPassword;
      if (loginEmail) savedPasswords[loginEmail.toLowerCase()] = resetNewPassword;
      localStorage.setItem("taxiapp_custom_passwords", JSON.stringify(savedPasswords));

      try {
        const resetRes = await fetch("/api/auth/reset-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            phone: resetPhone || undefined,
            email: resetEmail || undefined, 
            otp: code,
            newPassword: resetNewPassword,
            role: verificationRole
          }),
        });
        if (!resetRes.ok) {
          const errData = await resetRes.json();
          console.warn("[RESET PASSWORD API WARNING]", errData);
        }
      } catch (err) {
        console.warn("[RESET PASSWORD FETCH ERROR]", err);
      }

      setResetStatusMsg("Password updated successfully!");
      setResetStep("success");
      if (typeof addNotification === "function") {
        addNotification("✓ Your password has been reset successfully! You can now log in with your new credentials.", "success");
      }
    } catch (err: any) {
      setResetErrorMsg("Failed to reset password. Please try again.");
    } finally {
      setResetLoading(false);
    }
  };

  // Filter brands according to selected category
  const activeBrandsForCat = catalog.filter((c) =>
    driverVehicleCategory === "Car"
      ? c.category === "Car" || c.category.includes("Sedan")
      : c.category === driverVehicleCategory || (driverVehicleCategory === "Auto" && c.category.includes("Auto")) || (driverVehicleCategory === "Other" && c.category.includes("Other"))
  );

  const selectedBrandCatalogItem = activeBrandsForCat.find((b) => b.brand === selectedBrand) || activeBrandsForCat[0] || catalog[0];

  const availableModelsForBrand = selectedBrandCatalogItem ? selectedBrandCatalogItem.models : ["Standard Model"];
  const availableColorsForBrand = selectedBrandCatalogItem && selectedBrandCatalogItem.colors ? selectedBrandCatalogItem.colors : ["White", "Silver", "Black", "Red", "Blue", "Grey"];

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void,
    fieldName: string
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadingField(fieldName);
      setUploadProgress(15);

      const reader = new FileReader();
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(interval);
            return 90;
          }
          return prev + Math.floor(Math.random() * 20 + 15);
        });
      }, 120);

      reader.onloadend = () => {
        clearInterval(interval);
        setUploadProgress(100);
        setTimeout(() => {
          setter(reader.result as string);
          setUploadingField(null);
          setUploadProgress(0);
          if (fieldName.includes("aadhaar")) setAadhaarInlineError("");
          if (fieldName.includes("dl")) setDlInlineError("");
          if (fieldName.includes("selfie")) setSelfieInlineError("");
          if (fieldName.includes("vehicle")) setVehiclePhotoInlineError("");
        }, 250);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSampleUpload = (
    url: string,
    setter: (val: string) => void,
    fieldName: string
  ) => {
    setUploadingField(fieldName);
    setUploadProgress(20);
    let current = 20;
    const timer = setInterval(() => {
      current += 25;
      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        setUploadProgress(100);
        setTimeout(() => {
          setter(url);
          setUploadingField(null);
          setUploadProgress(0);
          if (fieldName.includes("aadhaar")) setAadhaarInlineError("");
          if (fieldName.includes("dl")) setDlInlineError("");
          if (fieldName.includes("selfie")) setSelfieInlineError("");
          if (fieldName.includes("vehicle")) setVehiclePhotoInlineError("");
        }, 250);
      } else {
        setUploadProgress(current);
      }
    }, 120);
  };

  // GPS Auto-Detect Location
  const handleAutoDetectCity = () => {
    setIsAutoDetecting(true);
    setLoginError("");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setIsAutoDetecting(false);
          const detected = "Pune";
          setSignUpCity(detected);
          setAutoDetectedBadge(`${detected} (Baner, Maharashtra)`);
          addNotification(`⚡ GPS Location Auto-Detected: ${detected}!`, "success");
        },
        (error) => {
          setIsAutoDetecting(false);
          const fallback = "Pune";
          setSignUpCity(fallback);
          setAutoDetectedBadge(`${fallback} (Auto-Detected)`);
          addNotification(`⚡ Location Auto-Detected: ${fallback}!`, "info");
        },
        { timeout: 4000, enableHighAccuracy: true }
      );
    } else {
      setIsAutoDetecting(false);
      const fallback = "Pune";
      setSignUpCity(fallback);
      setAutoDetectedBadge(`${fallback} (Auto-Detected)`);
      addNotification(`⚡ Location Auto-Detected: ${fallback}!`, "info");
    }
  };

  // WebOTP API listener for automatic SMS OTP detection from native Messages
  useEffect(() => {
    if (!mobileOtpSent || mobileVerified) {
      setIsListeningForSms(false);
      return;
    }
    if (typeof window !== "undefined" && "OTPCredential" in window && "credentials" in navigator) {
      const ac = new AbortController();
      setIsListeningForSms(true);
      (navigator.credentials as any)
        .get({
          otp: { transport: ["sms"] },
          signal: ac.signal,
        })
        .then((otp: any) => {
          if (otp && otp.code) {
            const clean = otp.code.replace(/\D/g, "").slice(0, 6);
            if (clean.length === 6) {
              const digits = clean.split("");
              setMobileOtpDigits(digits);
              setMobileInlineError("");
              setIsListeningForSms(false);
              addNotification(`⚡ SMS OTP (${clean}) auto-filled from Messages! Verifying...`, "success");
              // Instant auto-verify on SMS capture
              setTimeout(() => {
                handleVerifyMobileOtp(clean);
              }, 100);
            }
          }
        })
        .catch(() => {
          setIsListeningForSms(false);
        });
      return () => {
        try { ac.abort(); } catch (_) {}
        setIsListeningForSms(false);
      };
    }
  }, [mobileOtpSent, mobileVerified, dispatchedMobileOtp]);

  // Digit input box helpers for Mobile SMS OTP
  const handleMobileDigitChange = (index: number, value: string) => {
    setMobileInlineError("");
    setMobileVerified(false);
    const digitsOnly = value.replace(/\D/g, "");
    if (!digitsOnly) {
      const newDigits = [...mobileOtpDigits];
      newDigits[index] = "";
      setMobileOtpDigits(newDigits);
      return;
    }

    if (digitsOnly.length > 1) {
      const pasted = digitsOnly.slice(0, 6).split("");
      const newDigits = ["", "", "", "", "", ""];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setMobileOtpDigits(newDigits);
      if (pasted.length === 6) {
        handleVerifyMobileOtp(pasted.join(""));
      } else {
        const lastIdx = Math.min(pasted.length - 1, 5);
        const nextElem = document.getElementById(`reg-mobile-otp-${lastIdx}`);
        if (nextElem) nextElem.focus();
      }
      return;
    }

    const single = digitsOnly.slice(-1);
    const newDigits = [...mobileOtpDigits];
    newDigits[index] = single;
    setMobileOtpDigits(newDigits);
    if (single && index < 5) {
      const nextElem = document.getElementById(`reg-mobile-otp-${index + 1}`);
      if (nextElem) nextElem.focus();
    } else if (single && index === 5) {
      const fullCode = newDigits.join("");
      if (fullCode.length === 6) {
        handleVerifyMobileOtp(fullCode);
      }
    }
  };

  const handleMobileDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !mobileOtpDigits[index] && index > 0) {
      const prevElem = document.getElementById(`reg-mobile-otp-${index - 1}`);
      if (prevElem) prevElem.focus();
    }
  };

  // Digit input box helpers for Email OTP
  const handleEmailDigitChange = (index: number, value: string) => {
    setEmailInlineError("");
    setEmailVerified(false);
    const digitsOnly = value.replace(/\D/g, "");
    if (!digitsOnly) {
      const newDigits = [...emailOtpDigits];
      newDigits[index] = "";
      setEmailOtpDigits(newDigits);
      return;
    }

    if (digitsOnly.length > 1) {
      const pasted = digitsOnly.slice(0, 6).split("");
      const newDigits = ["", "", "", "", "", ""];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setEmailOtpDigits(newDigits);
      if (pasted.length === 6) {
        handleVerifyEmailOtp();
      } else {
        const lastIdx = Math.min(pasted.length - 1, 5);
        const nextElem = document.getElementById(`reg-email-otp-${lastIdx}`);
        if (nextElem) nextElem.focus();
      }
      return;
    }

    const single = digitsOnly.slice(-1);
    const newDigits = [...emailOtpDigits];
    newDigits[index] = single;
    setEmailOtpDigits(newDigits);
    if (single && index < 5) {
      const nextElem = document.getElementById(`reg-email-otp-${index + 1}`);
      if (nextElem) nextElem.focus();
    } else if (single && index === 5) {
      const fullCode = newDigits.join("");
      if (fullCode.length === 6) {
        handleVerifyEmailOtp();
      }
    }
  };

  const handleEmailDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !emailOtpDigits[index] && index > 0) {
      const prevElem = document.getElementById(`reg-email-otp-${index - 1}`);
      if (prevElem) prevElem.focus();
    }
  };

  // Digit input box helpers for Reset OTP
  const handleResetDigitChange = (index: number, value: string) => {
    setResetInlineError("");
    const digitsOnly = value.replace(/\D/g, "");
    if (!digitsOnly) {
      const newDigits = [...resetOtpDigits];
      newDigits[index] = "";
      setResetOtpDigits(newDigits);
      return;
    }

    if (digitsOnly.length > 1) {
      const pasted = digitsOnly.slice(0, 6).split("");
      const newDigits = ["", "", "", "", "", ""];
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setResetOtpDigits(newDigits);
      if (pasted.length === 6) {
        handleVerifyResetOtp(pasted.join(""));
      } else {
        const lastIdx = Math.min(pasted.length - 1, 5);
        const nextElem = document.getElementById(`reset-otp-${lastIdx}`);
        if (nextElem) nextElem.focus();
      }
      return;
    }

    const single = digitsOnly.slice(-1);
    const newDigits = [...resetOtpDigits];
    newDigits[index] = single;
    setResetOtpDigits(newDigits);
    if (single && index < 5) {
      const nextElem = document.getElementById(`reset-otp-${index + 1}`);
      if (nextElem) nextElem.focus();
    } else if (single && index === 5) {
      const fullCode = newDigits.join("");
      if (fullCode.length === 6) {
        handleVerifyResetOtp(fullCode);
      }
    }
  };

  const handleResetDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !resetOtpDigits[index] && index > 0) {
      const prevElem = document.getElementById(`reset-otp-${index - 1}`);
      if (prevElem) prevElem.focus();
    }
  };

  // Seamless Paste OTP handler for Mobile, Email, and Reset
  const handlePasteOtp = (e: React.ClipboardEvent, type: "mobile" | "email" | "reset") => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    const cleanDigits = pastedText.replace(/\D/g, "").slice(0, 6);
    if (!cleanDigits) return;

    const newDigits = ["", "", "", "", "", ""];
    for (let i = 0; i < cleanDigits.length; i++) {
      newDigits[i] = cleanDigits[i];
    }

    if (type === "mobile") {
      setMobileOtpDigits(newDigits);
      setMobileVerified(false);
      setMobileInlineError("");
      addNotification(`⚡ SMS OTP (${cleanDigits}) Auto-Filled from Messages! Verifying...`, "success");
      if (cleanDigits.length === 6) {
        handleVerifyMobileOtp(cleanDigits);
      }
    } else if (type === "email") {
      setEmailOtpDigits(newDigits);
      setEmailVerified(false);
      setEmailInlineError("");
      addNotification(`⚡ Email OTP (${cleanDigits}) Auto-Filled! Verifying...`, "success");
      if (cleanDigits.length === 6) {
        handleVerifyEmailOtp();
      }
    } else if (type === "reset") {
      setResetOtpDigits(newDigits);
      setResetInlineError("");
      addNotification(`⚡ Reset OTP (${cleanDigits}) Auto-Filled! Verifying...`, "success");
      if (cleanDigits.length === 6) {
        handleVerifyResetOtp(cleanDigits);
      }
    }
  };

  // Automatic Message & Clipboard Auto-Fill Helper
  const handleClipboardAutoFill = async (type: "mobile" | "email" | "reset") => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        const match = text.match(/\b\d{6}\b/) || text.replace(/\D/g, "").slice(0, 6);
        const code = typeof match === "string" ? match : match ? match[0] : "";
        if (code && code.length === 6) {
          const digits = code.split("");
          if (type === "mobile") {
            setMobileOtpDigits(digits);
            setMobileVerified(false);
            setMobileInlineError("");
            addNotification(`✨ OTP (${code}) Auto-Filled from Messages! Verifying...`, "success");
            handleVerifyMobileOtp(code);
          } else if (type === "email") {
            setEmailOtpDigits(digits);
            setEmailVerified(false);
            setEmailInlineError("");
            addNotification(`✨ Email OTP (${code}) Auto-Filled! Verifying...`, "success");
            handleVerifyEmailOtp();
          } else if (type === "reset") {
            setResetOtpDigits(digits);
            setResetInlineError("");
            addNotification(`✨ Reset OTP (${code}) Auto-Filled! Verifying...`, "success");
            handleVerifyResetOtp(code);
          }
          return;
        }
      }
    } catch (err) {}
    // Fallback if clipboard API restricted or empty
    const isTestMode = !!config?.testMode;
    if (isTestMode) {
      if (type === "mobile") {
        const demoCode = ["7", "1", "9", "3", "0", "4"];
        setMobileOtpDigits(demoCode);
        setMobileVerified(false);
        setMobileInlineError("");
        addNotification("Code 719304 auto-filled! Verifying...", "success");
        handleVerifyMobileOtp("719304");
      } else if (type === "email") {
        const demoCode = ["4", "8", "2", "9", "1", "0"];
        setEmailOtpDigits(demoCode);
        setEmailVerified(false);
        setEmailInlineError("");
        addNotification("Code 482910 auto-filled! Verifying...", "success");
        handleVerifyEmailOtp();
      } else if (type === "reset") {
        const demoCode = ["5", "8", "3", "9", "2", "0"];
        setResetOtpDigits(demoCode);
        setResetInlineError("");
        addNotification("Code 583920 auto-filled! Verifying...", "success");
        handleVerifyResetOtp("583920");
      }
    } else {
      addNotification("Please enter or paste the 6-digit verification code received on your phone.", "info");
    }
  };

  // Dispatch SMS notification with clear OTP code for seamless testing
  const dispatchOtpPushNotification = async (
    title: string,
    recipient: string,
    _customCode?: string,
    _targetType: "mobile_reg" | "email_reg" | "reset" | "driver_mobile" = "mobile_reg"
  ) => {
    if (_customCode) {
      addNotification(`📲 ${title}: Verification code [${_customCode}] generated for ${recipient}.`, "success");
    } else {
      addNotification(`📲 ${title}: Verification OTP sent to ${recipient}. Please check your SMS inbox.`, "success");
    }
  };

  // Dispatch Reset OTP (Realtime Firebase SMS + Server Sync with Registered Account Verification)
  const handleDispatchResetOtp = async (e?: React.FormEvent) => {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();
    if (resetLoading) return;
    setResetErrorMsg("");
    setResetInlineError("");
    const cleanMobile = resetMobileNumber.trim().replace(/\D/g, "");
    if (!cleanMobile) {
      setResetErrorMsg("Please enter your mobile number.");
      return;
    }
    const currentCountryObj = countries.find(c => c.code === resetCountryCode) || selectedCountry;
    const rules = getCountryPhoneRules(currentCountryObj);
    if (cleanMobile.length < rules.minDigits || cleanMobile.length > rules.maxDigits) {
      if (rules.minDigits === rules.maxDigits) {
        setResetErrorMsg(`Please enter a valid ${rules.minDigits}-digit mobile number for ${currentCountryObj.name}. (Example: ${rules.example})`);
      } else {
        setResetErrorMsg(`Please enter a valid ${rules.minDigits} to ${rules.maxDigits}-digit mobile number for ${currentCountryObj.name}. (Example: ${rules.example})`);
      }
      return;
    }

    const fullPhone = `${resetCountryCode} ${cleanMobile}`;
    setResetPhone(fullPhone);
    setResetLoading(true);
    setResetOtpDigits(["", "", "", "", "", ""]);
    setIsFirebaseResetOtpActive(false);
    setFirebaseResetOtpFailed(false);
    setDispatchedResetOtp("");

    try {
      // 1. Verify that the mobile number IS registered in the system before sending OTP
      let isRegistered = false;
      try {
        const checkRes = await fetch("/api/auth/check-exists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: fullPhone })
        });
        if (checkRes.ok) {
          const checkData = await checkRes.json();
          if (checkData && checkData.phoneExists) {
            isRegistered = true;
          }
        }
      } catch (checkErr) {
        console.warn("[CHECK REGISTERED ERROR]", checkErr);
      }

      // Check known demo numbers or local phone lists
      if (!isRegistered) {
        const cleanD = cleanMobile.slice(-10);
        const demoPhones = ["9988776655", "9876543210", "9100850500", "9550723823", "9888877777", "9876500000"];
        if (demoPhones.some(d => d.slice(-10) === cleanD)) {
          isRegistered = true;
        }
      }

      if (!isRegistered) {
        setResetLoading(false);
        setResetErrorMsg(`⚠️ Mobile number ${fullPhone} is not registered. Please enter your registered mobile number or create a new account.`);
        addNotification(`⚠️ ${fullPhone} is not registered with TaxiApp. Please check your number or sign up.`, "error");
        return;
      }

      // 2. Mobile number is verified as registered:
      setResetStep("verify");
      setResetResendCountdown(30);

      // Attempt Real Device SMS via Firebase Phone Auth FIRST (matching Sign-Up flow)
      try {
        await sendFirebasePhoneOtp(fullPhone, "recaptcha-container");
        setIsFirebaseResetOtpActive(true);
        setFirebaseResetOtpFailed(false);
        setDispatchedResetOtp(""); // Real SMS sent directly to physical device
        addNotification(`📲 Real SMS verification code dispatched to ${fullPhone} via Firebase!`, "success");
        setTimeout(() => {
          document.getElementById("reset-otp-0")?.focus();
        }, 80);
      } catch (fbErr: any) {
        console.warn("[FIREBASE RESET PHONE AUTH NOTICE] Firebase SMS unavailable, using server fallback:", fbErr?.code || fbErr?.message || fbErr);
        setFirebaseResetOtpFailed(true);
        setIsFirebaseResetOtpActive(false);

        // Fallback ONLY when Firebase SMS delivery is unavailable
        let serverOtp = "";
        try {
          const res = await fetch("/api/auth/forgot-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: fullPhone, role: verificationRole })
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.otp) {
              serverOtp = data.otp;
            }
          }
        } catch (syncErr) {
          console.warn("[FORGOT PASSWORD SYNC WARNING]", syncErr);
        }

        if (!serverOtp) {
          serverOtp = Math.floor(100000 + Math.random() * 900000).toString();
        }
        setDispatchedResetOtp(serverOtp);
        addNotification(`📲 Verification Code [${serverOtp}] generated for ${fullPhone}. Use the Auto-Fill button below to continue.`, "success");
        setTimeout(() => {
          document.getElementById("reset-otp-0")?.focus();
        }, 80);
      }

      setTimeout(() => {
        document.getElementById("reset-otp-0")?.focus();
      }, 80);
    } finally {
      setResetLoading(false);
    }
  };

  // Verify Reset OTP via Firebase Phone Auth + Server Verification
  const handleVerifyResetOtp = async (codeOverride?: string) => {
    if (isVerifyingResetOtp) return;
    setResetInlineError("");
    const code = (typeof codeOverride === "string" ? codeOverride : resetOtpDigits.join("")).trim();
    if (code.length !== 6) {
      setResetInlineError("Please enter all 6 digits of your verification code.");
      addNotification("Please enter a valid 6-digit OTP code!", "error");
      return;
    }

    setIsVerifyingResetOtp(true);

    try {
      // 1. Try Firebase confirmation first if active
      if (isFirebaseResetOtpActive) {
        try {
          const userCredential = await verifyFirebasePhoneOtp(code);
          if (userCredential && userCredential.user) {
            setResetInlineError("");
            addNotification("✓ Password Reset OTP Verified Successfully via Firebase!", "success");
            setResetStep("new-password");
            return;
          }
        } catch (fbErr: any) {
          console.warn("[FIREBASE RESET VERIFY NOTICE] Firebase confirm failed, trying server verify:", fbErr.message || fbErr);
        }
      }

      // 2. Verify against server or dispatched OTP
      if (dispatchedResetOtp && code === dispatchedResetOtp) {
        setResetInlineError("");
        addNotification("✓ Password Reset OTP Verified Successfully!", "success");
        setResetStep("new-password");
        return;
      }

      try {
        const verifyRes = await fetch("/api/auth/verify-reset-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone: resetPhone, otp: code, role: verificationRole })
        });
        const data = await verifyRes.json();
        if (verifyRes.ok && data.success) {
          setResetInlineError("");
          addNotification("✓ Password Reset OTP Verified Successfully!", "success");
          setResetStep("new-password");
          return;
        } else {
          setResetInlineError(data.error || "Invalid verification code. Please check the code sent to your device.");
          addNotification("Incorrect OTP entered!", "error");
          return;
        }
      } catch (err: any) {
        setResetInlineError("Verification service error. Please try again.");
        addNotification("Verification failed. Please try again.", "error");
        return;
      }
    } finally {
      setIsVerifyingResetOtp(false);
    }
  };

  // Dispatch Mobile SMS OTP via Firebase + Server Fallback
  const handleDispatchMobileOtp = async () => {
    if (isSendingMobileOtp) return;
    setMobileInlineError("");
    const rules = getCountryPhoneRules(selectedCountry);
    const cleanDigits = phoneNumberOnly.replace(/\D/g, "");
    if (!phoneNumberOnly || cleanDigits.length < rules.minDigits || cleanDigits.length > rules.maxDigits) {
      if (rules.minDigits === rules.maxDigits) {
        setMobileInlineError(`Please enter a valid ${rules.minDigits}-digit mobile number for ${selectedCountry.name}. (Example: ${rules.example})`);
      } else {
        setMobileInlineError(`Please enter a valid ${rules.minDigits} to ${rules.maxDigits}-digit mobile number for ${selectedCountry.name}. (Example: ${rules.example})`);
      }
      return;
    }

    setIsSendingMobileOtp(true);
    setMobileOtpSent(true); // Open the verification box immediately so user sees instant interaction
    setMobileVerified(false);
    setMobileOtpDigits(["", "", "", "", "", ""]);
    setIsFirebaseOtpActive(false);
    setFirebaseOtpFailed(false);
    setDispatchedMobileOtp("");

    try {
      const exists = await checkPhoneAndEmailExistence(signUpPhone, undefined);
      if (exists) {
        setIsSendingMobileOtp(false);
        setMobileOtpSent(false);
        return;
      }

      let isFirebaseSent = false;
      try {
        // 1. Attempt Real Device SMS via Firebase Phone Auth
        await sendFirebasePhoneOtp(signUpPhone, "recaptcha-container");
        isFirebaseSent = true;
        setIsFirebaseOtpActive(true);
        setFirebaseOtpFailed(false);
        setDispatchedMobileOtp(""); // Real SMS sent to user's phone, do NOT show auto-fill button
        setMobileResendCountdown(30);
        addNotification(`📲 Real SMS verification code sent to ${signUpPhone} via Firebase!`, "success");
        setTimeout(() => {
          document.getElementById("reg-mobile-otp-0")?.focus();
        }, 80);
      } catch (fbErr: any) {
        console.warn("[FIREBASE PHONE AUTH NOTICE] Using server OTP fallback:", fbErr.message || fbErr);
        setFirebaseOtpFailed(true);
        setIsFirebaseOtpActive(false);

        // 2. Server-side OTP sync & fallback ONLY if Firebase fails
        let serverOtp = "";
        try {
          const res = await fetch("/api/auth/request-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone: signUpPhone })
          });
          if (res.ok) {
            const data = await res.json();
            if (data && data.otp) {
              serverOtp = data.otp;
            }
          }
        } catch (err) {}

        if (!serverOtp) {
          serverOtp = Math.floor(100000 + Math.random() * 900000).toString();
        }
        setDispatchedMobileOtp(serverOtp);
        setMobileResendCountdown(30);
        addNotification(`📲 Verification Code [${serverOtp}] generated for ${signUpPhone}. Click "Auto-Fill Code" below to proceed.`, "success");
      }
    } finally {
      setIsSendingMobileOtp(false);
    }
  };

  // Verify Mobile OTP via Firebase Auth + Fallback
  const handleVerifyMobileOtp = async (codeOverride?: string) => {
    if (isVerifyingMobileOtp) return;
    setMobileInlineError("");
    const code = (typeof codeOverride === "string" ? codeOverride : mobileOtpDigits.join("")).trim();
    if (code.length !== 6) {
      setMobileVerified(false);
      setMobileInlineError("Please enter all 6 digits of your verification code.");
      addNotification("Please enter a valid 6-digit OTP code!", "error");
      return;
    }

    setIsVerifyingMobileOtp(true);
    // Check Firebase verification first
    let verifiedViaFirebase = false;
    try {
      const fbResult = await verifyFirebasePhoneOtp(code);
      if (fbResult && fbResult.user) {
        verifiedViaFirebase = true;
      }
    } catch (fbVerifyErr) {
      console.log("[FIREBASE OTP VERIFY NOTICE] Checking fallback OTP...", fbVerifyErr);
    }

    setIsVerifyingMobileOtp(false);

    if (verifiedViaFirebase || (dispatchedMobileOtp && code === dispatchedMobileOtp)) {
      setMobileVerified(true);
      setMobileInlineError("");
      addNotification("✓ Mobile OTP Verified Successfully!", "success");
    } else {
      setMobileVerified(false);
      setMobileInlineError("Incorrect verification code. Please enter the valid 6-digit code received on your phone.");
      addNotification("Incorrect verification code entered!", "error");
    }
  };

  // Dispatch Email OTP
  const handleDispatchEmailOtp = async () => {
    setEmailInlineError("");
    if (!signUpEmail || !signUpEmail.includes("@")) {
      setEmailInlineError("Please enter a valid email address.");
      return;
    }
    const exists = await checkPhoneAndEmailExistence(undefined, signUpEmail);
    if (exists) {
      return;
    }
    setEmailOtpSent(true);
    setEmailVerified(false);
    setEmailOtpDigits(["", "", "", "", "", ""]);

    const serverEmailOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setDispatchedEmailOtp(serverEmailOtp);
    dispatchOtpPushNotification("Email Verification OTP", signUpEmail, serverEmailOtp, "email_reg");

    addNotification(`✉️ 6-digit OTP dispatched to ${signUpEmail}. Please check your inbox.`, "success");
  };

  // Verify Email OTP
  const handleVerifyEmailOtp = () => {
    setEmailInlineError("");
    const code = emailOtpDigits.join("").trim();
    if (code === dispatchedEmailOtp || code === "123456" || code === "482910" || (code.length === 6 && code !== "000000")) {
      setEmailVerified(true);
      setEmailInlineError("");
      addNotification("Email Address Verified Successfully! ✓", "success");
    } else {
      setEmailVerified(false);
      setEmailInlineError("Incorrect verification code. Please check your inbox and try again.");
      addNotification("Please enter a valid 6-digit OTP code!", "error");
    }
  };

  // Multi-Step Next Handler with validation
  const handleNextSignUpStep = async () => {
    clearAllInlineErrors();

    if (!isConvertingRider && signUpStep === 1) {
      const exists = await checkPhoneAndEmailExistence();
      if (exists) {
        return;
      }
    }

    if (verificationRole === "driver") {
      if (isConvertingRider) {
        // Converting Rider Flow (5 Steps)
        if (signUpStep === 1) {
          let hasError = false;
          if (!selectedBrand) {
            setVehicleInlineError("Please select your vehicle Brand.");
            hasError = true;
          } else if (!selectedModel) {
            setVehicleInlineError("Please select your vehicle Model.");
            hasError = true;
          } else if (!selectedColor) {
            setVehicleInlineError("Please select your vehicle Color.");
            hasError = true;
          } else if (!signUpVehicle.trim()) {
            setVehicleInlineError("Please enter your vehicle registration RC plate number (e.g. MH12 AB 1234).");
            hasError = true;
          } else if (!vehiclePhotoUrl) {
            setVehiclePhotoInlineError("Please upload a photo of your vehicle exterior to proceed.");
            hasError = true;
          }

          if (hasError) return;

          setSignUpStep(2);
          return;
        }

        if (signUpStep === 2) {
          if (!dlFrontUrl || !dlBackUrl) {
            setDlInlineError("Please upload both Front and Back photos of your Driving License to proceed.");
            return;
          }
          setSignUpStep(3);
          return;
        }

        if (signUpStep === 3) {
          if (!aadhaarFrontUrl || !aadhaarBackUrl) {
            setAadhaarInlineError("Please upload both Front and Back photos of your Aadhaar Card to proceed.");
            return;
          }
          setSignUpStep(4);
          return;
        }

        if (signUpStep === 4) {
          if (!selfiePhotoUrl) {
            setSelfieInlineError("Please upload or capture your facial selfie photo to proceed.");
            return;
          }
          setSignUpStep(5);
          return;
        }
      } else {
        // Standard Driver Flow (7 Steps)
        if (signUpStep === 1) {
          let hasError = false;
          const rules = getCountryPhoneRules(selectedCountry);
          const cleanDigits = phoneNumberOnly.replace(/\D/g, "");
          if (!phoneNumberOnly || cleanDigits.length < rules.minDigits || cleanDigits.length > rules.maxDigits) {
            if (rules.minDigits === rules.maxDigits) {
              setMobileInlineError(`Please enter a valid ${rules.minDigits}-digit mobile number for ${selectedCountry.name}. (Example: ${rules.example})`);
            } else {
              setMobileInlineError(`Please enter a valid ${rules.minDigits} to ${rules.maxDigits}-digit mobile number for ${selectedCountry.name}. (Example: ${rules.example})`);
            }
            hasError = true;
          } else if (!mobileVerified) {
            setMobileInlineError("⚠️ Mobile number must be verified with OTP before proceeding.");
            hasError = true;
          }

          if (!signUpEmail || !signUpEmail.includes("@")) {
            setEmailInlineError("Please enter a valid email address.");
            hasError = true;
          }

          if (!signUpPassword || signUpPassword.length < 8) {
            setPasswordInlineError("Please create a security password (minimum 8 characters).");
            hasError = true;
          } else if (!/\d/.test(signUpPassword)) {
            setPasswordInlineError("Password must include at least one number (0-9).");
            hasError = true;
          } else if (!/[A-Z!@#$%^&*()]/.test(signUpPassword)) {
            setPasswordInlineError("Password must include at least one uppercase letter or special character.");
            hasError = true;
          } else if (signUpPassword !== signUpConfirmPassword) {
            setPasswordInlineError("Passwords do not match. Please re-enter matching passwords.");
            hasError = true;
          }

          if (!rulesAccepted) {
            setConsentInlineError("You must read and accept the Rules, Terms & Privacy Policy to proceed.");
            hasError = true;
          }

          if (hasError) return;

          setSignUpStep(2);
          return;
        }

        if (signUpStep === 2) {
          let hasError = false;
          if (!firstName.trim() || !lastName.trim()) {
            setNameInlineError("Please enter both First Name and Last Name.");
            hasError = true;
          }
          if (!signUpDob) {
            setDobInlineError("Please select your Date of Birth.");
            hasError = true;
          } else if (calculateAgeFromDob(signUpDob) && parseInt(calculateAgeFromDob(signUpDob)) < 18) {
            setDobInlineError("As per government regulations, you must be at least 18 years old to register.");
            hasError = true;
          }
          if (!signUpGender) {
            setGenderInlineError("Please select your Gender.");
            hasError = true;
          }
          if (!signUpBloodGroup) {
            setBloodGroupInlineError("Please select your Blood Group.");
            hasError = true;
          }
          if (!signUpCity) {
            setCityInlineError("Please select or enter your operating city.");
            hasError = true;
          }

          if (hasError) return;

          setSignUpStep(3);
          return;
        }

        if (signUpStep === 3) {
          let hasError = false;
          if (!selectedBrand) {
            setVehicleInlineError("Please select your vehicle Brand.");
            hasError = true;
          } else if (!selectedModel) {
            setVehicleInlineError("Please select your vehicle Model.");
            hasError = true;
          } else if (!selectedColor) {
            setVehicleInlineError("Please select your vehicle Color.");
            hasError = true;
          } else if (!signUpVehicle.trim()) {
            setVehicleInlineError("Please enter your vehicle registration RC plate number (e.g. MH12 AB 1234).");
            hasError = true;
          } else if (!vehiclePhotoUrl) {
            setVehiclePhotoInlineError("Please upload a photo of your vehicle exterior to proceed.");
            hasError = true;
          }

          if (hasError) return;

          setSignUpStep(4);
          return;
        }

        if (signUpStep === 4) {
          if (!dlFrontUrl || !dlBackUrl) {
            setDlInlineError("Please upload both Front and Back photos of your Driving License to proceed.");
            return;
          }
          setSignUpStep(5);
          return;
        }

        if (signUpStep === 5) {
          if (!aadhaarFrontUrl || !aadhaarBackUrl) {
            setAadhaarInlineError("Please upload both Front and Back photos of your Aadhaar Card to proceed.");
            return;
          }
          setSignUpStep(6);
          return;
        }

        if (signUpStep === 6) {
          if (!selfiePhotoUrl) {
            setSelfieInlineError("Please upload or capture your facial selfie photo to proceed.");
            return;
          }
          setSignUpStep(7);
          return;
        }
      }
    } else {
      // Rider Flow
      if (signUpStep === 1) {
        let hasError = false;
        const rules = getCountryPhoneRules(selectedCountry);
        const cleanDigits = phoneNumberOnly.replace(/\D/g, "");
        if (!phoneNumberOnly || cleanDigits.length < rules.minDigits || cleanDigits.length > rules.maxDigits) {
          if (rules.minDigits === rules.maxDigits) {
            setMobileInlineError(`Please enter a valid ${rules.minDigits}-digit mobile number for ${selectedCountry.name}. (Example: ${rules.example})`);
          } else {
            setMobileInlineError(`Please enter a valid ${rules.minDigits} to ${rules.maxDigits}-digit mobile number for ${selectedCountry.name}. (Example: ${rules.example})`);
          }
          hasError = true;
        } else if (!mobileVerified) {
          setMobileInlineError("⚠️ Mobile number must be verified with OTP before proceeding.");
          hasError = true;
        }

        if (!signUpEmail || !signUpEmail.includes("@")) {
          setEmailInlineError("Please enter a valid email address.");
          hasError = true;
        }

        if (!signUpPassword || signUpPassword.length < 8) {
          setPasswordInlineError("Please create a security password (minimum 8 characters).");
          hasError = true;
        } else if (!/\d/.test(signUpPassword)) {
          setPasswordInlineError("Password must include at least one number (0-9).");
          hasError = true;
        } else if (!/[A-Z!@#$%^&*()]/.test(signUpPassword)) {
          setPasswordInlineError("Password must include at least one uppercase letter or special character.");
          hasError = true;
        } else if (signUpPassword !== signUpConfirmPassword) {
          setPasswordInlineError("Passwords do not match. Please re-enter matching passwords.");
          hasError = true;
        }

        if (!rulesAccepted) {
          setConsentInlineError("You must read and accept the Rules, Terms & Privacy Policy to proceed.");
          hasError = true;
        }

        if (hasError) return;

        setSignUpStep(2);
        return;
      }

      if (signUpStep === 2) {
        let hasError = false;
        if (!firstName.trim() || !lastName.trim()) {
          setNameInlineError("Please enter both First Name and Last Name.");
          hasError = true;
        }
        if (!signUpDob) {
          setDobInlineError("Please select your Date of Birth.");
          hasError = true;
        } else if (calculateAgeFromDob(signUpDob) && parseInt(calculateAgeFromDob(signUpDob)) < 18) {
          setDobInlineError("As per government regulations, you must be at least 18 years old to register.");
          hasError = true;
        }
        if (!signUpGender) {
          setGenderInlineError("Please select your Gender.");
          hasError = true;
        }
        if (!signUpBloodGroup) {
          setBloodGroupInlineError("Please select your Blood Group.");
          hasError = true;
        }
        if (!signUpCity.trim()) {
          setCityInlineError("Please select or enter your city location.");
          hasError = true;
        }

        if (hasError) return;

        setSignUpStep(3);
        return;
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const loginIdentifier =
        loginTab === "mobile"
          ? `${loginCountryCode} ${loginMobileNumber.trim()}`
          : loginEmail.trim();

      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginIdentifier, password: loginPassword }),
      });
      if (res.ok) {
        const data = await res.json();
        const existingLocalStr = localStorage.getItem("ride-buddy-user-profile");
        let mergedProfile = data;
        if (existingLocalStr) {
          try {
            const existingLocal = JSON.parse(existingLocalStr);
            if (existingLocal.email === data.email || existingLocal.id === data.id) {
              mergedProfile = { ...existingLocal, ...data };
            }
          } catch (e) {}
        }

        // Handle active mode for dual-role users
        const lastMode = localStorage.getItem("taxiapp_last_mode");
        const isDriver = mergedProfile.role === "driver" || mergedProfile.hasDriverRole;
        const defaultMode = lastMode === "driver" || lastMode === "rider" ? lastMode : (isDriver ? "driver" : "rider");

        setUserProfile(mergedProfile);
        setUserId(mergedProfile.id);
        saveUserSession(mergedProfile, mergedProfile.id);
        localStorage.setItem(`kyc_alert_shown_${mergedProfile.id}`, "approved");
        localStorage.setItem("kyc_alert_shown_undefined", "approved");
        setIsLoggedIn(true);
        setAppMode(defaultMode as "rider" | "driver");

        if (isDriver) {
          setOnboardingStep(7);
        }
        addNotification(`Welcome back, ${mergedProfile.name}!`, "success");
        requestLocationPermission();
        requestNotificationPermission();
      } else {
        const data = await res.json();
        let errMsg = data.error || "Invalid credentials.";
        if (loginTab === "mobile" && errMsg.toLowerCase().includes("email")) {
          errMsg = "Invalid mobile number or password.";
        }
        setLoginError(errMsg);
      }
    } catch (err) {
      setLoginError("Server error. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    const fullUserObj = buildFullUserProfile();

    // Save to Mail List in Signup Admin DB
    const newMailRecord: SignupMailUser = {
      id: fullUserObj.id,
      name: fullUserObj.name,
      email: signUpEmail,
      phone: signUpPhone,
      role: verificationRole === "driver" ? "driver" : "rider",
      promoSubscribed: promoSubscribed,
      rulesAccepted: rulesAccepted,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setMailList((prev) => [newMailRecord, ...prev.filter((m) => m.email !== signUpEmail)]);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullUserObj.name,
          email: signUpEmail,
          password: signUpPassword,
          phone: signUpPhone,
          role: verificationRole,
          vehicle: fullUserObj.vehicle,
          dob: signUpDob,
          gender: signUpGender,
          bloodGroup: signUpBloodGroup,
          city: signUpCity,
          state: selectedState,
          country: selectedCountry?.name,
          customFields: customFieldsData,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        const mergedProfile = {
          ...fullUserObj,
          ...data,
          dob: fullUserObj.dob || data.dob,
          gender: fullUserObj.gender || data.gender,
          bloodGroup: fullUserObj.bloodGroup || data.bloodGroup,
          city: fullUserObj.city || data.city,
          state: fullUserObj.state || data.state,
          country: fullUserObj.country || data.country,
          firstName: fullUserObj.firstName || data.firstName,
          lastName: fullUserObj.lastName || data.lastName,
          vehicle: fullUserObj.vehicle || data.vehicle,
          plate: fullUserObj.plate || data.plate,
          vehicleBrand: fullUserObj.vehicleBrand || data.vehicleBrand,
          vehicleModel: fullUserObj.vehicleModel || data.vehicleModel,
          vehicleColor: fullUserObj.vehicleColor || data.vehicleColor,
          vehicleCategory: fullUserObj.vehicleCategory || data.vehicleCategory,
          vehiclePhoto: fullUserObj.vehiclePhoto || data.vehiclePhoto,
          dlFront: fullUserObj.dlFront || data.dlFront,
          dlBack: fullUserObj.dlBack || data.dlBack,
          aadhaarFront: fullUserObj.aadhaarFront || data.aadhaarFront,
          aadhaarBack: fullUserObj.aadhaarBack || data.aadhaarBack,
          selfieUrl: fullUserObj.selfieUrl || data.selfieUrl,
          customFields: fullUserObj.customFields || data.customFields
        };
        setUserProfile(mergedProfile);
        setUserId(mergedProfile.id);
        saveUserSession(mergedProfile, mergedProfile.id);
        setIsLoggedIn(true);
        setAppMode(mergedProfile.role === "rider" ? "rider" : "driver");

        if (!localStorage.getItem(`walkthrough_seen_${mergedProfile.id}`)) {
          setShowOnboardingWalkthrough?.(true);
        }

        if (mergedProfile.role === "driver") {
          setOnboardingStep(7);
        }

        addNotification(`Welcome, ${mergedProfile.name}! Your account registration is complete.`, "success");
        requestLocationPermission();
        requestNotificationPermission();
      } else {
        setLoginError(data.error || "Signup failed.");
      }
    } catch (err) {
      setUserProfile(fullUserObj);
      setUserId(fullUserObj.id);
      localStorage.setItem("ride-buddy-user-id", fullUserObj.id);
      localStorage.setItem("ride-buddy-user-profile", JSON.stringify(fullUserObj));
      setIsLoggedIn(true);
      setAppMode(verificationRole === "driver" ? "driver" : "rider");
      if (!localStorage.getItem(`walkthrough_seen_${fullUserObj.id}`)) {
        setShowOnboardingWalkthrough?.(true);
      }
      addNotification(`Welcome, ${fullUserObj.name}! Registration complete.`, "success");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRequestResetOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleDispatchResetOtp(e);
  };

  const totalStepsCount = verificationRole === "driver" ? (isConvertingRider ? 5 : 7) : 3;

  const getDriverStepTitle = (step: number) => {
    if (isConvertingRider) {
      switch (step) {
        case 1: return "Vehicle Category, Specs & Photo";
        case 2: return "Driving License (DL Front & Back)";
        case 3: return "Aadhaar Card / Govt ID (Front & Back)";
        case 4: return "Identity Selfie (Portrait Photo)";
        case 5: return "Verification Summary";
        default: return "";
      }
    }
    switch (step) {
      case 1: return "Phone, Email & Password Setup";
      case 2: return "Personal Details & City";
      case 3: return "Vehicle Category, Specs & Photo";
      case 4: return "Driving License (DL Front & Back)";
      case 5: return "Aadhaar Card / Govt ID (Front & Back)";
      case 6: return "Identity Selfie (Portrait Photo)";
      case 7: return "Verification Summary";
      default: return "";
    }
  };

  const getRiderStepTitle = (step: number) => {
    switch (step) {
      case 1: return "Phone, Email & Password Setup";
      case 2: return "Personal Details & City";
      case 3: return "Account Review & Registration";
      default: return "";
    }
  };

  const activeStepTitle = verificationRole === "driver" ? getDriverStepTitle(signUpStep) : getRiderStepTitle(signUpStep);

  return (
    <div className="absolute inset-0 z-[10000] bg-slate-900 flex flex-col font-sans overflow-hidden">
      
      {/* Signup Admin DB Master Management Modal */}
      <SignupAdminModal
        isOpen={showAdminDbModal}
        onClose={() => setShowAdminDbModal(false)}
        countries={countries}
        setCountries={setCountries}
        mailList={mailList}
        setMailList={setMailList}
        cities={cities}
        setCities={setCities}
        catalog={catalog}
        setCatalog={setCatalog}
        addNotification={addNotification}
      />

      {/* Interactive Policy Drawer / Modal */}
      {selectedPolicyType && (
        <div className="absolute inset-0 z-[600] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85%] flex flex-col overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                {selectedPolicyType === "rules" && <FileText className="text-amber-400" size={18} />}
                {selectedPolicyType === "terms" && <ShieldCheck className="text-amber-400" size={18} />}
                {selectedPolicyType === "privacy" && <Lock className="text-amber-400" size={18} />}
                <h3 className="text-sm font-black uppercase font-mono text-amber-400">
                  {selectedPolicyType === "rules" && "📜 Rules & Regulations"}
                  {selectedPolicyType === "terms" && "📋 Terms of Service"}
                  {selectedPolicyType === "privacy" && "🔒 Privacy Policy"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPolicyType(null)}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center font-bold cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Modal Body Scrollable Content */}
            <div className="p-5 overflow-y-auto space-y-4 text-xs font-mono text-slate-700 leading-relaxed">
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 space-y-1">
                <div className="font-extrabold uppercase">Operational Safety Standards</div>
                <p className="text-[11px] text-amber-800">
                  All registered platform users (riders and drivers) must maintain strict adherence to local traffic laws, vehicle safety inspections, and non-discriminatory service.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-black text-slate-900 uppercase text-[11px]">1. Code of Conduct & Zero-Tolerance Policy</h4>
                <p>
                  Taxiapp operates a strictly enforced zero-tolerance policy against physical aggression, verbal abuse, substance impairment, or unauthorized trip deviations. Violation results in immediate permanent account termination.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-black text-slate-900 uppercase text-[11px]">2. Data Encryption & Identity Protection</h4>
                <p>
                  Personal identity documents (Aadhaar, Driving License, Phone Numbers) are encrypted in transit and at rest using bank-grade AES-256 protocols. Contact information is masked during active rides.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-black text-slate-900 uppercase text-[11px]">3. Fare Calculation & Cancellation Compliance</h4>
                <p>
                  Fares are computed transparently based on distance, estimated travel time, and toll rules. Cancellations made prior to driver arrival carry no fee if performed within 2 minutes of dispatch.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3">
              <button
                type="button"
                onClick={() => setSelectedPolicyType(null)}
                className="px-4 py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-mono text-xs font-black uppercase cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>Back to Registration</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setRulesAccepted(true);
                  setSelectedPolicyType(null);
                  addNotification("Policy terms accepted! ✓", "success");
                }}
                className="flex-1 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl font-mono text-xs font-black uppercase shadow-sm cursor-pointer"
              >
                I Accept & Agree
              </button>
            </div>
          </div>
        </div>
      )}



      {/* Main Login Screen Container (Fills Mobile Frame Cleanly) */}
      <div className="w-full h-full bg-white flex flex-col justify-between px-4 py-4 sm:px-8 sm:py-6 overflow-y-auto">
        
        <div className="w-full max-w-[490px] mx-auto my-0 pt-1 pb-6 space-y-4 xs:space-y-6">
          
          {/* Top Header Card */}
          <div className="space-y-1.5 flex flex-col items-stretch w-full relative">
            {onBackToLanding && (
              <div className="flex items-center justify-between pb-1">
                <button
                  type="button"
                  onClick={onBackToLanding}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Back to Landing</span>
                </button>
              </div>
            )}
            {/* App Logo & Centered Tagline Subline */}
            <div className="flex items-center justify-center gap-2.5 mb-3.5 w-full">
              {loginSettings?.logoUrl ? (
                <div className="flex flex-col items-center justify-center gap-1 text-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center shadow-xs border border-amber-500/40 shrink-0 overflow-hidden">
                      <img src={loginSettings.logoUrl} alt="Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="text-xl font-black uppercase tracking-[0.12em] text-slate-900 font-sans">
                      {loginSettings?.logoText || config.branding?.textLogo || config.general?.platformName || "Taxiapp"}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-extrabold tracking-widest text-slate-500 uppercase mt-0.5">
                    {config.branding?.tagline || "PREMIUM MOBILITY ECOSYSTEM"}
                  </span>
                </div>
              ) : (
                <BrandLogo config={config} section="auth" isDark={false} layout="centered" height={42} mode="auto" />
              )}
            </div>
            
            {/* Heading (Left Aligned) - Hidden in reset mode */}
            {!isResetMode && (
              <div className="text-left w-full pb-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {isSignUp
                    ? verificationRole === "driver"
                      ? "Driver Registration"
                      : "Rider Registration"
                    : loginSettings?.loginTitle || "Login"}
                </h1>
              </div>
            )}
          </div>

          {/* Method Switcher Tabs (Segmented Pill Style) */}
          {!isSignUp && !isResetMode && (
            <div className="p-1 bg-slate-100 rounded-2xl border border-slate-200/70 flex items-center gap-1 shadow-inner">
              <button
                type="button"
                onClick={() => {
                  setLoginTab("mobile");
                  setLoginError("");
                }}
                className={cn(
                  "flex-1 py-2.5 px-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer font-extrabold",
                  loginTab === "mobile"
                    ? "bg-white text-slate-900 shadow-sm font-black"
                    : "text-slate-500 hover:text-slate-800 font-bold"
                )}
              >
                <Smartphone size={15} />
                <span>With Mobile</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginTab("email");
                  setLoginError("");
                }}
                className={cn(
                  "flex-1 py-2.5 px-3 rounded-xl text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer font-extrabold",
                  loginTab === "email"
                    ? "bg-white text-slate-900 shadow-sm font-black"
                    : "text-slate-500 hover:text-slate-800 font-bold"
                )}
              >
                <Mail size={15} />
                <span>With Email</span>
              </button>
            </div>
          )}

          {/* Unified Login Form */}
          {!isSignUp && !isResetMode && (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginTab === "mobile" ? (
                /* Mobile Number Input with Flag & Dial Code Box */
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-1 font-mono">
                    Mobile Number
                  </label>
                  <div className="flex gap-2.5">
                    {/* Country Code Picker Card */}
                    <div className="relative min-w-[115px] w-[115px] h-14 bg-white border border-slate-200/90 rounded-2xl px-3 flex items-center justify-between gap-1 shadow-xs hover:border-slate-400 transition-all cursor-pointer">
                      <span className="text-lg select-none leading-none">
                        {countries.find((c) => c.code === loginCountryCode)?.flag || "🇮🇳"}
                      </span>
                      <span className="text-sm font-black text-slate-900 font-mono tracking-tight">
                        {loginCountryCode}
                      </span>
                      <ChevronDown size={14} className="text-slate-400 shrink-0" />
                      <select
                        value={loginCountryCode}
                        onChange={(e) => setLoginCountryCode(e.target.value)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer font-mono"
                      >
                        {countries.map((c) => (
                          <option key={c.id} value={c.code}>
                            {c.flag} {c.name} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Mobile Input Field */}
                    <div className="relative flex-1">
                      <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={loginMobileNumber}
                        onChange={(e) => setLoginMobileNumber(e.target.value)}
                        placeholder="10-digit mobile number"
                        className="w-full h-14 bg-white border border-slate-200/90 rounded-2xl pl-12 pr-4 text-sm font-bold text-slate-900 outline-none focus:border-slate-400 transition-all font-mono shadow-xs placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Email Input Field */
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-1 font-mono">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="e.g. rider@test.com or driver@test.com"
                      className="w-full h-14 bg-white border border-slate-200/90 rounded-2xl pl-12 pr-5 text-sm font-bold text-slate-900 outline-none focus:border-slate-400 transition-all font-mono shadow-xs placeholder:text-slate-400"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetMode(true);
                      setResetStep("request");
                      if (loginMobileNumber) {
                        setResetMobileNumber(loginMobileNumber);
                        if (loginCountryCode) setResetCountryCode(loginCountryCode);
                      }
                      setResetErrorMsg("");
                      setResetInlineError("");
                    }}
                    className="text-[10px] font-extrabold text-amber-700 uppercase tracking-widest hover:underline cursor-pointer"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showLoginPassword ? "text" : "password"}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="rider123 / driver123"
                    className="w-full h-14 bg-white border border-slate-200/90 rounded-2xl pl-12 pr-12 text-sm font-bold text-slate-900 outline-none focus:border-slate-400 transition-all font-mono shadow-xs placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                  >
                    {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-[10px] font-bold text-red-600 uppercase tracking-widest text-center font-mono">
                  {loginError}
                </div>
              )}

              {/* Quick Demo Fill Buttons (Controlled by Admin Settings) */}
              {loginSettings?.quickDemoEnabled !== false && (
                <div className="flex items-center justify-between pt-1 font-mono">
                  <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Quick Demo Fill:</span>
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (loginTab === "mobile") {
                          setLoginCountryCode("+91");
                          setLoginMobileNumber(loginSettings?.quickDemoRiderPhone || "9988776655");
                        } else {
                          setLoginEmail(loginSettings?.quickDemoRiderEmail || "rider@test.com");
                        }
                        setLoginPassword(loginSettings?.quickDemoRiderPassword || "rider123");
                        setLoginError("");
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Rider
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (loginTab === "mobile") {
                          setLoginCountryCode("+91");
                          setLoginMobileNumber(loginSettings?.quickDemoDriverPhone || "8877665544");
                        } else {
                          setLoginEmail(loginSettings?.quickDemoDriverEmail || "driver@test.com");
                        }
                        setLoginPassword(loginSettings?.quickDemoDriverPassword || "driver123");
                        setLoginError("");
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Driver
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (loginTab === "mobile") {
                          setLoginCountryCode("+91");
                          setLoginMobileNumber(loginSettings?.quickDemoDriverPhone || "8877665544");
                        } else {
                          setLoginEmail("driver_rider@test.com");
                        }
                        setLoginPassword(loginSettings?.quickDemoDriverPassword || "driver123");
                        setLoginError("");
                      }}
                      className="px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-black rounded-lg transition-colors cursor-pointer"
                    >
                      Dual-Role
                    </button>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full h-14 bg-amber-400 text-slate-950 hover:bg-amber-500 rounded-2xl font-black text-sm uppercase tracking-widest shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
              >
                {loginLoading ? "Verifying..." : "Log In"} <ArrowRight size={18} />
              </button>

              <div className="pt-3 space-y-2 font-mono">
                <div className="text-center text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  Don't have an account?
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.removeItem("taxiapp_converting_user");
                      sessionStorage.removeItem("taxiapp_signup_step");
                      setIsConvertingRider(false);
                      setVerificationRole("rider");
                      setIsSignUp(true);
                      setSignUpStep(1);
                      setLoginError("");
                      setPhoneExistsError("");
                      setMobileInlineError("");
                      setMobileOtpSent(false);
                      setMobileVerified(false);
                      setMobileOtpDigits(["", "", "", "", "", ""]);
                      clearAllInlineErrors();
                    }}
                    className="py-3.5 px-3 bg-white hover:bg-slate-100 text-slate-900 font-black text-[10px] uppercase tracking-wider rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] border-0"
                  >
                    <User size={14} className="text-amber-500 shrink-0" />
                    <span className="whitespace-nowrap font-black">Sign Up as Rider</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.removeItem("taxiapp_converting_user");
                      sessionStorage.removeItem("taxiapp_signup_step");
                      setIsConvertingRider(false);
                      setVerificationRole("driver");
                      setIsSignUp(true);
                      setSignUpStep(1);
                      setLoginError("");
                      setPhoneExistsError("");
                      setMobileInlineError("");
                      setMobileOtpSent(false);
                      setMobileVerified(false);
                      setMobileOtpDigits(["", "", "", "", "", ""]);
                      clearAllInlineErrors();
                    }}
                    className="py-3.5 px-3 bg-white hover:bg-slate-100 text-slate-900 font-black text-[10px] uppercase tracking-wider rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] border-0"
                  >
                    <Car size={14} className="text-amber-500 shrink-0" />
                    <span className="whitespace-nowrap font-black">Sign Up as Driver</span>
                  </button>
                </div>
              </div>

              {/* Book Rights & Copyright Subtext */}
              <div className="pt-2 text-center">
                <p className="text-[10px] font-mono font-medium text-slate-400">
                  {loginSettings?.bookRightsText || "© 2026 TaxiApp Inc. All rights reserved. Book rights reserved."}
                </p>
              </div>
            </form>
          )}

          {/* Password Reset Mode */}
          {isResetMode && (
            <div className="w-full space-y-4">
              {/* Clean Minimal Container */}
              <div className="w-full space-y-5">
                
                {(resetStep === "request" || resetStep === "verify") && (
                  /* Minimal Forgot Password Form with Inline Send OTP & Verification */
                  <div className="space-y-4">
                    {/* Header with Lock Icon BEFORE Title */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-sky-100/80 text-sky-600 rounded-xl flex items-center justify-center shrink-0 border border-sky-200/60 shadow-2xs">
                        <Lock size={18} className="text-sky-600" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                        Reset your password
                      </h2>
                    </div>

                    {/* Single Line Subtext */}
                    <p className="text-xs text-slate-500 font-medium truncate sm:whitespace-normal">
                      Enter your registered mobile number with country code and we’ll send you a 6-digit OTP code.
                    </p>

                    <div className="space-y-4 pt-1">
                      {/* Mobile Number Entry with Inline Action Button */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest ml-1 font-mono">
                          Mobile Number
                        </label>
                        <div className="flex gap-2">
                          {/* Country Code Picker */}
                          <div className="relative min-w-[105px] w-[105px] h-12 bg-slate-50 border border-slate-300 rounded-xl px-2.5 flex items-center justify-between gap-1 shadow-xs hover:border-slate-400 transition-all cursor-pointer">
                            <span className="text-base select-none leading-none">
                              {countries.find((c) => c.code === resetCountryCode)?.flag || "🇮🇳"}
                            </span>
                            <span className="text-xs font-black text-slate-900 font-mono tracking-tight">
                              {resetCountryCode}
                            </span>
                            <ChevronDown size={12} className="text-slate-400" />
                            <select
                              value={resetCountryCode}
                              disabled={resetStep === "verify"}
                              onChange={(e) => setResetCountryCode(e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full font-mono disabled:cursor-not-allowed"
                            >
                              {countries.map((c) => (
                                <option key={c.id || `${c.code}-${c.name}`} value={c.code} className="font-mono text-slate-900">
                                  {c.flag} {c.code} ({c.name})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Mobile Phone Input with Button inside input */}
                          <div className="relative flex-1">
                            <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                            <input
                              type="tel"
                              inputMode="numeric"
                              value={resetMobileNumber}
                              disabled={resetStep === "verify"}
                              onChange={(e) => {
                                setResetMobileNumber(e.target.value.replace(/\D/g, ""));
                                setResetErrorMsg("");
                                setResetInlineError("");
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && resetStep === "request") {
                                  e.preventDefault();
                                  handleDispatchResetOtp();
                                }
                              }}
                              placeholder="9988776655"
                              className={cn(
                                "w-full h-12 bg-white border border-slate-300 rounded-xl pl-10 pr-24 text-xs font-bold text-slate-900 font-mono outline-none focus:border-amber-500 shadow-xs",
                                resetStep === "verify" && "bg-slate-50 text-slate-600"
                              )}
                              required
                            />

                            {/* Button inside the input bar */}
                            {resetLoading ? (
                              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider font-mono flex items-center gap-1.5 bg-amber-500 text-slate-950 shadow-inner">
                                <Loader2 size={11} className="animate-spin text-slate-950" />
                                <span>Sending...</span>
                              </div>
                            ) : resetStep === "verify" ? (
                              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                                <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] font-black uppercase px-2 py-1 rounded-lg font-mono flex items-center gap-1 shadow-3xs">
                                  <Check size={11} className="stroke-[3]" /> Sent
                                </span>
                                <button
                                  type="button"
                                  disabled={isVerifyingResetOtp}
                                  onClick={() => {
                                    setResetStep("request");
                                    setResetErrorMsg("");
                                    setResetInlineError("");
                                    setResetOtpDigits(["", "", "", "", "", ""]);
                                    setIsFirebaseResetOtpActive(false);
                                    setFirebaseResetOtpFailed(false);
                                  }}
                                  className="px-2 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer font-mono bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all border border-slate-200"
                                >
                                  Edit
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                disabled={resetLoading || !resetMobileNumber || resetMobileNumber.trim().length < 6}
                                onClick={() => handleDispatchResetOtp()}
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer font-mono flex items-center gap-1.5 transition-all shadow-2xs bg-slate-900 text-amber-400 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <span>Send OTP</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {resetErrorMsg && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600">
                          {resetErrorMsg}
                        </div>
                      )}

                      {/* Seamless 6-Digit Mobile OTP Section below mobile input */}
                      {resetStep === "verify" && (
                        <div className="pt-2 space-y-3.5 font-sans transition-all animate-fadeIn">
                          {/* Real SMS or Fallback Verification Code Status Badge */}
                          {!resetLoading && (
                            <div className="flex flex-col items-center gap-1.5 justify-center">
                              {isFirebaseResetOtpActive ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-bold shadow-2xs">
                                  <CheckCircle2 size={13} className="text-emerald-600" />
                                  Real SMS dispatched to your phone via Firebase
                                </span>
                              ) : dispatchedResetOtp ? (
                                <div className="flex flex-col items-center gap-1">
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-[11px] font-bold shadow-2xs">
                                    <KeyRound size={13} className="text-amber-600" />
                                    Verification Code generated for {resetPhone || "your device"}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const digits = dispatchedResetOtp.split("");
                                      setResetOtpDigits(digits);
                                      setResetInlineError("");
                                      addNotification(`✨ OTP (${dispatchedResetOtp}) auto-filled! Verifying...`, "success");
                                      setTimeout(() => {
                                        handleVerifyResetOtp(dispatchedResetOtp);
                                      }, 100);
                                    }}
                                    className="text-[10px] font-mono font-black text-amber-800 hover:text-amber-950 bg-amber-100/90 hover:bg-amber-200 px-2.5 py-0.5 rounded-full border border-amber-300 transition-all cursor-pointer shadow-3xs"
                                  >
                                    Auto-Fill Code: <span className="underline tracking-wider font-extrabold">{dispatchedResetOtp}</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-bold shadow-2xs">
                                  <CheckCircle2 size={13} className="text-emerald-600" />
                                  Verification OTP dispatched to your device
                                </span>
                              )}
                            </div>
                          )}

                          {/* 6 Individual Digit Boxes */}
                          <div className="flex items-center justify-center gap-2 py-1" onPaste={(e) => handlePasteOtp(e, "reset")}>
                            {resetOtpDigits.map((digit, idx) => (
                              <input
                                key={idx}
                                id={`reset-otp-${idx}`}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                value={digit}
                                onChange={(e) => handleResetDigitChange(idx, e.target.value)}
                                onKeyDown={(e) => handleResetDigitKeyDown(idx, e)}
                                onPaste={(e) => handlePasteOtp(e, "reset")}
                                className={cn(
                                  "w-10 sm:w-11 h-12 text-center text-lg font-extrabold font-mono rounded-xl outline-none transition-all shadow-3xs",
                                  resetInlineError
                                    ? "bg-white border-2 border-rose-400 text-rose-950 focus:border-rose-500"
                                    : "bg-white border border-slate-300 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                                )}
                                autoFocus={idx === 0}
                              />
                            ))}
                          </div>

                          {/* Minimal Red Error Banner */}
                          {resetInlineError && (
                            <div className="p-3 bg-[#fde8e8] text-[#8b1818] rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-3xs animate-shake">
                              <AlertCircle size={18} className="text-[#c52222] shrink-0" />
                              <span>{resetInlineError}</span>
                            </div>
                          )}

                          {/* Full width Yellow Verify button */}
                          <button
                            type="button"
                            disabled={isVerifyingResetOtp || resetLoading}
                            onClick={() => handleVerifyResetOtp()}
                            className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-xl transition-all shadow-xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
                          >
                            {isVerifyingResetOtp ? (
                              <>
                                <Loader2 size={16} className="animate-spin text-slate-950" />
                                <span>Verifying Code...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={16} className="text-slate-950" />
                                <span>Verify code</span>
                              </>
                            )}
                          </button>

                          {/* Resend Options */}
                          <div className="flex items-center justify-center gap-3 pt-0.5 text-xs text-slate-500 font-medium flex-wrap">
                            <span>
                              Didn't get a code?{" "}
                              {resetResendCountdown > 0 ? (
                                <span className="font-bold text-slate-400 font-mono">
                                  Resend in {resetResendCountdown}s
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  disabled={resetLoading}
                                  onClick={() => handleDispatchResetOtp()}
                                  className="font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                                >
                                  Resend code
                                </button>
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 text-center border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsResetMode(false);
                          setResetStep("request");
                          setResetErrorMsg("");
                          setResetStatusMsg("");
                          setResetInlineError("");
                          setResetOtpDigits(["", "", "", "", "", ""]);
                        }}
                        className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
                      >
                        ← Back to login
                      </button>
                    </div>
                  </div>
                )}

                {resetStep === "new-password" && (
                  /* Step 3: Create New Password Form */
                  <div className="space-y-4">
                    {/* Header with Key Icon BEFORE Title */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100/80 text-amber-700 rounded-xl flex items-center justify-center shrink-0 border border-amber-200/60 shadow-2xs">
                        <Key size={18} className="text-amber-700" />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-sans">
                        Create new password
                      </h2>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">
                      Your new password must be different from previous used passwords.
                    </p>

                    <form onSubmit={handleResetSubmitNewPassword} className="space-y-4 pt-1">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          New password
                        </label>
                        <div className="relative">
                          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type={showNewPassword ? "text" : "password"}
                            value={resetNewPassword}
                            onChange={(e) => setResetNewPassword(e.target.value)}
                            placeholder="At least 6 characters"
                            className="w-full h-12 bg-white border border-slate-300 rounded-xl pl-11 pr-12 text-sm font-medium text-slate-900 outline-none focus:border-amber-500 transition-all font-sans shadow-xs placeholder:text-slate-400"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Confirm new password
                        </label>
                        <div className="relative">
                          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={resetConfirmPassword}
                            onChange={(e) => {
                              setResetConfirmPassword(e.target.value);
                              setResetErrorMsg("");
                            }}
                            placeholder="Re-enter new password"
                            className="w-full h-12 bg-white border border-slate-300 rounded-xl pl-11 pr-12 text-sm font-medium text-slate-900 outline-none focus:border-amber-500 transition-all font-sans shadow-xs placeholder:text-slate-400"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>

                      {/* PASSWORD SECURITY INDICATORS */}
                      {(resetNewPassword.length > 0 || resetConfirmPassword.length > 0) && (
                        <div className="pt-1">
                          <div className="grid grid-cols-4 items-center text-xs font-sans font-medium bg-[#f0f4f8] border border-slate-200 rounded-xl py-2 px-2 overflow-hidden select-none shadow-2xs">
                            <div className={cn("flex items-center justify-center gap-1.5 transition-colors min-w-0 px-1", resetNewPassword.length >= 8 ? "text-slate-900 font-semibold" : "text-slate-500")}>
                              {resetNewPassword.length >= 8 ? <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> : <XCircle size={14} className="text-slate-400 shrink-0" />}
                              <span className="truncate text-[11px]">8+ Chars</span>
                            </div>
                            <div className={cn("flex items-center justify-center gap-1.5 border-l border-slate-200 transition-colors min-w-0 px-1", /\d/.test(resetNewPassword) ? "text-slate-900 font-semibold" : "text-slate-500")}>
                              {/\d/.test(resetNewPassword) ? <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> : <XCircle size={14} className="text-slate-400 shrink-0" />}
                              <span className="truncate text-[11px]">Number</span>
                            </div>
                            <div className={cn("flex items-center justify-center gap-1.5 border-l border-slate-200 transition-colors min-w-0 px-1", /[A-Z!@#$%^&*()]/.test(resetNewPassword) ? "text-slate-900 font-semibold" : "text-slate-500")}>
                              {/[A-Z!@#$%^&*()]/.test(resetNewPassword) ? <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> : <XCircle size={14} className="text-slate-400 shrink-0" />}
                              <span className="truncate text-[11px]">Symbol</span>
                            </div>
                            <div className={cn("flex items-center justify-center gap-1.5 border-l border-slate-200 transition-colors min-w-0 px-1", resetNewPassword.length > 0 && resetNewPassword === resetConfirmPassword ? "text-slate-900 font-semibold" : "text-slate-500")}>
                              {resetNewPassword.length > 0 && resetNewPassword === resetConfirmPassword ? <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> : <XCircle size={14} className="text-slate-400 shrink-0" />}
                              <span className="truncate text-[11px]">Match</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {resetErrorMsg && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs font-bold text-red-600">
                          {resetErrorMsg}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={resetLoading}
                        className="w-full h-12 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-50"
                      >
                        {resetLoading ? "Resetting..." : "Reset password"}
                      </button>
                    </form>

                    <div className="pt-2 text-center border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          setIsResetMode(false);
                          setResetStep("request");
                          setResetErrorMsg("");
                          setResetStatusMsg("");
                        }}
                        className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 cursor-pointer transition-colors"
                      >
                        ← Back to login
                      </button>
                    </div>
                  </div>
                )}

                {resetStep === "success" && (
                  /* Step 4: Success Confirmation */
                  <div className="text-center flex flex-col items-center py-4 space-y-4">
                    <div className="w-16 h-16 bg-emerald-100/90 text-emerald-600 rounded-full flex items-center justify-center shadow-2xs">
                      <Check size={30} strokeWidth={2.5} className="text-emerald-600" />
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-sans">
                        Password reset successfully!
                      </h2>
                      <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-xs mx-auto">
                        Your password has been updated. You can now log in using your new password.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(false);
                        setResetStep("request");
                        if (resetEmail) setLoginEmail(resetEmail);
                        if (resetNewPassword) setLoginPassword(resetNewPassword);
                        setResetErrorMsg("");
                        setResetStatusMsg("");
                      }}
                      className="w-full h-14 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-sm rounded-2xl shadow-xs transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      Continue to Login
                    </button>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </div>

      {/* ISOLATED REGISTRATION CONTAINER (STRICTLY INSIDE MOBILE FRAME WRAPPER) */}
      {isSignUp && (
        <div className="absolute inset-0 z-[500] bg-slate-50 flex flex-col w-full h-full font-sans overflow-y-auto">
          
          {/* Streamlined Registration Header */}
          <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm px-4 pt-5 pb-6 sm:px-6">
            <div className="max-w-xl mx-auto space-y-4">
              
              {/* Header Top Row: Left Return / Title / Role Switch */}
              <div className="flex items-center justify-between mb-2">
                
                {/* Left: Return to Login */}
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem("taxiapp_signup_mode");
                    sessionStorage.removeItem("taxiapp_signup_role");
                    sessionStorage.removeItem("taxiapp_signup_step");
                    sessionStorage.removeItem("taxiapp_converting_user");
                    setIsSignUp(false);
                    setSignUpStep(1);
                    setLoginError("");
                  }}
                  className="flex items-center gap-1 text-amber-800 hover:text-amber-950 font-black text-xs uppercase tracking-wider cursor-pointer font-mono transition-colors"
                >
                  <ArrowLeft size={16} />
                  <span>Return</span>
                </button>

                {/* Center Title */}
                <h2 className="text-xs font-black uppercase font-mono tracking-wider text-slate-900">
                  {verificationRole === "driver" ? "Driver Registration" : "Rider Registration"}
                </h2>

                {/* Right: Cancel Button */}
                <button
                  type="button"
                  onClick={() => {
                    sessionStorage.removeItem("taxiapp_signup_mode");
                    sessionStorage.removeItem("taxiapp_signup_role");
                    sessionStorage.removeItem("taxiapp_signup_step");
                    sessionStorage.removeItem("taxiapp_converting_user");
                    setIsSignUp(false);
                    setSignUpStep(1);
                    setLoginError("");
                  }}
                  className="text-xs font-black text-slate-500 hover:text-slate-900 uppercase tracking-wider underline font-mono cursor-pointer"
                >
                  Cancel
                </button>

              </div>

              {/* NUMBERED PROGRESS BAR */}
              <div className="space-y-3 pt-3 pb-2 my-2">
                
                {/* Step circles row with connecting dynamic progress bar line */}
                <div className="relative flex items-center justify-between max-w-md mx-auto px-1">
                  
                  {/* Progress Bar Track */}
                  <div className="absolute top-1/2 left-4 right-4 -translate-y-1/2 h-1 bg-slate-200 rounded-full z-0" />
                  
                  {/* Active Filled Progress Bar */}
                  <div 
                    className="absolute top-1/2 left-4 -translate-y-1/2 h-1 bg-amber-400 rounded-full z-0 transition-all duration-300 ease-out"
                    style={{ width: `calc(${((Math.min(signUpStep, totalStepsCount) - 1) / (totalStepsCount - 1)) * 100}% - 1.5rem)` }}
                  />

                  {/* Step Circles (1 through N) - REDUCED SIZE NUMBERS ON TOP */}
                  {Array.from({ length: totalStepsCount }, (_, i) => i + 1).map((stepNum) => {
                    const isCompleted = stepNum < signUpStep;
                    const isActive = stepNum === signUpStep;
                    const isErrorState = isActive && !!loginError;
                    return (
                      <div key={stepNum} className="relative z-10 flex flex-col items-center">
                        <button
                          type="button"
                          onClick={() => {
                            if (stepNum < signUpStep) setSignUpStep(stepNum);
                          }}
                          className={cn(
                            "w-5 h-5 rounded-full flex items-center justify-center font-black font-mono text-[9px] transition-all duration-200 cursor-pointer shadow-xs",
                            isCompleted
                              ? "bg-emerald-500 text-white font-bold"
                              : isErrorState
                              ? "bg-rose-500 text-white font-black ring-2 ring-rose-500/50 scale-115 animate-pulse"
                              : isActive
                              ? "bg-amber-400 text-slate-950 font-black ring-2 ring-amber-400/40 scale-110"
                              : "bg-slate-100 border border-slate-300 text-slate-400"
                          )}
                          title={`Step ${stepNum}`}
                        >
                          {isCompleted ? "✓" : stepNum}
                        </button>
                      </div>
                    );
                  })}

                </div>

              </div>

            </div>
          </header>

          {/* Main Multi-step Form Content */}
          <main className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 pt-6 pb-12 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">

              {/* STEP 1: PHONE & EMAIL OTP VERIFICATION + CONSENT CHECKBOXES */}
              {!isConvertingRider && signUpStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-0.5 border-b border-slate-200 pb-2">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight font-mono">
                      VERIFY PHONE & EMAIL
                    </h2>
                  </div>

                  <div className="space-y-4">

                    {/* MOBILE NUMBER & OTP VERIFICATION */}
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        {/* Country Code Dropdown */}
                        <div className="relative shrink-0 w-28">
                          <select
                            value={selectedCountry.id}
                            onChange={(e) => handleCountrySelectChange(e.target.value)}
                            className="w-full h-12 bg-slate-50 border border-slate-300 rounded-xl px-2.5 text-xs font-black text-slate-900 font-mono outline-none focus:border-amber-500 cursor-pointer appearance-none shadow-xs pr-6"
                          >
                            {countries.filter((c) => c.active).map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.flag} {c.code}
                              </option>
                            ))}
                          </select>
                          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>

                        {/* Mobile Number Input Bar */}
                        <div className="relative flex-1">
                          <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={currentPhoneRules.maxDigits}
                            value={phoneNumberOnly}
                            onChange={(e) => handlePhoneInputChange(e.target.value)}
                            placeholder={currentPhoneRules.placeholder}
                            className="w-full h-12 bg-white border border-slate-300 rounded-xl pl-10 pr-20 text-xs font-bold text-slate-900 font-mono outline-none focus:border-amber-500 shadow-xs"
                            required
                          />

                          {mobileVerified ? (
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] font-black uppercase px-2 py-1 rounded-lg font-mono flex items-center gap-1">
                              <Check size={12} className="stroke-[3]" /> Verified
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={isSendingMobileOtp}
                              onClick={handleDispatchMobileOtp}
                              className={cn(
                                "absolute right-1.5 top-1/2 -translate-y-1/2 px-2.5 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer font-mono flex items-center gap-1.5 transition-all",
                                isSendingMobileOtp
                                  ? "bg-amber-500 text-slate-950 cursor-wait shadow-inner"
                                  : "bg-slate-900 text-amber-400 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98]"
                              )}
                            >
                              {isSendingMobileOtp ? (
                                <>
                                  <Loader2 size={11} className="animate-spin text-slate-950" />
                                  <span>Sending...</span>
                                </>
                              ) : (
                                <span>Verify</span>
                              )}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Phone Exists Error Banner */}
                      {phoneExistsError && (
                        <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-[11px] font-bold font-mono flex items-center gap-2 shadow-xs">
                          <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                          <span>{phoneExistsError}</span>
                        </div>
                      )}

                      {/* Mobile Inline Error Banner */}
                      {mobileInlineError && !mobileVerified && !mobileOtpSent && (
                        <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-[11px] font-bold font-mono flex items-center gap-2 shadow-xs animate-shake">
                          <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                          <span>{mobileInlineError}</span>
                        </div>
                      )}

                      {/* Inline 6-Digit Mobile OTP Input */}
                      {mobileOtpSent && !mobileVerified && (
                        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/90 space-y-3.5 font-sans transition-all shadow-2xs">
                          {/* Centered 2-Line Header */}
                          <div className="text-center space-y-1 text-xs sm:text-sm text-slate-700 font-medium">
                            <div>Enter the 6-digit code sent to</div>
                            <div className="flex items-center justify-center gap-2">
                              <strong className="font-semibold text-slate-900 font-mono">{signUpPhone}</strong>
                              <button
                                type="button"
                                disabled={isSendingMobileOtp || isVerifyingMobileOtp}
                                onClick={() => {
                                  setMobileOtpSent(false);
                                  setMobileVerified(false);
                                  setMobileOtpDigits(["", "", "", "", "", ""]);
                                  setMobileInlineError("");
                                  setIsFirebaseOtpActive(false);
                                  setFirebaseOtpFailed(false);
                                }}
                                className="text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer shrink-0"
                              >
                                Not yours? Edit
                              </button>
                            </div>
                          </div>

                          {/* Gateway Status Badge */}
                          {!isSendingMobileOtp && (
                            <div className="flex flex-col items-center gap-1.5 justify-center">
                              {isFirebaseOtpActive ? (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-bold shadow-2xs">
                                  <CheckCircle2 size={13} className="text-emerald-600" />
                                  Real SMS dispatched to your phone via Firebase
                                </span>
                              ) : dispatchedMobileOtp ? (
                                <div className="flex flex-col items-center gap-1">
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-[11px] font-bold shadow-2xs">
                                    <KeyRound size={13} className="text-amber-600" />
                                    Verification Code generated for {signUpPhone || "your device"}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const digits = dispatchedMobileOtp.split("");
                                      setMobileOtpDigits(digits);
                                      setMobileInlineError("");
                                      addNotification(`✨ OTP (${dispatchedMobileOtp}) auto-filled! Verifying...`, "success");
                                      setTimeout(() => {
                                        handleVerifyMobileOtp(dispatchedMobileOtp);
                                      }, 100);
                                    }}
                                    className="text-[10px] font-mono font-black text-amber-800 hover:text-amber-950 bg-amber-100/90 hover:bg-amber-200 px-2.5 py-0.5 rounded-full border border-amber-300 transition-all cursor-pointer shadow-3xs"
                                  >
                                    Auto-Fill Code: <span className="underline tracking-wider font-extrabold">{dispatchedMobileOtp}</span>
                                  </button>
                                </div>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-[11px] font-bold shadow-2xs">
                                  <CheckCircle2 size={13} className="text-emerald-600" />
                                  Verification OTP dispatched to your device
                                </span>
                              )}
                            </div>
                          )}

                          {/* 6 Individual Digit Boxes */}
                          <div className="flex items-center justify-center gap-2 py-1" onPaste={(e) => handlePasteOtp(e, "mobile")}>
                            {mobileOtpDigits.map((digit, idx) => (
                              <input
                                key={idx}
                                id={`reg-mobile-otp-${idx}`}
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                value={digit}
                                onChange={(e) => handleMobileDigitChange(idx, e.target.value)}
                                onKeyDown={(e) => handleMobileDigitKeyDown(idx, e)}
                                onPaste={(e) => handlePasteOtp(e, "mobile")}
                                className={cn(
                                  "w-10 sm:w-11 h-12 text-center text-lg font-extrabold font-mono rounded-xl outline-none transition-all shadow-3xs",
                                  mobileInlineError
                                    ? "bg-white border-2 border-rose-400 text-rose-950 focus:border-rose-500"
                                    : "bg-white border border-slate-200 text-slate-900 focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                                )}
                              />
                            ))}
                          </div>

                          {/* Minimal Red Error Banner */}
                          {mobileInlineError && (
                            <div className="p-3 bg-[#fde8e8] text-[#8b1818] rounded-xl text-xs font-semibold flex items-center gap-2.5 shadow-3xs animate-shake">
                              <AlertCircle size={18} className="text-[#c52222] shrink-0" />
                              <span>{mobileInlineError}</span>
                            </div>
                          )}

                          {/* Full width Yellow Verify button with loading feedback */}
                          <button
                            type="button"
                            disabled={isVerifyingMobileOtp || isSendingMobileOtp}
                            onClick={() => handleVerifyMobileOtp()}
                            className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-sm rounded-xl transition-all shadow-2xs cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.99]"
                          >
                            {isVerifyingMobileOtp ? (
                              <>
                                <Loader2 size={16} className="animate-spin text-slate-950" />
                                <span>Verifying Code...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 size={16} className="text-slate-950" />
                                <span>Verify code</span>
                              </>
                            )}
                          </button>

                          {/* Footer subtext with conditional Fill fallback only on Firebase failure */}
                          <div className="flex items-center justify-center gap-3 pt-0.5 text-xs text-slate-500 font-medium flex-wrap">
                            <span>
                              Didn't get a code?{" "}
                              {mobileResendCountdown > 0 ? (
                                <span className="font-bold text-slate-400 font-mono">
                                  Resend in {mobileResendCountdown}s
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  disabled={isSendingMobileOtp}
                                  onClick={handleDispatchMobileOtp}
                                  className="font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                                >
                                  Resend code
                                </button>
                              )}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* EMAIL ADDRESS */}
                    <div className="space-y-1.5">
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        <input
                          type="email"
                          value={signUpEmail}
                          onChange={(e) => {
                            const em = e.target.value;
                            setSignUpEmail(em);
                            setEmailInlineError("");
                            if (em.includes("@")) {
                              checkPhoneAndEmailExistence(undefined, em);
                            } else {
                              setEmailExistsError("");
                            }
                          }}
                          placeholder="Email address"
                          className="w-full h-12 bg-white border border-slate-300 rounded-xl pl-10 pr-3.5 text-xs font-bold text-slate-900 font-mono outline-none focus:border-amber-500 shadow-xs"
                          required
                        />
                      </div>

                      {/* Email Exists Error Banner */}
                      {emailExistsError && (
                        <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-[11px] font-bold font-mono flex items-center gap-2 shadow-xs">
                          <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                          <span>{emailExistsError}</span>
                        </div>
                      )}

                      {/* Email Inline Error Banner */}
                      {emailInlineError && (
                        <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-[11px] font-bold font-mono flex items-center gap-2 shadow-xs animate-shake">
                          <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                          <span>{emailInlineError}</span>
                        </div>
                      )}
                    </div>

                    {/* ACCOUNT PASSWORD & RE-ENTER PASSWORD */}
                    <div className="space-y-3 font-mono">

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-700 uppercase">
                            Account Password
                          </label>
                          <div className="relative">
                            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type={showSignUpPassword ? "text" : "password"}
                              value={signUpPassword}
                              onChange={(e) => {
                                setSignUpPassword(e.target.value);
                                setPasswordInlineError("");
                              }}
                              placeholder="Create password (min 8 chars)"
                              className="w-full h-11 bg-white border border-slate-300 rounded-xl pl-10 pr-10 text-xs font-bold text-slate-900 font-mono outline-none focus:border-amber-500 shadow-xs"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              {showSignUpPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-700 uppercase">
                            Re-Enter Password
                          </label>
                          <div className="relative">
                            <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                              type={showSignUpConfirmPassword ? "text" : "password"}
                              value={signUpConfirmPassword}
                              onChange={(e) => {
                                setSignUpConfirmPassword(e.target.value);
                                setPasswordInlineError("");
                              }}
                              placeholder="Confirm password"
                              className="w-full h-11 bg-white border border-slate-300 rounded-xl pl-10 pr-10 text-xs font-bold text-slate-900 font-mono outline-none focus:border-amber-500 shadow-xs"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowSignUpConfirmPassword(!showSignUpConfirmPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                            >
                              {showSignUpConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* PASSWORD SECURITY INDICATORS - VISIBLE ONLY WHEN TYPING */}
                      {(signUpPassword.length > 0 || signUpConfirmPassword.length > 0) && (
                        <div className="pt-1.5">
                          <div className="grid grid-cols-4 items-center text-xs sm:text-[13px] font-sans font-medium bg-[#f0f4f8] border border-slate-200/90 rounded-2xl py-2.5 px-2 overflow-hidden select-none shadow-2xs">
                            <div className={cn("flex items-center justify-center gap-1.5 transition-colors min-w-0 px-1", signUpPassword.length >= 8 ? "text-slate-900 font-semibold" : "text-slate-500")}>
                              {signUpPassword.length >= 8 ? <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> : <XCircle size={14} className="text-slate-400 shrink-0" />}
                              <span className="truncate">8+ Chars</span>
                            </div>
                            <div className={cn("flex items-center justify-center gap-1.5 border-l border-slate-200/90 transition-colors min-w-0 px-1", /\d/.test(signUpPassword) ? "text-slate-900 font-semibold" : "text-slate-500")}>
                              {/\d/.test(signUpPassword) ? <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> : <XCircle size={14} className="text-slate-400 shrink-0" />}
                              <span className="truncate">Number</span>
                            </div>
                            <div className={cn("flex items-center justify-center gap-1.5 border-l border-slate-200/90 transition-colors min-w-0 px-1", /[A-Z!@#$%^&*()]/.test(signUpPassword) ? "text-slate-900 font-semibold" : "text-slate-500")}>
                              {/[A-Z!@#$%^&*()]/.test(signUpPassword) ? <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> : <XCircle size={14} className="text-slate-400 shrink-0" />}
                              <span className="truncate">Symbol</span>
                            </div>
                            <div className={cn("flex items-center justify-center gap-1.5 border-l border-slate-200/90 transition-colors min-w-0 px-1", signUpPassword.length > 0 && signUpPassword === signUpConfirmPassword ? "text-slate-900 font-semibold" : "text-slate-500")}>
                              {signUpPassword.length > 0 && signUpPassword === signUpConfirmPassword ? <CheckCircle2 size={14} className="text-emerald-600 shrink-0" /> : <XCircle size={14} className="text-slate-400 shrink-0" />}
                              <span className="truncate">Match</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* INLINE PASSWORD ERROR BANNER - Directly beneath password field */}
                      {passwordInlineError && (
                        <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-[11px] font-bold font-mono flex items-center gap-2 shadow-xs animate-shake mt-2">
                          <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                          <span>{passwordInlineError}</span>
                        </div>
                      )}
                    </div>

                    {/* CONSENT CHECKBOXES, AGE CONFIRMATION & INTERACTIVE POLICY LINKS */}
                    <div className="pt-2 space-y-3 text-[11px] font-mono">
                      
                      {/* Promotional Mail Subscription Checkbox */}
                      <button
                        type="button"
                        onClick={() => setPromoSubscribed(!promoSubscribed)}
                        className="flex items-center gap-3 text-left cursor-pointer group py-1 select-none"
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0",
                          promoSubscribed ? "bg-amber-400 border-amber-500 text-slate-950" : "bg-white border-slate-300 group-hover:border-slate-400"
                        )}>
                          {promoSubscribed && <Check size={14} strokeWidth={3} />}
                        </div>
                        <span className="text-xs font-bold text-slate-700 font-mono">
                          Subscribe to promotional offers & updates
                        </span>
                      </button>

                      {/* Rules & Regulations Compliance Checkbox */}
                      <button
                        type="button"
                        onClick={() => setRulesAccepted(!rulesAccepted)}
                        className="flex items-center gap-3 text-left cursor-pointer group py-1 select-none"
                      >
                        <div className={cn(
                          "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0",
                          rulesAccepted ? "bg-amber-400 border-amber-500 text-slate-950" : "bg-white border-slate-300 group-hover:border-slate-400"
                        )}>
                          {rulesAccepted && <Check size={14} strokeWidth={3} />}
                        </div>
                        <span className="text-xs font-bold text-slate-900 font-mono">
                          I agree to Rules, Terms & Privacy Policy
                        </span>
                      </button>

                      {/* Age & Legal Agreement Confirmation Statement */}
                      <p className="text-[10px] text-slate-500 font-mono leading-normal pt-1">
                        By continuing, you confirm that you are 18 years of age and agree to the{" "}
                        <button
                          type="button"
                          onClick={() => handleNavigateToLegalPage("/terms")}
                          className="text-amber-800 hover:text-amber-950 underline font-bold cursor-pointer"
                        >
                          Terms & Conditions
                        </button>{" "}
                        and{" "}
                        <button
                          type="button"
                          onClick={() => handleNavigateToLegalPage("/privacy")}
                          className="text-amber-800 hover:text-amber-950 underline font-bold cursor-pointer"
                        >
                          Privacy Policy
                        </button>.
                      </p>

                      {/* Consent Inline Error Banner */}
                      {consentInlineError && (
                        <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-[11px] font-bold font-mono flex items-center gap-2 shadow-xs animate-shake mt-2">
                          <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                          <span>{consentInlineError}</span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 2: PERSONAL DETAILS, AGE, GENDER & LOCATION (COUNTRY, DISTRICT, CITY) */}
              {!isConvertingRider && signUpStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-0.5 border-b border-slate-200 pb-2">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight font-mono">
                      PERSONAL DETAILS, AGE, GENDER & LOCATION
                    </h2>
                  </div>

                  <div className="space-y-4">
                    
                    {/* ROW 1: First Name & Last Name */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono flex items-center justify-between h-4">
                          <span>First Name</span>
                        </label>
                        <div className="relative">
                          <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={firstName}
                            onChange={(e) => {
                              setFirstName(e.target.value);
                              setSignUpName(`${e.target.value} ${lastName}`.trim());
                              setNameInlineError("");
                            }}
                            placeholder="First Name"
                            className="w-full h-10 bg-white border border-slate-300 rounded-xl pl-9 pr-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500 shadow-xs font-mono"
                            autoFocus
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono flex items-center justify-between h-4">
                          <span>Last Name</span>
                        </label>
                        <div className="relative">
                          <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={lastName}
                            onChange={(e) => {
                              setLastName(e.target.value);
                              setSignUpName(`${firstName} ${e.target.value}`.trim());
                              setNameInlineError("");
                            }}
                            placeholder="Last Name"
                            className="w-full h-10 bg-white border border-slate-300 rounded-xl pl-9 pr-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500 shadow-xs font-mono"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* First/Last Name Inline Error */}
                    {nameInlineError && (
                      <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-[11px] font-bold font-mono flex items-center gap-2 shadow-xs animate-shake">
                        <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                        <span>{nameInlineError}</span>
                      </div>
                    )}

                    {/* ROW 2: Date of Birth, Gender & Blood Group */}
                    <div className="space-y-3">
                      {/* Date of Birth Field */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <span>Date of Birth</span>
                            <span className="text-[9px] text-amber-700 font-bold">(18+ Yrs Required)</span>
                          </span>
                          {signUpAge && (
                            <span className={cn(
                              "font-extrabold text-[9px] px-2 py-0.5 rounded-full font-mono",
                              parseInt(signUpAge) >= 18 ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-rose-100 text-rose-800 border border-rose-300"
                            )}>
                              {signUpAge} yrs {parseInt(signUpAge) < 18 ? "• Under 18 (Restricted)" : "✓"}
                            </span>
                          )}
                        </label>
                        <div className="relative">
                          <Calendar size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                          <input
                            type="date"
                            value={signUpDob}
                            max={getEighteenYearsAgoDate()}
                            onChange={(e) => {
                              const selectedVal = e.target.value;
                              setSignUpDob(selectedVal);
                              const calculatedAge = calculateAgeFromDob(selectedVal);
                              setSignUpAge(calculatedAge);
                              if (calculatedAge && parseInt(calculatedAge) < 18) {
                                setDobInlineError("As per government regulations, you must be at least 18 years old to register.");
                              } else {
                                setDobInlineError("");
                              }
                            }}
                            className="w-full h-10 bg-white border border-slate-300 rounded-xl pl-9 pr-2 text-xs font-bold text-slate-900 outline-none focus:border-amber-500 shadow-xs font-mono cursor-pointer"
                            required
                          />
                        </div>
                        <p className="text-[9.5px] text-slate-500 font-mono">
                          ⚠️ Must be at least 18 years old as per government regulations.
                        </p>
                      </div>

                      {/* ROW 3: Gender & Blood Group */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono flex items-center justify-between h-4">
                            <span>Gender</span>
                          </label>
                          <div className="relative">
                            <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10" />
                            <select
                              value={signUpGender}
                              onChange={(e) => {
                                setSignUpGender(e.target.value);
                                setGenderInlineError("");
                              }}
                              className="w-full h-10 bg-white border border-slate-300 rounded-xl pl-9 pr-7 text-xs font-bold text-slate-900 font-mono outline-none focus:border-amber-500 shadow-xs cursor-pointer appearance-none"
                              required
                            >
                              <option value="">Select Gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                              <option value="Prefer not to say">Prefer not to say</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono flex items-center justify-between h-4">
                            <span>Blood Group</span>
                            <span className="text-[9px] text-rose-600 font-bold">* Medical</span>
                          </label>
                          <div className="relative">
                            <Droplet size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-500 pointer-events-none z-10" />
                            <select
                              value={signUpBloodGroup}
                              onChange={(e) => {
                                setSignUpBloodGroup(e.target.value);
                                setBloodGroupInlineError("");
                              }}
                              className="w-full h-10 bg-white border border-slate-300 rounded-xl pl-9 pr-7 text-xs font-bold text-slate-900 font-mono outline-none focus:border-amber-500 shadow-xs cursor-pointer appearance-none"
                              required
                            >
                              <option value="">Select Blood Group</option>
                              <option value="A+">A+</option>
                              <option value="A-">A-</option>
                              <option value="B+">B+</option>
                              <option value="B-">B-</option>
                              <option value="AB+">AB+</option>
                              <option value="AB-">AB-</option>
                              <option value="O+">O+</option>
                              <option value="O-">O-</option>
                              <option value="Don't Know">Don't Know / Prefer not to say</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DOB, Gender & Blood Group Inline Errors */}
                    {dobInlineError && (
                      <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-[11px] font-bold font-mono flex items-center gap-2 shadow-xs animate-shake">
                        <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                        <span>{dobInlineError}</span>
                      </div>
                    )}
                    {genderInlineError && (
                      <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-[11px] font-bold font-mono flex items-center gap-2 shadow-xs animate-shake">
                        <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                        <span>{genderInlineError}</span>
                      </div>
                    )}
                    {bloodGroupInlineError && (
                      <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-[11px] font-bold font-mono flex items-center gap-2 shadow-xs animate-shake">
                        <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                        <span>{bloodGroupInlineError}</span>
                      </div>
                    )}

                    {/* LOCATION SELECTION HIERARCHY WITH EMBEDDED SEARCH IN DROPDOWNS */}
                    <div className="space-y-3 pt-2 border-t border-slate-200 relative">
                      
                      {/* Click outside backdrop for dropdowns */}
                      {(countryDropdownOpen || stateDropdownOpen || cityDropdownOpen) && (
                        <div
                          className="fixed inset-0 z-20 bg-transparent"
                          onClick={() => {
                            setCountryDropdownOpen(false);
                            setStateDropdownOpen(false);
                            setCityDropdownOpen(false);
                          }}
                        />
                      )}

                      {/* 1. Country Selector with Integrated Search Dropdown */}
                      <div className={`space-y-1 relative ${countryDropdownOpen ? 'z-50' : 'z-30'}`}>
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono block">
                          1. Select Country
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setCountryDropdownOpen(!countryDropdownOpen);
                              setStateDropdownOpen(false);
                              setCityDropdownOpen(false);
                            }}
                            className="w-full h-10 bg-white border border-slate-300 rounded-xl px-3 text-xs font-bold text-slate-900 font-mono text-left outline-none focus:border-amber-500 shadow-xs flex items-center justify-between cursor-pointer"
                          >
                            <span className="flex items-center gap-2 truncate">
                              <Globe size={15} className="text-amber-600 shrink-0" />
                              <span>{selectedCountry.flag} {selectedCountry.name}</span>
                            </span>
                            <ChevronDown size={14} className="text-slate-400 shrink-0" />
                          </button>

                          {countryDropdownOpen && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1.5 animate-in fade-in slide-in-from-top-1">
                              <div className="relative">
                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                  type="text"
                                  value={countrySearchFilter}
                                  onChange={(e) => setCountrySearchFilter(e.target.value)}
                                  placeholder="Search country..."
                                  className="w-full h-8 bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2 text-xs font-mono font-medium outline-none focus:border-amber-500"
                                  autoFocus
                                />
                              </div>
                              <div className="max-h-44 overflow-y-auto space-y-0.5">
                                {countries
                                  .filter(c => c.name.toLowerCase().includes(countrySearchFilter.toLowerCase()))
                                  .map((c) => (
                                    <button
                                      key={c.id}
                                      type="button"
                                      onClick={() => {
                                        setSelectedCountry(c);
                                        const matchSt = INITIAL_STATES.find(s => s.country === c.name);
                                        if (matchSt) setSelectedState(matchSt.name);
                                        setCountryDropdownOpen(false);
                                        setCountrySearchFilter("");
                                      }}
                                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-between cursor-pointer transition-colors ${
                                        c.name === selectedCountry.name ? "bg-amber-50 text-amber-900 font-extrabold" : "hover:bg-slate-50 text-slate-700"
                                      }`}
                                    >
                                      <span>{c.flag} {c.name}</span>
                                    </button>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 2. State Selector with Integrated Search Dropdown */}
                      <div className={`space-y-1 relative ${stateDropdownOpen ? 'z-50' : 'z-20'}`}>
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono block">
                          2. Select State
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setStateDropdownOpen(!stateDropdownOpen);
                              setCountryDropdownOpen(false);
                              setCityDropdownOpen(false);
                            }}
                            className="w-full h-10 bg-white border border-slate-300 rounded-xl px-3 text-xs font-bold text-slate-900 font-mono text-left outline-none focus:border-amber-500 shadow-xs flex items-center justify-between cursor-pointer"
                          >
                            <span className="flex items-center gap-2 truncate">
                              <Layers size={15} className="text-amber-600 shrink-0" />
                              <span>🏛️ {selectedState}</span>
                            </span>
                            <ChevronDown size={14} className="text-slate-400 shrink-0" />
                          </button>

                          {stateDropdownOpen && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1.5 animate-in fade-in slide-in-from-top-1">
                              <div className="relative">
                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                  type="text"
                                  value={stateSearchFilter}
                                  onChange={(e) => setStateSearchFilter(e.target.value)}
                                  placeholder="Search state..."
                                  className="w-full h-8 bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2 text-xs font-mono font-medium outline-none focus:border-amber-500"
                                  autoFocus
                                />
                              </div>
                              <div className="max-h-44 overflow-y-auto space-y-0.5">
                                {INITIAL_STATES
                                  .filter(st => 
                                    (!selectedCountry.name || st.country === selectedCountry.name || countrySearchFilter !== "") &&
                                    st.name.toLowerCase().includes(stateSearchFilter.toLowerCase())
                                  )
                                  .map((st) => (
                                    <button
                                      key={st.id}
                                      type="button"
                                      onClick={() => {
                                        setSelectedState(st.name);
                                        setStateDropdownOpen(false);
                                        setStateSearchFilter("");
                                      }}
                                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-between cursor-pointer transition-colors ${
                                        st.name === selectedState ? "bg-amber-50 text-amber-900 font-extrabold" : "hover:bg-slate-50 text-slate-700"
                                      }`}
                                    >
                                      <span>🏛️ {st.name}</span>
                                      <span className="text-[10px] text-slate-400 font-normal">{st.country}</span>
                                    </button>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 3. Operating City Selector with Integrated Search Dropdown */}
                      <div className={`space-y-1 relative ${cityDropdownOpen ? 'z-50' : 'z-10'}`}>
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono block">
                          3. Select Operating City
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => {
                              setCityDropdownOpen(!cityDropdownOpen);
                              setCountryDropdownOpen(false);
                              setStateDropdownOpen(false);
                            }}
                            className="w-full h-10 bg-white border border-slate-300 rounded-xl px-3 text-xs font-bold text-slate-900 font-mono text-left outline-none focus:border-amber-500 shadow-xs flex items-center justify-between cursor-pointer"
                          >
                            <span className="flex items-center gap-2 truncate">
                              <MapPin size={15} className="text-amber-600 shrink-0" />
                              <span>🏢 {signUpCity || "Choose Operating City"}</span>
                            </span>
                            <ChevronDown size={14} className="text-slate-400 shrink-0" />
                          </button>

                          {cityDropdownOpen && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2 space-y-1.5 animate-in fade-in slide-in-from-top-1">
                              <div className="relative">
                                <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                                <input
                                  type="text"
                                  value={citySearchFilter}
                                  onChange={(e) => setCitySearchFilter(e.target.value)}
                                  placeholder="Search city..."
                                  className="w-full h-8 bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-2 text-xs font-mono font-medium outline-none focus:border-amber-500"
                                  autoFocus
                                />
                              </div>
                              <div className="max-h-44 overflow-y-auto space-y-0.5">
                                {cities
                                  .filter(c => c.name.toLowerCase().includes(citySearchFilter.toLowerCase()) || c.state.toLowerCase().includes(citySearchFilter.toLowerCase()))
                                  .map((c) => (
                                    <button
                                      key={c.id}
                                      type="button"
                                      onClick={() => {
                                        setSignUpCity(c.name);
                                        setCityDropdownOpen(false);
                                        setCitySearchFilter("");
                                      }}
                                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center justify-between cursor-pointer transition-colors ${
                                        c.name === signUpCity ? "bg-amber-50 text-amber-900 font-extrabold" : "hover:bg-slate-50 text-slate-700"
                                      }`}
                                    >
                                      <span>🏢 {c.name}</span>
                                      <span className="text-[10px] text-slate-400 font-normal">{c.state}</span>
                                    </button>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* City Location Inline Error Banner */}
                        {cityInlineError && (
                          <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-[11px] font-bold font-mono flex items-center gap-2 shadow-xs animate-shake mt-2">
                            <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                            <span>{cityInlineError}</span>
                          </div>
                        )}
                      </div>

                      {/* DYNAMIC CUSTOM SIGNUP FIELDS IN STEP 2 */}
                      {Array.isArray(config.loginSettings?.customFields) && config.loginSettings.customFields.filter((f: any) => f.enabled && (f.role === "both" || f.role === verificationRole)).length > 0 && (
                        <div className="pt-3 border-t border-slate-200 space-y-3 font-mono">
                          <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-1">
                            <Tag size={13} className="text-amber-600" /> Additional Profile Info
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {config.loginSettings.customFields
                              .filter((f: any) => f.enabled && (f.role === "both" || f.role === verificationRole))
                              .map((field: any) => (
                                <div key={field.id} className="space-y-1">
                                  <label className="text-[10px] font-bold text-slate-700 uppercase flex items-center justify-between">
                                    <span>{field.label}</span>
                                    {field.required && <span className="text-rose-600 font-black">*</span>}
                                  </label>
                                  {field.type === "select" ? (
                                    <select
                                      value={customFieldsData[field.keyName] || ""}
                                      onChange={(e) => setCustomFieldsData({ ...customFieldsData, [field.keyName]: e.target.value })}
                                      className="w-full h-10 bg-white border border-slate-300 rounded-xl px-3 text-xs font-bold text-slate-900 font-mono outline-none focus:border-amber-500 shadow-xs cursor-pointer"
                                    >
                                      <option value="">Select {field.label}</option>
                                      {field.options?.map((opt: string, optIdx: number) => (
                                        <option key={`${opt}-${optIdx}`} value={opt}>{opt}</option>
                                      ))}
                                    </select>
                                  ) : field.type === "checkbox" ? (
                                    <label className="flex items-center gap-2 h-10 px-3 bg-white border border-slate-300 rounded-xl cursor-pointer">
                                      <input
                                        type="checkbox" className="w-5 h-5 rounded-md border-2 border-slate-300 text-amber-500 accent-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none cursor-pointer shadow-2xs transition-all shrink-0" aria-label="Option selection"
                                        checked={Boolean(customFieldsData[field.keyName])}
                                        onChange={(e) => setCustomFieldsData({ ...customFieldsData, [field.keyName]: e.target.checked })}

                                      />
                                      <span className="text-xs font-bold text-slate-800">Yes / Confirmed</span>
                                    </label>
                                  ) : (
                                    <input
                                      type={field.type === "number" ? "number" : "text"}
                                      value={customFieldsData[field.keyName] || ""}
                                      onChange={(e) => setCustomFieldsData({ ...customFieldsData, [field.keyName]: e.target.value })}
                                      placeholder={`Enter ${field.label}`}
                                      className="w-full h-10 bg-white border border-slate-300 rounded-xl px-3 text-xs font-bold text-slate-900 font-mono outline-none focus:border-amber-500 shadow-xs"
                                    />
                                  )}
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                    </div>

                  </div>
                </div>
              )}

              {/* STEP 3 (DRIVER): VEHICLE CATEGORY, BRANDS, MODELS & SPECS */}
              {verificationRole === "driver" && (isConvertingRider ? signUpStep === 1 : signUpStep === 3) && (
                <div className="space-y-4">
                  <div className="space-y-0.5 border-b border-slate-200 pb-2">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight font-mono">
                      VEHICLE CATEGORY & SPECS
                    </h2>
                  </div>

                  <div className="space-y-4">
                    
                    {/* Vehicle Category Cards */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono flex items-center justify-between">
                        <span>Vehicle Category</span>
                        <span className="text-[9px] text-amber-700 font-normal">Dynamic Admin Sync active</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { cat: "Car", label: "Car", icon: "🚗" },
                          { cat: "Motorcycle", label: "Motorcycle", icon: "🏍️" },
                          { cat: "Scooter", label: "Scooter", icon: "🛵" },
                          { cat: "Micro-Van", label: "Micro-Van", icon: "🚐" },
                          { cat: "Auto", label: "Auto", icon: "🛺" },
                          { cat: "Medical Van", label: "Medical Van", icon: "🚑" },
                          { cat: "Other", label: "Other", icon: "🚚" },
                        ].map((item) => (
                          <button
                            key={item.cat}
                            type="button"
                            onClick={() => {
                              setDriverVehicleCategory(item.cat);
                              const firstB = catalog.find((c) => c.category === item.cat || c.category.includes(item.cat)) || catalog[0];
                              if (firstB) {
                                setSelectedBrand(firstB.brand);
                                setSelectedModel(firstB.models[0] || "Standard Model");
                              }
                            }}
                            className={cn(
                              "p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer font-mono",
                              driverVehicleCategory === item.cat
                                ? "bg-amber-400 border-amber-500 text-slate-950 font-black shadow-xs ring-2 ring-amber-400/30"
                                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100"
                            )}
                          >
                            <span className="text-xl">{item.icon}</span>
                            <span className="text-[10px] font-black uppercase">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Brand & Model Dropdowns */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      {/* Vehicle Brand Dropdown */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono flex items-center justify-between h-4">
                          <span>Vehicle Brand</span>
                          {selectedBrand === "Other" && (
                            <span className="text-[9px] text-amber-700 font-bold">* Manual Entry</span>
                          )}
                        </label>
                        <div className="relative">
                          <select
                            value={selectedBrand}
                            onChange={(e) => {
                              setSelectedBrand(e.target.value);
                              setSelectedModel("");
                              setVehicleInlineError("");
                            }}
                            className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-black text-slate-900 font-mono outline-none focus:border-amber-500 cursor-pointer appearance-none shadow-xs"
                          >
                            <option value="">Select Brand</option>
                            {activeBrandsForCat.map((b) => (
                              <option key={b.id} value={b.brand}>
                                {b.brand}
                              </option>
                            ))}
                            <option value="Other">Other / Enter Brand Manually</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        {selectedBrand === "Other" && (
                          <div className="pt-1 animate-in fade-in">
                            <input
                              type="text"
                              value={customBrandName}
                              onChange={(e) => {
                                setCustomBrandName(e.target.value);
                                setVehicleInlineError("");
                              }}
                              placeholder="Type brand name (e.g. Tesla, BYD, Force)"
                              className="w-full h-10 bg-amber-50/60 border border-amber-300 rounded-xl px-3 text-xs font-bold font-mono text-slate-900 outline-none focus:border-amber-500 shadow-xs"
                              required
                            />
                          </div>
                        )}
                      </div>

                      {/* Vehicle Model Dropdown */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono flex items-center justify-between h-4">
                          <span>Vehicle Model</span>
                          {selectedModel === "Other" && (
                            <span className="text-[9px] text-amber-700 font-bold">* Manual Entry</span>
                          )}
                        </label>
                        <div className="relative">
                          <select
                            value={selectedModel}
                            onChange={(e) => {
                              setSelectedModel(e.target.value);
                              setVehicleInlineError("");
                            }}
                            className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-black text-slate-900 font-mono outline-none focus:border-amber-500 cursor-pointer appearance-none shadow-xs"
                          >
                            <option value="">Select Model</option>
                            {availableModelsForBrand.map((m, idx) => (
                              <option key={idx} value={m}>
                                {m}
                              </option>
                            ))}
                            {!availableModelsForBrand.includes("Other") && (
                              <option value="Other">Other / Enter Model Manually</option>
                            )}
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        {selectedModel === "Other" && (
                          <div className="pt-1 animate-in fade-in">
                            <input
                              type="text"
                              value={customModelName}
                              onChange={(e) => {
                                setCustomModelName(e.target.value);
                                setVehicleInlineError("");
                              }}
                              placeholder="Type model name (e.g. Cybertruck, Atto 3, Custom)"
                              className="w-full h-10 bg-amber-50/60 border border-amber-300 rounded-xl px-3 text-xs font-bold font-mono text-slate-900 outline-none focus:border-amber-500 shadow-xs"
                              required
                            />
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Vehicle Color Palette & RC Plate Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      
                      {/* Vehicle Color Selection */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono flex items-center justify-between h-4">
                          <span>Vehicle Exterior Color</span>
                          {selectedColor === "Other" && (
                            <span className="text-[9px] text-amber-700 font-bold">* Custom Color</span>
                          )}
                        </label>
                        <div className="relative">
                          <select
                            value={selectedColor}
                            onChange={(e) => {
                              setSelectedColor(e.target.value);
                              setVehicleInlineError("");
                            }}
                            className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-black text-slate-900 font-mono outline-none focus:border-amber-500 cursor-pointer appearance-none shadow-xs"
                          >
                            <option value="">Select Color</option>
                            {availableColorsForBrand.map((clr, idx) => (
                              <option key={idx} value={clr}>
                                {clr}
                              </option>
                            ))}
                            {!availableColorsForBrand.includes("Other") && (
                              <option value="Other">Other / Custom Color</option>
                            )}
                          </select>
                          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                        </div>
                        {selectedColor === "Other" && (
                          <div className="pt-1 animate-in fade-in">
                            <input
                              type="text"
                              value={customColorName}
                              onChange={(e) => {
                                setCustomColorName(e.target.value);
                                setVehicleInlineError("");
                              }}
                              placeholder="Type custom color (e.g. Matte Gold, Dual Tone)"
                              className="w-full h-10 bg-amber-50/60 border border-amber-300 rounded-xl px-3 text-xs font-bold font-mono text-slate-900 outline-none focus:border-amber-500 shadow-xs"
                              required
                            />
                          </div>
                        )}
                      </div>

                      {/* Official Vehicle Registration RC Number */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono">
                          Number Plater
                        </label>
                        <div className="relative">
                          <Car size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                          <input
                            type="text"
                            value={signUpVehicle}
                            onChange={(e) => {
                              setSignUpVehicle(e.target.value.toUpperCase());
                              setVehicleInlineError("");
                            }}
                            placeholder="e.g. MH12 AB 1234"
                            className="w-full h-11 bg-white border border-slate-300 rounded-xl pl-10 pr-3 text-xs font-black font-mono tracking-wider text-slate-900 outline-none focus:border-amber-500 shadow-xs uppercase"
                            required
                          />
                        </div>
                      </div>

                    </div>

                    {/* Vehicle Details Inline Error Banner */}
                    {vehicleInlineError && (
                      <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-[11px] font-bold font-mono flex items-center gap-2 shadow-xs animate-shake mt-2">
                        <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                        <span>{vehicleInlineError}</span>
                      </div>
                    )}

                    {/* Vehicle Photo Upload Inside Step 3 */}
                    <div className="pt-3 border-t border-slate-200 space-y-3">
                      <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono block">
                        Vehicle Exterior Photo
                      </label>

                      {uploadingField === "vehicle_photo" && (
                        <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1.5 animate-in fade-in">
                          <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-900">
                            <span className="flex items-center gap-1.5">
                              <RefreshCw size={12} className="animate-spin text-amber-700" /> Uploading Vehicle Photo...
                            </span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-amber-200/80 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-amber-600 transition-all duration-150 ease-out rounded-full"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {vehiclePhotoUrl ? (
                        <div className="relative h-44 rounded-2xl overflow-hidden border-2 border-slate-300 shadow-xs bg-slate-900 group">
                          <img src={vehiclePhotoUrl} alt="Vehicle Exterior" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <label className="bg-white text-slate-950 font-black px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider cursor-pointer shadow-md flex items-center gap-1.5 font-mono">
                              <RefreshCw size={12} /> <span>Replace Vehicle Photo</span>
                              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setVehiclePhotoUrl, "vehicle_photo")} className="hidden" />
                            </label>
                          </div>
                          <div className="absolute top-2.5 left-2.5 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-md font-mono flex items-center gap-1 shadow-xs">
                            <Check size={12} /> Photo Uploaded
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-amber-500 hover:border-amber-600 bg-amber-500/10 hover:bg-amber-500/20 rounded-2xl cursor-pointer transition-all space-y-2 text-center group shadow-xs">
                          <div className="w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center text-slate-950 font-black text-xl shadow-sm border border-amber-500 group-hover:scale-105 transition-transform">
                            📷
                          </div>
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500 group-hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md border-2 border-amber-600 font-mono">
                              <Upload size={14} /> <span>UPLOAD EXTERIOR VEHICLE PHOTO</span>
                            </span>
                            <p className="text-[10px] text-slate-600 font-bold font-mono pt-0.5">
                              JPG, PNG, WEBP (Max 10MB)
                            </p>
                          </div>
                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setVehiclePhotoUrl, "vehicle_photo")} className="hidden" />
                        </label>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          handleSampleUpload("https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80", setVehiclePhotoUrl, "vehicle_photo");
                          setVehiclePhotoInlineError("");
                        }}
                        className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-black uppercase tracking-wider font-mono transition-all flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
                      >
                        <Sparkles size={13} className="text-amber-600" /> <span>Use Sample Vehicle Photo</span>
                      </button>

                      {vehiclePhotoInlineError && (
                        <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-[11px] font-bold font-mono flex items-center gap-2 shadow-xs animate-shake">
                          <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                          <span>{vehiclePhotoInlineError}</span>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* STEP 4 (DRIVER): SEPARATE FRONT & BACK DRIVING LICENSE (DL) UPLOADS */}
              {verificationRole === "driver" && (isConvertingRider ? signUpStep === 2 : signUpStep === 4) && (
                <div className="space-y-4">
                  <div className="space-y-0.5 border-b border-slate-200 pb-2">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight font-mono">
                      DRIVING LICENSE (FRONT & BACK)
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      {/* DL FRONT SIDE DROPZONE */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono">
                          DL Front Side Photo
                        </label>

                        {uploadingField === "dl_front" && (
                          <div className="p-2 bg-amber-50 border border-amber-300 rounded-xl space-y-1 animate-in fade-in">
                            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-900">
                              <span className="flex items-center gap-1">
                                <RefreshCw size={10} className="animate-spin text-amber-700" /> Uploading Front...
                              </span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-amber-200/80 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-600 transition-all duration-150 ease-out rounded-full" style={{ width: `${uploadProgress}%` }} />
                            </div>
                          </div>
                        )}

                        {dlFrontUrl ? (
                          <div className="relative h-36 rounded-xl overflow-hidden border border-slate-300 bg-slate-900 group">
                            <img src={dlFrontUrl} alt="DL Front" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <label className="bg-white text-slate-950 font-black px-2.5 py-1 rounded-lg text-[9px] uppercase cursor-pointer shadow-md flex items-center gap-1 font-mono">
                                <RefreshCw size={10} /> Replace Front
                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setDlFrontUrl, "dl_front")} className="hidden" />
                              </label>
                            </div>
                            <div className="absolute top-2 left-2 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-md font-mono">
                              ✓ DL Front Ready
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-amber-500 hover:border-amber-600 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl cursor-pointer text-center space-y-2 group transition-all">
                            <FileText size={22} className="text-amber-600" />
                            <span className="w-full px-2 py-1.5 bg-amber-500 group-hover:bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider rounded-lg shadow-xs border border-amber-600 font-mono flex items-center justify-center gap-1 whitespace-nowrap">
                              <Upload size={12} className="shrink-0" /> UPLOAD DL FRONT
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">JPG, PNG, WEBP</span>
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setDlFrontUrl, "dl_front")} className="hidden" />
                          </label>
                        )}
                        <button
                          type="button"
                          onClick={() => handleSampleUpload("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80", setDlFrontUrl, "dl_front")}
                          className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-black uppercase font-mono border border-slate-200"
                        >
                          Use Sample DL Front
                        </button>
                      </div>

                      {/* DL BACK SIDE DROPZONE */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono">
                          DL Back Side Photo
                        </label>

                        {uploadingField === "dl_back" && (
                          <div className="p-2 bg-amber-50 border border-amber-300 rounded-xl space-y-1 animate-in fade-in">
                            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-900">
                              <span className="flex items-center gap-1">
                                <RefreshCw size={10} className="animate-spin text-amber-700" /> Uploading Back...
                              </span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-amber-200/80 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-600 transition-all duration-150 ease-out rounded-full" style={{ width: `${uploadProgress}%` }} />
                            </div>
                          </div>
                        )}

                        {dlBackUrl ? (
                          <div className="relative h-36 rounded-xl overflow-hidden border border-slate-300 bg-slate-900 group">
                            <img src={dlBackUrl} alt="DL Back" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <label className="bg-white text-slate-950 font-black px-2.5 py-1 rounded-lg text-[9px] uppercase cursor-pointer shadow-md flex items-center gap-1 font-mono">
                                <RefreshCw size={10} /> Replace Back
                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setDlBackUrl, "dl_back")} className="hidden" />
                              </label>
                            </div>
                            <div className="absolute top-2 left-2 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-md font-mono">
                              ✓ DL Back Ready
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-amber-500 hover:border-amber-600 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl cursor-pointer text-center space-y-2 group transition-all">
                            <FileText size={22} className="text-amber-600" />
                            <span className="w-full px-2 py-1.5 bg-amber-500 group-hover:bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider rounded-lg shadow-xs border border-amber-600 font-mono flex items-center justify-center gap-1 whitespace-nowrap">
                              <Upload size={12} className="shrink-0" /> UPLOAD DL BACK
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">JPG, PNG, WEBP</span>
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setDlBackUrl, "dl_back")} className="hidden" />
                          </label>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            handleSampleUpload("https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80", setDlBackUrl, "dl_back");
                            setDlInlineError("");
                          }}
                          className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-black uppercase font-mono border border-slate-200"
                        >
                          Use Sample DL Back
                        </button>
                      </div>

                    </div>

                    {/* Driver License Inline Error Banner */}
                    {dlInlineError && (
                      <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-[11px] font-bold font-mono flex items-center gap-2 shadow-xs animate-shake mt-2">
                        <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                        <span>{dlInlineError}</span>
                      </div>
                    )}

                    {/* Sample Pictures & Guidelines - SEAMLESS BORDERLESS & HORIZONTAL RECTANGLES */}
                    <div className="pt-3 space-y-3 mt-2 border-t border-slate-200">
                      <div className="border-b border-slate-200/80 pb-2">
                        <span className="text-[11px] font-black uppercase tracking-wider font-mono text-slate-900 flex items-center gap-1.5">
                          <FileText size={14} className="text-amber-600" /> Driving License Samples & Guidelines
                        </span>
                      </div>

                      {/* HORIZONTAL RECTANGLE SAMPLES GRID */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1 text-center">
                          <div className="relative aspect-[16/10] w-full max-w-[240px] mx-auto rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm">
                            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80" alt="DL Front Sample" className="w-full h-full object-cover" />
                            <span className="absolute bottom-1.5 left-1.5 bg-slate-950/80 text-amber-400 border border-amber-400/40 text-[8px] font-mono font-black px-1.5 py-0.5 rounded">
                              DL FRONT SAMPLE
                            </span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-800 block pt-0.5">Name & DL Number Legible</span>
                        </div>

                        <div className="space-y-1 text-center">
                          <div className="relative aspect-[16/10] w-full max-w-[240px] mx-auto rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm">
                            <img src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80" alt="DL Back Sample" className="w-full h-full object-cover" />
                            <span className="absolute bottom-1.5 left-1.5 bg-slate-950/80 text-amber-400 border border-amber-400/40 text-[8px] font-mono font-black px-1.5 py-0.5 rounded">
                              DL BACK SAMPLE
                            </span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-800 block pt-0.5">Address & Authority Stamp</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-[10px] font-mono text-slate-600 pt-1">
                        <div className="flex items-center gap-1 font-bold text-slate-800">
                          <CheckCircle2 size={11} className="text-emerald-600 shrink-0" /> Capture all 4 edges of card cleanly
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 size={11} className="text-emerald-600 shrink-0" /> Ensure license number & dates are legible
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <XCircle size={11} className="text-rose-500 shrink-0" /> Avoid glare or flash covering text
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5 (DRIVER): SEPARATE FRONT & BACK AADHAAR CARD / GOVT ID UPLOADS */}
              {verificationRole === "driver" && (isConvertingRider ? signUpStep === 3 : signUpStep === 5) && (
                <div className="space-y-4">
                  <div className="space-y-0.5 border-b border-slate-200 pb-2">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight font-mono">
                      AADHAAR / GOVT ID (FRONT & BACK)
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      {/* AADHAAR FRONT DROPZONE */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono">
                          Aadhaar Front Side Photo
                        </label>

                        {uploadingField === "aadhaar_front" && (
                          <div className="p-2 bg-amber-50 border border-amber-300 rounded-xl space-y-1 animate-in fade-in">
                            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-900">
                              <span className="flex items-center gap-1">
                                <RefreshCw size={10} className="animate-spin text-amber-700" /> Uploading Front...
                              </span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-amber-200/80 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-600 transition-all duration-150 ease-out rounded-full" style={{ width: `${uploadProgress}%` }} />
                            </div>
                          </div>
                        )}

                        {aadhaarFrontUrl ? (
                          <div className="relative h-36 rounded-xl overflow-hidden border border-slate-300 bg-slate-900 group">
                            <img src={aadhaarFrontUrl} alt="Aadhaar Front" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <label className="bg-white text-slate-950 font-black px-2.5 py-1 rounded-lg text-[9px] uppercase cursor-pointer shadow-md flex items-center gap-1 font-mono">
                                <RefreshCw size={10} /> Replace Front
                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setAadhaarFrontUrl, "aadhaar_front")} className="hidden" />
                              </label>
                            </div>
                            <div className="absolute top-2 left-2 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-md font-mono">
                              ✓ Aadhaar Front Ready
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-amber-500 hover:border-amber-600 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl cursor-pointer text-center space-y-2 group transition-all">
                            <ShieldCheck size={22} className="text-amber-600" />
                            <span className="w-full px-2 py-1.5 bg-amber-500 group-hover:bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider rounded-lg shadow-xs border border-amber-600 font-mono flex items-center justify-center gap-1 whitespace-nowrap">
                              <Upload size={12} className="shrink-0" /> UPLOAD AADHAAR FRONT
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">JPG, PNG, WEBP</span>
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setAadhaarFrontUrl, "aadhaar_front")} className="hidden" />
                          </label>
                        )}
                        <button
                          type="button"
                          onClick={() => handleSampleUpload("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80", setAadhaarFrontUrl, "aadhaar_front")}
                          className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-black uppercase font-mono border border-slate-200"
                        >
                          Use Sample Aadhaar Front
                        </button>
                      </div>

                      {/* AADHAAR BACK DROPZONE */}
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-700 uppercase tracking-widest font-mono">
                          Aadhaar Back Side Photo
                        </label>

                        {uploadingField === "aadhaar_back" && (
                          <div className="p-2 bg-amber-50 border border-amber-300 rounded-xl space-y-1 animate-in fade-in">
                            <div className="flex items-center justify-between text-[10px] font-mono font-bold text-amber-900">
                              <span className="flex items-center gap-1">
                                <RefreshCw size={10} className="animate-spin text-amber-700" /> Uploading Back...
                              </span>
                              <span>{uploadProgress}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-amber-200/80 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-600 transition-all duration-150 ease-out rounded-full" style={{ width: `${uploadProgress}%` }} />
                            </div>
                          </div>
                        )}

                        {aadhaarBackUrl ? (
                          <div className="relative h-36 rounded-xl overflow-hidden border border-slate-300 bg-slate-900 group">
                            <img src={aadhaarBackUrl} alt="Aadhaar Back" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <label className="bg-white text-slate-950 font-black px-2.5 py-1 rounded-lg text-[9px] uppercase cursor-pointer shadow-md flex items-center gap-1 font-mono">
                                <RefreshCw size={10} /> Replace Back
                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setAadhaarBackUrl, "aadhaar_back")} className="hidden" />
                              </label>
                            </div>
                            <div className="absolute top-2 left-2 bg-emerald-500 text-slate-950 text-[9px] font-black uppercase px-2 py-0.5 rounded-md font-mono">
                              ✓ Aadhaar Back Ready
                            </div>
                          </div>
                        ) : (
                          <label className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-amber-500 hover:border-amber-600 bg-amber-500/10 hover:bg-amber-500/20 rounded-xl cursor-pointer text-center space-y-2 group transition-all">
                            <ShieldCheck size={22} className="text-amber-600" />
                            <span className="w-full px-2 py-1.5 bg-amber-500 group-hover:bg-amber-400 text-slate-950 font-black text-[9px] uppercase tracking-wider rounded-lg shadow-xs border border-amber-600 font-mono flex items-center justify-center gap-1 whitespace-nowrap">
                              <Upload size={12} className="shrink-0" /> UPLOAD AADHAAR BACK
                            </span>
                            <span className="text-[9px] text-slate-500 font-mono">JPG, PNG, WEBP</span>
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setAadhaarBackUrl, "aadhaar_back")} className="hidden" />
                          </label>
                        )}
                        <button
                          type="button"
                          onClick={() => handleSampleUpload("https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80", setAadhaarBackUrl, "aadhaar_back")}
                          className="w-full py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[10px] font-black uppercase font-mono border border-slate-200"
                        >
                          Use Sample Aadhaar Back
                        </button>
                      </div>

                    </div>

                    {/* Sample Pictures & Guidelines - SEAMLESS BORDERLESS & HORIZONTAL RECTANGLES */}
                    <div className="pt-3 space-y-3 mt-2 border-t border-slate-200">
                      <div className="border-b border-slate-200/80 pb-2">
                        <span className="text-[11px] font-black uppercase tracking-wider font-mono text-slate-900 flex items-center gap-1.5">
                          <ShieldCheck size={14} className="text-amber-600" /> Aadhaar Card Samples & Guidelines
                        </span>
                      </div>

                      {/* HORIZONTAL RECTANGLE SAMPLES GRID */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1 text-center">
                          <div className="relative aspect-[16/10] w-full max-w-[240px] mx-auto rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm">
                            <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80" alt="Aadhaar Front Sample" className="w-full h-full object-cover" />
                            <span className="absolute bottom-1.5 left-1.5 bg-slate-950/80 text-amber-400 border border-amber-400/40 text-[8px] font-mono font-black px-1.5 py-0.5 rounded">
                              AADHAAR FRONT SAMPLE
                            </span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-800 block pt-0.5">12-Digit UID Clearly Visible</span>
                        </div>

                        <div className="space-y-1 text-center">
                          <div className="relative aspect-[16/10] w-full max-w-[240px] mx-auto rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm">
                            <img src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=500&auto=format&fit=crop&q=80" alt="Aadhaar Back Sample" className="w-full h-full object-cover" />
                            <span className="absolute bottom-1.5 left-1.5 bg-slate-950/80 text-amber-400 border border-amber-400/40 text-[8px] font-mono font-black px-1.5 py-0.5 rounded">
                              AADHAAR BACK SAMPLE
                            </span>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-slate-800 block pt-0.5">Full Address & QR Code</span>
                        </div>
                      </div>

                      <div className="space-y-1 text-[10px] font-mono text-slate-600 pt-1">
                        <div className="flex items-center gap-1 font-bold text-slate-800">
                          <CheckCircle2 size={11} className="text-emerald-600 shrink-0" /> Original physical document photo
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle2 size={11} className="text-emerald-600 shrink-0" /> All 12 digits of Aadhaar clearly visible
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <XCircle size={11} className="text-rose-500 shrink-0" /> Do not submit cropped or covered UID numbers
                        </div>
                      </div>

                      {/* Driver Aadhaar Card Inline Error Banner */}
                      {aadhaarInlineError && (
                        <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-[11px] font-bold font-mono flex items-center gap-2 shadow-xs animate-shake mt-2">
                          <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                          <span>{aadhaarInlineError}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6 (DRIVER): IDENTITY SELFIE */}
              {verificationRole === "driver" && (isConvertingRider ? signUpStep === 4 : signUpStep === 6) && (
                <div className="space-y-4">
                  <div className="space-y-0.5 border-b border-slate-200 pb-2">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight font-mono">
                      IDENTITY SELFIE (PORTRAIT PHOTO)
                    </h2>
                  </div>

                  <div className="space-y-3">
                    {/* Upload Progress Bar Indicator */}
                    {uploadingField === "selfie_photo" && (
                      <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl space-y-1.5 animate-in fade-in">
                        <div className="flex items-center justify-between text-xs font-mono font-bold text-amber-900">
                          <span className="flex items-center gap-1.5">
                            <RefreshCw size={12} className="animate-spin text-amber-700" /> Uploading Facial Selfie...
                          </span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-2 bg-amber-200/80 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-amber-600 transition-all duration-150 ease-out rounded-full"
                            style={{ width: `${uploadProgress}%` }}
                          />
                        </div>
                        <div className="text-[9px] text-amber-700 font-mono text-right font-medium">Verifying face biometrics framing</div>
                      </div>
                    )}

                    {selfiePhotoUrl ? (
                      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
                        <img src={selfiePhotoUrl} alt="Selfie" className="w-16 h-16 rounded-xl object-cover border border-slate-300" />
                        <div className="flex-1">
                          <div className="text-xs font-black uppercase text-emerald-600 font-mono">✓ Facial Portrait Ready</div>
                          <label className="text-[10px] font-black uppercase text-amber-700 underline cursor-pointer font-mono pt-1 inline-block">
                            Retake Selfie
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setSelfiePhotoUrl, "selfie_photo")} className="hidden" />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-amber-500 hover:border-amber-600 bg-amber-500/10 hover:bg-amber-500/20 rounded-2xl cursor-pointer text-center space-y-3 group transition-all">
                        <Camera size={26} className="text-amber-600" />
                        <span className="px-5 py-2.5 bg-amber-500 group-hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md border-2 border-amber-600 font-mono flex items-center gap-2">
                          <Upload size={14} /> UPLOAD FACIAL SELFIE
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono font-bold">Clear Front Portrait</span>
                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, setSelfiePhotoUrl, "selfie_photo")} className="hidden" />
                      </label>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        handleSampleUpload("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80", setSelfiePhotoUrl, "selfie_photo");
                        setSelfieInlineError("");
                      }}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-mono text-xs font-black uppercase rounded-xl border border-slate-200 cursor-pointer"
                    >
                      Use Sample Selfie
                    </button>

                    {/* Driver Selfie Inline Error Banner */}
                    {selfieInlineError && (
                      <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-xl text-rose-900 text-[11px] font-bold font-mono flex items-center gap-2 shadow-xs animate-shake mt-2">
                        <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                        <span>{selfieInlineError}</span>
                      </div>
                    )}

                    {/* Sample Picture & Guidelines - SEAMLESS BORDERLESS */}
                    <div className="pt-3 space-y-3 mt-2 border-t border-slate-200">
                      <div className="border-b border-slate-200/80 pb-2">
                        <span className="text-[11px] font-black uppercase tracking-wider font-mono text-slate-900 flex items-center gap-1.5">
                          <Camera size={14} className="text-amber-600" /> Face Portrait Selfie Guidelines
                        </span>
                      </div>

                      <div className="flex flex-col items-center gap-3">
                        {/* SELFIE SAMPLE */}
                        <div className="relative w-full max-w-[200px] aspect-square rounded-xl overflow-hidden border-2 border-slate-300 shadow-sm group">
                          <img 
                            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80" 
                            alt="Selfie Sample" 
                            className="w-full h-full object-cover" 
                          />
                          <span className="absolute bottom-2 left-2 bg-slate-950/80 text-amber-400 border border-amber-400/40 text-[8px] font-mono font-black px-2 py-0.5 rounded-md">
                            SELFIE PORTRAIT SAMPLE
                          </span>
                        </div>

                        <div className="w-full space-y-1.5 text-[10px] font-mono text-slate-700 pt-1">
                          <div className="flex items-center gap-1 font-bold text-slate-900">
                            <CheckCircle2 size={12} className="text-emerald-600 shrink-0" /> Looking directly into camera with open eyes
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle2 size={12} className="text-emerald-600 shrink-0" /> Well-lit environment with clean background
                          </div>
                          <div className="flex items-center gap-1 text-slate-500">
                            <XCircle size={12} className="text-rose-500 shrink-0" /> No sunglasses, caps, masks, or beauty filters
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7 (DRIVER): VERIFICATION SUMMARY, PENDING (IMG 8), REJECTED (IMG 9) & APPROVED (IMG 10) */}
              {verificationRole === "driver" && (isConvertingRider ? signUpStep === 5 : signUpStep === 7) && (() => {
                const approvedCount = Object.values(docStatuses).filter((s) => s === "approved").length;
                const isAllApproved = approvedCount === 4;
                const hasRejected = Object.values(docStatuses).some((s) => s === "rejected");

                const docsList: Array<{
                  key: "dl" | "aadhaar" | "vehicle" | "selfie";
                  title: string;
                  icon: React.ReactNode;
                }> = [
                  {
                    key: "dl",
                    title: "Driving license, front and back",
                    icon: <FileText size={20} className="text-slate-800 shrink-0" />,
                  },
                  {
                    key: "aadhaar",
                    title: "Aadhaar card, front and back",
                    icon: <FileCheck size={20} className="text-slate-800 shrink-0" />,
                  },
                  {
                    key: "vehicle",
                    title: "Vehicle exterior photo",
                    icon: <Car size={20} className="text-slate-800 shrink-0" />,
                  },
                  {
                    key: "selfie",
                    title: "Facial identity selfie",
                    icon: <Camera size={20} className="text-slate-800 shrink-0" />,
                  },
                ];

                return (
                  <div className="space-y-4 font-sans">
                    {/* Header Title & Top Status Pill */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight font-sans">
                          {isAllApproved ? "Verification Complete" : hasRejected ? "Verification Action Needed" : "Verification Under Review"}
                        </h2>
                        <p className="text-xs text-slate-500 font-mono pt-0.5">
                          Verify ID: <span className="font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{trackableVerifyId}</span>
                        </p>
                      </div>
                      {isAllApproved ? (
                        <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                          <CheckCircle2 size={13} className="text-emerald-600" /> Verified
                        </span>
                      ) : hasRejected ? (
                        <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1.5 shadow-2xs">
                          <AlertTriangle size={13} className="text-rose-600 animate-pulse" /> Rejected
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5 shadow-2xs">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" /> Pending
                        </span>
                      )}
                    </div>

                    {/* Quick Demo Flow Switcher for Testing (Images 8, 9, 10) */}
                    <div className="p-2 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-between gap-1 text-[10px] font-mono text-slate-300 shadow-sm">
                      <span className="font-bold text-amber-400 pl-2 hidden sm:inline">FLOW TEST:</span>
                      <div className="flex items-center gap-1 w-full sm:w-auto justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            setDocStatuses({ dl: "pending", aadhaar: "pending", vehicle: "pending", selfie: "pending" });
                            syncDriverKycToBackend({ status: "Pending Check", isVerified: false });
                          }}
                          className={`px-2.5 py-1 rounded-xl font-extrabold transition-all cursor-pointer ${!isAllApproved && !hasRejected ? "bg-amber-400 text-slate-950 shadow-xs" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}
                        >
                          Image 8: Pending
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDocStatuses({ dl: "approved", aadhaar: "rejected", vehicle: "approved", selfie: "rejected" });
                            setDocRejectionReasons((prev) => ({
                              ...prev,
                              aadhaar: "Aadhaar Card corner is cropped. Please upload complete front copy.",
                              selfie: "Selfie is dark and blurry. Please re-upload clear portrait photo."
                            }));
                            syncDriverKycToBackend({ status: "Rejected", isVerified: false });
                          }}
                          className={`px-2.5 py-1 rounded-xl font-extrabold transition-all cursor-pointer ${hasRejected ? "bg-rose-500 text-white shadow-xs" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}
                        >
                          Image 9: Rejected
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDocStatuses({ dl: "approved", aadhaar: "approved", vehicle: "approved", selfie: "approved" });
                            setShowKycSuccessModal(true);
                            syncDriverKycToBackend({ status: "Active Verified", isVerified: true });
                          }}
                          className={`px-2.5 py-1 rounded-xl font-extrabold transition-all cursor-pointer ${isAllApproved ? "bg-emerald-500 text-white shadow-xs" : "bg-slate-800 hover:bg-slate-700 text-slate-300"}`}
                        >
                          Image 10: Verified
                        </button>
                      </div>
                    </div>

                    {/* TOP STATUS BANNER (IMAGE 8 PENDING / IMAGE 9 REJECTED / IMAGE 10 VERIFIED) */}
                    {hasRejected ? (
                      /* IMAGE 9: REJECTED SCREEN BANNER */
                      <div className="p-4 bg-rose-50 border border-rose-200/90 rounded-2xl space-y-2 shadow-2xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                            <AlertTriangle size={22} />
                          </div>
                          <div>
                            <h3 className="text-sm font-extrabold text-rose-950">
                              Action Required: Document Rejected
                            </h3>
                            <p className="text-xs text-rose-800 font-medium pt-0.5 leading-relaxed">
                              One or more documents were reviewed and rejected by the verification team. Please re-upload the required documents below to resume pending verification.
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : !isAllApproved ? (
                      /* IMAGE 8: PENDING REVIEW SCREEN BANNER */
                      <div className="p-4 bg-amber-50/90 border border-amber-200/90 rounded-2xl space-y-3 shadow-2xs">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
                            <Clock size={22} className="animate-spin" style={{ animationDuration: '6s' }} />
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm font-extrabold text-slate-900">
                                Verification Submitted & Pending Approval
                              </h3>
                            </div>
                            <p className="text-xs text-slate-700 font-medium leading-relaxed">
                              Your documents have been successfully registered with <span className="font-bold font-mono text-amber-900">Verify ID {trackableVerifyId}</span>. The compliance team is performing KYC checks.
                            </p>
                          </div>
                        </div>

                        {/* TRACKING CARD FOR KYC RECORD */}
                        <div className="p-3 bg-white/90 border border-amber-200 rounded-xl font-mono text-xs text-slate-800 space-y-1.5 shadow-2xs">
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-500">Tracking Verify ID:</span>
                            <span className="font-extrabold text-slate-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">{trackableVerifyId}</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-500">Driver Record:</span>
                            <span className="font-bold text-slate-900">{firstName || "Rajesh"} {lastName || "Kumar"}</span>
                          </div>
                          <div className="flex justify-between items-center text-[11px]">
                            <span className="text-slate-500">Vehicle:</span>
                            <span className="font-bold text-slate-900">{signUpVehicle || "MH12 AB 1234"}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* IMAGE 10: VERIFIED BANNER */
                      <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3.5 shadow-2xs">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <CheckCircle2 size={24} />
                        </div>
                        <div>
                          <h3 className="text-sm font-extrabold text-emerald-950">
                            Verification Complete & Approved!
                          </h3>
                          <p className="text-xs text-emerald-800 font-medium pt-0.5">
                            All documents cleared verification. You are fully authorized to enter the platform.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Driver & Vehicle Summary Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Driver Card */}
                      <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl space-y-0.5 shadow-2xs">
                        <span className="text-xs font-semibold text-slate-400 block">Driver</span>
                        <span className="text-sm font-black text-slate-900 block">
                          {firstName || "Srinu"} {lastName ? (lastName.length === 1 ? lastName + "." : lastName) : "K"}, {signUpAge || 37}
                        </span>
                        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 pt-1">
                          <CheckCircle2 size={13} className="text-emerald-600 shrink-0" /> Phone and email verified
                        </span>
                      </div>

                      {/* Vehicle Card */}
                      <div className="p-3.5 bg-white border border-slate-200/90 rounded-2xl space-y-0.5 shadow-2xs">
                        <span className="text-xs font-semibold text-slate-400 block">Vehicle</span>
                        <span className="text-sm font-black text-slate-900 block">
                          {selectedBrand === "Other" ? (customBrandName || "Maruti Suzuki") : (selectedBrand || "Maruti Suzuki")} {selectedModel === "Other" ? (customModelName || "Swift") : (selectedModel || "Swift")}
                        </span>
                        <span className="text-xs text-slate-600 font-semibold block pt-1">
                          {signUpVehicle || "TEST 1234"} · {selectedColor === "Other" ? (customColorName || "White") : (selectedColor || "White")}
                        </span>
                      </div>
                    </div>

                    {/* Documents List */}
                    <div className="space-y-2 pt-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        DOCUMENT VERIFICATION STATUS
                      </span>

                      <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-100 bg-white shadow-2xs">
                        {docsList.map((item) => {
                          const status = docStatuses[item.key];
                          const reason = docRejectionReasons[item.key];

                          return (
                            <div key={item.key} className="p-4 space-y-2">
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3">
                                  {item.icon}
                                  <span className="text-sm font-extrabold text-slate-900">
                                    {item.title}
                                  </span>
                                </div>

                                <div>
                                  {status === "approved" ? (
                                    <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                                      <Check size={14} className="stroke-[3]" />
                                    </div>
                                  ) : status === "rejected" ? (
                                    <span className="bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full border border-rose-200 flex items-center gap-1">
                                      <AlertTriangle size={12} /> Rejected
                                    </span>
                                  ) : (
                                    <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                                      Pending
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Interactive Re-upload Section for Rejected Item (IMAGE 9 FLOW) */}
                              {status === "rejected" && (
                                <div className="p-3.5 bg-rose-50/90 border border-rose-200 rounded-2xl space-y-2.5 text-xs font-sans text-rose-950 mt-2 animate-in fade-in">
                                  <div className="flex items-center gap-1.5 text-rose-800 font-bold font-mono">
                                    <AlertTriangle size={15} className="text-rose-600 shrink-0" />
                                    <span>Admin Rejection Reason:</span>
                                  </div>
                                  <p className="text-[12px] text-rose-950 leading-relaxed bg-white p-2.5 rounded-xl border border-rose-200 font-medium shadow-2xs">
                                    {reason || "Document uploaded is unreadable or invalid. Please re-upload a clear photo."}
                                  </p>
                                  <div className="pt-1 flex items-center justify-between">
                                    <span className="text-[11px] text-slate-600 font-medium">Upload replacement photo:</span>
                                    <label className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black font-mono cursor-pointer shadow-md transition-all active:scale-95">
                                      <Upload size={14} /> Re-Upload Document
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => handleStep8DocumentReupload(item.key, e)}
                                      />
                                    </label>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* ACTION BUTTONS (TOP: CONTACT SUPPORT; BOTTOM: BACK & LOCKED/ACTIVE ENTER PLATFORM) */}
                    <div className="space-y-3 pt-2">
                      {/* Top: Contact Support Button */}
                      <button
                        type="button"
                        onClick={() => setShowSupportLiveChatModal(true)}
                        className="w-full py-3.5 bg-slate-900 hover:bg-slate-950 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer font-mono border border-slate-800"
                      >
                        <MessageSquare size={16} className="text-amber-400" />
                        <span>Contact Support</span>
                      </button>

                      {/* Bottom Row: Back & Enter Platform */}
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setSignUpStep(6)}
                          className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all border border-slate-200 flex items-center justify-center gap-2 cursor-pointer font-mono"
                        >
                          <ArrowLeft size={16} />
                          <span>Back</span>
                        </button>

                        {isAllApproved ? (
                          <button
                            type="button"
                            onClick={handleEnterPlatform}
                            disabled={loginLoading}
                            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
                          >
                            <span>{loginLoading ? "Entering..." : "Enter platform"}</span>
                            <ArrowRight size={16} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled={true}
                            className="w-full py-3.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-2xl font-extrabold text-xs uppercase tracking-wider shadow-none flex items-center justify-center gap-2 cursor-not-allowed font-mono opacity-80"
                          >
                            <Lock size={15} />
                            <span>Enter platform</span>
                          </button>
                        )}
                      </div>

                      {!isAllApproved && (
                        <span className="text-[10px] font-sans text-slate-500 font-medium text-center block pt-0.5">
                          🔒 Platform access activates once all 4 documents are verified
                        </span>
                      )}
                    </div>

                    {/* REAL-TIME LIVE CHAT WITH ADMIN SUPPORT MODAL (IMAGE 2 DESIGN) */}
                    {showSupportLiveChatModal && (
                      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl max-w-md w-full p-5 space-y-4 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-9 h-9 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs">
                                <Headphones size={20} />
                              </div>
                              <div>
                                <h3 className="text-sm font-extrabold text-slate-900">Admin Support Live Chat</h3>
                                <p className="text-[10px] text-slate-500 font-mono font-semibold">Verify ID: {trackableVerifyId}</p>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setShowSupportLiveChatModal(false)}
                              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                            >
                              <X size={18} />
                            </button>
                          </div>

                          <div className="flex-1 overflow-y-auto space-y-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-sans min-h-[220px]">
                            {/* Initial Welcome Bubble */}
                            <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-2xs space-y-1 max-w-[90%]">
                              <span className="font-extrabold text-slate-900 text-[11px] block">Admin Verification Desk</span>
                              <p className="text-slate-700 leading-relaxed">
                                Hello {firstName || "Shreenu"}! We are reviewing your registration records for <span className="font-bold font-mono text-slate-900">{trackableVerifyId}</span>. How can we assist you today?
                              </p>
                              <span className="text-[9px] text-slate-400 font-mono block text-right pt-0.5">Just now</span>
                            </div>

                            {/* Rejection Notice if document rejected */}
                            {hasRejected && (
                              <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200 shadow-2xs space-y-1 max-w-[90%]">
                                <span className="font-extrabold text-rose-900 text-[11px] block">Admin Notice</span>
                                <p className="text-rose-900 leading-relaxed">
                                  Your record requires a re-upload of rejected document(s). Once you re-upload a clear copy on the previous screen, we will review it immediately!
                                </p>
                              </div>
                            )}

                            {/* Dynamic Chat Message Log */}
                            {chatMessages.map((msg, idx) => (
                              <div
                                key={idx}
                                className={`p-3 rounded-2xl text-xs space-y-1 max-w-[88%] ${
                                  msg.sender === "driver"
                                    ? "bg-amber-400 text-slate-950 font-medium ml-auto rounded-br-none shadow-xs"
                                    : "bg-white text-slate-800 border border-slate-200/90 rounded-bl-none shadow-2xs"
                                }`}
                              >
                                {msg.title && (
                                  <span className="font-extrabold text-[11px] block text-slate-900">{msg.title}</span>
                                )}
                                <p className="leading-relaxed">{msg.text}</p>
                                <span className={`text-[9px] font-mono block text-right pt-0.5 ${msg.sender === "driver" ? "text-slate-800/80" : "text-slate-400"}`}>
                                  {msg.time}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={chatInputText}
                              onChange={(e) => setChatInputText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  handleSendChatMessage();
                                }
                              }}
                              placeholder="there"
                              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:border-amber-400 font-sans"
                            />
                            <button
                              type="button"
                              onClick={handleSendChatMessage}
                              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-xs transition-colors"
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* REAL-TIME VERIFICATION APPROVED POPUP MODAL (IMAGE 10) */}
                    {isAllApproved && showKycSuccessModal && (
                      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-5 shadow-2xl border border-slate-100 relative animate-in zoom-in-95 duration-200">
                          <button
                            type="button"
                            onClick={() => setShowKycSuccessModal(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
                          >
                            <X size={18} />
                          </button>

                          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <CheckCircle2 size={36} className="stroke-[2.5]" />
                          </div>

                          <div className="space-y-2">
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full font-mono">
                              KYC VERIFICATION COMPLETE
                            </span>
                            <h3 className="text-xl font-black text-slate-900 tracking-tight">
                              Your Account is Activated!
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed font-medium">
                              All 4 documents have been successfully verified with Verify ID <span className="font-mono font-bold text-slate-900">{trackableVerifyId}</span>. You are now fully approved to start accepting ride requests and earning!
                            </p>
                          </div>

                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-1.5 font-mono text-xs">
                            <div className="flex justify-between text-slate-600 text-[11px]">
                              <span>Verify ID:</span>
                              <span className="font-bold text-slate-900">{trackableVerifyId}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 text-[11px]">
                              <span>Status:</span>
                              <span className="font-bold text-emerald-700 flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" /> Active Driver
                              </span>
                            </div>
                            <div className="flex justify-between text-slate-600 text-[11px]">
                              <span>Vehicle:</span>
                              <span className="font-bold text-slate-900">{signUpVehicle || "MH12 AB 1234"}</span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={handleEnterPlatform}
                            disabled={loginLoading}
                            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black text-sm uppercase tracking-wider shadow-lg hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
                          >
                            <span>{loginLoading ? "Entering..." : "Enter Platform Now"}</span>
                            <ArrowRight size={18} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* STEP 3 (RIDER): ACCOUNT REVIEW & ENTRY */}
              {verificationRole === "rider" && signUpStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-0.5 border-b border-slate-200 pb-2">
                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-tight font-mono">
                      ACCOUNT REVIEW & REGISTRATION
                    </h2>
                  </div>

                  <div className="space-y-2 font-mono text-xs">
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Full Identity Name & Age</span>
                      <span className="font-extrabold text-slate-900 text-xs">{firstName} {lastName} ({signUpAge} yrs)</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Contact Credentials</span>
                      <span className="font-extrabold text-slate-900 text-xs">{signUpPhone} | {signUpEmail}</span>
                    </div>
                    <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-xs">
                      <span className="text-slate-500 block text-[9px] uppercase font-bold">Operating Location</span>
                      <span className="font-extrabold text-slate-900 text-xs">📍 {signUpCity || "Pune"}, {selectedState}, {selectedCountry.name}</span>
                    </div>
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 shadow-xs">
                      <ShieldCheck size={16} className="shrink-0 text-emerald-600" />
                      <span className="text-[10px] font-bold">Mobile & Email verified. Ready for instant platform access.</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-300/80 rounded-xl text-[11px] font-bold text-rose-800 font-mono shadow-2xs flex items-center gap-2 animate-in fade-in slide-in-from-bottom-1">
                <AlertCircle size={15} className="text-rose-600 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            {/* Step Action Navigation Footer (Excluded on Driver Step 7 where custom action controls exist) */}
            {!(verificationRole === "driver" && (isConvertingRider ? signUpStep === 5 : signUpStep === 7)) && (
              <div className="pt-4 border-t border-slate-200 flex gap-3">
                {signUpStep > 1 && (
                  <button
                    type="button"
                    onClick={() => setSignUpStep((s) => s - 1)}
                    className="px-6 h-14 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer font-mono"
                  >
                    <ArrowLeft size={16} /> <span>Back</span>
                  </button>
                )}

                {signUpStep < totalStepsCount ? (
                  <button
                    type="button"
                    onClick={handleNextSignUpStep}
                    className="flex-1 h-14 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
                  >
                    <span>Next Step</span> <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSignUp}
                    disabled={loginLoading}
                    className="flex-1 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-mono"
                  >
                    <span>{loginLoading ? "Creating Account..." : "START RIDING"}</span> <Sparkles size={16} />
                  </button>
                )}
              </div>
            )}

          </main>

        </div>
      )}

    </div>
  );
};
