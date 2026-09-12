import React, { useState } from "react";
import { 
  X, 
  Globe, 
  Mail, 
  MapPin, 
  Car, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Search, 
  Download, 
  Filter, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Layers,
  Sparkles,
  RefreshCw,
  PlusCircle,
  Tag,
  Building2,
  ListFilter
} from "lucide-react";
import { cn } from "../lib/utils";

export interface SignupCountry {
  id: string;
  name: string;
  code: string;
  flag: string;
  active: boolean;
}

export interface SignupMailUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "rider" | "driver";
  promoSubscribed: boolean;
  rulesAccepted: boolean;
  createdAt: string;
}

export interface SignupCity {
  id: string;
  name: string;
  state: string;
  localAreas: string[];
}

export interface VehicleBrandCatalogItem {
  id: string;
  category: string; // "Car", "Motorcycle", "Scooter", "Micro-Van", "Auto Rickshaw", "Medical Van", "Other Vehicle"
  brand: string;
  models: string[];
  colors: string[];
}

interface SignupAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  countries: SignupCountry[];
  setCountries: React.Dispatch<React.SetStateAction<SignupCountry[]>>;
  mailList: SignupMailUser[];
  setMailList: React.Dispatch<React.SetStateAction<SignupMailUser[]>>;
  cities: SignupCity[];
  setCities: React.Dispatch<React.SetStateAction<SignupCity[]>>;
  catalog: VehicleBrandCatalogItem[];
  setCatalog: React.Dispatch<React.SetStateAction<VehicleBrandCatalogItem[]>>;
  addNotification: (msg: string, type: "success" | "error" | "info" | "warning") => void;
}

export const SignupAdminModal: React.FC<SignupAdminModalProps> = ({
  isOpen,
  onClose,
  countries,
  setCountries,
  mailList,
  setMailList,
  cities,
  setCities,
  catalog,
  setCatalog,
  addNotification
}) => {
  const [activeTab, setActiveTab] = useState<"countries" | "mail" | "cities" | "catalog">("countries");

  // Tab 1: Countries state
  const [newCountryName, setNewCountryName] = useState("");
  const [newCountryCode, setNewCountryCode] = useState("");
  const [newCountryFlag, setNewCountryFlag] = useState("🌐");

  // Tab 2: Mail state & filters
  const [mailSearch, setMailSearch] = useState("");
  const [mailRoleFilter, setMailRoleFilter] = useState<"all" | "rider" | "driver">("all");
  const [mailPromoFilter, setMailPromoFilter] = useState<"all" | "subscribed" | "unsubscribed">("all");
  
  // Add new mail user state
  const [showAddMailModal, setShowAddMailModal] = useState(false);
  const [newMailName, setNewMailName] = useState("");
  const [newMailEmail, setNewMailEmail] = useState("");
  const [newMailPhone, setNewMailPhone] = useState("");
  const [newMailRole, setNewMailRole] = useState<"rider" | "driver">("rider");
  const [newMailPromo, setNewMailPromo] = useState(true);

  // Tab 3: Cities state
  const [newCityName, setNewCityName] = useState("");
  const [newCityState, setNewCityState] = useState("");
  const [selectedCityForArea, setSelectedCityForArea] = useState<string | null>(null);
  const [newAreaName, setNewAreaName] = useState("");

  // Tab 4: Catalog state
  const [newCatName, setNewCatName] = useState("Car");
  const [newBrandName, setNewBrandName] = useState("");
  const [newModelInput, setNewModelInput] = useState("");
  const [selectedCatalogForModels, setSelectedCatalogForModels] = useState<string | null>(null);
  const [addModelToCatalogInput, setAddModelToCatalogInput] = useState("");

  if (!isOpen) return null;

  // Handlers for Tab 1: Countries
  const handleAddCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCountryName || !newCountryCode) {
      addNotification("Please provide both Country Name and Dial Code.", "error");
      return;
    }
    const item: SignupCountry = {
      id: "cnt_" + Date.now(),
      name: newCountryName,
      code: newCountryCode.startsWith("+") ? newCountryCode : `+${newCountryCode}`,
      flag: newCountryFlag || "🌐",
      active: true
    };
    setCountries((prev) => [item, ...prev]);
    setNewCountryName("");
    setNewCountryCode("");
    setNewCountryFlag("🌐");
    addNotification(`Added country ${item.name} (${item.code})`, "success");
  };

  const toggleCountryActive = (id: string) => {
    setCountries((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  const deleteCountry = (id: string) => {
    setCountries((prev) => prev.filter((c) => c.id !== id));
    addNotification("Country deleted from master list.", "info");
  };

  // Handlers for Tab 2: Mail IDs
  const filteredMailList = mailList.filter((m) => {
    const matchesSearch =
      m.email.toLowerCase().includes(mailSearch.toLowerCase()) ||
      m.name.toLowerCase().includes(mailSearch.toLowerCase()) ||
      m.phone.includes(mailSearch);
    const matchesRole = mailRoleFilter === "all" || m.role === mailRoleFilter;
    const matchesPromo =
      mailPromoFilter === "all" ||
      (mailPromoFilter === "subscribed" && m.promoSubscribed) ||
      (mailPromoFilter === "unsubscribed" && !m.promoSubscribed);
    return matchesSearch && matchesRole && matchesPromo;
  });

  const handleAddMailUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMailEmail) {
      addNotification("Please provide an email address.", "error");
      return;
    }
    const newUser: SignupMailUser = {
      id: "usr_" + Date.now(),
      name: newMailName || "Registered User",
      email: newMailEmail,
      phone: newMailPhone || "+91 98765 43210",
      role: newMailRole,
      promoSubscribed: newMailPromo,
      rulesAccepted: true,
      createdAt: new Date().toISOString().split("T")[0]
    };
    setMailList((prev) => [newUser, ...prev]);
    setShowAddMailModal(false);
    setNewMailName("");
    setNewMailEmail("");
    setNewMailPhone("");
    addNotification(`Added user email ${newUser.email} to signup database.`, "success");
  };

  const exportMailCSV = () => {
    const headers = ["ID", "Name", "Email", "Phone", "Role", "Promo Subscribed", "Rules Accepted", "Created Date"];
    const rows = filteredMailList.map((m) => [
      m.id,
      `"${m.name}"`,
      `"${m.email}"`,
      `"${m.phone}"`,
      m.role,
      m.promoSubscribed ? "Yes" : "No",
      m.rulesAccepted ? "Yes" : "No",
      m.createdAt
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `signup_master_mail_list_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification("Exported Mail IDs List to CSV successfully!", "success");
  };

  const deleteMailUser = (id: string) => {
    setMailList((prev) => prev.filter((m) => m.id !== id));
    addNotification("User removed from mail database.", "info");
  };

  // Handlers for Tab 3: Cities
  const handleAddCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName) {
      addNotification("Please enter a city name.", "error");
      return;
    }
    const newC: SignupCity = {
      id: "cty_" + Date.now(),
      name: newCityName,
      state: newCityState || "India",
      localAreas: []
    };
    setCities((prev) => [newC, ...prev]);
    setNewCityName("");
    setNewCityState("");
    addNotification(`Added city ${newC.name} to operating list.`, "success");
  };

  const handleAddAreaToCity = (cityId: string) => {
    if (!newAreaName.trim()) return;
    setCities((prev) =>
      prev.map((c) =>
        c.id === cityId
          ? { ...c, localAreas: Array.from(new Set([...c.localAreas, newAreaName.trim()])) }
          : c
      )
    );
    setNewAreaName("");
    addNotification("Added local area / locality.", "success");
  };

  const handleDeleteCity = (id: string) => {
    setCities((prev) => prev.filter((c) => c.id !== id));
    addNotification("City deleted.", "info");
  };

  // Handlers for Tab 4: Catalog
  const handleAddCatalogItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName) {
      addNotification("Please enter a brand name.", "error");
      return;
    }
    const modelsArr = newModelInput
      .split(",")
      .map((m) => m.trim())
      .filter(Boolean);
    const newItem: VehicleBrandCatalogItem = {
      id: "vcat_" + Date.now(),
      category: newCatName,
      brand: newBrandName,
      models: modelsArr.length ? modelsArr : ["Standard Model"],
      colors: ["White", "Silver", "Black", "Red", "Blue", "Grey"]
    };
    setCatalog((prev) => [newItem, ...prev]);
    setNewBrandName("");
    setNewModelInput("");
    addNotification(`Added ${newItem.brand} under ${newItem.category}.`, "success");
  };

  const handleAddModelToCatalog = (catId: string) => {
    if (!addModelToCatalogInput.trim()) return;
    setCatalog((prev) =>
      prev.map((c) =>
        c.id === catId
          ? { ...c, models: Array.from(new Set([...c.models, addModelToCatalogInput.trim()])) }
          : c
      )
    );
    setAddModelToCatalogInput("");
    addNotification("Added vehicle model to brand catalog.", "success");
  };

  const handleDeleteCatalog = (id: string) => {
    setCatalog((prev) => prev.filter((c) => c.id !== id));
    addNotification("Brand catalog entry deleted.", "info");
  };

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        
        {/* Header Bar */}
        <div className="bg-amber-400 text-slate-950 p-5 flex items-center justify-between border-b border-amber-500 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-black text-xl shadow-md">
              🗄️
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-wider font-mono text-slate-950 flex items-center gap-2">
                Signup Database Management Admin
              </h2>
              <p className="text-xs text-slate-800 font-mono font-medium">
                Master Management Interface for Onboarding Data & Catalog Rules
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-950/10 hover:bg-slate-950/20 text-slate-950 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-white border-b border-slate-200 p-2 flex flex-wrap gap-1.5 overflow-x-auto no-scrollbar">
          {[
            { id: "countries", label: "Countries We Serve", icon: Globe, count: countries.length },
            { id: "mail", label: "Mail IDs List", icon: Mail, count: mailList.length },
            { id: "cities", label: "Cities & Local Areas", icon: MapPin, count: cities.length },
            { id: "catalog", label: "Vehicle Catalog", icon: Car, count: catalog.length }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap",
                  isActive
                    ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                )}
              >
                <Icon size={16} className={isActive ? "text-slate-950" : "text-amber-500"} />
                <span>{tab.label}</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold",
                  isActive ? "bg-slate-950 text-amber-400" : "bg-slate-200 text-slate-700"
                )}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Modal Body Scroll Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: COUNTRIES WE SERVE */}
          {activeTab === "countries" && (
            <div className="space-y-6">
              
              {/* Add Country Form */}
              <form onSubmit={handleAddCountry} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                  <PlusCircle size={16} className="text-amber-600" />
                  <span>Add New Country to Master List</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 font-mono">Flag Emoji</label>
                    <input
                      type="text"
                      value={newCountryFlag}
                      onChange={(e) => setNewCountryFlag(e.target.value)}
                      placeholder="🇮🇳"
                      className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-center text-lg font-bold outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 font-mono">Country Name</label>
                    <input
                      type="text"
                      value={newCountryName}
                      onChange={(e) => setNewCountryName(e.target.value)}
                      placeholder="e.g. India, Brazil, UAE"
                      className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-sm font-bold text-slate-900 outline-none focus:border-amber-500 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 font-mono">Dial Code</label>
                    <input
                      type="text"
                      value={newCountryCode}
                      onChange={(e) => setNewCountryCode(e.target.value)}
                      placeholder="+91"
                      className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-sm font-bold text-slate-900 outline-none focus:border-amber-500 font-mono"
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={16} /> <span>Save Country to Active Registration List</span>
                </button>
              </form>

              {/* Countries Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">Flag & Name</th>
                      <th className="p-3">Dial Code</th>
                      <th className="p-3">Active Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {countries.map((c) => (
                      <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <span className="text-xl">{c.flag}</span>
                          <span>{c.name}</span>
                        </td>
                        <td className="p-3 font-extrabold text-amber-700">{c.code}</td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={() => toggleCountryActive(c.id)}
                            className={cn(
                              "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider cursor-pointer border",
                              c.active
                                ? "bg-emerald-100 border-emerald-300 text-emerald-800"
                                : "bg-slate-100 border-slate-300 text-slate-500"
                            )}
                          >
                            {c.active ? "✓ Active" : "Disabled"}
                          </button>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => deleteCountry(c.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Country"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 2: MAIL IDS LIST & PROMOTIONAL SUBSCRIBERS */}
          {activeTab === "mail" && (
            <div className="space-y-6">

              {/* Toolbar: Search, Filters, Add & Export */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                <div className="relative flex-1">
                  <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={mailSearch}
                    onChange={(e) => setMailSearch(e.target.value)}
                    placeholder="Search by email, name, phone..."
                    className="w-full h-11 bg-white border border-slate-300 rounded-xl pl-10 pr-4 text-xs font-bold text-slate-900 outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={mailRoleFilter}
                    onChange={(e) => setMailRoleFilter(e.target.value as any)}
                    className="h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-bold text-slate-900 outline-none focus:border-amber-500 font-mono cursor-pointer"
                  >
                    <option value="all">Role: All Users</option>
                    <option value="rider">Riders Only</option>
                    <option value="driver">Drivers Only</option>
                  </select>

                  <select
                    value={mailPromoFilter}
                    onChange={(e) => setMailPromoFilter(e.target.value as any)}
                    className="h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-bold text-slate-900 outline-none focus:border-amber-500 font-mono cursor-pointer"
                  >
                    <option value="all">Promo Mailers: All</option>
                    <option value="subscribed">Subscribed Only</option>
                    <option value="unsubscribed">Unsubscribed</option>
                  </select>

                  <button
                    type="button"
                    onClick={() => setShowAddMailModal(true)}
                    className="h-11 bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs uppercase tracking-wider px-4 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-xs"
                  >
                    <Plus size={16} /> <span>Add Email</span>
                  </button>

                  <button
                    type="button"
                    onClick={exportMailCSV}
                    className="h-11 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider px-4 rounded-xl flex items-center gap-2 cursor-pointer transition-all shadow-xs"
                  >
                    <Download size={16} /> <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Add Mail User Drawer Modal */}
              {showAddMailModal && (
                <form onSubmit={handleAddMailUser} className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-2">
                    <h4 className="text-xs font-black uppercase text-amber-950 font-mono">
                      Add New Registered Mail Record
                    </h4>
                    <button type="button" onClick={() => setShowAddMailModal(false)} className="text-amber-900">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[10px] font-black uppercase text-amber-900 font-mono">Full Name</label>
                      <input
                        type="text"
                        value={newMailName}
                        onChange={(e) => setNewMailName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full h-10 bg-white border border-amber-300 rounded-xl px-3 text-xs font-bold text-slate-900 outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-amber-900 font-mono">Email Address *</label>
                      <input
                        type="email"
                        value={newMailEmail}
                        onChange={(e) => setNewMailEmail(e.target.value)}
                        placeholder="user@example.com"
                        className="w-full h-10 bg-white border border-amber-300 rounded-xl px-3 text-xs font-bold text-slate-900 outline-none font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-amber-900 font-mono">Phone Number</label>
                      <input
                        type="text"
                        value={newMailPhone}
                        onChange={(e) => setNewMailPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className="w-full h-10 bg-white border border-amber-300 rounded-xl px-3 text-xs font-bold text-slate-900 outline-none font-mono"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-900 font-mono cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          checked={newMailRole === "rider"}
                          onChange={() => setNewMailRole("rider")}
                        />
                        <span>Rider</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-900 font-mono cursor-pointer">
                        <input
                          type="radio"
                          name="role"
                          checked={newMailRole === "driver"}
                          onChange={() => setNewMailRole("driver")}
                        />
                        <span>Driver</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs font-bold text-slate-900 font-mono cursor-pointer ml-4">
                        <input
                          type="checkbox" className="w-5 h-5 rounded-md border-2 border-slate-300 text-amber-500 accent-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none cursor-pointer shadow-2xs transition-all shrink-0" aria-label="Option selection"
                          checked={newMailPromo}
                          onChange={(e) => setNewMailPromo(e.target.checked)}
                        />
                        <span>Promo Mail Subscription</span>
                      </label>
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-900 text-amber-400 text-xs font-black uppercase rounded-xl shadow-xs cursor-pointer"
                    >
                      Save Email Record
                    </button>
                  </div>
                </form>
              )}

              {/* Mail IDs Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="p-3">User & Contact</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Promo Mail Subscription</th>
                      <th className="p-3">Rules Agreed</th>
                      <th className="p-3">Created</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {filteredMailList.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-slate-900">{m.name}</div>
                          <div className="my-1">
                            <span className={cn(
                              "inline-block px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider",
                              m.role === "driver" ? "bg-amber-100 text-amber-950 border border-amber-300" : "bg-sky-100 text-sky-950 border border-sky-300"
                            )}>
                              {m.role === "driver" ? "👨‍✈️ Driver" : "👤 Rider"}
                            </span>
                          </div>
                          <div className="text-[11px] text-amber-700 font-bold">{m.email}</div>
                          <div className="text-[10px] text-slate-500">{m.phone}</div>
                        </td>
                        <td className="p-3">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider",
                            m.role === "driver" ? "bg-amber-100 text-amber-950 border border-amber-300" : "bg-sky-100 text-sky-950 border border-sky-300"
                          )}>
                            {m.role === "driver" ? "👨‍✈️ Driver" : "👤 Rider"}
                          </span>
                        </td>
                        <td className="p-3">
                          {m.promoSubscribed ? (
                            <span className="text-emerald-700 font-extrabold flex items-center gap-1">
                              <CheckCircle2 size={14} /> Subscribed
                            </span>
                          ) : (
                            <span className="text-slate-400 font-medium">Not Subscribed</span>
                          )}
                        </td>
                        <td className="p-3">
                          {m.rulesAccepted ? (
                            <span className="text-emerald-600 font-bold">✓ Agreed</span>
                          ) : (
                            <span className="text-slate-400">Pending</span>
                          )}
                        </td>
                        <td className="p-3 text-slate-500 font-medium">{m.createdAt}</td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => deleteMailUser(m.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete User Record"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: CITIES & LOCAL AREAS */}
          {activeTab === "cities" && (
            <div className="space-y-6">

              {/* Add City Form */}
              <form onSubmit={handleAddCity} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                  <MapPin size={16} className="text-amber-600" />
                  <span>Add Operating City to Signup Dropdown</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 font-mono">City Name *</label>
                    <input
                      type="text"
                      value={newCityName}
                      onChange={(e) => setNewCityName(e.target.value)}
                      placeholder="e.g. Pune, Nagpur, Chandigarh"
                      className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-sm font-bold text-slate-900 outline-none focus:border-amber-500 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 font-mono">State / Region</label>
                    <input
                      type="text"
                      value={newCityState}
                      onChange={(e) => setNewCityState(e.target.value)}
                      placeholder="Maharashtra, Punjab, etc."
                      className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-sm font-bold text-slate-900 outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Plus size={16} /> <span>Save City</span>
                    </button>
                  </div>
                </div>
              </form>

              {/* Cities Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {cities.map((city) => (
                  <div key={city.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-amber-600" />
                        <div>
                          <span className="font-black text-sm text-slate-900 font-mono">{city.name}</span>
                          <span className="text-[10px] text-slate-500 font-mono ml-2">({city.state})</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCity(city.id)}
                        className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Neighborhoods / Local Areas List */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider font-mono">
                        Local Areas / Neighborhoods ({city.localAreas.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {city.localAreas.map((area, idx) => (
                          <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg">
                            📍 {area}
                          </span>
                        ))}
                      </div>

                      {/* Add Area to City Input */}
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          value={selectedCityForArea === city.id ? newAreaName : ""}
                          onChange={(e) => {
                            setSelectedCityForArea(city.id);
                            setNewAreaName(e.target.value);
                          }}
                          placeholder="Add neighborhood (e.g. Baner, Bandra)"
                          className="flex-1 h-9 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 font-mono outline-none focus:border-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddAreaToCity(city.id)}
                          className="px-3 h-9 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase rounded-xl cursor-pointer shadow-xs"
                        >
                          + Add Area
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: VEHICLE MODELS & BRANDS MARKET CATALOG */}
          {activeTab === "catalog" && (
            <div className="space-y-6">

              {/* Add Vehicle Catalog Form */}
              <form onSubmit={handleAddCatalogItem} className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider font-mono flex items-center gap-2">
                  <Car size={16} className="text-amber-600" />
                  <span>Add Vehicle Brand & Models to Market Catalog</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 font-mono">Vehicle Category *</label>
                    <select
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-bold text-slate-900 outline-none focus:border-amber-500 font-mono cursor-pointer"
                    >
                      <option value="Car">Car / Sedan / Hatch / SUV</option>
                      <option value="Motorcycle">Motorcycle</option>
                      <option value="Scooter">Scooter / EV</option>
                      <option value="Micro-Van">Micro-Van</option>
                      <option value="Auto Rickshaw">Auto Rickshaw</option>
                      <option value="Medical Van">Medical Van</option>
                      <option value="Other Vehicle">Other Vehicle</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 font-mono">Brand Name *</label>
                    <input
                      type="text"
                      value={newBrandName}
                      onChange={(e) => setNewBrandName(e.target.value)}
                      placeholder="e.g. Toyota, Bajaj, TVS"
                      className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-sm font-bold text-slate-900 outline-none focus:border-amber-500 font-mono"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 font-mono">Models (Comma Separated)</label>
                    <input
                      type="text"
                      value={newModelInput}
                      onChange={(e) => setNewModelInput(e.target.value)}
                      placeholder="Innova, Fortuner, Glanza"
                      className="w-full h-11 bg-white border border-slate-300 rounded-xl px-3 text-xs font-bold text-slate-900 outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full h-11 bg-slate-900 hover:bg-slate-800 text-amber-400 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Plus size={16} /> <span>Save Brand & Models to Driver Registration Catalog</span>
                </button>
              </form>

              {/* Catalog Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catalog.map((item) => (
                  <div key={item.id} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="p-2 bg-amber-100 text-amber-900 rounded-xl font-bold text-sm font-mono">
                          {item.brand}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                          ({item.category})
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteCatalog(item.id)}
                        className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {/* Models List */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-wider font-mono">
                        Available Models ({item.models.length})
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {item.models.map((m, idx) => (
                          <span key={idx} className="bg-slate-100 border border-slate-200 text-slate-900 text-[10px] font-mono font-black px-2.5 py-1 rounded-lg">
                            {m}
                          </span>
                        ))}
                      </div>

                      {/* Add Model to Brand */}
                      <div className="flex gap-2 pt-1">
                        <input
                          type="text"
                          value={selectedCatalogForModels === item.id ? addModelToCatalogInput : ""}
                          onChange={(e) => {
                            setSelectedCatalogForModels(item.id);
                            setAddModelToCatalogInput(e.target.value);
                          }}
                          placeholder="Add model (e.g. Swift Dzire)"
                          className="flex-1 h-9 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-bold text-slate-900 font-mono outline-none focus:border-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddModelToCatalog(item.id)}
                          className="px-3 h-9 bg-slate-900 text-amber-400 font-black text-xs uppercase rounded-xl cursor-pointer shadow-xs"
                        >
                          + Model
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 flex items-center justify-between text-xs font-mono">
          <div className="text-slate-500 font-bold">
            ⚡ Master Signup Data is persisted locally and synchronizes directly with the registration form.
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl hover:bg-amber-500 transition-all cursor-pointer shadow-xs border border-amber-500"
          >
            Close Master Admin
          </button>
        </div>

      </div>
    </div>
  );
};
