import React, { useState, useMemo } from 'react';
import { 
  ShieldAlert, ShieldCheck, Navigation, AlertTriangle, Headphones, 
  IndianRupee, Truck, Sparkles, Users, User, CheckCircle2, XCircle, 
  Clock, MapPin, ArrowRight, Shield, Check, Lock, Cpu, Database, 
  Activity, Car, Star, Tag, TrendingUp, Image as ImageIcon, Globe, 
  MessageSquare, Sliders, Layers, FileText, ChevronRight, LogIn, ExternalLink,
  Plus, Edit3, Trash2, Crown, Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { SERVICE_ROLES, ServiceRoleDef, StaffUserProfile } from '../data/serviceRoles';

interface RoleSummaryViewProps {
  userProfiles: StaffUserProfile[];
  permissionMatrix: Record<string, Record<string, string>>;
  roles?: ServiceRoleDef[];
  onUpdatePermission?: (moduleName: string, roleName: string, clearance: string) => void;
  onSelectStaffUser?: (staff: StaffUserProfile) => void;
  onNavigateTab?: (tabKey: string) => void;
  onCreateRole?: () => void;
  onEditRole?: (role: ServiceRoleDef) => void;
  onDeleteRole?: (roleId: string) => void;
  authenticatedStaff?: StaffUserProfile | null;
  initialSelectedRoleId?: string;
}

export const RoleSummaryView: React.FC<RoleSummaryViewProps> = ({
  userProfiles,
  permissionMatrix,
  roles = SERVICE_ROLES,
  onUpdatePermission,
  onSelectStaffUser,
  onNavigateTab,
  onCreateRole,
  onEditRole,
  onDeleteRole,
  authenticatedStaff,
  initialSelectedRoleId = 'all'
}) => {
  const allRoles = roles && roles.length > 0 ? roles : SERVICE_ROLES;
  const isSuperAdmin = authenticatedStaff?.role === 'Super Admin';
  const [selectedRoleId, setSelectedRoleId] = useState<string>(initialSelectedRoleId);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Executive', 'Operations', 'Trust & Safety', 'Support', 'Finance', 'Fleet & Growth', 'Custom'];

  const getRoleIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case 'ShieldAlert': return <ShieldAlert className={className} />;
      case 'Navigation': return <Navigation className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'AlertTriangle': return <AlertTriangle className={className} />;
      case 'Headphones': return <Headphones className={className} />;
      case 'IndianRupee': return <IndianRupee className={className} />;
      case 'Truck': return <Truck className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Database': return <Database className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Car': return <Car className={className} />;
      case 'Star': return <Star className={className} />;
      case 'Tag': return <Tag className={className} />;
      case 'TrendingUp': return <TrendingUp className={className} />;
      case 'Image': return <ImageIcon className={className} />;
      case 'Globe': return <Globe className={className} />;
      case 'MessageSquare': return <MessageSquare className={className} />;
      case 'Crown': return <Crown className={className} />;
      case 'Key': return <Key className={className} />;
      case 'Sliders': return <Sliders className={className} />;
      default: return <Shield className={className} />;
    }
  };

  const filteredRoles = useMemo(() => {
    return allRoles.filter(r => {
      const matchCat = categoryFilter === 'All' || r.category === categoryFilter;
      const matchSearch = !searchQuery || 
        r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.tagline && r.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.description && r.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (r.category && r.category.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [allRoles, categoryFilter, searchQuery]);

  const activeRoleDef = useMemo(() => {
    if (selectedRoleId === 'all') return null;
    return allRoles.find(r => r.id === selectedRoleId || r.name === selectedRoleId) || null;
  }, [allRoles, selectedRoleId]);

  const getStaffForRole = (roleName: string) => {
    return userProfiles.filter(u => u.role === roleName);
  };

  const getRoleClearanceCount = (roleName: string) => {
    let full = 0;
    let partial = 0;
    let none = 0;
    const modules = Object.keys(permissionMatrix);
    modules.forEach(m => {
      const clearance = permissionMatrix[m]?.[roleName] || 'No';
      if (clearance === 'Full') full++;
      else if (clearance === 'No') none++;
      else partial++;
    });
    return { full, partial, none, total: modules.length };
  };

  const cycleValues = ['Full', 'City-only', 'View/Approve', 'Monitor', 'View', 'No'];

  return (
    <div className="space-y-6 text-slate-800">
      {/* Role Tabs Navigation Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-3 md:p-4">
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-700 flex items-center justify-center font-black">
                <Layers size={18} />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Service Role Summaries & SOP Tabs</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={cn(
                      "px-2.5 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer border",
                      categoryFilter === cat
                        ? "bg-slate-900 text-white border-slate-900 shadow-2xs"
                        : "bg-slate-50 text-slate-600 border-slate-200/80 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Super Admin Create Role Button */}
              {isSuperAdmin && onCreateRole && (
                <button
                  type="button"
                  onClick={onCreateRole}
                  className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer ml-2"
                >
                  <Plus size={14} className="stroke-[3]" />
                  <span>Create Role</span>
                </button>
              )}
            </div>
          </div>

          {/* Dynamic Role Sub-Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto p-1.5 bg-white rounded-2xl border border-slate-200 shadow-2xs no-scrollbar">
            <button
              onClick={() => setSelectedRoleId('all')}
              className={cn(
                "h-10 px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer shrink-0 border",
                selectedRoleId === 'all'
                  ? "bg-amber-400 text-slate-950 font-black border-amber-500/50 shadow-xs"
                  : "bg-slate-50/80 text-slate-700 hover:text-slate-950 hover:bg-slate-100 border-slate-200/80"
              )}
            >
              <Layers size={14} className={selectedRoleId === 'all' ? "text-slate-950" : "text-amber-500"} />
              <span>All Roles Overview ({allRoles.length})</span>
            </button>

            {allRoles.map((role) => {
              const isActive = selectedRoleId === role.id || selectedRoleId === role.name;
              const staffCount = getStaffForRole(role.name).length;
              return (
                <button
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  className={cn(
                    "h-10 px-4 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer shrink-0 border",
                    isActive
                      ? "bg-amber-400 text-slate-950 font-black border-amber-500/50 shadow-xs"
                      : "bg-slate-50/80 text-slate-700 hover:text-slate-950 hover:bg-slate-100 border-slate-200/80"
                  )}
                >
                  <span className={cn(
                    "w-5 h-5 rounded-lg flex items-center justify-center text-[10px]",
                    isActive ? "bg-slate-950 text-white font-black" : "bg-slate-200 text-slate-700"
                  )}>
                    {getRoleIcon(role.iconName, "w-3 h-3")}
                  </span>
                  <span>{role.name}</span>
                  {role.isCustom && (
                    <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-200 text-amber-950">
                      Custom
                    </span>
                  )}
                  <span className={cn(
                    "px-2 py-0.5 rounded-md text-[10px] font-mono font-bold leading-none ml-1",
                    isActive ? "bg-slate-950/10 text-slate-950" : "bg-slate-200 text-slate-700 border border-slate-300"
                  )}>
                    {staffCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* VIEW 1: ALL ROLES OVERVIEW GRID */}
      {selectedRoleId === 'all' && (
        <motion.div 
          initial={{ opacity: 0, y: 8 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -8 }} 
          className="space-y-6"
        >
          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Service Roles</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{allRoles.length}</p>
              <span className="text-[10px] text-emerald-600 font-bold">{allRoles.filter(r => r.isCustom).length} Custom Roles Added</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Staff Operators</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{userProfiles.filter(u => u.active).length}</p>
              <span className="text-[10px] text-blue-600 font-bold">{userProfiles.length} Total Registered</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Operational Hubs</p>
              <p className="text-2xl font-black text-slate-900 mt-1">6 Hubs</p>
              <span className="text-[10px] text-purple-600 font-bold">National & Regional</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Operator Session</p>
              <p className="text-base font-black text-slate-900 mt-1 truncate">{authenticatedStaff?.role || 'Super Admin'}</p>
              <span className="text-[10px] text-amber-600 font-bold">{authenticatedStaff?.name || 'Rahul Sharma'}</span>
            </div>
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoles.map((role) => {
              const staffMembers = getStaffForRole(role.name);
              const clearanceCounts = getRoleClearanceCount(role.name);
              const isCurrentRole = authenticatedStaff?.role === role.name;

              return (
                <div
                  key={role.id}
                  className={cn(
                    "bg-white rounded-3xl border transition-all p-5 flex flex-col justify-between hover:shadow-md text-left relative overflow-hidden group",
                    isCurrentRole ? "border-amber-300 ring-2 ring-amber-400/20 bg-amber-50/10" : "border-slate-200 hover:border-slate-300"
                  )}
                >
                  {/* Top Bar */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs", role.badgeBg)}>
                          {getRoleIcon(role.iconName, "w-6 h-6 stroke-[2.2]")}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-sm font-black text-slate-900 leading-tight">{role.name}</h4>
                            {isCurrentRole && (
                              <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-amber-400 text-slate-950 rounded">
                                Active
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{role.category}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {role.isCustom && (
                          <span className="text-[8px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-800 border border-amber-400/30">
                            Custom
                          </span>
                        )}
                        <span className={cn("text-[9px] font-black uppercase px-2 py-0.5 rounded-md border", role.badgeBg, role.badgeBorder, role.badgeText)}>
                          {role.category}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs font-bold text-slate-800 leading-snug mb-1.5">{role.tagline}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-3">{role.description}</p>

                    {/* Clearance Visual Indicator */}
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 mb-3">
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-slate-500">Module Access Ratio</span>
                        <span className="text-slate-900 font-extrabold">{clearanceCounts.full + clearanceCounts.partial} / {clearanceCounts.total} Modules</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden flex">
                        <div style={{ width: `${(clearanceCounts.full / clearanceCounts.total) * 100}%` }} className="h-full bg-slate-900" title="Full Access" />
                        <div style={{ width: `${(clearanceCounts.partial / clearanceCounts.total) * 100}%` }} className="h-full bg-amber-400" title="Partial Access" />
                        <div style={{ width: `${(clearanceCounts.none / clearanceCounts.total) * 100}%` }} className="h-full bg-slate-200" title="No Access" />
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-slate-400 font-semibold">
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-900" /> {clearanceCounts.full} Full</span>
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> {clearanceCounts.partial} Partial</span>
                        <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-slate-300" /> {clearanceCounts.none} Locked</span>
                      </div>
                    </div>

                    {/* Staff Assigned */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center -space-x-1.5 overflow-hidden">
                        {staffMembers.slice(0, 3).map((st) => (
                          <img
                            key={st.id}
                            src={st.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"}
                            alt={st.name}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover"
                            title={`${st.name} (${st.username})`}
                          />
                        ))}
                        {staffMembers.length > 3 && (
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-200 text-[9px] font-black text-slate-700 ring-2 ring-white">
                            +{staffMembers.length - 3}
                          </span>
                        )}
                        {staffMembers.length === 0 && (
                          <span className="text-[10px] text-slate-400 font-bold italic">No operators assigned</span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">
                        {staffMembers.length} {staffMembers.length === 1 ? 'Operator' : 'Operators'}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedRoleId(role.id)}
                      className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs border-none"
                    >
                      <span>Role Summary Tab</span>
                      <ChevronRight size={13} />
                    </button>
                    {isSuperAdmin && onEditRole && (
                      <button
                        onClick={() => onEditRole(role)}
                        title={`Edit ${role.name} Permissions`}
                        className="py-2 px-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border-none"
                      >
                        <Edit3 size={13} />
                      </button>
                    )}
                    {staffMembers.length > 0 && onSelectStaffUser && (
                      <button
                        onClick={() => onSelectStaffUser(staffMembers[0])}
                        title={`Login as ${staffMembers[0].name} (${role.name})`}
                        className="py-2 px-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer border-none"
                      >
                        <LogIn size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* VIEW 2: DEDICATED INDIVIDUAL ROLE TAB SUMMARY */}
      {activeRoleDef && (
        <motion.div
          key={activeRoleDef.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {/* Hero Banner for the Role */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 relative overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center shadow-md shrink-0", activeRoleDef.badgeBg)}>
                  {getRoleIcon(activeRoleDef.iconName, "w-8 h-8 stroke-[2.2]")}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">{activeRoleDef.name}</h2>
                    {activeRoleDef.isCustom && (
                      <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-bold">
                        Custom Role
                      </span>
                    )}
                    <span className={cn("text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border", activeRoleDef.badgeBg, activeRoleDef.badgeBorder, activeRoleDef.badgeText)}>
                      {activeRoleDef.category}
                    </span>
                  </div>
                  <p className="text-sm font-extrabold text-amber-700 mt-1">{activeRoleDef.tagline}</p>
                  <p className="text-xs text-slate-600 mt-1.5 max-w-3xl leading-relaxed">{activeRoleDef.description}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 self-start lg:self-center">
                {isSuperAdmin && onEditRole && (
                  <button
                    onClick={() => onEditRole(activeRoleDef)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Edit3 size={14} />
                    <span>Edit Permissions</span>
                  </button>
                )}

                {isSuperAdmin && activeRoleDef.isCustom && onDeleteRole && (
                  <button
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete custom role "${activeRoleDef.name}"?`)) {
                        onDeleteRole(activeRoleDef.id);
                        setSelectedRoleId('all');
                      }
                    }}
                    className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Trash2 size={14} />
                    <span>Delete Role</span>
                  </button>
                )}

                {getStaffForRole(activeRoleDef.name).length > 0 && onSelectStaffUser && (
                  <button
                    onClick={() => onSelectStaffUser(getStaffForRole(activeRoleDef.name)[0])}
                    className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs transition-all flex items-center gap-2 shadow-xs cursor-pointer border-none"
                  >
                    <LogIn size={14} />
                    <span>Switch Session to {getStaffForRole(activeRoleDef.name)[0].name.split(' ')[0]}</span>
                  </button>
                )}
                <button
                  onClick={() => setSelectedRoleId('all')}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer border-none"
                >
                  <span>All Roles</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main 2-Column Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Responsibilities, SOP, KPIs (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Key Objectives & Responsibilities */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 text-left">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <FileText size={16} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Core Mission & Operational Mandate</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeRoleDef.responsibilities.map((resp, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-700 font-medium leading-snug">{resp}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clearance & Access Boundaries (Permitted vs Restricted) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Permitted Actions */}
                <div className="bg-white rounded-3xl border border-emerald-200/80 shadow-2xs p-5 text-left bg-emerald-50/20">
                  <div className="flex items-center gap-2 mb-3 border-b border-emerald-100 pb-2">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-emerald-900">Permitted Operations & Clearances</h4>
                  </div>
                  <ul className="space-y-2">
                    {activeRoleDef.permittedActions.map((perm, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                        <span>{perm}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Restricted Actions */}
                <div className="bg-white rounded-3xl border border-rose-200/80 shadow-2xs p-5 text-left bg-rose-50/20">
                  <div className="flex items-center gap-2 mb-3 border-b border-rose-100 pb-2">
                    <Lock size={16} className="text-rose-600" />
                    <h4 className="text-xs font-black uppercase tracking-wider text-rose-900">Security Restrictions & Hard Limits</h4>
                  </div>
                  <ul className="space-y-2">
                    {activeRoleDef.restrictedActions.map((rest, idx) => (
                      <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5" />
                        <span>{rest}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Daily Standard Operating Procedure (SOP) */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-6 text-left">
                <div className="flex items-center gap-2 mb-4 border-b border-slate-100 pb-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock size={16} />
                  </div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Daily Standard Operating Procedure (SOP)</h3>
                </div>

                <div className="space-y-3">
                  {activeRoleDef.sopWorkflow.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50/50 border border-slate-100">
                      <span className="px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-xs shrink-0">
                        Step {idx + 1}
                      </span>
                      <p className="text-xs text-slate-700 font-semibold leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Module Clearance Table for this Role */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs overflow-hidden text-left">
                <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/60">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Module Access Clearances for {activeRoleDef.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold">Click any chip to cycle permissions for this specific role</p>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500">
                    <span className="w-2 h-2 rounded-full bg-slate-900" /> Full Access
                    <span className="w-2 h-2 rounded-full bg-slate-300 ml-2" /> View Only
                    <span className="w-2 h-2 rounded-full bg-rose-400 ml-2" /> No Access
                  </div>
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  {Object.keys(permissionMatrix).map((moduleName) => {
                    const clearance = permissionMatrix[moduleName]?.[activeRoleDef.name] || 'No';

                    const styleMap: Record<string, string> = {
                      'Full': 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800',
                      'City-only': 'bg-slate-200 text-slate-800 border-slate-300 hover:bg-slate-300',
                      'View/Approve': 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200',
                      'Monitor': 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100',
                      'View': 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100',
                      'No': 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                    };

                    return (
                      <div key={moduleName} className="p-3.5 px-5 flex items-center justify-between gap-3 hover:bg-slate-50/60 transition-colors">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className={cn(
                            "w-2 h-2 rounded-full shrink-0",
                            clearance === 'Full' ? "bg-slate-900" : clearance === 'No' ? "bg-rose-400" : "bg-amber-400"
                          )} />
                          <span className="text-xs font-bold text-slate-900 truncate">{moduleName}</span>
                        </div>

                        <button
                          onClick={() => {
                            if (onUpdatePermission) {
                              const currentIndex = cycleValues.indexOf(clearance);
                              const nextClearance = cycleValues[(currentIndex + 1) % cycleValues.length];
                              onUpdatePermission(moduleName, activeRoleDef.name, nextClearance);
                            }
                          }}
                          className={cn(
                            "px-3 py-1 text-[10px] font-black rounded-lg border transition-all cursor-pointer shadow-2xs whitespace-nowrap",
                            styleMap[clearance] || styleMap['No']
                          )}
                          title="Click to cycle permission level"
                        >
                          {clearance === 'Full' ? 'Full Access' : clearance === 'No' ? 'No Access' : clearance}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Assigned Staff, Primary Tools, KPIs (1 col) */}
            <div className="space-y-6">
              {/* Primary Tool Launchers */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-5 text-left">
                <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2.5">
                  <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                    <Activity size={14} />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Primary Workspace Shortcuts</h4>
                </div>

                <div className="space-y-2">
                  {activeRoleDef.primaryTools.map((tool, idx) => (
                    <button
                      key={idx}
                      onClick={() => onNavigateTab && onNavigateTab(tool.tabKey)}
                      className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-amber-50/70 border border-slate-100 hover:border-amber-300 transition-all text-left flex items-start justify-between gap-2 group cursor-pointer"
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 group-hover:bg-amber-400 group-hover:text-slate-950 group-hover:border-amber-400 transition-colors shrink-0 shadow-2xs">
                          {getRoleIcon(tool.icon, "w-4 h-4")}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-black text-slate-900 group-hover:text-amber-950 truncate">{tool.name}</p>
                          <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{tool.desc}</p>
                        </div>
                      </div>
                      <ExternalLink size={13} className="text-slate-400 group-hover:text-amber-900 shrink-0 mt-1" />
                    </button>
                  ))}
                </div>
              </div>

              {/* KPIs & Target SLAs */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-5 text-left">
                <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2.5">
                  <div className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                    <TrendingUp size={14} />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Operational KPIs & Targets</h4>
                </div>

                <div className="space-y-2.5">
                  {activeRoleDef.kpis.map((kpi, idx) => (
                    <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-slate-800">{kpi.metric}</p>
                        <span className="text-[10px] text-slate-400 font-semibold">{kpi.period}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-amber-400 font-black text-xs shadow-2xs font-mono">
                        {kpi.target}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Assigned Staff Profiles */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-2xs p-5 text-left">
                <div className="flex items-center justify-between gap-2 mb-3 border-b border-slate-100 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-black">
                      <Users size={14} />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-900">Assigned Operators</h4>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-2 py-0.5 rounded-md">
                    {getStaffForRole(activeRoleDef.name).length} Active
                  </span>
                </div>

                <div className="space-y-2.5">
                  {getStaffForRole(activeRoleDef.name).map((staff) => {
                    const isCurrent = authenticatedStaff?.id === staff.id;
                    return (
                      <div
                        key={staff.id}
                        className={cn(
                          "p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 text-left",
                          isCurrent ? "bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20" : "bg-slate-50/50 border-slate-100 hover:bg-slate-50"
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={staff.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120"}
                            alt={staff.name}
                            className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-slate-200"
                          />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-black text-slate-900 truncate">{staff.name}</p>
                              {isCurrent && (
                                <span className="text-[8px] font-black uppercase px-1 py-0.2 bg-amber-400 text-slate-950 rounded">
                                  You
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 font-mono truncate">{staff.hub}</p>
                          </div>
                        </div>

                        {onSelectStaffUser && !isCurrent && (
                          <button
                            onClick={() => onSelectStaffUser(staff)}
                            className="px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0 border-none"
                            title={`Switch session to ${staff.name}`}
                          >
                            <LogIn size={11} />
                            <span>Switch</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                  {getStaffForRole(activeRoleDef.name).length === 0 && (
                    <div className="p-4 text-center text-slate-400 text-xs font-bold">
                      No active operators assigned to this role yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
