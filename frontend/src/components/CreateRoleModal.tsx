import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  X, Check, Shield, ShieldAlert, ShieldCheck, Navigation, 
  AlertTriangle, Headphones, IndianRupee, Truck, Sparkles, Users, Car, 
  Activity, Crown, Globe, Search, CheckCircle2, MapPin, Eye, Lock,
  Sliders, Filter, RefreshCw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  ServiceRoleDef, 
  PLATFORM_MODULES, 
  ROLE_PRESETS, 
  CLEARANCE_LEVELS,
  ModuleDefinition
} from '../data/serviceRoles';

interface CreateRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveRole: (role: ServiceRoleDef, permissions: Record<string, string>) => void;
  editingRole?: ServiceRoleDef | null;
  existingPermissions?: Record<string, Record<string, string>>;
}

const CATEGORIES = [
  'Operations',
  'Trust & Safety',
  'Support',
  'Finance',
  'Fleet & Growth',
  'Executive',
  'Custom'
];

const PERMISSION_OPTIONS = [
  { value: 'Full', label: 'Full Access', desc: 'Read & Write', color: 'bg-emerald-600 text-white hover:bg-emerald-700' },
  { value: 'City Hub', label: 'City Scoped', desc: 'Regional Only', color: 'bg-blue-600 text-white hover:bg-blue-700' },
  { value: 'View', label: 'View Only', desc: 'Read-only', color: 'bg-amber-600 text-white hover:bg-amber-700' },
  { value: 'No', label: 'No Access', desc: 'Disabled', color: 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 hover:bg-slate-300' }
];

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  isOpen,
  onClose,
  onSaveRole,
  editingRole,
  existingPermissions
}) => {
  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('Operations');
  const [defaultHub, setDefaultHub] = useState('National Platform (All Hubs)');
  const [description, setDescription] = useState('');
  const [permissions, setPermissions] = useState<Record<string, string>>({});
  
  // Table Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [errorMessage, setErrorMessage] = useState('');

  // Reset or initialize on open
  useEffect(() => {
    if (!isOpen) return;

    if (editingRole) {
      setName(editingRole.name);
      setCategory(editingRole.category || 'Operations');
      setDefaultHub(editingRole.defaultHub || 'National Platform (All Hubs)');
      setDescription(editingRole.description || '');

      const initialPerms: Record<string, string> = {};
      PLATFORM_MODULES.forEach(mod => {
        initialPerms[mod.name] = existingPermissions?.[mod.name]?.[editingRole.name] || 'No';
      });
      setPermissions(initialPerms);
    } else {
      setName('');
      setCategory('Operations');
      setDefaultHub('National Platform (All Hubs)');
      setDescription('');

      // Default all to No except Dashboard View
      const initialPerms: Record<string, string> = {};
      PLATFORM_MODULES.forEach(mod => {
        initialPerms[mod.name] = 'No';
      });
      initialPerms['Dashboard & Analytics'] = 'View';
      setPermissions(initialPerms);
    }

    setSearchQuery('');
    setCategoryFilter('All');
    setErrorMessage('');
  }, [editingRole, isOpen]);

  // Apply a quick preset
  const handleApplyPreset = (presetKey: string) => {
    const preset = ROLE_PRESETS[presetKey];
    if (!preset) return;

    const newPerms = { ...permissions };
    PLATFORM_MODULES.forEach(mod => {
      newPerms[mod.name] = preset.clearances[mod.name] || 'No';
    });
    setPermissions(newPerms);

    if (!editingRole && (!name || name === 'Operations Lead' || name === 'Custom Role')) {
      setName(preset.label);
    }
  };

  // Bulk set all permissions
  const handleSetAll = (level: string) => {
    const newPerms: Record<string, string> = {};
    PLATFORM_MODULES.forEach(mod => {
      newPerms[mod.name] = level;
    });
    setPermissions(newPerms);
  };

  // Bulk set category permissions
  const handleSetCategory = (cat: string, level: string) => {
    setPermissions(prev => {
      const updated = { ...prev };
      PLATFORM_MODULES.filter(m => m.category === cat).forEach(mod => {
        updated[mod.name] = level;
      });
      return updated;
    });
  };

  // Filtered modules
  const filteredModules = useMemo(() => {
    return PLATFORM_MODULES.filter(m => {
      const matchCat = categoryFilter === 'All' || m.category === categoryFilter;
      const matchSearch = !searchQuery || 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [categoryFilter, searchQuery]);

  // Permission stats
  const fullCount = useMemo(() => Object.values(permissions).filter(c => c === 'Full').length, [permissions]);
  const viewCount = useMemo(() => Object.values(permissions).filter(c => c !== 'Full' && c !== 'No').length, [permissions]);
  const noCount = useMemo(() => Object.values(permissions).filter(c => c === 'No').length, [permissions]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter a role title (e.g. Airport Operations Lead)');
      return;
    }

    const roleDef: ServiceRoleDef = {
      id: editingRole ? editingRole.id : name.trim().toLowerCase().replace(/\s+/g, '_'),
      name: name.trim(),
      category: category as any,
      tagline: `${category} operational role and regional hub permissions`,
      description: description.trim() || `${name.trim()} configured with customized module access table.`,
      badgeBg: category === 'Executive' ? 'bg-emerald-500/10 text-emerald-700' :
               category === 'Trust & Safety' ? 'bg-rose-500/10 text-rose-700' :
               category === 'Finance' ? 'bg-amber-500/10 text-amber-700' :
               category === 'Support' ? 'bg-cyan-500/10 text-cyan-700' : 'bg-blue-500/10 text-blue-700',
      badgeText: 'text-slate-800 dark:text-slate-200',
      badgeBorder: 'border-slate-200 dark:border-slate-800',
      iconName: category === 'Trust & Safety' ? 'ShieldCheck' : 
                category === 'Finance' ? 'IndianRupee' : 
                category === 'Support' ? 'Headphones' : 'Navigation',
      defaultHub: defaultHub,
      responsibilities: [`Manage ${category} platform workflows according to standard operating procedures`],
      permittedActions: ['Access authorized platform modules as defined in the permissions table'],
      restrictedActions: ['Access to unauthorized modules is blocked by system RBAC rules'],
      primaryTools: [{ name: 'Dashboard', tabKey: 'dashboard', icon: 'LayoutDashboard', desc: 'Analytics' }],
      kpis: [{ metric: 'SLA Adherence', target: '99.0%', period: 'Weekly' }],
      sopWorkflow: ['Log in to administrative console', 'Review regional alerts and assigned queues'],
      isCustom: true
    };

    onSaveRole(roleDef, permissions);
    onClose();
  };

  const categoriesList = ['All', ...Array.from(new Set(PLATFORM_MODULES.map(m => m.category)))];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* =========================================================================
            HEADER
        ========================================================================= */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-900/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black">
              <Shield size={20} />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                {editingRole ? `Edit Role: ${editingRole.name}` : 'Create New Service Role'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* =========================================================================
            CONTENT BODY (SCROLLABLE)
        ========================================================================= */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {errorMessage && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* =====================================================================
              1. BASIC ROLE DETAILS (COMPACT SINGLE ROW)
          ===================================================================== */}
          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300">
                1. Role Details
              </span>
              {/* Optional Quick Template Dropdown */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-500 text-[11px]">Quick Template:</span>
                <select
                  onChange={(e) => e.target.value && handleApplyPreset(e.target.value)}
                  defaultValue=""
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-[11px] font-bold rounded-lg px-2.5 py-1 text-slate-800 dark:text-slate-200 cursor-pointer shadow-3xs outline-none focus:border-amber-400"
                >
                  <option value="" disabled>Choose a template (optional)...</option>
                  {Object.entries(ROLE_PRESETS).map(([key, preset]) => (
                    <option key={key} value={key}>{preset.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  Role Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Airport Operations Lead"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-amber-400 text-xs rounded-xl px-3 py-2 outline-none font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:border-amber-400 text-xs rounded-xl px-3 py-2 outline-none font-semibold text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* =====================================================================
              2. PERMISSIONS TABLE SECTION
          ===================================================================== */}
          <div className="space-y-3">
            {/* Table Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-950/50 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800">
              {/* Category Filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mr-1">
                  2. Permissions Table:
                </span>
                {categoriesList.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategoryFilter(cat)}
                    className={cn(
                      "px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all cursor-pointer",
                      categoryFilter === cat
                        ? "bg-slate-900 text-white dark:bg-amber-400 dark:text-slate-950 font-black"
                        : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Search & Bulk Set */}
              <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                <div className="relative w-full sm:w-44">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter modules..."
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs rounded-lg pl-7 pr-2.5 py-1.2 outline-none text-slate-800 dark:text-slate-200"
                  />
                  <Search size={13} className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleSetAll('Full')}
                    className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                  >
                    All Full
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAll('View')}
                    className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                  >
                    All View
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSetAll('No')}
                    className="px-2 py-1 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-lg cursor-pointer"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            </div>

            {/* The Clean Permission Table */}
            <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-100/80 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-black uppercase text-slate-600 dark:text-slate-400 tracking-wider">
                    <th className="py-2.5 px-4 w-1/3">Platform Module</th>
                    <th className="py-2.5 px-4 hidden md:table-cell">Description / Scope</th>
                    <th className="py-2.5 px-4 text-right sm:text-center w-1/3">Permission Level</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-xs">
                  {filteredModules.map((mod) => {
                    const current = permissions[mod.name] || 'No';

                    return (
                      <tr 
                        key={mod.id}
                        className={cn(
                          "transition-colors",
                          current === 'Full' ? "bg-emerald-50/30 dark:bg-emerald-950/10" :
                          current === 'City Hub' ? "bg-blue-50/30 dark:bg-blue-950/10" :
                          current === 'View' ? "bg-amber-50/20 dark:bg-amber-950/10" :
                          "hover:bg-slate-50/60 dark:hover:bg-slate-800/30"
                        )}
                      >
                        {/* Module Column */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={cn(
                              "w-2 h-2 rounded-full shrink-0",
                              current === 'Full' ? "bg-emerald-500" :
                              current === 'City Hub' ? "bg-blue-500" :
                              current === 'View' ? "bg-amber-500" : "bg-slate-300 dark:bg-slate-700"
                            )} />
                            <div>
                              <p className="font-black text-slate-900 dark:text-white">
                                {mod.name}
                              </p>
                              <span className="text-[10px] text-slate-400 font-semibold">
                                {mod.category}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Description Column */}
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400 text-xs hidden md:table-cell">
                          {mod.description}
                        </td>

                        {/* Permission Selector Column */}
                        <td className="py-3 px-4 text-right sm:text-center">
                          <div className="inline-flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 gap-1">
                            {PERMISSION_OPTIONS.map(opt => {
                              const isSelected = current === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => {
                                    setPermissions(prev => ({ ...prev, [mod.name]: opt.value }));
                                  }}
                                  className={cn(
                                    "px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap",
                                    isSelected
                                      ? opt.color + " shadow-2xs font-black"
                                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                                  )}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
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

        {/* =========================================================================
            FOOTER ACTIONS
        ========================================================================= */}
        <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1 text-emerald-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              {fullCount} Full Access
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-600 font-bold">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              {viewCount} View/City
            </span>
            <span>•</span>
            <span className="text-slate-400">{noCount} Disabled</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:opacity-90 text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Check size={14} className="stroke-[3]" />
              <span>{editingRole ? 'Save Changes' : 'Create Role'}</span>
            </button>
          </div>
        </div>

      </motion.div>
    </div>
  );
};
