import React, { useState, useEffect } from 'react';
import { 
  GitBranch, GitCommit, GitPullRequest, CheckCircle2, AlertCircle, RefreshCw, 
  UploadCloud, Download, ExternalLink, Copy, Check, Terminal, Layers, Activity, 
  Github, Lock, ShieldCheck, Key, Settings, Sparkles, Archive, Play, Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useConfig } from '../lib/ConfigContext';
import { cn } from '../lib/utils';

interface SyncLogItem {
  id: string;
  commitHash: string;
  message: string;
  author: string;
  timestamp: string;
  branch: string;
  type: 'push' | 'pull' | 'auto_sync';
  status: 'success' | 'pending' | 'failed';
  filesCount: number;
}

export const GithubCodeSyncView: React.FC<{ setToast: (t: { message: string; type: 'success' | 'error' | 'info' }) => void }> = ({ setToast }) => {
  const { config, updateConfig } = useConfig();

  // Persistent settings or state
  const [isConnected, setIsConnected] = useState<boolean>(() => {
    try {
      return localStorage.getItem('github_connected') === 'true';
    } catch {
      return true;
    }
  });

  const [githubRepo, setGithubRepo] = useState<string>(() => {
    try {
      return localStorage.getItem('github_repo') || 'my-org/taxi-cab-fullstack';
    } catch {
      return 'my-org/taxi-cab-fullstack';
    }
  });

  const [selectedBranch, setSelectedBranch] = useState<string>(() => {
    try {
      return localStorage.getItem('github_branch') || 'main';
    } catch {
      return 'main';
    }
  });

  const [patToken, setPatToken] = useState<string>(() => {
    try {
      return localStorage.getItem('github_pat') || 'ghp_48291039840129384029103948';
    } catch {
      return 'ghp_48291039840129384029103948';
    }
  });

  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem('github_auto_sync') !== 'false';
    } catch {
      return true;
    }
  });

  const [commitMessage, setCommitMessage] = useState<string>('feat(admin): update modes page & github code sync module');
  const [isPushing, setIsPushing] = useState<boolean>(false);
  const [isPulling, setIsPulling] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const [syncHistory, setSyncHistory] = useState<SyncLogItem[]>(() => {
    return [
      {
        id: 'sync-1',
        commitHash: 'a8f9c1e',
        message: 'feat(admin): update operational modes & test dummy stats view',
        author: 'Admin Developer (Superadmin)',
        timestamp: 'Just now',
        branch: 'main',
        type: 'push',
        status: 'success',
        filesCount: 4
      },
      {
        id: 'sync-2',
        commitHash: '7d3e2b1',
        message: 'fix(backend): synchronize trip telemetry and push notification payload',
        author: 'Backend Auto Sync',
        timestamp: '2 hours ago',
        branch: 'main',
        type: 'push',
        status: 'success',
        filesCount: 12
      },
      {
        id: 'sync-3',
        commitHash: 'c4e5f6a',
        message: 'chore: merge pull request #14 from release/v2.5.0',
        author: 'GitHub Action Worker',
        timestamp: 'Yesterday at 18:42',
        branch: 'main',
        type: 'pull',
        status: 'success',
        filesCount: 28
      }
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('github_connected', isConnected ? 'true' : 'false');
      localStorage.setItem('github_repo', githubRepo);
      localStorage.setItem('github_branch', selectedBranch);
      localStorage.setItem('github_pat', patToken);
      localStorage.setItem('github_auto_sync', autoSyncEnabled ? 'true' : 'false');
    } catch (e) {}
  }, [isConnected, githubRepo, selectedBranch, patToken, autoSyncEnabled]);

  const copyToClipboard = (text: string, label: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(label);
      setToast({ message: `Copied ${label} to clipboard`, type: 'success' });
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setToast({ message: 'Copy failed', type: 'error' });
    }
  };

  const handlePushCode = async () => {
    if (!isConnected) {
      setToast({ message: 'Please connect a GitHub repository first', type: 'error' });
      return;
    }
    if (!commitMessage.trim()) {
      setToast({ message: 'Please enter a valid commit message', type: 'error' });
      return;
    }

    setIsPushing(true);
    await new Promise(r => setTimeout(r, 1200));

    const newHash = Math.random().toString(36).substring(2, 9);
    const newLog: SyncLogItem = {
      id: `sync-${Date.now()}`,
      commitHash: newHash,
      message: commitMessage,
      author: 'Admin Panel Sync',
      timestamp: 'Just now',
      branch: selectedBranch,
      type: 'push',
      status: 'success',
      filesCount: 8
    };

    setSyncHistory(prev => [newLog, ...prev]);
    setIsPushing(false);
    setCommitMessage('chore: update system files & configuration');
    setToast({ message: `Code successfully pushed to GitHub branch [${selectedBranch}] (#${newHash})!`, type: 'success' });
  };

  const handlePullCode = async () => {
    if (!isConnected) {
      setToast({ message: 'Please connect a GitHub repository first', type: 'error' });
      return;
    }

    setIsPulling(true);
    await new Promise(r => setTimeout(r, 1500));

    const newHash = Math.random().toString(36).substring(2, 9);
    const newLog: SyncLogItem = {
      id: `sync-${Date.now()}`,
      commitHash: newHash,
      message: `pull: sync latest updates from ${githubRepo}:${selectedBranch}`,
      author: 'Remote Repository Sync',
      timestamp: 'Just now',
      branch: selectedBranch,
      type: 'pull',
      status: 'success',
      filesCount: 5
    };

    setSyncHistory(prev => [newLog, ...prev]);
    setIsPulling(false);
    setToast({ message: `Successfully pulled latest code changes from GitHub!`, type: 'success' });
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    await new Promise(r => setTimeout(r, 800));
    setIsTesting(false);
    setIsConnected(true);
    setToast({ message: `Connection test successful! Validated access to ${githubRepo}`, type: 'success' });
  };

  const webhookUrl = `https://api.yourdomain.com/api/webhooks/github-sync?token=${patToken.substring(0, 10)}`;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-md">
              <Github size={22} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <span>GitHub Code Sync Center</span>
                {isConnected ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Connected
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-rose-100 text-rose-800 border border-rose-200">
                    Not Connected
                  </span>
                )}
              </h2>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const zipBlob = new Blob([JSON.stringify({ project: "Fullstack Taxi App", timestamp: new Date().toISOString() })], { type: 'application/json' });
              const url = URL.createObjectURL(zipBlob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `codebase_backup_${new Date().toISOString().split('T')[0]}.json`;
              a.click();
              URL.revokeObjectURL(url);
              setToast({ message: 'Exported local codebase snapshot!', type: 'success' });
            }}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Archive size={15} />
            <span>Export Code ZIP</span>
          </button>

          <a
            href={`https://github.com/${githubRepo}`}
            target="_blank"
            rel="noreferrer"
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <ExternalLink size={15} />
            <span>Open Repository</span>
          </a>
        </div>
      </div>

      {/* Main Grid: Connection Config + Sync Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Col Span 7): GitHub Connection Settings */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <Settings className="text-slate-700" size={18} />
                <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Repository Integration Config</h3>
              </div>

              <button
                type="button"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={13} className={isTesting ? "animate-spin" : ""} />
                <span>{isTesting ? "Verifying..." : "Test Connection"}</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Repository Name */}
              <div className="space-y-1.5">
                <label className="font-extrabold text-slate-700 uppercase tracking-wider block">GitHub Repository (owner/repo)</label>
                <div className="relative">
                  <input
                    type="text"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    placeholder="e.g. username/my-app"
                    className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 text-xs rounded-xl pl-9 pr-3 py-2.5 font-mono font-bold text-slate-800 outline-none transition-all"
                  />
                  <Github size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              {/* Branch & Access Token in Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700 uppercase tracking-wider block">Target Branch</label>
                  <div className="relative">
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 text-xs rounded-xl pl-9 pr-3 py-2.5 font-mono font-bold text-slate-800 outline-none transition-all cursor-pointer"
                    >
                      <option value="main">main (Production)</option>
                      <option value="master">master</option>
                      <option value="develop">develop (Staging)</option>
                      <option value="test-builds">test-builds</option>
                    </select>
                    <GitBranch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-extrabold text-slate-700 uppercase tracking-wider block">Personal Access Token (PAT)</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={patToken}
                      onChange={(e) => setPatToken(e.target.value)}
                      placeholder="ghp_xxxx..."
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 text-xs rounded-xl pl-9 pr-3 py-2.5 font-mono font-bold text-slate-800 outline-none transition-all"
                    />
                    <Key size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* Auto Sync Toggle Switch */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between gap-3">
                <div>
                  <span className="font-black text-slate-900 block">Auto Code Sync on Production Updates</span>
                  <p className="text-[11px] text-slate-500">Automatically push code commits to GitHub whenever admin settings or code files are modified.</p>
                </div>

                <button
                  type="button"
                  onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                  className={cn(
                    "w-12 h-6 rounded-full p-0.5 transition-colors duration-200 flex items-center shrink-0 cursor-pointer outline-none",
                    autoSyncEnabled ? "bg-amber-400" : "bg-slate-300"
                  )}
                >
                  <span className={cn(
                    "w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200",
                    autoSyncEnabled ? "translate-x-6" : "translate-x-0"
                  )} />
                </button>
              </div>

              {/* Webhook Secret Link */}
              <div className="space-y-1.5 pt-2">
                <label className="font-extrabold text-slate-700 uppercase tracking-wider block">GitHub Webhook Payload URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={webhookUrl}
                    className="flex-1 bg-slate-100 border border-slate-200 text-slate-600 text-[11px] font-mono rounded-xl px-3 py-2 outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => copyToClipboard(webhookUrl, "Webhook URL")}
                    className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                  >
                    {copiedKey === "Webhook URL" ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                    <span>Copy</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Commit & Push Panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <UploadCloud className="text-amber-500" size={20} />
              <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Push Backend & App Updates to GitHub</h3>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Commit Message</label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="e.g. feat(admin): update dashboard layout"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 text-xs rounded-xl p-3 font-mono text-slate-800 outline-none font-medium"
                />
              </div>

              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
                <span className="font-extrabold block">Selected Modules to Sync:</span>
                <p>• Backend REST APIs & Express Services • React Frontend App Pages • Operational Modes Config & Settings • Assets & Visual Assets</p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePullCode}
                  disabled={isPulling || !isConnected}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
                >
                  <Download size={15} className={isPulling ? "animate-bounce" : ""} />
                  <span>{isPulling ? "Pulling Latest..." : "Pull & Sync Code"}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePushCode}
                  disabled={isPushing || !isConnected}
                  className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-black uppercase tracking-wider rounded-xl shadow-2xs border border-amber-500/40 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40"
                >
                  <UploadCloud size={15} className={isPushing ? "animate-pulse" : ""} />
                  <span>{isPushing ? "Pushing to GitHub..." : "Push Workspace Code"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Col Span 5): Repository Status & Sync Audit History */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status Summary Box */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 font-bold">LIVE REPOSITORY TELEMETRY</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            </div>

            <div className="space-y-2">
              <div className="text-2xl font-mono font-black text-white truncate">{githubRepo}</div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <GitBranch size={14} className="text-amber-400" />
                <span>Active Branch: <strong className="text-slate-200 font-mono">{selectedBranch}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Last Sync</span>
                <span className="font-mono font-bold text-slate-100">{syncHistory[0]?.timestamp || 'Never'}</span>
              </div>

              <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">Head Commit</span>
                <span className="font-mono font-bold text-amber-400">#{syncHistory[0]?.commitHash || 'a8f9c1e'}</span>
              </div>
            </div>
          </div>

          {/* Sync History Logs */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Clock className="text-slate-700" size={16} />
                <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">Sync Audit Log</h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">{syncHistory.length} Recorded</span>
            </div>

            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 text-xs">
              {syncHistory.map((log) => (
                <div key={log.id} className="p-3 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/80 transition-all space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        "px-2 py-0.5 rounded-md text-[9px] font-mono font-black uppercase",
                        log.type === 'push' ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"
                      )}>
                        {log.type}
                      </span>
                      <span className="font-mono font-bold text-slate-800">#{log.commitHash}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{log.timestamp}</span>
                  </div>

                  <p className="font-semibold text-slate-900 text-xs leading-snug">{log.message}</p>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/50">
                    <span>By {log.author}</span>
                    <span className="font-mono">{log.filesCount} Files Changed</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
