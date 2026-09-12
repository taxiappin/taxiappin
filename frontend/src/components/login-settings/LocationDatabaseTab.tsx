import React, { useState } from "react";
import {
  Globe,
  MapPin,
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  CheckSquare,
  Square,
  Smartphone,
  ShieldCheck,
  Check,
  Tag,
  X,
  Layers,
  Filter
} from "lucide-react";
import { CountryItem, StateItem, CityItem } from "./types";

interface LocationDatabaseTabProps {
  countries: CountryItem[];
  setCountries: React.Dispatch<React.SetStateAction<CountryItem[]>>;
  states: StateItem[];
  setStates: React.Dispatch<React.SetStateAction<StateItem[]>>;
  cities: CityItem[];
  setCities: React.Dispatch<React.SetStateAction<CityItem[]>>;
  setToast: (toast: { show: boolean; message: string; type: "success" | "error" | "info" }) => void;
}

export const LocationDatabaseTab: React.FC<LocationDatabaseTabProps> = ({
  countries,
  setCountries,
  states,
  setStates,
  cities,
  setCities,
  setToast
}) => {
  // Subtabs: "countries" | "states" | "cities"
  const [subTab, setSubTab] = useState<"countries" | "states" | "cities">("countries");

  // ==================== TAB 1: COUNTRIES DATABASE STATE ====================
  const [countrySearch, setCountrySearch] = useState("");
  const [selectedCountryIds, setSelectedCountryIds] = useState<string[]>([]);
  const [showCountryModal, setShowCountryModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState<CountryItem | null>(null);

  const [formCountryName, setFormCountryName] = useState("");
  const [formCountryCode, setFormCountryCode] = useState("+");
  const [formCountryIso, setFormCountryIso] = useState("");
  const [formCountryFlag, setFormCountryFlag] = useState("🌐");
  const [formCountryDigits, setFormCountryDigits] = useState(10);
  const [formCountryExample, setFormCountryExample] = useState("1234567890");

  // Phone test sandbox
  const [testCountryId, setTestCountryId] = useState<string>(countries[0]?.id || "c_in");
  const [testInputPhone, setTestInputPhone] = useState<string>("");
  const activeTestCountry = countries.find((c) => c.id === testCountryId) || countries[0];

  // ==================== TAB 2: STATES DATABASE STATE ====================
  const [stateSearch, setStateSearch] = useState("");
  const [stateCountryFilter, setStateCountryFilter] = useState<string>("all");
  const [selectedStateIds, setSelectedStateIds] = useState<string[]>([]);
  const [showStateModal, setShowStateModal] = useState(false);
  const [editingState, setEditingState] = useState<StateItem | null>(null);

  const [formStateName, setFormStateName] = useState("");
  const [formStateCountry, setFormStateCountry] = useState(countries[0]?.name || "India");
  const [formStateCode, setFormStateCode] = useState("");

  // ==================== TAB 3: CITIES DATABASE STATE ====================
  const [citySearch, setCitySearch] = useState("");
  const [cityCountryFilter, setCityCountryFilter] = useState<string>("all");
  const [cityStateFilter, setCityStateFilter] = useState<string>("all");
  const [selectedCityIds, setSelectedCityIds] = useState<string[]>([]);
  const [showCityModal, setShowCityModal] = useState(false);
  const [editingCity, setEditingCity] = useState<CityItem | null>(null);

  const [formCityName, setFormCityName] = useState("");
  const [formCityState, setFormCityState] = useState(states[0]?.name || "Maharashtra");
  const [formCityCountry, setFormCityCountry] = useState(countries[0]?.name || "India");
  const [formCityTier, setFormCityTier] = useState("Tier 1");
  const [formCityAreas, setFormCityAreas] = useState("");

  // ==================== COUNTRY HANDLERS ====================
  const handleSelectAllCountries = () => setSelectedCountryIds(countries.map((c) => c.id));
  const handleDeselectAllCountries = () => setSelectedCountryIds([]);
  const handleToggleSelectCountry = (id: string) => {
    setSelectedCountryIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenAddCountry = () => {
    setEditingCountry(null);
    setFormCountryName("");
    setFormCountryCode("+");
    setFormCountryIso("");
    setFormCountryFlag("🌐");
    setFormCountryDigits(10);
    setFormCountryExample("9876543210");
    setShowCountryModal(true);
  };

  const handleOpenEditCountry = (c: CountryItem) => {
    setEditingCountry(c);
    setFormCountryName(c.name);
    setFormCountryCode(c.code);
    setFormCountryIso(c.isoCode);
    setFormCountryFlag(c.flag);
    setFormCountryDigits(c.maxDigits);
    setFormCountryExample(c.example);
    setShowCountryModal(true);
  };

  const handleSaveCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCountryName.trim() || !formCountryCode.trim()) return;

    const formattedCode = formCountryCode.trim().startsWith("+") ? formCountryCode.trim() : `+${formCountryCode.trim()}`;
    const newItem: CountryItem = {
      id: editingCountry ? editingCountry.id : `c_${Date.now()}`,
      name: formCountryName.trim(),
      code: formattedCode,
      isoCode: formCountryIso.trim().toUpperCase() || "XX",
      flag: formCountryFlag.trim() || "🌐",
      maxDigits: Number(formCountryDigits) || 10,
      example: formCountryExample.trim() || "1234567890",
      active: editingCountry ? editingCountry.active : true
    };

    if (editingCountry) {
      setCountries((prev) => prev.map((item) => (item.id === editingCountry.id ? newItem : item)));
    } else {
      setCountries((prev) => [...prev, newItem]);
    }

    setShowCountryModal(false);
    setToast({
      show: true,
      message: `${editingCountry ? "Updated" : "Added"} country ${newItem.name} (${newItem.code})`,
      type: "success"
    });
  };

  const handleDeleteCountry = (id: string) => {
    setCountries((prev) => prev.filter((c) => c.id !== id));
    setToast({ show: true, message: "Country removed from database", type: "info" });
  };

  // ==================== STATE HANDLERS ====================
  const handleSelectAllStates = () => setSelectedStateIds(states.map((s) => s.id));
  const handleDeselectAllStates = () => setSelectedStateIds([]);
  const handleToggleSelectState = (id: string) => {
    setSelectedStateIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenAddState = () => {
    setEditingState(null);
    setFormStateName("");
    setFormStateCountry(countries[0]?.name || "India");
    setFormStateCode("");
    setShowStateModal(true);
  };

  const handleOpenEditState = (s: StateItem) => {
    setEditingState(s);
    setFormStateName(s.name);
    setFormStateCountry(s.countryName);
    setFormStateCode(s.code || "");
    setShowStateModal(true);
  };

  const handleSaveState = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formStateName.trim()) return;

    const newItem: StateItem = {
      id: editingState ? editingState.id : `st_${Date.now()}`,
      name: formStateName.trim(),
      countryName: formStateCountry,
      code: formStateCode.trim().toUpperCase(),
      active: editingState ? editingState.active : true
    };

    if (editingState) {
      setStates((prev) => prev.map((item) => (item.id === editingState.id ? newItem : item)));
    } else {
      setStates((prev) => [...prev, newItem]);
    }

    setShowStateModal(false);
    setToast({
      show: true,
      message: `${editingState ? "Updated" : "Added"} state ${newItem.name} (${newItem.countryName})`,
      type: "success"
    });
  };

  const handleDeleteState = (id: string) => {
    setStates((prev) => prev.filter((s) => s.id !== id));
    setToast({ show: true, message: "State removed from database", type: "info" });
  };

  // ==================== CITY HANDLERS ====================
  const handleSelectAllCities = () => setSelectedCityIds(cities.map((c) => c.id));
  const handleDeselectAllCities = () => setSelectedCityIds([]);
  const handleToggleSelectCity = (id: string) => {
    setSelectedCityIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenAddCity = () => {
    setEditingCity(null);
    setFormCityName("");
    setFormCityCountry(countries[0]?.name || "India");
    setFormCityState(states[0]?.name || "Maharashtra");
    setFormCityTier("Tier 1");
    setFormCityAreas("");
    setShowCityModal(true);
  };

  const handleOpenEditCity = (c: CityItem) => {
    setEditingCity(c);
    setFormCityName(c.name);
    setFormCityState(c.stateName);
    setFormCityCountry(c.countryName);
    setFormCityTier(c.tier || "Tier 1");
    setFormCityAreas(c.localAreas ? c.localAreas.join(", ") : "");
    setShowCityModal(true);
  };

  const handleSaveCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCityName.trim()) return;

    const areasArr = formCityAreas
      .split(",")
      .map((a) => a.trim())
      .filter((a) => a.length > 0);

    const newItem: CityItem = {
      id: editingCity ? editingCity.id : `cty_${Date.now()}`,
      name: formCityName.trim(),
      stateName: formCityState,
      countryName: formCityCountry,
      tier: formCityTier,
      localAreas: areasArr.length > 0 ? areasArr : ["Central Area"],
      active: editingCity ? editingCity.active : true
    };

    if (editingCity) {
      setCities((prev) => prev.map((item) => (item.id === editingCity.id ? newItem : item)));
    } else {
      setCities((prev) => [...prev, newItem]);
    }

    setShowCityModal(false);
    setToast({
      show: true,
      message: `${editingCity ? "Updated" : "Added"} city ${newItem.name} (${newItem.stateName})`,
      type: "success"
    });
  };

  const handleDeleteCity = (id: string) => {
    setCities((prev) => prev.filter((c) => c.id !== id));
    setToast({ show: true, message: "City removed from database", type: "info" });
  };

  const handleAddLocalAreaToCity = (cityId: string, areaName: string) => {
    if (!areaName.trim()) return;
    setCities((prev) =>
      prev.map((c) => {
        if (c.id === cityId) {
          const currentAreas = c.localAreas || [];
          if (currentAreas.includes(areaName.trim())) return c;
          return { ...c, localAreas: [...currentAreas, areaName.trim()] };
        }
        return c;
      })
    );
  };

  const handleRemoveLocalAreaFromCity = (cityId: string, areaIndex: number) => {
    setCities((prev) =>
      prev.map((c) => {
        if (c.id === cityId && c.localAreas) {
          const updated = c.localAreas.filter((_, idx) => idx !== areaIndex);
          return { ...c, localAreas: updated };
        }
        return c;
      })
    );
  };

  // Filtered queries
  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.includes(countrySearch) ||
      c.isoCode.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const filteredStates = states.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(stateSearch.toLowerCase()) ||
      s.countryName.toLowerCase().includes(stateSearch.toLowerCase()) ||
      (s.code && s.code.toLowerCase().includes(stateSearch.toLowerCase()));
    const matchesCountry = stateCountryFilter === "all" || s.countryName === stateCountryFilter;
    return matchesSearch && matchesCountry;
  });

  const filteredCities = cities.filter((cty) => {
    const matchesSearch =
      cty.name.toLowerCase().includes(citySearch.toLowerCase()) ||
      cty.stateName.toLowerCase().includes(citySearch.toLowerCase()) ||
      cty.countryName.toLowerCase().includes(citySearch.toLowerCase());
    const matchesCountry = cityCountryFilter === "all" || cty.countryName === cityCountryFilter;
    const matchesState = cityStateFilter === "all" || cty.stateName === cityStateFilter;
    return matchesSearch && matchesCountry && matchesState;
  });

  // Phone regex check
  const isTestPhoneValid =
    activeTestCountry &&
    testInputPhone.length === activeTestCountry.maxDigits &&
    /^\d+$/.test(testInputPhone);

  return (
    <div className="space-y-6">
      {/* SUBTAB SWITCHER HEADER */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setSubTab("countries")}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            subTab === "countries"
              ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Globe size={16} className={subTab === "countries" ? "text-slate-950" : "text-amber-500"} />
          <span>Countries Database ({countries.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("states")}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            subTab === "states"
              ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <MapPin size={16} className={subTab === "states" ? "text-slate-950" : "text-amber-500"} />
          <span>States &amp; Provinces Database ({states.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setSubTab("cities")}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            subTab === "cities"
              ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-500/50"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Building2 size={16} className={subTab === "cities" ? "text-slate-950" : "text-amber-500"} />
          <span>Cities &amp; Local Areas Database ({cities.length})</span>
        </button>
      </div>

      {/* ==================== SUBTAB 1: COUNTRIES DATABASE ==================== */}
      {subTab === "countries" && (
        <div className="space-y-6">
          {/* PHONE FORMATTER SANDBOX */}
          <div className="bg-amber-50/80 text-slate-900 p-5 rounded-3xl shadow-2xs border border-amber-200/90 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-3">
              <div>
                <h3 className="text-base font-black uppercase tracking-wider flex items-center gap-2 text-slate-900">
                  <Smartphone size={18} className="text-amber-600" /> Real-Time Country Code & Input Formatting Sandbox
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Test dial codes and digit limits for any country in the location database.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-600 uppercase">Select Country</label>
                <select
                  value={testCountryId}
                  onChange={(e) => setTestCountryId(e.target.value)}
                  className="w-full bg-white border border-amber-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500 cursor-pointer shadow-2xs"
                >
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.flag} {c.name} ({c.code}) - {c.maxDigits} Digits
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="text-[10px] font-extrabold text-slate-600 uppercase">
                  Live Phone Number Test ({testInputPhone.length} / {activeTestCountry?.maxDigits || 10} Digits)
                </label>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2 bg-white border border-amber-200 rounded-xl text-xs font-mono font-black text-amber-900 shadow-2xs">
                    {activeTestCountry?.flag} {activeTestCountry?.code}
                  </span>
                  <input
                    type="tel"
                    maxLength={activeTestCountry?.maxDigits || 10}
                    value={testInputPhone}
                    onChange={(e) => setTestInputPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder={`e.g. ${activeTestCountry?.example || "9876543210"}`}
                    className="flex-1 bg-white border border-amber-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500 shadow-2xs"
                  />
                  <span
                    className={`px-3 py-2 rounded-xl text-xs font-black uppercase font-mono ${
                      isTestPhoneValid
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        : "bg-rose-100 text-rose-800 border border-rose-300"
                    }`}
                  >
                    {isTestPhoneValid ? "✓ Valid Format" : "Invalid Length"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* COUNTRIES TABLE CARD */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Globe size={18} className="text-amber-500" /> World Country Database ({countries.length})
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Manage dial codes, flag icons, and digit rules for driver & rider signups.</p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddCountry}
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-xs border border-amber-500 shrink-0"
              >
                <Plus size={16} /> Add Country
              </button>
            </div>

            {/* CONTROLS BAR */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={selectedCountryIds.length === countries.length ? handleDeselectAllCountries : handleSelectAllCountries}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  {selectedCountryIds.length === countries.length ? <Square size={14} /> : <CheckSquare size={14} />}
                  <span>{selectedCountryIds.length === countries.length ? "Deselect All" : "Select All"}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCountries((prev) => prev.map((c) => ({ ...c, active: true })))}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-extrabold uppercase transition-all cursor-pointer border border-amber-500"
                >
                  Enable All
                </button>
                <button
                  type="button"
                  onClick={() => setCountries((prev) => prev.map((c) => ({ ...c, active: false })))}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold uppercase transition-all cursor-pointer border border-slate-200"
                >
                  Disable All
                </button>
              </div>

              <div className="relative w-full md:w-64">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Search country or code..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* COUNTRIES TABLE */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 text-[11px] font-black uppercase font-mono tracking-wider border-b border-slate-200">
                    <th className="p-3.5 w-10 text-center">
                      <input
                        type="checkbox" className="w-5 h-5 rounded-md border-2 border-slate-300 text-amber-500 accent-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none cursor-pointer shadow-2xs transition-all shrink-0" aria-label="Option selection"
                        checked={selectedCountryIds.length === countries.length && countries.length > 0}
                        onChange={(e) => (e.target.checked ? handleSelectAllCountries() : handleDeselectAllCountries())}
                      />
                    </th>
                    <th className="p-3.5">Country & Flag</th>
                    <th className="p-3.5">Dial Code</th>
                    <th className="p-3.5">ISO Code</th>
                    <th className="p-3.5">Max Digits</th>
                    <th className="p-3.5">Sample Phone</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs font-bold text-slate-900">
                  {filteredCountries.map((c) => {
                    const isSelected = selectedCountryIds.includes(c.id);
                    return (
                      <tr
                        key={c.id}
                        className={`transition-colors hover:bg-amber-50/40 ${
                          isSelected ? "bg-amber-100/50" : !c.active ? "bg-slate-50/60 opacity-60" : "bg-white"
                        }`}
                      >
                        <td className="p-3.5 text-center">
                          <input
                            type="checkbox" className="w-5 h-5 rounded-md border-2 border-slate-300 text-amber-500 accent-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none cursor-pointer shadow-2xs transition-all shrink-0" aria-label="Option selection"
                            checked={isSelected}
                            onChange={() => handleToggleSelectCountry(c.id)}
                          />
                        </td>
                        <td className="p-3.5 font-extrabold flex items-center gap-2">
                          <span className="text-xl">{c.flag}</span>
                          <span>{c.name}</span>
                        </td>
                        <td className="p-3.5 font-mono font-black text-amber-900">{c.code}</td>
                        <td className="p-3.5 font-mono text-slate-600">{c.isoCode}</td>
                        <td className="p-3.5 font-mono">{c.maxDigits} digits</td>
                        <td className="p-3.5 font-mono text-slate-500">{c.example}</td>
                        <td className="p-3.5">
                          <button
                            type="button"
                            onClick={() =>
                              setCountries((prev) =>
                                prev.map((item) => (item.id === c.id ? { ...item, active: !item.active } : item))
                              )
                            }
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase cursor-pointer ${
                              c.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {c.active ? "Active" : "Disabled"}
                          </button>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditCountry(c)}
                              className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                              title="Edit Country"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCountry(c.id)}
                              className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                              title="Delete Country"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 2: STATES DATABASE ==================== */}
      {subTab === "states" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <MapPin size={18} className="text-amber-500" /> States & Provinces Database ({states.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage states and provinces mapped by country for driver location selection during registration.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddState}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-xs border border-amber-500 shrink-0"
            >
              <Plus size={16} /> Add State / Province
            </button>
          </div>

          {/* CONTROLS BAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={selectedStateIds.length === states.length ? handleDeselectAllStates : handleSelectAllStates}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {selectedStateIds.length === states.length ? <Square size={14} /> : <CheckSquare size={14} />}
                <span>{selectedStateIds.length === states.length ? "Deselect All" : "Select All"}</span>
              </button>

              <button
                type="button"
                onClick={() => setStates((prev) => prev.map((s) => ({ ...s, active: true })))}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-extrabold uppercase transition-all cursor-pointer border border-amber-500"
              >
                Enable All
              </button>
              <button
                type="button"
                onClick={() => setStates((prev) => prev.map((s) => ({ ...s, active: false })))}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold uppercase transition-all cursor-pointer border border-slate-200"
              >
                Disable All
              </button>
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              {/* Filter Country */}
              <select
                value={stateCountryFilter}
                onChange={(e) => setStateCountryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-900 outline-none cursor-pointer"
              >
                <option value="all">All Countries ({countries.length})</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>

              {/* Search */}
              <div className="relative flex-1 md:w-56">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={stateSearch}
                  onChange={(e) => setStateSearch(e.target.value)}
                  placeholder="Search state..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* STATES TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 text-[11px] font-black uppercase font-mono tracking-wider border-b border-slate-200">
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox" className="w-5 h-5 rounded-md border-2 border-slate-300 text-amber-500 accent-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none cursor-pointer shadow-2xs transition-all shrink-0" aria-label="Option selection"
                      checked={selectedStateIds.length === states.length && states.length > 0}
                      onChange={(e) => (e.target.checked ? handleSelectAllStates() : handleDeselectAllStates())}
                    />
                  </th>
                  <th className="p-3.5">State / Province Name</th>
                  <th className="p-3.5">Country</th>
                  <th className="p-3.5">Code / Abbr</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs font-bold text-slate-900">
                {filteredStates.map((s) => {
                  const isSelected = selectedStateIds.includes(s.id);
                  const matchedCountry = countries.find((c) => c.name === s.countryName);
                  return (
                    <tr
                      key={s.id}
                      className={`transition-colors hover:bg-amber-50/40 ${
                        isSelected ? "bg-amber-100/50" : !s.active ? "bg-slate-50/60 opacity-60" : "bg-white"
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox" className="w-5 h-5 rounded-md border-2 border-slate-300 text-amber-500 accent-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none cursor-pointer shadow-2xs transition-all shrink-0" aria-label="Option selection"
                          checked={isSelected}
                          onChange={() => handleToggleSelectState(s.id)}
                        />
                      </td>
                      <td className="p-3.5 font-extrabold text-slate-900">{s.name}</td>
                      <td className="p-3.5 font-extrabold text-slate-700 flex items-center gap-1.5">
                        <span>{matchedCountry?.flag || "🌐"}</span>
                        <span>{s.countryName}</span>
                      </td>
                      <td className="p-3.5 font-mono text-slate-600">{s.code || "-"}</td>
                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() =>
                            setStates((prev) =>
                              prev.map((item) => (item.id === s.id ? { ...item, active: !item.active } : item))
                            )
                          }
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase cursor-pointer ${
                            s.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {s.active ? "Active" : "Disabled"}
                        </button>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditState(s)}
                            className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                            title="Edit State"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteState(s.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Delete State"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== SUBTAB 3: CITIES DATABASE ==================== */}
      {subTab === "cities" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Building2 size={18} className="text-amber-500" /> Cities & Local Operating Areas Database ({cities.length})
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage operating cities, classification tiers, and local area zones for rider & driver matching.
              </p>
            </div>

            <button
              type="button"
              onClick={handleOpenAddCity}
              className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-xs border border-amber-500 shrink-0"
            >
              <Plus size={16} /> Add City
            </button>
          </div>

          {/* CONTROLS BAR */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={selectedCityIds.length === cities.length ? handleDeselectAllCities : handleSelectAllCities}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {selectedCityIds.length === cities.length ? <Square size={14} /> : <CheckSquare size={14} />}
                <span>{selectedCityIds.length === cities.length ? "Deselect All" : "Select All"}</span>
              </button>

              <button
                type="button"
                onClick={() => setCities((prev) => prev.map((c) => ({ ...c, active: true })))}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-extrabold uppercase transition-all cursor-pointer border border-amber-500"
              >
                Enable All
              </button>
              <button
                type="button"
                onClick={() => setCities((prev) => prev.map((c) => ({ ...c, active: false })))}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold uppercase transition-all cursor-pointer border border-slate-200"
              >
                Disable All
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {/* Filter Country */}
              <select
                value={cityCountryFilter}
                onChange={(e) => setCityCountryFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-900 outline-none cursor-pointer"
              >
                <option value="all">All Countries</option>
                {countries.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.flag} {c.name}
                  </option>
                ))}
              </select>

              {/* Filter State */}
              <select
                value={cityStateFilter}
                onChange={(e) => setCityStateFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-2xl px-3 py-2 text-xs font-bold text-slate-900 outline-none cursor-pointer"
              >
                <option value="all">All States</option>
                {states.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name} ({s.countryName})
                  </option>
                ))}
              </select>

              {/* Search */}
              <div className="relative flex-1 md:w-48">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={citySearch}
                  onChange={(e) => setCitySearch(e.target.value)}
                  placeholder="Search city or area..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* CITIES TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-800 text-[11px] font-black uppercase font-mono tracking-wider border-b border-slate-200">
                  <th className="p-3.5 w-10 text-center">
                    <input
                      type="checkbox" className="w-5 h-5 rounded-md border-2 border-slate-300 text-amber-500 accent-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none cursor-pointer shadow-2xs transition-all shrink-0" aria-label="Option selection"
                      checked={selectedCityIds.length === cities.length && cities.length > 0}
                      onChange={(e) => (e.target.checked ? handleSelectAllCities() : handleDeselectAllCities())}
                    />
                  </th>
                  <th className="p-3.5 w-40">City Name & Tier</th>
                  <th className="p-3.5 w-36">State & Country</th>
                  <th className="p-3.5">Operating Local Areas / Zones (Interactive Tags)</th>
                  <th className="p-3.5 w-24">Status</th>
                  <th className="p-3.5 w-20 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs font-bold text-slate-900">
                {filteredCities.map((cty) => {
                  const isSelected = selectedCityIds.includes(cty.id);
                  const matchedCountry = countries.find((c) => c.name === cty.countryName);
                  return (
                    <tr
                      key={cty.id}
                      className={`transition-colors hover:bg-amber-50/40 ${
                        isSelected ? "bg-amber-100/50" : !cty.active ? "bg-slate-50/60 opacity-60" : "bg-white"
                      }`}
                    >
                      <td className="p-3.5 text-center">
                        <input
                          type="checkbox" className="w-5 h-5 rounded-md border-2 border-slate-300 text-amber-500 accent-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none cursor-pointer shadow-2xs transition-all shrink-0" aria-label="Option selection"
                          checked={isSelected}
                          onChange={() => handleToggleSelectCity(cty.id)}
                        />
                      </td>
                      <td className="p-3.5 font-extrabold text-slate-900">
                        <span className="text-sm font-black block">{cty.name}</span>
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-900 border border-amber-200 font-mono text-[9px] uppercase rounded font-bold inline-block mt-0.5">
                          {cty.tier || "Tier 1"}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-700">
                        <span className="font-bold block text-xs">{cty.stateName}</span>
                        <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                          <span>{matchedCountry?.flag || "🌐"}</span>
                          <span>{cty.countryName}</span>
                        </span>
                      </td>
                      <td className="p-3.5">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {(cty.localAreas || []).map((area, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800 flex items-center gap-1 transition-all"
                            >
                              <span>{area}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveLocalAreaFromCity(cty.id, idx)}
                                className="text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                                title={`Remove ${area}`}
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}

                          <input
                            type="text"
                            placeholder="+ Add Area & Enter"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const val = e.currentTarget.value;
                                handleAddLocalAreaToCity(cty.id, val);
                                e.currentTarget.value = "";
                              }
                            }}
                            className="px-2 py-0.5 bg-amber-50/70 border border-amber-300 rounded-lg text-xs font-mono font-bold text-slate-800 outline-none focus:bg-white focus:border-amber-500 w-36"
                          />
                        </div>
                      </td>
                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() =>
                            setCities((prev) =>
                              prev.map((item) => (item.id === cty.id ? { ...item, active: !item.active } : item))
                            )
                          }
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase cursor-pointer ${
                            cty.active ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"
                          }`}
                        >
                          {cty.active ? "Active" : "Disabled"}
                        </button>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditCity(cty)}
                            className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
                            title="Edit City"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteCity(cty.id)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                            title="Delete City"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== ADD / EDIT COUNTRY MODAL ==================== */}
      {showCountryModal && (
        <div className="fixed inset-0 z-[20000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Globe size={18} className="text-amber-500" /> {editingCountry ? "Edit Country" : "Add Country to Database"}
            </h4>

            <form onSubmit={handleSaveCountry} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Country Name *</label>
                <input
                  type="text"
                  value={formCountryName}
                  onChange={(e) => setFormCountryName(e.target.value)}
                  placeholder="e.g. Japan, Brazil, India"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase">Dial Code *</label>
                  <input
                    type="text"
                    value={formCountryCode}
                    onChange={(e) => setFormCountryCode(e.target.value)}
                    placeholder="+81"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase">ISO Code</label>
                  <input
                    type="text"
                    value={formCountryIso}
                    onChange={(e) => setFormCountryIso(e.target.value)}
                    placeholder="JP"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase">Flag Emoji</label>
                  <input
                    type="text"
                    value={formCountryFlag}
                    onChange={(e) => setFormCountryFlag(e.target.value)}
                    placeholder="🇯🇵"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-center font-bold text-slate-900 outline-none"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase">Max Phone Digits</label>
                  <input
                    type="number"
                    value={formCountryDigits}
                    onChange={(e) => setFormCountryDigits(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Sample Example Phone Number</label>
                <input
                  type="text"
                  value={formCountryExample}
                  onChange={(e) => setFormCountryExample(e.target.value)}
                  placeholder="9012345678"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCountryModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-xs border border-amber-500"
                >
                  Save Country
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ADD / EDIT STATE MODAL ==================== */}
      {showStateModal && (
        <div className="fixed inset-0 z-[20000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <MapPin size={18} className="text-amber-500" /> {editingState ? "Edit State / Province" : "Add State / Province"}
            </h4>

            <form onSubmit={handleSaveState} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Country *</label>
                <select
                  value={formStateCountry}
                  onChange={(e) => setFormStateCountry(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none"
                >
                  {countries.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">State / Province Name *</label>
                <input
                  type="text"
                  value={formStateName}
                  onChange={(e) => setFormStateName(e.target.value)}
                  placeholder="e.g. Maharashtra, California, Ontario"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">State Code / Abbreviation</label>
                <input
                  type="text"
                  value={formStateCode}
                  onChange={(e) => setFormStateCode(e.target.value)}
                  placeholder="e.g. MH, CA, ON"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowStateModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-xs border border-amber-500"
                >
                  Save State
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== ADD / EDIT CITY MODAL ==================== */}
      {showCityModal && (
        <div className="fixed inset-0 z-[20000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Building2 size={18} className="text-amber-500" /> {editingCity ? "Edit City" : "Add City to Database"}
            </h4>

            <form onSubmit={handleSaveCity} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase">Country *</label>
                  <select
                    value={formCityCountry}
                    onChange={(e) => setFormCityCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none"
                  >
                    {countries.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.flag} {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase">State *</label>
                  <select
                    value={formCityState}
                    onChange={(e) => setFormCityState(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none"
                  >
                    {states.map((s) => (
                      <option key={s.id} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">City Name *</label>
                <input
                  type="text"
                  value={formCityName}
                  onChange={(e) => setFormCityName(e.target.value)}
                  placeholder="e.g. Pune, Mumbai, Los Angeles"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">City Classification Tier</label>
                <select
                  value={formCityTier}
                  onChange={(e) => setFormCityTier(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none"
                >
                  <option value="Tier 1">Tier 1 (Metropolitan)</option>
                  <option value="Tier 2">Tier 2 (Growth City)</option>
                  <option value="Tier 3">Tier 3 (Regional)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Operating Local Areas / Suburbs (Comma Separated)</label>
                <input
                  type="text"
                  value={formCityAreas}
                  onChange={(e) => setFormCityAreas(e.target.value)}
                  placeholder="e.g. Baner, Hinjawadi, Kothrud, Viman Nagar"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCityModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-xs border border-amber-500"
                >
                  Save City
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
