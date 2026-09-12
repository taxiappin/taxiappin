import React, { useState } from "react";
import { User, Plus, Trash2, Search, SlidersHorizontal, Check, ShieldCheck, Mail, Smartphone, Layers, CheckCircle2 } from "lucide-react";
import { RiderFieldItem } from "./types";

interface RiderFieldsTabProps {
  riderFields: Record<string, RiderFieldItem>;
  setRiderFields: React.Dispatch<React.SetStateAction<Record<string, RiderFieldItem>>>;
  setPreviewFlow: (flow: "login" | "rider" | "driver" | "reset") => void;
  setPreviewRiderStep: (step: number) => void;
  setToast: (toast: { show: boolean; message: string; type: "success" | "error" | "info" }) => void;
}

export const RiderFieldsTab: React.FC<RiderFieldsTabProps> = ({
  riderFields,
  setRiderFields,
  setPreviewFlow,
  setPreviewRiderStep,
  setToast
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStep, setFilterStep] = useState<number | "all">("all");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Field Modal State
  const [newLabel, setNewLabel] = useState("");
  const [newKey, setNewKey] = useState("");
  const [newHelper, setNewHelper] = useState("");
  const [newType, setNewType] = useState("text");
  const [newStepId, setNewStepId] = useState<number>(2);
  const [newMandatory, setNewMandatory] = useState(false);

  // 3 Detailed Rider Steps Summary Definition
  const riderStepsSummary = [
    {
      id: 1,
      title: "Step 1: Phone, Email & Password Setup",
      subtitle: "OTP Phone dispatch, email verification, account password & policy consent checkboxes."
    },
    {
      id: 2,
      title: "Step 2: Personal Details & Custom Inputs",
      subtitle: "Full name, city, DOB, emergency contact, referral tag, and admin custom rider fields."
    },
    {
      id: 3,
      title: "Step 3: Account Review & Final Registration",
      subtitle: "Review submitted profile information and complete rider account activation."
    }
  ];

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    const key = newKey.trim() || `custom_rider_${Date.now()}`;
    setRiderFields((prev) => ({
      ...prev,
      [key]: {
        key,
        enabled: true,
        mandatory: newMandatory,
        label: newLabel.trim(),
        helper: newHelper.trim() || "Custom rider input field",
        type: newType,
        stepId: newStepId
      }
    }));
    setShowAddModal(false);
    setNewLabel("");
    setNewKey("");
    setNewHelper("");
    setToast({ show: true, message: `Added rider field "${newLabel}" to Step ${newStepId}`, type: "success" });
  };

  const handleDeleteField = (key: string) => {
    setRiderFields((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setToast({ show: true, message: "Field removed", type: "info" });
  };

  const filteredFields = Object.entries(riderFields).filter(([key, item]) => {
    const matchesSearch =
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.helper && item.helper.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStep = filterStep === "all" || (item.stepId || 2) === filterStep;
    return matchesSearch && matchesStep;
  });

  return (
    <div className="space-y-6">
      {/* RIDER FIELDS MANAGEMENT TABLE */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <SlidersHorizontal size={18} className="text-amber-500" /> Rider Form Fields Directory Table
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Manage custom and standard input fields across all rider registration steps.</p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs border border-amber-500 shrink-0"
          >
            <Plus size={16} /> Add Custom Field
          </button>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search rider fields by label or key..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <span className="text-xs font-extrabold text-slate-500 uppercase">Filter Step:</span>
            <select
              value={filterStep}
              onChange={(e) => setFilterStep(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="all">All Steps ({Object.keys(riderFields).length})</option>
              <option value={1}>Step 1 (Verify)</option>
              <option value={2}>Step 2 (Personal)</option>
              <option value={3}>Step 3 (Confirm)</option>
            </select>
          </div>
        </div>

        {/* RIDER FIELDS TABLE FORMAT */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 text-[11px] font-black uppercase font-mono tracking-wider border-b border-slate-200">
                <th className="p-3.5 w-24">Step</th>
                <th className="p-3.5">Field Title & Key</th>
                <th className="p-3.5 w-36">Control Type</th>
                <th className="p-3.5">Helper Instruction Text</th>
                <th className="p-3.5 w-24 text-center">Required</th>
                <th className="p-3.5 w-24 text-center">Status</th>
                <th className="p-3.5 w-16 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredFields.map(([key, item]) => (
                <tr key={key} className={`hover:bg-slate-50/80 transition-colors ${!item.enabled ? "opacity-60 bg-slate-50/50" : ""}`}>
                  {/* STEP SELECT */}
                  <td className="p-3">
                    <select
                      value={item.stepId || 2}
                      onChange={(e) =>
                        setRiderFields((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], stepId: Number(e.target.value) }
                        }))
                      }
                      className="bg-amber-100 text-amber-900 border border-amber-200 rounded-lg px-2 py-1 text-[11px] font-bold outline-none cursor-pointer"
                    >
                      <option value={1}>Step 1</option>
                      <option value={2}>Step 2</option>
                      <option value={3}>Step 3</option>
                    </select>
                  </td>

                  {/* FIELD LABEL & KEY */}
                  <td className="p-3">
                    <input
                      type="text"
                      value={item.label}
                      onChange={(e) =>
                        setRiderFields((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], label: e.target.value }
                        }))
                      }
                      className="font-black text-xs text-slate-900 uppercase bg-transparent outline-none border-b border-dashed border-slate-300 focus:border-amber-500 w-full"
                    />
                    <span className="text-[10px] font-mono text-slate-400 block mt-0.5">key: {item.key}</span>
                  </td>

                  {/* INPUT TYPE */}
                  <td className="p-3">
                    <select
                      value={item.type || "text"}
                      onChange={(e) =>
                        setRiderFields((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], type: e.target.value }
                        }))
                      }
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-800 outline-none cursor-pointer w-full"
                    >
                      <option value="text">Text Line</option>
                      <option value="email">Email</option>
                      <option value="tel">Phone</option>
                      <option value="date">Date (DOB)</option>
                      <option value="select">Dropdown</option>
                    </select>
                  </td>

                  {/* HELPER TEXT */}
                  <td className="p-3">
                    <input
                      type="text"
                      value={item.helper || ""}
                      onChange={(e) =>
                        setRiderFields((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], helper: e.target.value }
                        }))
                      }
                      placeholder="Helper instructions..."
                      className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 outline-none focus:border-amber-500"
                    />
                  </td>

                  {/* REQUIRED MANDATORY TOGGLE */}
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        setRiderFields((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], mandatory: !prev[key].mandatory }
                        }))
                      }
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase cursor-pointer border ${
                        item.mandatory ? "bg-amber-400 text-slate-950 border-amber-500" : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}
                    >
                      {item.mandatory ? "Required" : "Optional"}
                    </button>
                  </td>

                  {/* ACTIVE TOGGLE */}
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() =>
                        setRiderFields((prev) => ({
                          ...prev,
                          [key]: { ...prev[key], enabled: !prev[key].enabled }
                        }))
                      }
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase cursor-pointer border ${
                        item.enabled ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {item.enabled ? "Active" : "Disabled"}
                    </button>
                  </td>

                  {/* ACTION */}
                  <td className="p-3 text-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteField(key)}
                      className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                      title="Delete Field"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD RIDER FIELD MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-[20000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Plus size={18} className="text-amber-500" /> Add Custom Rider Field
            </h4>

            <form onSubmit={handleAddField} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Field Label Name *</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Passport Number, Preferred Language"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Step Placement</label>
                <select
                  value={newStepId}
                  onChange={(e) => setNewStepId(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none"
                >
                  <option value={1}>Step 1: Phone, Email & Password</option>
                  <option value={2}>Step 2: Personal Details</option>
                  <option value={3}>Step 3: Review & Submit</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Field Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none"
                >
                  <option value="text">Text Input</option>
                  <option value="email">Email</option>
                  <option value="tel">Phone / Number</option>
                  <option value="date">Date Picker</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Helper Instruction Subtext</label>
                <input
                  type="text"
                  value={newHelper}
                  onChange={(e) => setNewHelper(e.target.value)}
                  placeholder="e.g. Enter valid identity code"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox" className="w-5 h-5 rounded-md border-2 border-slate-300 text-amber-500 accent-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none cursor-pointer shadow-2xs transition-all shrink-0" aria-label="Option selection"
                  id="newRiderMandatoryCheck"
                  checked={newMandatory}
                  onChange={(e) => setNewMandatory(e.target.checked)}

                />
                <label htmlFor="newRiderMandatoryCheck" className="text-xs font-extrabold text-slate-800 uppercase cursor-pointer">
                  Mark as Required Mandatory Field
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-xs border border-amber-500"
                >
                  Add Field
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
