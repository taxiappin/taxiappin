import React, { useState, useEffect, useMemo } from 'react';
import { 
  Bug, 
  AlertTriangle, 
  CheckCircle2, 
  Search, 
  Trash2, 
  Copy, 
  Sparkles, 
  Terminal, 
  User, 
  Car, 
  Shield, 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  Send, 
  Check, 
  Clock, 
  Laptop, 
  AlertOctagon,
  Filter,
  X,
  MessageSquare,
  Radio,
  Pencil,
  CheckSquare,
  Square,
  FileCode2,
  Info
} from 'lucide-react';
import { 
  AppErrorLog, 
  getStoredErrorLogs, 
  toggleErrorStatus, 
  deleteErrorLog, 
  deleteMultipleErrorLogs,
  toggleMultipleErrorStatus,
  clearAllErrorLogs, 
  generateAIFixPrompt, 
  generateCombinedAIFixPrompt,
  updateErrorLog,
  logAppError, 
  APP_ERROR_EVENT 
} from '../lib/errorLogger';

interface ErrorsPageViewProps {
  setToast?: (toast: { message: string; type: 'success' | 'error' | 'info' }) => void;
}

export const ErrorsPageView: React.FC<ErrorsPageViewProps> = ({ setToast }) => {
  const [logs, setLogs] = useState<AppErrorLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedSource, setSelectedSource] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  
  // Selection for multi-check batch operations
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAiPromptId, setCopiedAiPromptId] = useState<string | null>(null);
  const [copiedBatchAiPrompt, setCopiedBatchAiPrompt] = useState(false);

  // Edit Modal State
  const [editingLog, setEditingLog] = useState<AppErrorLog | null>(null);

  // Test Error Simulation State
  const [showSimulateModal, setShowSimulateModal] = useState(false);
  const [testRole, setTestRole] = useState<'Rider' | 'Driver' | 'Admin' | 'Guest'>('Rider');
  const [testSource, setTestSource] = useState<'User Submitted Report' | 'Auto Application Capture'>('User Submitted Report');
  const [testPage, setTestPage] = useState('Rider Ride Booking Screen');
  const [testSection, setTestSection] = useState('Payment & Fare Estimate Card');
  const [testErrorName, setTestErrorName] = useState('TypeError');
  const [testErrorMessage, setTestErrorMessage] = useState('Cannot read properties of undefined (reading "fareAmount")');
  const [testUserNotes, setTestUserNotes] = useState('User reported: Clicked "Confirm Ride" and screen showed a blank error card.');
  const [testSeverity, setTestSeverity] = useState<'critical' | 'high' | 'medium' | 'low'>('high');

  // Load logs and setup real-time listener across tabs and events
  const refreshLogs = () => {
    setLogs(getStoredErrorLogs());
  };

  useEffect(() => {
    refreshLogs();

    const handleAppErrorLogged = () => {
      refreshLogs();
    };

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'app_runtime_errors_v1') {
        refreshLogs();
      }
    };

    window.addEventListener(APP_ERROR_EVENT, handleAppErrorLogged);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener(APP_ERROR_EVENT, handleAppErrorLogged);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesSearch = 
        searchQuery === '' ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.errorMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.page.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.section.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.userName && log.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.userNotes && log.userNotes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (log.stackTrace && log.stackTrace.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRole = selectedRole === 'all' || log.userRole.toLowerCase() === selectedRole.toLowerCase();
      const matchesSource = selectedSource === 'all' || (log.source && log.source.toLowerCase().includes(selectedSource.toLowerCase()));
      const matchesStatus = selectedStatus === 'all' || log.status.toLowerCase() === selectedStatus.toLowerCase();
      const matchesSeverity = selectedSeverity === 'all' || log.severity.toLowerCase() === selectedSeverity.toLowerCase();

      return matchesSearch && matchesRole && matchesSource && matchesStatus && matchesSeverity;
    });
  }, [logs, searchQuery, selectedRole, selectedSource, selectedStatus, selectedSeverity]);

  // Statistics
  const stats = useMemo(() => {
    const total = logs.length;
    const unresolved = logs.filter(l => l.status === 'Unresolved').length;
    const userSubmitted = logs.filter(l => l.source === 'User Submitted Report').length;
    const autoCaptured = logs.filter(l => l.source !== 'User Submitted Report').length;
    const critical = logs.filter(l => l.severity === 'critical' && l.status === 'Unresolved').length;
    return { total, unresolved, userSubmitted, autoCaptured, critical };
  }, [logs]);

  // Checkbox Selection Logic
  const isAllSelected = useMemo(() => {
    if (filteredLogs.length === 0) return false;
    return filteredLogs.every(log => selectedIds.includes(log.id));
  }, [filteredLogs, selectedIds]);

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredLogs.map(l => l.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Actions
  const handleCopyAIPrompt = (log: AppErrorLog) => {
    const promptText = generateAIFixPrompt(log);
    navigator.clipboard.writeText(promptText);
    setCopiedAiPromptId(log.id);
    if (setToast) {
      setToast({ message: `AI Fix Prompt for ${log.id} copied! Paste into AI to fix.`, type: 'success' });
    }
    setTimeout(() => setCopiedAiPromptId(null), 3000);
  };

  const handleBatchCopyAIPrompt = () => {
    const selectedLogs = logs.filter(l => selectedIds.includes(l.id));
    if (selectedLogs.length === 0) return;
    const combinedPrompt = generateCombinedAIFixPrompt(selectedLogs);
    navigator.clipboard.writeText(combinedPrompt);
    setCopiedBatchAiPrompt(true);
    if (setToast) {
      setToast({ message: `Combined AI Fix Prompt for ${selectedLogs.length} error(s) copied to clipboard!`, type: 'success' });
    }
    setTimeout(() => setCopiedBatchAiPrompt(false), 3000);
  };

  const handleBatchResolve = () => {
    if (selectedIds.length === 0) return;
    toggleMultipleErrorStatus(selectedIds, 'Resolved');
    refreshLogs();
    if (setToast) {
      setToast({ message: `${selectedIds.length} error(s) marked as Resolved.`, type: 'success' });
    }
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    if (window.confirm(`Delete ${selectedIds.length} selected error log(s)?`)) {
      deleteMultipleErrorLogs(selectedIds);
      setSelectedIds([]);
      refreshLogs();
      if (setToast) {
        setToast({ message: `${selectedIds.length} error log(s) deleted.`, type: 'info' });
      }
    }
  };

  const handleCopyRawJson = (log: AppErrorLog) => {
    navigator.clipboard.writeText(JSON.stringify(log, null, 2));
    setCopiedId(log.id);
    if (setToast) {
      setToast({ message: 'Raw error JSON copied to clipboard.', type: 'info' });
    }
    setTimeout(() => setCopiedId(null), 3000);
  };

  const handleToggleStatus = (id: string) => {
    toggleErrorStatus(id);
    refreshLogs();
    if (setToast) {
      setToast({ message: 'Error status updated.', type: 'success' });
    }
  };

  const handleDeleteLog = (id: string) => {
    deleteErrorLog(id);
    setSelectedIds(prev => prev.filter(i => i !== id));
    refreshLogs();
    if (setToast) {
      setToast({ message: 'Error log removed.', type: 'info' });
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all error logs? This cannot be undone.')) {
      clearAllErrorLogs();
      setSelectedIds([]);
      refreshLogs();
      if (setToast) {
        setToast({ message: 'All error logs cleared.', type: 'info' });
      }
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLog) return;
    updateErrorLog(editingLog);
    setEditingLog(null);
    refreshLogs();
    if (setToast) {
      setToast({ message: `Error log ${editingLog.id} updated successfully!`, type: 'success' });
    }
  };

  const handleSimulateTestError = (e: React.FormEvent) => {
    e.preventDefault();
    logAppError({
      userRole: testRole,
      page: testPage,
      section: testSection,
      errorName: testErrorName,
      errorMessage: testErrorMessage,
      severity: testSeverity,
      source: testSource,
      userNotes: testSource === 'User Submitted Report' ? testUserNotes : undefined,
      stackTrace: `${testErrorName}: ${testErrorMessage}\n    at renderComponent (${testPage.replace(/\s+/g, '')}.tsx:142:18)\n    at dispatchEvent (react-dom.js:3210)`
    });
    setShowSimulateModal(false);
    refreshLogs();
    if (setToast) {
      setToast({ message: `Simulated live error report dispatched to real-time queue!`, type: 'success' });
    }
  };

  return (
    <div className="space-y-4 w-full font-sans text-slate-800">
      {/* HEADER BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs shrink-0">
            <Bug size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900 dark:text-white">Errors Log & Live Debugger</h2>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase tracking-wider">
                REAL-TIME SYNC
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowSimulateModal(true)}
            className="px-3.5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-2xs flex items-center gap-1.5 cursor-pointer border border-amber-500"
          >
            <Send size={14} />
            <span>Simulate Error</span>
          </button>

          <button
            type="button"
            onClick={refreshLogs}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            title="Refresh Logs"
          >
            <RefreshCw size={15} />
          </button>

          {logs.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* MINIMAL INLINE STATS COUNTERS */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-xl border border-slate-200/80 shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Total Logs:</span>
          <span className="font-black text-slate-900 dark:text-white">{stats.total}</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 shadow-2xs">
          <span className="text-[10px] font-bold text-amber-800 dark:text-amber-300 uppercase">Unresolved:</span>
          <span className="font-black text-amber-900 dark:text-amber-200">{stats.unresolved}</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200 shadow-2xs">
          <span className="text-[10px] font-bold text-sky-800 dark:text-sky-300 uppercase">User Reports:</span>
          <span className="font-black text-sky-900 dark:text-sky-200">{stats.userSubmitted}</span>
        </div>

        <div className="flex items-center gap-2 px-3 py-1 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 shadow-2xs">
          <span className="text-[10px] font-bold text-rose-800 dark:text-rose-300 uppercase">Critical:</span>
          <span className="font-black text-rose-900 dark:text-rose-200">{stats.critical}</span>
        </div>
      </div>

      {/* SEARCH AND FILTERS BAR */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search logs, errors, screen, stack..."
            className="w-full pl-9 pr-8 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 outline-none focus:border-amber-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2 text-slate-400 hover:text-slate-600 text-xs"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1">
            <Filter size={12} className="text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">Status: All</option>
              <option value="unresolved">Unresolved Only</option>
              <option value="resolved">Resolved Only</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1">
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">Source: All</option>
              <option value="user submitted">User Reports</option>
              <option value="auto application">Auto Detected</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">Role: All</option>
              <option value="rider">Rider</option>
              <option value="driver">Driver</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">Severity: All</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* BATCH ACTION BAR WHEN CHECKED */}
      {selectedIds.length > 0 && (
        <div className="p-3 bg-amber-400 text-slate-950 rounded-2xl shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
            <CheckSquare size={16} />
            <span>{selectedIds.length} Error Log(s) Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleBatchCopyAIPrompt}
              className="px-3 py-1.5 bg-slate-950 hover:bg-slate-900 text-white text-xs font-black rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles size={14} className="text-amber-400" />
              <span>{copiedBatchAiPrompt ? 'Copied Prompt!' : 'Send Selected to AI (Copy)'}</span>
            </button>

            <button
              type="button"
              onClick={handleBatchResolve}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            >
              <CheckCircle2 size={14} />
              <span>Mark Resolved</span>
            </button>

            <button
              type="button"
              onClick={handleBatchDelete}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 cursor-pointer"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl cursor-pointer"
            >
              Deselect
            </button>
          </div>
        </div>
      )}

      {/* MINIMAL LIST TABLE CONTAINER */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-2xs">
        {/* Table Header Row */}
        <div className="grid grid-cols-12 items-center gap-2 px-4 py-2.5 bg-slate-100/80 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-[11px] font-black uppercase text-slate-500 tracking-wider">
          <div className="col-span-1 flex items-center gap-2">
            <button 
              type="button" 
              onClick={handleToggleSelectAll}
              className="text-slate-500 hover:text-slate-800 cursor-pointer"
              title={isAllSelected ? "Deselect All" : "Select All"}
            >
              {isAllSelected ? <CheckSquare size={16} className="text-amber-600" /> : <Square size={16} />}
            </button>
            <span>ID</span>
          </div>
          <div className="col-span-2">Severity & Status</div>
          <div className="col-span-5">Error Message & Component Location</div>
          <div className="col-span-2">Role & Source</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>

        {/* List Items */}
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 size={24} className="text-emerald-500 mx-auto" />
            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No application errors found</p>
            <p className="text-[11px] text-slate-400">All application modules are operating smoothly.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLogs.map((log) => {
              const isSelected = selectedIds.includes(log.id);
              const isExpanded = expandedLogId === log.id;
              const isResolved = log.status === 'Resolved';
              const isUserSubmitted = log.source === 'User Submitted Report';

              return (
                <div 
                  key={log.id} 
                  className={`transition-colors ${
                    isSelected ? 'bg-amber-50/60 dark:bg-amber-950/20' : 'hover:bg-slate-50/70 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {/* Main Minimal Row */}
                  <div className="grid grid-cols-12 items-center gap-2 px-4 py-3 text-xs">
                    {/* Checkbox + ID */}
                    <div className="col-span-1 flex items-center gap-2 shrink-0">
                      <button 
                        type="button"
                        onClick={() => handleToggleSelectRow(log.id)}
                        className="text-slate-400 hover:text-slate-800 cursor-pointer"
                      >
                        {isSelected ? <CheckSquare size={15} className="text-amber-600" /> : <Square size={15} />}
                      </button>
                      <span className="font-mono text-[11px] font-bold text-slate-700 dark:text-slate-300 truncate">
                        {log.id.replace('ERR-', '#')}
                      </span>
                    </div>

                    {/* Severity & Status Badges */}
                    <div className="col-span-2 flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          log.severity === 'critical'
                            ? 'bg-rose-500 text-white'
                            : log.severity === 'high'
                            ? 'bg-amber-400 text-slate-950'
                            : log.severity === 'medium'
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {log.severity}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(log.id)}
                        className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider cursor-pointer border ${
                          isResolved
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                            : 'bg-rose-100 text-rose-800 border-rose-300'
                        }`}
                        title="Click to toggle status"
                      >
                        {log.status}
                      </button>
                    </div>

                    {/* Error Message & Screen Location */}
                    <div className="col-span-5 min-w-0 pr-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-900 dark:text-white text-xs truncate">
                          {log.errorName}: {log.errorMessage}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 truncate mt-0.5">
                        <span className="font-semibold text-slate-600 dark:text-slate-300">{log.page}</span>
                        <span>•</span>
                        <span className="text-amber-700 dark:text-amber-400 font-medium">{log.section}</span>
                        {log.userNotes && (
                          <>
                            <span>•</span>
                            <span className="text-slate-500 italic truncate max-w-[150px]">"{log.userNotes}"</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Role & Source */}
                    <div className="col-span-2 text-[11px] space-y-0.5">
                      <div className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                        {log.userRole === 'Rider' && <User size={12} className="text-indigo-500" />}
                        {log.userRole === 'Driver' && <Car size={12} className="text-emerald-500" />}
                        {log.userRole === 'Admin' && <Shield size={12} className="text-slate-700" />}
                        <span>{log.userRole}</span>
                        <span className="text-[10px] font-normal text-slate-400">({log.timeFormatted})</span>
                      </div>
                      <div className="text-[10px] text-slate-400 flex items-center gap-1">
                        {isUserSubmitted ? <MessageSquare size={10} className="text-amber-500" /> : <Radio size={10} className="text-sky-500" />}
                        <span>{isUserSubmitted ? 'User Report' : 'Auto Detect'}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="col-span-2 flex items-center justify-end gap-1 shrink-0">
                      {/* Copy AI Prompt Button */}
                      <button
                        type="button"
                        onClick={() => handleCopyAIPrompt(log)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-black transition-all flex items-center gap-1 cursor-pointer border ${
                          copiedAiPromptId === log.id
                            ? 'bg-emerald-500 text-white border-emerald-600'
                            : 'bg-amber-400 hover:bg-amber-500 text-slate-950 border-amber-500'
                        }`}
                        title="Copy AI Debug Fix Prompt"
                      >
                        <Sparkles size={12} />
                        <span>{copiedAiPromptId === log.id ? 'Copied' : 'AI Fix'}</span>
                      </button>

                      {/* Edit Button */}
                      <button
                        type="button"
                        onClick={() => setEditingLog({ ...log })}
                        className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                        title="Edit Error Log Details"
                      >
                        <Pencil size={13} />
                      </button>

                      {/* Delete Button */}
                      <button
                        type="button"
                        onClick={() => handleDeleteLog(log.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg cursor-pointer transition-colors"
                        title="Delete Error Log"
                      >
                        <Trash2 size={13} />
                      </button>

                      {/* Expand Details Toggle */}
                      <button
                        type="button"
                        onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 rounded-lg cursor-pointer transition-colors"
                        title="View Full Stack Trace & Telemetry"
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Accordion Expanded Stack Trace */}
                  {isExpanded && (
                    <div className="px-4 py-3 bg-slate-950 text-slate-200 border-t border-slate-800 font-mono text-xs space-y-2">
                      <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Terminal size={12} /> Full Stack Trace ({log.id})
                        </span>
                        <span>Route: {log.url || 'N/A'}</span>
                      </div>
                      <pre className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-48">
                        {log.stackTrace || 'No stack trace captured.'}
                      </pre>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-sans">
                        <span>Device/Browser: {log.browserInfo}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyRawJson(log)}
                          className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-all flex items-center gap-1 cursor-pointer text-[10px]"
                        >
                          {copiedId === log.id ? <Check size={11} /> : <Copy size={11} />}
                          <span>{copiedId === log.id ? 'Copied JSON' : 'Copy JSON'}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* EDIT ERROR LOG MODAL */}
      {editingLog && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Pencil size={18} className="text-amber-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Edit Error Log ({editingLog.id})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingLog(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-500">Status</label>
                  <select
                    value={editingLog.status}
                    onChange={(e) => setEditingLog({ ...editingLog, status: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                  >
                    <option value="Unresolved">Unresolved</option>
                    <option value="Investigating">Investigating</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-500">Severity</label>
                  <select
                    value={editingLog.severity}
                    onChange={(e) => setEditingLog({ ...editingLog, severity: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-500">Error Name</label>
                  <input
                    type="text"
                    value={editingLog.errorName}
                    onChange={(e) => setEditingLog({ ...editingLog, errorName: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-100 outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-500">Target Role</label>
                  <select
                    value={editingLog.userRole}
                    onChange={(e) => setEditingLog({ ...editingLog, userRole: e.target.value as any })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                  >
                    <option value="Rider">Rider</option>
                    <option value="Driver">Driver</option>
                    <option value="Admin">Admin</option>
                    <option value="Guest">Guest</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-500">Error Message</label>
                <textarea
                  rows={2}
                  value={editingLog.errorMessage}
                  onChange={(e) => setEditingLog({ ...editingLog, errorMessage: e.target.value })}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-mono text-slate-800 dark:text-slate-100 outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-500">Page / Screen</label>
                  <input
                    type="text"
                    value={editingLog.page}
                    onChange={(e) => setEditingLog({ ...editingLog, page: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-500">Section / Module</label>
                  <input
                    type="text"
                    value={editingLog.section}
                    onChange={(e) => setEditingLog({ ...editingLog, section: e.target.value })}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-500">User Feedback / Notes</label>
                <input
                  type="text"
                  value={editingLog.userNotes || ''}
                  onChange={(e) => setEditingLog({ ...editingLog, userNotes: e.target.value })}
                  placeholder="Optional user comments..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs text-slate-800 dark:text-slate-100 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingLog(null)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black uppercase rounded-xl shadow-xs cursor-pointer border border-amber-500"
                >
                  Update Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SIMULATE TEST ERROR MODAL */}
      {showSimulateModal && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Send size={18} className="text-amber-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Simulate Live Error Report
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSimulateModal(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSimulateTestError} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-500">Report Source</label>
                  <select
                    value={testSource}
                    onChange={(e) => setTestSource(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                  >
                    <option value="User Submitted Report">User Submitted Report</option>
                    <option value="Auto Application Capture">Auto Application Capture</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-500">Target Role</label>
                  <select
                    value={testRole}
                    onChange={(e) => setTestRole(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                  >
                    <option value="Rider">Rider App</option>
                    <option value="Driver">Driver App</option>
                    <option value="Admin">Admin Panel</option>
                    <option value="Guest">Guest / Public</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-500">Severity</label>
                  <select
                    value={testSeverity}
                    onChange={(e) => setTestSeverity(e.target.value as any)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-500">Error Name</label>
                  <input
                    type="text"
                    value={testErrorName}
                    onChange={(e) => setTestErrorName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-mono font-bold text-slate-800 dark:text-slate-100 outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-500">Target Screen / Page</label>
                <input
                  type="text"
                  value={testPage}
                  onChange={(e) => setTestPage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-500">Specific Section / Component</label>
                <input
                  type="text"
                  value={testSection}
                  onChange={(e) => setTestSection(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-bold text-slate-800 dark:text-slate-100 outline-none"
                  required
                />
              </div>

              {testSource === 'User Submitted Report' && (
                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold uppercase text-slate-500">User Notes / Description</label>
                  <textarea
                    rows={2}
                    value={testUserNotes}
                    onChange={(e) => setTestUserNotes(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-medium text-slate-800 dark:text-slate-100 outline-none"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase text-slate-500">Error Message</label>
                <textarea
                  rows={2}
                  value={testErrorMessage}
                  onChange={(e) => setTestErrorMessage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2 text-xs font-mono text-slate-800 dark:text-slate-100 outline-none"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSimulateModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black uppercase rounded-xl shadow-xs cursor-pointer border border-amber-500"
                >
                  Dispatch Error Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
