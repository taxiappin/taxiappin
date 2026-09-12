import React, { useState } from "react";
import {
  Car,
  Layers,
  Plus,
  Trash2,
  Search,
  Upload,
  CheckCircle2,
  FileText,
  SlidersHorizontal,
  Image as ImageIcon,
  Check,
  X,
  ShieldCheck,
  Tag,
  Palette
} from "lucide-react";
import { DriverStepItem, DriverFieldItem, VehicleBrandItem, SampleDocumentItem } from "./types";

interface DriverSectionTabProps {
  driverSteps: Record<string, DriverStepItem>;
  setDriverSteps: React.Dispatch<React.SetStateAction<Record<string, DriverStepItem>>>;
  driverFields: Record<string, DriverFieldItem>;
  setDriverFields: React.Dispatch<React.SetStateAction<Record<string, DriverFieldItem>>>;
  vehicleBrands: VehicleBrandItem[];
  setVehicleBrands: React.Dispatch<React.SetStateAction<VehicleBrandItem[]>>;
  sampleDocuments: SampleDocumentItem[];
  setSampleDocuments: React.Dispatch<React.SetStateAction<SampleDocumentItem[]>>;
  setPreviewFlow: (flow: "login" | "rider" | "driver" | "reset") => void;
  setPreviewDriverStep: (step: number) => void;
  setToast: (toast: { show: boolean; message: string; type: "success" | "error" | "info" }) => void;
}

export const DriverSectionTab: React.FC<DriverSectionTabProps> = ({
  driverSteps,
  setDriverSteps,
  driverFields,
  setDriverFields,
  vehicleBrands,
  setVehicleBrands,
  sampleDocuments,
  setSampleDocuments,
  setPreviewFlow,
  setPreviewDriverStep,
  setToast
}) => {
  // Left Editing Section Subtab: "steps_fields" | "vehicle_catalog" | "sample_uploads"
  const [driverSubtab, setDriverSubtab] = useState<"steps_fields" | "vehicle_catalog" | "sample_uploads">("steps_fields");

  // Fields Search & Filters
  const [fieldsSearchQuery, setFieldsSearchQuery] = useState("");
  const [filterDriverStep, setFilterDriverStep] = useState<number | "all">("all");

  // Modals State
  const [showAddStepModal, setShowAddStepModal] = useState(false);
  const [showAddFieldModal, setShowAddFieldModal] = useState(false);
  const [showAddBrandModal, setShowAddBrandModal] = useState(false);

  // New Step Form State
  const [newStepLabel, setNewStepLabel] = useState("");
  const [newStepDesc, setNewStepDesc] = useState("");

  // New Field Form State
  const [newFieldLabel, setNewFieldLabel] = useState("");
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldStepId, setNewFieldStepId] = useState(1);
  const [newFieldHelper, setNewFieldHelper] = useState("");
  const [newFieldType, setNewFieldType] = useState("text");
  const [newFieldMandatory, setNewFieldMandatory] = useState(true);

  // New Brand Form State
  const [newBrandName, setNewBrandName] = useState("");
  const [newBrandCategory, setNewBrandCategory] = useState("Sedan");
  const [newBrandModels, setNewBrandModels] = useState("");

  // Handle Add Step
  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStepLabel.trim()) return;
    const nextId = Object.keys(driverSteps).length + 1;
    const key = `step${nextId}_custom_${Date.now()}`;
    setDriverSteps((prev) => ({
      ...prev,
      [key]: {
        id: nextId,
        key,
        enabled: true,
        label: newStepLabel.trim(),
        description: newStepDesc.trim() || `Driver onboarding step ${nextId}`
      }
    }));
    setShowAddStepModal(false);
    setNewStepLabel("");
    setNewStepDesc("");
    setToast({ show: true, message: `Added Driver Step ${nextId}: "${newStepLabel}"`, type: "success" });
  };

  // Handle Delete Step
  const handleDeleteStep = (key: string) => {
    setDriverSteps((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setToast({ show: true, message: "Driver step removed", type: "info" });
  };

  // Handle Add Field
  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFieldLabel.trim()) return;
    const key = newFieldKey.trim() || `driver_custom_${Date.now()}`;
    setDriverFields((prev) => ({
      ...prev,
      [key]: {
        key,
        enabled: true,
        mandatory: newFieldMandatory,
        label: newFieldLabel.trim(),
        stepId: Number(newFieldStepId),
        helper: newFieldHelper.trim() || "Driver input requirement",
        type: newFieldType
      }
    }));
    setShowAddFieldModal(false);
    setNewFieldLabel("");
    setNewFieldKey("");
    setNewFieldHelper("");
    setToast({ show: true, message: `Added driver field "${newFieldLabel}"`, type: "success" });
  };

  // Handle Delete Field
  const handleDeleteField = (key: string) => {
    setDriverFields((prev) => {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });
    setToast({ show: true, message: "Driver field removed", type: "info" });
  };

  // Handle Add Brand
  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBrandName.trim()) return;
    const modelsArr = newBrandModels
      .split(",")
      .map((m) => m.trim())
      .filter((m) => m.length > 0);

    const newBrand: VehicleBrandItem = {
      id: `brand_${Date.now()}`,
      brandName: newBrandName.trim(),
      category: newBrandCategory,
      models: modelsArr.length > 0 ? modelsArr : ["Standard Model"],
      enabled: true
    };

    setVehicleBrands((prev) => [...prev, newBrand]);
    setShowAddBrandModal(false);
    setNewBrandName("");
    setNewBrandModels("");
    setToast({ show: true, message: `Added brand "${newBrand.brandName}"`, type: "success" });
  };

  // Handle Delete Brand
  const handleDeleteBrand = (id: string) => {
    setVehicleBrands((prev) => prev.filter((b) => b.id !== id));
    setToast({ show: true, message: "Vehicle brand removed", type: "info" });
  };

  // Handle Remove Model Tag
  const handleRemoveModelTag = (brandId: string, modelIndex: number) => {
    setVehicleBrands((prev) =>
      prev.map((b) => {
        if (b.id === brandId) {
          const updatedModels = b.models.filter((_, idx) => idx !== modelIndex);
          return { ...b, models: updatedModels };
        }
        return b;
      })
    );
  };

  // Handle Add Model Tag
  const handleAddModelTag = (brandId: string, modelName: string) => {
    if (!modelName.trim()) return;
    setVehicleBrands((prev) =>
      prev.map((b) => {
        if (b.id === brandId) {
          if (b.models.includes(modelName.trim())) return b;
          return { ...b, models: [...b.models, modelName.trim()] };
        }
        return b;
      })
    );
  };

  // Sample Upload File Handler
  const handleSampleUpload = (docId: string, side: "front" | "back" | "single", e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setSampleDocuments((prev) =>
          prev.map((doc) => {
            if (doc.id !== docId) return doc;
            if (side === "front") {
              return { ...doc, frontSampleUrl: url, sampleUrl: url };
            } else if (side === "back") {
              return { ...doc, backSampleUrl: url };
            } else {
              return { ...doc, sampleUrl: url, frontSampleUrl: url };
            }
          })
        );
        setToast({ show: true, message: `Sample document ${side} image updated!`, type: "success" });
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredFields = Object.entries(driverFields).filter(([key, item]) => {
    const matchesSearch =
      item.label.toLowerCase().includes(fieldsSearchQuery.toLowerCase()) ||
      item.key.toLowerCase().includes(fieldsSearchQuery.toLowerCase());
    const matchesStep = filterDriverStep === "all" || item.stepId === filterDriverStep;
    return matchesSearch && matchesStep;
  });

  return (
    <div className="space-y-6">
      {/* DRIVER EDITING SUBTABS */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200/90 shadow-xs flex items-center gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setDriverSubtab("steps_fields")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            driverSubtab === "steps_fields"
              ? "bg-amber-400 text-slate-950 shadow-xs border border-amber-500"
              : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
          }`}
        >
          <Layers size={15} />
          <span>Steps & Form Fields</span>
        </button>

        <button
          type="button"
          onClick={() => setDriverSubtab("vehicle_catalog")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            driverSubtab === "vehicle_catalog"
              ? "bg-amber-400 text-slate-950 shadow-xs border border-amber-500"
              : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
          }`}
        >
          <Car size={15} />
          <span>Vehicle Brands, Models & Categories</span>
        </button>

        <button
          type="button"
          onClick={() => setDriverSubtab("sample_uploads")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            driverSubtab === "sample_uploads"
              ? "bg-amber-400 text-slate-950 shadow-xs border border-amber-500"
              : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
          }`}
        >
          <Upload size={15} />
          <span>Sample Document Uploads Admin</span>
        </button>
      </div>

      {/* SUBTAB 1: STEPS & FIELDS BUILDER */}
      {driverSubtab === "steps_fields" && (
        <div className="space-y-6">
          {/* DRIVER ONBOARDING STEPS TABLE */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Layers size={18} className="text-amber-500" /> Driver Registration Onboarding Steps Directory
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Manage the multi-step registration sequence for driver partners.</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddStepModal(true)}
                className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer border border-amber-500"
              >
                <Plus size={15} /> Add Step
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 text-[11px] font-black uppercase font-mono tracking-wider border-b border-slate-200">
                    <th className="p-3 w-16 text-center">Step #</th>
                    <th className="p-3">Step Title</th>
                    <th className="p-3">Description & Scope</th>
                    <th className="p-3 w-28 text-center">Preview</th>
                    <th className="p-3 w-24 text-center">Status</th>
                    <th className="p-3 w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {Object.entries(driverSteps).map(([stepKey, step]) => (
                    <tr key={stepKey} className={`hover:bg-slate-50 transition-colors ${!step.enabled ? "opacity-60 bg-slate-50/50" : ""}`}>
                      <td className="p-3 text-center font-mono font-black text-slate-900">
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] inline-flex items-center justify-center">
                          {step.id}
                        </span>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={step.label}
                          onChange={(e) =>
                            setDriverSteps((prev) => ({
                              ...prev,
                              [stepKey]: { ...prev[stepKey], label: e.target.value }
                            }))
                          }
                          className="font-black text-xs text-slate-900 uppercase bg-transparent outline-none border-b border-dashed border-slate-300 focus:border-amber-500 w-full"
                        />
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={step.description}
                          onChange={(e) =>
                            setDriverSteps((prev) => ({
                              ...prev,
                              [stepKey]: { ...prev[stepKey], description: e.target.value }
                            }))
                          }
                          placeholder="Step description..."
                          className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewFlow("driver");
                            setPreviewDriverStep(step.id);
                          }}
                          className="px-2.5 py-1 bg-amber-400 hover:bg-amber-500 text-slate-950 text-[10px] font-black uppercase rounded-lg border border-amber-500 cursor-pointer shadow-2xs"
                        >
                          Step {step.id}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setDriverSteps((prev) => ({
                              ...prev,
                              [stepKey]: { ...prev[stepKey], enabled: !prev[stepKey].enabled }
                            }))
                          }
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase cursor-pointer border ${
                            step.enabled ? "bg-emerald-100 text-emerald-800 border-emerald-300" : "bg-slate-100 text-slate-500 border-slate-200"
                          }`}
                        >
                          {step.enabled ? "Enabled" : "Disabled"}
                        </button>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteStep(stepKey)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          title="Delete Step"
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

          {/* DRIVER FORM FIELDS TABLE FORMAT */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-amber-500" /> Driver Input Fields Table
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Manage all fields assigned across Steps 1 through 7.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddFieldModal(true)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs border border-amber-500 shrink-0"
              >
                <Plus size={16} /> Add Driver Field
              </button>
            </div>

            {/* SEARCH & STEP FILTER BAR */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={fieldsSearchQuery}
                  onChange={(e) => setFieldsSearchQuery(e.target.value)}
                  placeholder="Search driver fields by label..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                <span className="text-xs font-extrabold text-slate-500 uppercase">Filter Step:</span>
                <select
                  value={filterDriverStep}
                  onChange={(e) => setFilterDriverStep(e.target.value === "all" ? "all" : Number(e.target.value))}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-900 outline-none cursor-pointer"
                >
                  <option value="all">All Steps ({Object.keys(driverFields).length})</option>
                  {Object.values(driverSteps).map((s) => (
                    <option key={s.id} value={s.id}>
                      Step {s.id}: {s.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* DRIVER FIELDS TABLE */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 text-[11px] font-black uppercase font-mono tracking-wider border-b border-slate-200">
                    <th className="p-3.5 w-28">Assign Step</th>
                    <th className="p-3.5">Field Title & Key</th>
                    <th className="p-3.5 w-36">Control Type</th>
                    <th className="p-3.5">Helper Instruction Subtext</th>
                    <th className="p-3.5 w-24 text-center">Required</th>
                    <th className="p-3.5 w-24 text-center">Status</th>
                    <th className="p-3.5 w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredFields.map(([key, item]) => (
                    <tr key={key} className={`hover:bg-slate-50 transition-colors ${!item.enabled ? "opacity-60 bg-slate-50/50" : ""}`}>
                      <td className="p-3">
                        <select
                          value={item.stepId}
                          onChange={(e) =>
                            setDriverFields((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], stepId: Number(e.target.value) }
                            }))
                          }
                          className="bg-amber-100 text-amber-900 border border-amber-200 rounded-lg px-2 py-1 text-[11px] font-bold outline-none cursor-pointer w-full"
                        >
                          {Object.values(driverSteps).map((s) => (
                            <option key={s.id} value={s.id}>
                              Step {s.id}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={item.label}
                          onChange={(e) =>
                            setDriverFields((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], label: e.target.value }
                            }))
                          }
                          className="font-black text-xs text-slate-900 uppercase bg-transparent outline-none border-b border-dashed border-slate-300 focus:border-amber-500 w-full"
                        />
                        <span className="text-[10px] font-mono text-slate-400 block mt-0.5">key: {item.key}</span>
                      </td>
                      <td className="p-3">
                        <select
                          value={item.type || "text"}
                          onChange={(e) =>
                            setDriverFields((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], type: e.target.value }
                            }))
                          }
                          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-slate-800 outline-none cursor-pointer w-full"
                        >
                          <option value="text">Text Line</option>
                          <option value="email">Email</option>
                          <option value="tel">Phone</option>
                          <option value="password">Password</option>
                          <option value="date">Date Picker</option>
                          <option value="file">File / Photo</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <input
                          type="text"
                          value={item.helper || ""}
                          onChange={(e) =>
                            setDriverFields((prev) => ({
                              ...prev,
                              [key]: { ...prev[key], helper: e.target.value }
                            }))
                          }
                          placeholder="Helper instruction text..."
                          className="w-full text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 outline-none focus:border-amber-500"
                        />
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setDriverFields((prev) => ({
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
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() =>
                            setDriverFields((prev) => ({
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
        </div>
      )}

      {/* SUBTAB 2: VEHICLE CATEGORIES, BRANDS & MODELS CATALOG */}
      {driverSubtab === "vehicle_catalog" && (
        <div className="space-y-6">
          {/* VEHICLE CATEGORIES LIST FORMAT */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Car size={18} className="text-amber-500" /> Vehicle Categories Master Table
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Fleet ride options available for rider bookings and driver vehicle matching.</p>
              </div>
              <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-200 text-xs font-mono font-black rounded-xl">
                6 Active Categories
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 text-[11px] font-black uppercase font-mono tracking-wider border-b border-slate-200">
                    <th className="p-3.5 w-16 text-center">Icon</th>
                    <th className="p-3.5 w-40">Category Name</th>
                    <th className="p-3.5">Category Details & Compatible Fleet</th>
                    <th className="p-3.5 w-32">Seating</th>
                    <th className="p-3.5 w-24 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {[
                    { name: "Hatchback", desc: "Compact & economical city hatchbacks (Swift, WagonR, i10, Tiago)", seats: "4 Passengers", icon: "🚗" },
                    { name: "Sedan", desc: "Comfortable air-conditioned sedans for city & outstation (Dzire, Etios, Ciaz)", seats: "4 Passengers", icon: "🚘" },
                    { name: "SUV / MUV", desc: "Spacious 6-7 seater vehicles for group travel & heavy luggage (Ertiga, Innova)", seats: "6-7 Passengers", icon: "🚙" },
                    { name: "Auto Rickshaw", desc: "Fast & affordable 3-wheeler auto rickshaw rides for short hops (Bajaj, Piaggio)", seats: "3 Passengers", icon: "𛁈" },
                    { name: "Bike / Scooter", desc: "Quick single-rider motorcycle taxi service (Activa, Splendor, Pulsar)", seats: "1 Passenger", icon: "🛵" },
                    { name: "Luxury / Premium", desc: "Premium executive luxury sedans for VIP transfers (Camry, Mercedes, BMW)", seats: "4 Passengers", icon: "✨" }
                  ].map((cat, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 text-center text-xl">{cat.icon}</td>
                      <td className="p-3 font-black text-slate-900 uppercase">{cat.name}</td>
                      <td className="p-3 text-slate-600 font-medium">{cat.desc}</td>
                      <td className="p-3 font-bold text-slate-700">{cat.seats}</td>
                      <td className="p-3 text-center">
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-extrabold rounded-lg uppercase">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MASTER VEHICLE BRANDS & MODELS TABLE FORMAT */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Tag size={18} className="text-amber-500" /> Vehicle Brands & Models Directory Table
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Structured directory table of vehicle makes and interactive model tags.</p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddBrandModal(true)}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-xs border border-amber-500 shrink-0"
              >
                <Plus size={16} /> Add Vehicle Brand
              </button>
            </div>

            {/* BRANDS TABLE */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 text-[11px] font-black uppercase font-mono tracking-wider border-b border-slate-200">
                    <th className="p-3.5 w-32">Category</th>
                    <th className="p-3.5 w-36">Brand Name</th>
                    <th className="p-3.5">Associated Models (Interactive Tags + Quick Add)</th>
                    <th className="p-3.5 w-16 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {vehicleBrands.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3">
                        <span className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-200 font-black text-[10px] uppercase rounded-lg">
                          {b.category}
                        </span>
                      </td>
                      <td className="p-3 font-black text-slate-900 uppercase tracking-wide">
                        {b.brandName}
                        <span className="text-[10px] font-mono text-slate-400 block font-medium">({b.models.length} models)</span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {b.models.map((mod, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-800 flex items-center gap-1 transition-all"
                            >
                              <span>{mod}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveModelTag(b.id, idx)}
                                className="text-slate-400 hover:text-rose-600 rounded cursor-pointer"
                                title={`Remove ${mod}`}
                              >
                                <X size={12} />
                              </button>
                            </span>
                          ))}

                          <input
                            type="text"
                            placeholder="+ Add Model & Enter"
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                const val = e.currentTarget.value;
                                handleAddModelTag(b.id, val);
                                e.currentTarget.value = "";
                              }
                            }}
                            className="px-2 py-0.5 bg-amber-50/70 border border-amber-300 rounded-lg text-xs font-mono font-bold text-slate-800 outline-none focus:bg-white focus:border-amber-500 w-36"
                          />
                        </div>
                      </td>
                      <td className="p-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteBrand(b.id)}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer transition-colors"
                          title="Delete Brand"
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
        </div>
      )}

      {/* SUBTAB 3: SAMPLE DOCUMENT UPLOADS ADMIN (DUAL FRONT & BACK SIDE) */}
      {driverSubtab === "sample_uploads" && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Upload size={18} className="text-amber-500" /> Sample Document Uploads Admin (Front & Back Sides)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload sample document reference images for BOTH Front Side and Back Side (Driving License, Vehicle RC, Insurance, Aadhaar/ID) shown to driver applicants during signup.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sampleDocuments.map((doc) => {
              const frontImage = doc.frontSampleUrl || doc.sampleUrl;
              const backImage = doc.backSampleUrl || doc.sampleUrl;

              return (
                <div key={doc.id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 shadow-2xs">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide flex items-center gap-1.5">
                      <FileText size={15} className="text-amber-500" /> {doc.title}
                    </h4>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded uppercase">
                      Front & Back Active
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 font-medium">{doc.instructions}</p>

                  {/* DUAL PREVIEWS: FRONT SIDE & BACK SIDE */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* FRONT SIDE PREVIEW & CONTROL */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 font-mono">
                          Front Side Sample
                        </span>
                      </div>
                      <div className="relative w-full h-32 bg-slate-200 rounded-xl overflow-hidden border border-slate-300 flex items-center justify-center group">
                        {frontImage ? (
                          <img src={frontImage} alt={`${doc.title} Front`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center space-y-1 p-2">
                            <ImageIcon size={22} className="mx-auto text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-500 block">No Front Image</span>
                          </div>
                        )}
                        <span className="absolute bottom-1.5 left-1.5 bg-slate-950/80 text-amber-400 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded">
                          FRONT
                        </span>
                      </div>
                      <label className="w-full py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-lg cursor-pointer text-center flex items-center justify-center gap-1 shadow-2xs font-mono border border-amber-500">
                        <Upload size={12} /> Update Front
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSampleUpload(doc.id, "front", e)}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* BACK SIDE PREVIEW & CONTROL */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-700 font-mono">
                          Back Side Sample
                        </span>
                      </div>
                      <div className="relative w-full h-32 bg-slate-200 rounded-xl overflow-hidden border border-slate-300 flex items-center justify-center group">
                        {backImage ? (
                          <img src={backImage} alt={`${doc.title} Back`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-center space-y-1 p-2">
                            <ImageIcon size={22} className="mx-auto text-slate-400" />
                            <span className="text-[10px] font-bold text-slate-500 block">No Back Image</span>
                          </div>
                        )}
                        <span className="absolute bottom-1.5 left-1.5 bg-slate-950/80 text-amber-400 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded">
                          BACK
                        </span>
                      </div>
                      <label className="w-full py-1.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-[10px] uppercase tracking-wider rounded-lg cursor-pointer text-center flex items-center justify-center gap-1 shadow-2xs font-mono border border-amber-500">
                        <Upload size={12} /> Update Back
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleSampleUpload(doc.id, "back", e)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL: ADD DRIVER STEP */}
      {showAddStepModal && (
        <div className="fixed inset-0 z-[20000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Plus size={18} className="text-amber-500" /> Add Driver Onboarding Step
            </h4>

            <form onSubmit={handleAddStep} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Step Title *</label>
                <input
                  type="text"
                  value={newStepLabel}
                  onChange={(e) => setNewStepLabel(e.target.value)}
                  placeholder="e.g. Step 8: Police Verification Certificate"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Step Description</label>
                <input
                  type="text"
                  value={newStepDesc}
                  onChange={(e) => setNewStepDesc(e.target.value)}
                  placeholder="e.g. Upload official background verification PCC certificate"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddStepModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-xs border border-amber-500"
                >
                  Add Step
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD DRIVER FIELD */}
      {showAddFieldModal && (
        <div className="fixed inset-0 z-[20000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Plus size={18} className="text-amber-500" /> Add Custom Driver Input Field
            </h4>

            <form onSubmit={handleAddField} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Field Label *</label>
                <input
                  type="text"
                  value={newFieldLabel}
                  onChange={(e) => setNewFieldLabel(e.target.value)}
                  placeholder="e.g. Vehicle Insurance Policy Number"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Assign Step</label>
                <select
                  value={newFieldStepId}
                  onChange={(e) => setNewFieldStepId(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none"
                >
                  {Object.values(driverSteps).map((s) => (
                    <option key={s.id} value={s.id}>
                      Step {s.id}: {s.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Field Input Type</label>
                <select
                  value={newFieldType}
                  onChange={(e) => setNewFieldType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none"
                >
                  <option value="text">Text Input</option>
                  <option value="email">Email</option>
                  <option value="tel">Phone</option>
                  <option value="password">Password</option>
                  <option value="date">Date</option>
                  <option value="file">File / Document Upload</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Helper Instruction</label>
                <input
                  type="text"
                  value={newFieldHelper}
                  onChange={(e) => setNewFieldHelper(e.target.value)}
                  placeholder="e.g. Must match official registration certificate"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox" className="w-5 h-5 rounded-md border-2 border-slate-300 text-amber-500 accent-amber-400 focus:ring-2 focus:ring-amber-400/50 focus:outline-none cursor-pointer shadow-2xs transition-all shrink-0" aria-label="Option selection"
                  id="newDriverMandatoryCheck"
                  checked={newFieldMandatory}
                  onChange={(e) => setNewFieldMandatory(e.target.checked)}

                />
                <label htmlFor="newDriverMandatoryCheck" className="text-xs font-extrabold text-slate-800 uppercase cursor-pointer">
                  Mandatory Field Required
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddFieldModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
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

      {/* MODAL: ADD BRAND */}
      {showAddBrandModal && (
        <div className="fixed inset-0 z-[20000] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h4 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Plus size={18} className="text-amber-500" /> Add Vehicle Brand & Models
            </h4>

            <form onSubmit={handleAddBrand} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Brand Name *</label>
                <input
                  type="text"
                  value={newBrandName}
                  onChange={(e) => setNewBrandName(e.target.value)}
                  placeholder="e.g. Maruti Suzuki, Toyota, Tesla"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Vehicle Class Category</label>
                <select
                  value={newBrandCategory}
                  onChange={(e) => setNewBrandCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none"
                >
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Auto">Auto Rickshaw</option>
                  <option value="Bike">Bike / Two-Wheeler</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-slate-700 uppercase">Models (Comma-Separated)</label>
                <input
                  type="text"
                  value={newBrandModels}
                  onChange={(e) => setNewBrandModels(e.target.value)}
                  placeholder="e.g. Dzire, Swift, Brezza, Ertiga"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-900 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddBrandModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-xs border border-amber-500"
                >
                  Add Brand
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
