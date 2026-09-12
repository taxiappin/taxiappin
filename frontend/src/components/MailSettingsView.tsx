import React, { useState } from "react";
import { 
  Mail, 
  Key, 
  Eye, 
  EyeOff, 
  Check, 
  Zap, 
  ShieldCheck, 
  Server,
  Send,
  Loader2
} from "lucide-react";

interface MailSettingsViewProps {
  config: any;
  updateConfig: (updater: (prev: any) => any) => void;
  setToast: (toast: { message: string; type: "success" | "error" | "info" }) => void;
}

export const MailSettingsView: React.FC<MailSettingsViewProps> = ({ config, updateConfig, setToast }) => {
  const mailSettings = config.mailSettings || {};

  const [smtpHost, setSmtpHost] = useState(mailSettings.smtpHost || "smtp.gmail.com");
  const [smtpPort, setSmtpPort] = useState(mailSettings.smtpPort || "587");
  const [smtpUser, setSmtpUser] = useState(mailSettings.smtpUser || "");
  const [smtpPass, setSmtpPass] = useState(mailSettings.smtpPass || "");
  const [smtpSecure, setSmtpSecure] = useState(mailSettings.smtpSecure !== false);
  const [smtpSenderName, setSmtpSenderName] = useState(mailSettings.smtpSenderName || "TaxiApp Team");
  const [smtpFrom, setSmtpFrom] = useState(mailSettings.smtpFrom || "notifications@taxiapp.com");
  const [mailProvider, setMailProvider] = useState<"smtp" | "simulation">(mailSettings.mailProvider === "smtp" ? "smtp" : "simulation");
  
  const [showPassword, setShowPassword] = useState(false);
  const [testEmailAddress, setTestEmailAddress] = useState("");
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleSaveMailConfig = () => {
    updateConfig((prev: any) => ({
      ...prev,
      mailSettings: {
        ...prev.mailSettings,
        mailProvider,
        smtpHost,
        smtpPort,
        smtpUser,
        smtpPass,
        smtpSecure,
        smtpSenderName,
        smtpFrom,
        enabled: true
      }
    }));
    setToast({ message: "Mail server & SMTP settings updated successfully!", type: "success" });
  };

  const handleSendTestEmail = async () => {
    if (!testEmailAddress || !testEmailAddress.includes("@")) {
      setToast({ message: "Please enter a valid test recipient email address.", type: "error" });
      return;
    }
    setIsSendingTest(true);
    try {
      const res = await fetch("/api/admin/mail/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipient: testEmailAddress,
          mailSettings: {
            smtpHost,
            smtpPort,
            smtpUser,
            smtpPass,
            smtpSecure,
            smtpSenderName,
            smtpFrom,
            mailProvider
          }
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setToast({ message: `Test email successfully dispatched to ${testEmailAddress}!`, type: "success" });
      } else {
        setToast({ message: data.error || "Failed to dispatch test email. Check SMTP credentials.", type: "error" });
      }
    } catch (err: any) {
      setToast({ message: "Network error trying to contact mail service.", type: "error" });
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <div className="space-y-6 w-full font-sans text-slate-800">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Mail className="text-slate-800" size={24} />
            <span>Email &amp; SMTP Gateway Settings</span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
              mailProvider === "smtp" 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : "bg-blue-50 text-blue-700 border-blue-200"
            }`}>
              {mailProvider === "smtp" ? "Live SMTP Active" : "In-App Simulation Active"}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure outgoing transactional emails, OTP verification notices, receipts, and admin alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-400 text-slate-950 px-3.5 py-2 rounded-xl shrink-0 shadow-2xs font-mono border border-amber-500/50">
          <Zap size={15} />
          <span className="text-xs font-black uppercase tracking-wider">
            {mailProvider.toUpperCase()} GATEWAY
          </span>
        </div>
      </div>

      {/* MAIN SETTINGS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Server size={18} className="text-amber-500" />
              <h3 className="font-extrabold text-slate-900 text-base">SMTP Server Configuration</h3>
            </div>
            <span className="text-[10px] font-extrabold font-mono text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
              Port: {smtpPort}
            </span>
          </div>

          {/* Provider Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setMailProvider("smtp")}
              className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                mailProvider === "smtp"
                  ? "bg-amber-50/80 border-amber-300 shadow-2xs"
                  : "bg-slate-50 border-slate-200 hover:bg-white"
              }`}
            >
              <div className="text-xs font-black text-slate-900">📧 Custom SMTP Server</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Use your Gmail, SendGrid, Amazon SES, or custom mail gateway.</div>
            </button>

            <button
              type="button"
              onClick={() => setMailProvider("simulation")}
              className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                mailProvider === "simulation"
                  ? "bg-amber-50/80 border-amber-300 shadow-2xs"
                  : "bg-slate-50 border-slate-200 hover:bg-white"
              }`}
            >
              <div className="text-xs font-black text-slate-900">⚡ Local Simulator</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Dispatches instant OTPs directly in toasts for sandbox testing.</div>
            </button>
          </div>

          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">SMTP Host / Server</label>
                <input
                  type="text"
                  value={smtpHost}
                  onChange={(e) => setSmtpHost(e.target.value)}
                  placeholder="smtp.gmail.com"
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-400 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">SMTP Port</label>
                <input
                  type="text"
                  value={smtpPort}
                  onChange={(e) => setSmtpPort(e.target.value)}
                  placeholder="587"
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">SMTP Username / Email</label>
                <input
                  type="text"
                  value={smtpUser}
                  onChange={(e) => setSmtpUser(e.target.value)}
                  placeholder="admin@yourdomain.com"
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs font-medium text-slate-900 outline-none focus:border-amber-400 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">SMTP Password / App Key</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={smtpPass}
                    onChange={(e) => setSmtpPass(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-3.5 pr-10 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-400 focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Sender Display Name</label>
                <input
                  type="text"
                  value={smtpSenderName}
                  onChange={(e) => setSmtpSenderName(e.target.value)}
                  placeholder="TaxiApp Security Team"
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs font-medium text-slate-900 outline-none focus:border-amber-400 focus:bg-white transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">Sender "From" Email Address</label>
                <input
                  type="text"
                  value={smtpFrom}
                  onChange={(e) => setSmtpFrom(e.target.value)}
                  placeholder="no-reply@yourdomain.com"
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl px-3.5 text-xs font-mono text-slate-900 outline-none focus:border-amber-400 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smtpSecure}
                  onChange={(e) => setSmtpSecure(e.target.checked)}
                  className="rounded text-amber-500 focus:ring-amber-400"
                />
                <span>Enable TLS / SSL Security Protocol (Recommended)</span>
              </label>
            </div>

            <button
              type="button"
              onClick={handleSaveMailConfig}
              className="w-full h-12 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98"
            >
              <Check size={16} /> Save Mail &amp; SMTP Settings
            </button>
          </div>
        </div>

        {/* SIDEBAR: TEST DISPATCH & INFO */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 font-black text-slate-900 text-sm">
              <Send size={16} className="text-amber-500" />
              <span>Send Test Email</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Verify your SMTP credentials by dispatching a test email with diagnostic timestamp.
            </p>
            <div className="space-y-2">
              <input
                type="email"
                value={testEmailAddress}
                onChange={(e) => setTestEmailAddress(e.target.value)}
                placeholder="recipient@example.com"
                className="w-full h-10 bg-slate-50 border border-slate-200 rounded-xl px-3 text-xs font-medium text-slate-900 outline-none focus:border-amber-400 focus:bg-white transition-all"
              />
              <button
                type="button"
                onClick={handleSendTestEmail}
                disabled={isSendingTest}
                className="w-full h-10 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSendingTest ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                <span>{isSendingTest ? "Sending Test..." : "Dispatch Test Email"}</span>
              </button>
            </div>
          </div>

          <div className="bg-amber-50/80 border border-amber-200 p-5 rounded-3xl space-y-3">
            <div className="flex items-center gap-2 font-black text-amber-900 text-sm">
              <ShieldCheck size={18} className="text-amber-600" />
              <span>Direct PostgreSQL &amp; SMTP</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              All credentials, passwords, and reset tokens are securely hashed and managed directly in your local PostgreSQL database with standard SMTP delivery.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
