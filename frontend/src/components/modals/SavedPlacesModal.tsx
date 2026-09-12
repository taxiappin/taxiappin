import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Edit, Trash2 } from "lucide-react";

export interface SavedPlace {
  id: string;
  name: string;
  address: string;
  icon: string;
}

interface SavedPlacesModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlaces: SavedPlace[];
  setSavedPlaces: React.Dispatch<React.SetStateAction<SavedPlace[]>>;
  addNotification: (msg: string, type?: string) => void;
}

export const SavedPlacesModal: React.FC<SavedPlacesModalProps> = ({
  isOpen,
  onClose,
  savedPlaces,
  setSavedPlaces,
  addNotification,
}) => {
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
  const [editPlaceName, setEditPlaceName] = useState("");
  const [editPlaceAddress, setEditPlaceAddress] = useState("");
  const [editPlacesSuggestions, setEditPlacesSuggestions] = useState<any[]>([]);
  const [isSearchingEditPlaces, setIsSearchingEditPlaces] = useState(false);

  const [newPlaceName, setNewPlaceName] = useState("");
  const [newPlaceAddress, setNewPlaceAddress] = useState("");
  const [savedPlacesSuggestions, setSavedPlacesSuggestions] = useState<any[]>([]);
  const [isSearchingSavedPlaces, setIsSearchingSavedPlaces] = useState(false);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[11000] flex items-center justify-center p-6 bg-slate-950/70 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.95, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.95, y: 20 }}
          className="bg-canvas border border-hairline-soft w-full max-w-[420px] rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
        >
          <div className="p-6 border-b border-hairline-soft flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black uppercase text-secondary tracking-tight">
                Saved Places
              </h3>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center text-mute cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-4 flex-1">
            <p className="text-[10px] text-mute font-bold uppercase tracking-widest mb-2">
              My Locations
            </p>
            <div className="space-y-2">
              {savedPlaces.map((place) => (
                <React.Fragment key={place.id}>
                  {editingPlaceId === place.id ? (
                    <div
                      className="w-full p-4 bg-white dark:bg-slate-900 border border-primary/40 rounded-2xl space-y-3 shadow-md"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl bg-slate-50 dark:bg-slate-800 w-10 h-10 rounded-xl flex items-center justify-center border border-slate-100 dark:border-slate-850 shrink-0 select-none">
                          ✏️
                        </span>
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            placeholder="PLACE NAME (e.g. HOME, WORK)"
                            value={editPlaceName}
                            onChange={(e) => setEditPlaceName(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl py-2 px-3 text-[11px] font-black text-ink uppercase outline-none focus:border-primary/50 transition-all"
                          />
                          <div className="relative">
                            <input
                              type="text"
                              placeholder="FULL ADDRESS OR REGION"
                              value={editPlaceAddress}
                              onChange={(e) =>
                                setEditPlaceAddress(e.target.value)
                              }
                              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl py-2 px-3 text-[11px] font-black text-ink uppercase outline-none focus:border-primary/50 transition-all pr-8"
                            />
                            {isSearchingEditPlaces && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                                <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                              </div>
                            )}

                            {editPlacesSuggestions.length > 0 && (
                              <div className="absolute left-0 right-0 top-full mt-1 bg-white dark:bg-[#1e232b] border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-[9999] max-h-[140px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                                {editPlacesSuggestions.map(
                                  (s: any, idx: number) => (
                                    <button
                                      key={idx}
                                      onClick={() => {
                                        setEditPlaceAddress(
                                          s.display_name || s.label
                                        );
                                        if (!editPlaceName) {
                                          const firstPart = (
                                            s.display_name ||
                                            s.label ||
                                            ""
                                          ).split(",")[0];
                                          setEditPlaceName(firstPart.trim());
                                        }
                                        setEditPlacesSuggestions([]);
                                      }}
                                      className="w-full text-left px-3 py-2 text-[10px] text-ink hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold truncate block"
                                    >
                                      📍 {s.display_name || s.label}
                                    </button>
                                  )
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSavedPlaces((prev) =>
                                  prev.map((p) =>
                                    p.id === place.id
                                      ? {
                                          ...p,
                                          name: editPlaceName || p.name,
                                          address:
                                            editPlaceAddress || p.address,
                                        }
                                      : p
                                  )
                                );
                                setEditingPlaceId(null);
                                addNotification(
                                  "Updated location details",
                                  "success"
                                );
                              }}
                              className="px-3 py-1.5 bg-primary text-black font-black text-[9px] uppercase rounded-lg"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingPlaceId(null)}
                              className="px-3 py-1.5 bg-slate-100 text-slate-600 font-bold text-[9px] uppercase rounded-lg"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-primary/20 hover:bg-white duration-150 transition-all cursor-pointer"
                      onClick={() => {
                        addNotification(
                          `Selected ${place.name}: ${place.address}`,
                          "info"
                        );
                        onClose();
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-slate-100">
                          {place.icon}
                        </span>
                        <div>
                          <p className="text-xs font-black text-secondary uppercase tracking-tight">
                            {place.name}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter truncate max-w-[180px]">
                            {place.address}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 max-sm:opacity-100 transition-opacity duration-155">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingPlaceId(place.id);
                            setEditPlaceName(place.name);
                            setEditPlaceAddress(place.address);
                          }}
                          className="p-2 text-slate-400 hover:text-primary rounded-xl hover:bg-slate-100 transition-all duration-150 cursor-pointer"
                          title="Edit Location"
                        >
                          <Edit size={13} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSavedPlaces((prev) =>
                              prev.filter((p) => p.id !== place.id)
                            );
                            addNotification(
                              `Deleted saved place: ${place.name}`,
                              "info"
                            );
                          }}
                          className="p-2 text-rose-500 rounded-xl hover:bg-rose-50 transition-all duration-150 cursor-pointer"
                          title="Delete Location"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
              {savedPlaces.length === 0 && (
                <p className="text-center py-6 text-[11px] font-bold text-mute uppercase">
                  No saved places yet
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-hairline-soft space-y-3">
              <p className="text-[10px] text-mute font-bold uppercase tracking-widest">
                Add New Location
              </p>
              <div className="space-y-2 relative">
                <input
                  type="text"
                  placeholder="PLACE NAME (e.g. CAFE, PARK)"
                  value={newPlaceName}
                  onChange={(e) => setNewPlaceName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-[11px] font-black text-ink uppercase outline-none focus:border-primary/50 transition-all"
                />
                <div className="relative">
                  <input
                    type="text"
                    placeholder="FULL ADDRESS OR REGION"
                    value={newPlaceAddress}
                    onChange={(e) => setNewPlaceAddress(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 px-4 text-[11px] font-black text-ink uppercase outline-none focus:border-primary/50 transition-all pr-10"
                  />
                  {isSearchingSavedPlaces && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                      <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {savedPlacesSuggestions.length > 0 && (
                    <div className="absolute left-0 right-0 bottom-[102%] mb-1 bg-white border border-slate-200 rounded-xl shadow-xl z-[9999] max-h-[160px] overflow-y-auto divide-y divide-slate-100">
                      {savedPlacesSuggestions.map((s: any, idx: number) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setNewPlaceAddress(s.display_name || s.label);
                            if (!newPlaceName) {
                              const firstPart = (
                                s.display_name ||
                                s.label ||
                                ""
                              ).split(",")[0];
                              setNewPlaceName(firstPart.trim());
                            }
                            setSavedPlacesSuggestions([]);
                          }}
                          className="w-full text-left px-4 py-2.5 text-[11px] text-ink hover:bg-slate-50 transition-colors font-bold truncate block"
                        >
                          📍 {s.display_name || s.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => {
                  if (!newPlaceName || !newPlaceAddress) {
                    addNotification(
                      "Fill both fields to save location",
                      "info"
                    );
                    return;
                  }
                  setSavedPlaces((prev) => [
                    ...prev,
                    {
                      id: Date.now().toString(),
                      name: newPlaceName,
                      address: newPlaceAddress,
                      icon: "📍",
                    },
                  ]);
                  setNewPlaceName("");
                  setNewPlaceAddress("");
                  addNotification(
                    "Added new location securely",
                    "success"
                  );
                }}
                className="w-full py-3 bg-secondary text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Save Location
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
