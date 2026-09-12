import React, { useState } from "react";
import { Globe, Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, CheckSquare, Square, Smartphone, ShieldCheck, Check } from "lucide-react";
import { CountryItem } from "./types";

interface CountryMasterTabProps {
  countries: CountryItem[];
  setCountries: React.Dispatch<React.SetStateAction<CountryItem[]>>;
  setToast: (toast: { show: boolean; message: string; type: "success" | "error" | "info" }) => void;
}

export const CountryMasterTab: React.FC<CountryMasterTabProps> = ({
  countries,
  setCountries,
  setToast
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCountry, setEditingCountry] = useState<CountryItem | null>(null);

  // Modal Form State
  const [formName, setFormName] = useState("");
  const [formCode, setFormCode] = useState("+");
  const [formIso, setFormIso] = useState("");
  const [formFlag, setFormFlag] = useState("🌐");
  const [formDigits, setFormDigits] = useState(10);
  const [formExample, setFormExample] = useState("1234567890");

  // Real-time Test Sandbox Input State
  const [testCountryId, setTestCountryId] = useState<string>(countries[0]?.id || "c_in");
  const [testInputPhone, setTestInputPhone] = useState<string>("");

  const activeTestCountry = countries.find((c) => c.id === testCountryId) || countries[0];

  const handleSelectAll = () => {
    setSelectedIds(countries.map((c) => c.id));
  };

  const handleDeselectAll = () => {
    setSelectedIds([]);
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleEnableSelected = () => {
    if (selectedIds.length === 0) return;
    setCountries((prev) =>
      prev.map((c) => (selectedIds.includes(c.id) ? { ...c, active: true } : c))
    );
    setToast({ show: true, message: `Enabled ${selectedIds.length} selected countries`, type: "success" });
  };

  const handleDisableSelected = () => {
    if (selectedIds.length === 0) return;
    setCountries((prev) =>
      prev.map((c) => (selectedIds.includes(c.id) ? { ...c, active: false } : c))
    );
    setToast({ show: true, message: `Disabled ${selectedIds.length} selected countries`, type: "info" });
  };

  const handleEnableAll = () => {
    setCountries((prev) => prev.map((c) => ({ ...c, active: true })));
    setToast({ show: true, message: "Enabled all countries in master list", type: "success" });
  };

  const handleDisableAll = () => {
    setCountries((prev) => prev.map((c) => ({ ...c, active: false })));
    setToast({ show: true, message: "Disabled all countries", type: "info" });
  };

  const handleOpenAddModal = () => {
    setEditingCountry(null);
    setFormName("");
    setFormCode("+");
    setFormIso("");
    setFormFlag("🌐");
    setFormDigits(10);
    setFormExample("9876543210");
    setShowModal(true);
  };

  const handleOpenEditModal = (c: CountryItem) => {
    setEditingCountry(c);
    setFormName(c.name);
    setFormCode(c.code);
    setFormIso(c.isoCode);
    setFormFlag(c.flag);
    setFormDigits(c.maxDigits);
    setFormExample(c.example);
    setShowModal(true);
  };

  const handleSaveCountry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formCode.trim()) return;

    const formattedCode = formCode.trim().startsWith("+") ? formCode.trim() : `+${formCode.trim()}`;
    const newItem: CountryItem = {
      id: editingCountry ? editingCountry.id : `c_${Date.now()}`,
      name: formName.trim(),
      code: formattedCode,
      isoCode: formIso.trim().toUpperCase() || "XX",
      flag: formFlag.trim() || "🌐",
      maxDigits: Number(formDigits) || 10,
      example: formExample.trim() || "1234567890",
      active: editingCountry ? editingCountry.active : true
    };

    if (editingCountry) {
      setCountries((prev) => prev.map((item) => (item.id === editingCountry.id ? newItem : item)));
    } else {
      setCountries((prev) => [...prev, newItem]);
    }

    setShowModal(false);
    setToast({
      show: true,
      message: `${editingCountry ? "Updated" : "Added"} country ${newItem.name} (${newItem.code})`,
      type: "success"
    });
  };

  const handleDeleteCountry = (id: string) => {
    setCountries((prev) => prev.filter((c) => c.id !== id));
    setToast({ show: true, message: "Country code removed", type: "info" });
  };

  const filteredCountries = countries.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.includes(searchQuery) ||
      c.isoCode.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Validate test input
  const isTestPhoneValid =
    activeTestCountry &&
    testInputPhone.length === activeTestCountry.maxDigits &&
    /^\d+$/.test(testInputPhone);

  return (
    <div className="space-y-6">
      {/* REAL-TIME TEST SANDBOX BANNER */}
      <div className="bg-amber-50/80 text-slate-900 p-5 rounded-3xl shadow-2xs border border-amber-200/90 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-3">
          <div>
            <h3 className="text-base font-black uppercase tracking-wider flex items-center gap-2 text-slate-900">
              <Smartphone size={18} className="text-amber-600" /> Real-Time Country Code & Input Formatting Sandbox
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Test how phone input digit limits and dial codes render live for any active country.
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

      {/* MASTER LIST FORM WITH BATCH ACTIONS */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Globe size={18} className="text-amber-500" /> World Country Master Registry ({countries.length})
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Select multiple countries to enable/disable in batch or add custom country codes.</p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center gap-2 cursor-pointer shadow-xs border border-amber-500 shrink-0"
          >
            <Plus size={16} /> Add Country Code
          </button>
        </div>

        {/* BATCH ACTION CONTROLS & SEARCH */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Batch Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={selectedIds.length === countries.length ? handleDeselectAll : handleSelectAll}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-extrabold uppercase transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {selectedIds.length === countries.length ? <Square size={14} /> : <CheckSquare size={14} />}
              <span>{selectedIds.length === countries.length ? "Deselect All" : "Select All"}</span>
            </button>

            {selectedIds.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={handleEnableSelected}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-extrabold uppercase transition-all cursor-pointer"
                >
                  Enable Selected ({selectedIds.length})
                </button>
                <button
                  type="button"
                  onClick={handleDisableSelected}
                  className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-extrabold uppercase transition-all cursor-pointer"
                >
                  Disable Selected ({selectedIds.length})
                </button>
              </>
            )}

            <button
              type="button"
              onClick={handleEnableAll}
              className="px-3 py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl text-xs font-extrabold uppercase transition-all cursor-pointer border border-amber-500"
            >
              Enable All
            </button>
            <button
              type="button"
              onClick={handleDisableAll}
              className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-extrabold uppercase transition-all cursor-pointer border border-slate-200"
            >
              Disable All
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-64">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country name or code..."
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* LIST FORM TABLE */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 text-[11px] font-black uppercase font-mono tracking-wider border-b border-slate-200">
                <th className="p-3.5 w-10 text-center">
                  <input
                    type="checkbox" className="w-5 h-5 rounded-md border-2 border-slate-300 text-amber-500 accent-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none cursor-pointer shadow-2xs transition-all shrink-0" aria-label="Option selection"
                    checked={selectedIds.length === countries.length && countries.length > 0}
                    onChange={(e) => (e.target.checked ? handleSelectAll() : handleDeselectAll())}

                  />
                </th>
                <th className="p-3.5">Country & Flag</th>
                <th className="p-3.5">Dial Code</th>
                <th className="p-3.5">ISO Code</th>
                <th className="p-3.5">Max Digits</th>
                <th className="p-3.5">Sample Example</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs font-bold text-slate-900">
              {filteredCountries.map((c) => {
                const isSelected = selectedIds.includes(c.id);
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
                        onChange={() => handleToggleSelect(c.id)}

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
                        {c.active ? "Enabled" : "Disabled"}
                      </button>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(c)}
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

      {/* ADD / EDIT COUNTRY MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[20000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Globe size={18} className="text-amber-500" /> {editingCountry ? "Edit Country Code" : "Add Country Code"}
            </h4>

            <form onSubmit={handleSaveCountry} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Country Name *</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
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
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="+81"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase">ISO Code</label>
                  <input
                    type="text"
                    value={formIso}
                    onChange={(e) => setFormIso(e.target.value)}
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
                    value={formFlag}
                    onChange={(e) => setFormFlag(e.target.value)}
                    placeholder="🇯🇵"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-center font-bold text-slate-900 outline-none"
                  />
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-[10px] font-extrabold text-slate-700 uppercase">Max Phone Digits</label>
                  <input
                    type="number"
                    value={formDigits}
                    onChange={(e) => setFormDigits(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Sample Example Phone Number</label>
                <input
                  type="text"
                  value={formExample}
                  onChange={(e) => setFormExample(e.target.value)}
                  placeholder="9012345678"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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
    </div>
  );
};
