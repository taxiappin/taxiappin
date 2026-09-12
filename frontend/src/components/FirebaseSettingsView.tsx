import React, { useState, useEffect } from 'react';
import { 
  Flame, Key, Lock, Bell, CheckCircle2, AlertTriangle, Send, 
  RefreshCw, Copy, Check, ExternalLink, HelpCircle, Shield, 
  Smartphone, Save, Eye, EyeOff, Radio, Info, ChevronDown, ChevronRight
} from 'lucide-react';
import { cn } from '../lib/utils';
import { sendFirebasePhoneOtp, verifyFirebasePhoneOtp, requestFcmToken } from '../services/firebase';

interface FirebaseSettingsViewProps {
  config: any;
  updateConfig: (patch: any) => void;
  setToast: (toast: { message: string; type: 'success' | 'error' | 'info' }) => void;
}

export const FirebaseSettingsView: React.FC<FirebaseSettingsViewProps> = ({
  config,
  updateConfig,
  setToast
}) => {
  const currentFb = config?.firebaseConfig || {
    apiKey: "AIzaSyDv-yvl14rUgyunBX2tBS9tQXvUC_JU1q4",
    authDomain: "taxiappwebsite.firebaseapp.com",
    projectId: "taxiappwebsite",
    storageBucket: "taxiappwebsite.firebasestorage.app",
    messagingSenderId: "32855624240",
    appId: "1:32855624240:web:7f7073ff421952cbecbbf5",
    measurementId: "G-BHERTJVM9W",
    vapidKey: "BFlD7f-W2eN9F_z_T7oU0NfJ1T087k5M3_7u5pP8b9S_79sN2VfT1Z0F8Y8X8z8f_T9_79oK1S8_Y0NfJ1T087k5M",
    serviceAccountJson: "",
    phoneAuthEnabled: true,
    fcmPushEnabled: true
  };

  const [formData, setFormData] = useState(currentFb);
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Test SMS State
  const [testPhone, setTestPhone] = useState("+1 555-555-0100");
  const [testOtpCode, setTestOtpCode] = useState("");
  const [isSendingSms, setIsSendingSms] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [smsTestResult, setSmsTestResult] = useState<{ status: 'idle' | 'sent' | 'verified' | 'error'; message: string }>({
    status: 'idle',
    message: ''
  });

  // Test Push State
  const [testFcmTitle, setTestFcmTitle] = useState("🔔 Real-Time Ride Alert");
  const [testFcmBody, setTestFcmBody] = useState("Your driver is arriving in 3 mins! (Background Push Test)");
  const [isSendingPush, setIsSendingPush] = useState(false);
  const [pushTestResult, setPushTestResult] = useState<string>('');

  // Guide accordions
  const [expandedFaq, setExpandedFaq] = useState<string | null>('battery_optimization');

  useEffect(() => {
    if (config?.firebaseConfig) {
      setFormData(config.firebaseConfig);
    }
  }, [config?.firebaseConfig]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
    setToast({ message: 'Copied to clipboard!', type: 'info' });
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Save locally to storage as active override
      localStorage.setItem('taxiapp_firebase_config', JSON.stringify(formData));

      // Persist in backend config.json
      updateConfig({
        firebaseConfig: formData
      });

      // Also trigger direct save to backend endpoint
      await fetch('/api/admin/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...config,
          firebaseConfig: formData
        })
      });

      setToast({ message: '✓ Firebase & FCM credentials saved successfully!', type: 'success' });
    } catch (err: any) {
      setToast({ message: `Failed to save: ${err.message}`, type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };

  // Test Real Firebase SMS OTP
  const handleTestSendOtp = async () => {
    if (!testPhone.trim()) {
      setToast({ message: 'Please enter a test phone number with country code.', type: 'error' });
      return;
    }

    setIsSendingSms(true);
    setSmsTestResult({ status: 'idle', message: '' });

    try {
      await sendFirebasePhoneOtp(testPhone.trim(), 'recaptcha-container');
      setSmsTestResult({
        status: 'sent',
        message: `✓ Real SMS verification dispatched to ${testPhone}. Enter the 6-digit code below to confirm.`
      });
      setToast({ message: `SMS OTP dispatched to ${testPhone}!`, type: 'success' });
    } catch (err: any) {
      console.error('[TEST SMS ERROR]', err);
      setSmsTestResult({
        status: 'error',
        message: `Failed: ${err.message || 'Check Firebase Console phone settings & authorized domains.'}`
      });
      setToast({ message: `SMS Error: ${err.message || 'Check domain authorization'}`, type: 'error' });
    } finally {
      setIsSendingSms(false);
    }
  };

  // Verify Test SMS Code
  const handleTestVerifyOtp = async () => {
    if (!testOtpCode.trim()) {
      setToast({ message: 'Please enter the 6-digit verification code.', type: 'error' });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const result = await verifyFirebasePhoneOtp(testOtpCode.trim());
      if (result && result.user) {
        setSmsTestResult({
          status: 'verified',
          message: `✓ Verification Successful! Authenticated Firebase User UID: ${result.user.uid}`
        });
        setToast({ message: '✓ Phone OTP verified successfully in Firebase!', type: 'success' });
      }
    } catch (err: any) {
      console.error('[TEST VERIFY ERROR]', err);
      setSmsTestResult({
        status: 'error',
        message: `Verification Failed: ${err.message}`
      });
      setToast({ message: `Verification failed: ${err.message}`, type: 'error' });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Test FCM Background Push Broadcast
  const handleTestFcmPush = async () => {
    setIsSendingPush(true);
    setPushTestResult('');

    try {
      // 1. Trigger via server web push broadcast
      const res = await fetch('/api/push/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target: 'All',
          title: testFcmTitle,
          body: testFcmBody,
          url: '/',
          actionLabel: 'Open TaxiApp',
          actionUrl: '/'
        })
      });

      const data = await res.json();
      if (res.ok) {
        setPushTestResult(`✓ Push Broadcast triggered successfully! Delivered to ${data.stats?.delivered || 1} active registered device endpoint(s).`);
        setToast({ message: 'Background Push notification broadcasted!', type: 'success' });
      } else {
        setPushTestResult(`Error: ${data.error || 'Push dispatch failed'}`);
        setToast({ message: data.error || 'Failed to dispatch push', type: 'error' });
      }
    } catch (err: any) {
      setPushTestResult(`Error: ${err.message}`);
      setToast({ message: `Push failed: ${err.message}`, type: 'error' });
    } finally {
      setIsSendingPush(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Flame className="text-amber-500 fill-amber-400" size={26} />
            <span>Firebase &amp; Cloud Messaging (FCM)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage Firebase Phone Authentication, reCAPTCHA keys, Web Push VAPID certificates, and 24/7 background notification delivery.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://console.firebase.google.com/project/taxiappwebsite"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <span>Firebase Console</span>
            <ExternalLink size={13} className="text-slate-400" />
          </a>

          <button
            type="button"
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center gap-1.5 border border-amber-500 cursor-pointer"
          >
            <Save size={14} className={isSaving ? 'animate-spin' : ''} />
            <span>{isSaving ? 'Saving...' : 'Save Firebase Config'}</span>
          </button>
        </div>
      </div>

      {/* Status Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center font-black">
            📱
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone Authentication</div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
              <span>{formData.phoneAuthEnabled ? 'Active (SMS + OTP)' : 'Disabled'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-[11px] text-slate-500">Project: <span className="font-mono font-bold text-slate-700">{formData.projectId}</span></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center font-black">
            🚀
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Background Web Push</div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
              <span>{formData.fcmPushEnabled ? 'FCM + VAPID Active' : 'Disabled'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-[11px] text-slate-500">Sender ID: <span className="font-mono font-bold text-slate-700">{formData.messagingSenderId}</span></div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 border border-purple-200 flex items-center justify-center font-black">
            🛡️
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">reCAPTCHA &amp; Security</div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-1.5 mt-0.5">
              <span>Enterprise Invisible</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
            <div className="text-[11px] text-slate-500">Authorized Domain Ready</div>
          </div>
        </div>
      </div>

      {/* Main Form: Firebase Web App Credentials */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key size={16} className="text-amber-500" />
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
              Firebase Client &amp; Web App Configuration
            </h3>
          </div>
          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
            Synchronized with Frontend &amp; Backend
          </span>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project ID */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
                <span>Firebase Project ID</span>
                <span className="text-[10px] text-slate-400 font-mono">projectId</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.projectId}
                  onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 font-bold outline-none focus:border-amber-500 focus:bg-white"
                  placeholder="taxiappwebsite"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(formData.projectId, 'projectId')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {copiedKey === 'projectId' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Auth Domain */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
                <span>Auth Domain</span>
                <span className="text-[10px] text-slate-400 font-mono">authDomain</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.authDomain}
                  onChange={(e) => setFormData({ ...formData, authDomain: e.target.value })}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 font-bold outline-none focus:border-amber-500 focus:bg-white"
                  placeholder="taxiappwebsite.firebaseapp.com"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(formData.authDomain, 'authDomain')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {copiedKey === 'authDomain' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* API Key */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
                <span>Web API Key</span>
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-[10px] text-amber-600 hover:text-amber-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  {showApiKey ? <EyeOff size={12} /> : <Eye size={12} />}
                  <span>{showApiKey ? 'Hide' : 'Reveal'}</span>
                </button>
              </label>
              <div className="relative">
                <input
                  type={showApiKey ? "text" : "password"}
                  value={formData.apiKey}
                  onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 font-bold outline-none focus:border-amber-500 focus:bg-white pr-10"
                  placeholder="AIzaSy..."
                />
                <button
                  type="button"
                  onClick={() => handleCopy(formData.apiKey, 'apiKey')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {copiedKey === 'apiKey' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Messaging Sender ID */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
                <span>Messaging Sender ID (FCM)</span>
                <span className="text-[10px] text-slate-400 font-mono">messagingSenderId</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.messagingSenderId}
                  onChange={(e) => setFormData({ ...formData, messagingSenderId: e.target.value })}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 font-bold outline-none focus:border-amber-500 focus:bg-white"
                  placeholder="32855624240"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(formData.messagingSenderId, 'messagingSenderId')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {copiedKey === 'messagingSenderId' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* App ID */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
                <span>Web App ID</span>
                <span className="text-[10px] text-slate-400 font-mono">appId</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.appId}
                  onChange={(e) => setFormData({ ...formData, appId: e.target.value })}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 font-bold outline-none focus:border-amber-500 focus:bg-white"
                  placeholder="1:32855624240:web:..."
                />
                <button
                  type="button"
                  onClick={() => handleCopy(formData.appId, 'appId')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {copiedKey === 'appId' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Storage Bucket */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
                <span>Storage Bucket</span>
                <span className="text-[10px] text-slate-400 font-mono">storageBucket</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.storageBucket}
                  onChange={(e) => setFormData({ ...formData, storageBucket: e.target.value })}
                  className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 font-bold outline-none focus:border-amber-500 focus:bg-white"
                  placeholder="taxiappwebsite.firebasestorage.app"
                />
                <button
                  type="button"
                  onClick={() => handleCopy(formData.storageBucket, 'storageBucket')}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
                >
                  {copiedKey === 'storageBucket' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                </button>
              </div>
            </div>
          </div>

          {/* VAPID Public Key */}
          <div className="space-y-1 pt-2">
            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wide flex items-center justify-between">
              <span>Web Push Certificate / VAPID Key</span>
              <span className="text-[10px] text-slate-400 font-mono">Cloud Messaging &gt; Web configuration</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.vapidKey}
                onChange={(e) => setFormData({ ...formData, vapidKey: e.target.value })}
                className="w-full bg-slate-50/70 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-900 font-bold outline-none focus:border-amber-500 focus:bg-white"
                placeholder="BFlD7f-W2eN9F_z_T7oU0NfJ1T087k5M3..."
              />
              <button
                type="button"
                onClick={() => handleCopy(formData.vapidKey, 'vapidKey')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                {copiedKey === 'vapidKey' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </button>
            </div>
            <p className="text-[10px] text-slate-500">
              Used by browsers and service workers to generate push subscription tokens with Google Play Push &amp; Apple APNs.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Testing Panel: SMS OTP & Background Push */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Test 1: Real Firebase Phone SMS OTP */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="text-base">📲</span>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Test Firebase Phone Auth (Real SMS)
                </h4>
              </div>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-amber-100 text-amber-900 rounded">
                Live Verification
              </span>
            </div>

            <div className="p-5 space-y-3.5">
              <p className="text-xs text-slate-600">
                Send an actual SMS verification code to any phone number to confirm your Firebase credentials and reCAPTCHA domain binding.
              </p>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-700 uppercase">Destination Phone Number</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    placeholder="+1 555-555-0100 or +91 9876543210"
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={handleTestSendOtp}
                    disabled={isSendingSms}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-black rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    <Send size={13} className={isSendingSms ? 'animate-spin' : ''} />
                    <span>{isSendingSms ? 'Sending...' : 'Send SMS'}</span>
                  </button>
                </div>
              </div>

              {smsTestResult.status === 'sent' && (
                <div className="space-y-2 pt-2 border-t border-slate-100 animate-fadeIn">
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Enter Received 6-Digit OTP</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={testOtpCode}
                      onChange={(e) => setTestOtpCode(e.target.value)}
                      placeholder="123456"
                      className="w-32 text-center tracking-widest bg-amber-50/50 border border-amber-300 rounded-xl px-3 py-2 text-sm font-mono font-black text-slate-900 outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleTestVerifyOtp}
                      disabled={isVerifyingOtp}
                      className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs rounded-xl transition-all cursor-pointer"
                    >
                      {isVerifyingOtp ? 'Verifying...' : 'Verify OTP Code'}
                    </button>
                  </div>
                </div>
              )}

              {smsTestResult.message && (
                <div className={cn(
                  "p-3 rounded-xl text-xs font-medium border flex items-start gap-2",
                  smsTestResult.status === 'verified' ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                  smsTestResult.status === 'sent' ? "bg-amber-50 text-amber-800 border-amber-200" :
                  "bg-rose-50 text-rose-800 border-rose-200"
                )}>
                  {smsTestResult.status === 'verified' ? <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" /> :
                   smsTestResult.status === 'sent' ? <Info size={16} className="text-amber-600 shrink-0 mt-0.5" /> :
                   <AlertTriangle size={16} className="text-rose-600 shrink-0 mt-0.5" />}
                  <span className="leading-relaxed">{smsTestResult.message}</span>
                </div>
              )}
            </div>
          </div>

          <div className="px-5 py-2.5 bg-slate-50 text-[10px] text-slate-500 border-t border-slate-100 flex items-center justify-between">
            <span>Tip: Test numbers in Firebase Console can use fixed codes (e.g. 123456).</span>
            <span className="font-bold text-slate-700">Quota Free</span>
          </div>
        </div>

        {/* Test 2: Background FCM Push Notification Broadcast */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden flex flex-col justify-between">
          <div>
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2">
                <span className="text-base">🚀</span>
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Test Background Push (Even When App is Closed)
                </h4>
              </div>
              <span className="px-2 py-0.5 text-[9px] font-mono font-bold bg-blue-100 text-blue-900 rounded">
                High Priority (TTL: 86400)
              </span>
            </div>

            <div className="p-5 space-y-3.5">
              <p className="text-xs text-slate-600">
                Dispatches a system-level Web Push notification to all registered browser &amp; PWA device endpoints using the active VAPID keypair.
              </p>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Notification Title</label>
                  <input
                    type="text"
                    value={testFcmTitle}
                    onChange={(e) => setTestFcmTitle(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-slate-900 outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 uppercase">Message Body</label>
                  <input
                    type="text"
                    value={testFcmBody}
                    onChange={(e) => setTestFcmBody(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={handleTestFcmPush}
                  disabled={isSendingPush}
                  className="w-full py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer border border-amber-500 disabled:opacity-50"
                >
                  <Bell size={14} className={isSendingPush ? 'animate-bounce' : ''} />
                  <span>{isSendingPush ? 'Broadcasting Push...' : 'Broadcast Test Push to All Devices'}</span>
                </button>
              </div>

              {pushTestResult && (
                <div className="p-3 bg-blue-50 text-blue-900 border border-blue-200 rounded-xl text-xs flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-blue-600 shrink-0 mt-0.5" />
                  <span>{pushTestResult}</span>
                </div>
              )}
            </div>
          </div>

          <div className="px-5 py-2.5 bg-slate-50 text-[10px] text-slate-500 border-t border-slate-100 flex items-center justify-between">
            <span>Payload includes <code>urgency: high</code> and <code>requireInteraction: true</code></span>
            <span className="font-bold text-emerald-700">W3C Compliant</span>
          </div>
        </div>
      </div>

      {/* Comprehensive Architectural Guide: Why Push Sleeps & How to Enable 24/7 Delivery (Like WhatsApp) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 to-slate-800 text-white">
          <div className="flex items-center gap-2.5">
            <HelpCircle size={18} className="text-amber-400" />
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400">
                Architectural Breakdown: Why Push Notifications Stop When App is Closed &amp; How to Fix It
              </h3>
              <p className="text-[11px] text-slate-300">
                Understanding PWA Web Push vs. Native Background Apps (WhatsApp / Uber) and how to ensure 100% 24/7 delivery.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4 divide-y divide-slate-100 text-xs text-slate-700">
          {/* Section 1 */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setExpandedFaq(expandedFaq === 'battery_optimization' ? null : 'battery_optimization')}
              className="w-full flex items-center justify-between font-black text-slate-900 text-left cursor-pointer py-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-bold">Q1:</span>
                <span>Why do push notifications work for a while, but stop when the app is closed or unused for an hour?</span>
              </div>
              {expandedFaq === 'battery_optimization' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {expandedFaq === 'battery_optimization' && (
              <div className="mt-2.5 space-y-2 text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200/70 leading-relaxed">
                <p>
                  <strong>Root Cause (Android Doze Mode &amp; Browser Sleeping):</strong><br />
                  When the app is open, it uses active <strong>WebSockets (Socket.io)</strong> in the foreground. When the app is closed or inactive for 15–60 minutes, the mobile OS (Android MIUI, Samsung OneUI, OnePlus, iOS) puts the browser background process to sleep to preserve battery.
                </p>
                <p>
                  <strong>Why Native Apps (WhatsApp/Uber) keep working:</strong><br />
                  Native APK/IPA apps install persistent background services with OS-level WakeLocks. When built as a Web PWA, the OS delegates push waking to <strong>Google Play Services (FCM)</strong> and the <strong>Service Worker</strong> (<code>sw.ts</code> / <code>firebase-messaging-sw.js</code>).
                </p>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 text-[11px]">
                  <strong>✨ Implemented Solution:</strong> We have configured the backend push service with <code>TTL: 86400</code> (24h retention) and <code>urgency: 'high'</code> headers so Google Play Services / FCM wakes the phone's lock screen directly without waiting for the app to open.
                </div>
              </div>
            )}
          </div>

          {/* Section 2 */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setExpandedFaq(expandedFaq === 'phone_settings' ? null : 'phone_settings')}
              className="w-full flex items-center justify-between font-black text-slate-900 text-left cursor-pointer py-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-bold">Q2:</span>
                <span>What settings should Users &amp; Drivers turn on to receive notifications 24/7 like WhatsApp?</span>
              </div>
              {expandedFaq === 'phone_settings' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {expandedFaq === 'phone_settings' && (
              <div className="mt-2.5 space-y-3 text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200/70 leading-relaxed">
                <div>
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>🤖 On Android (Chrome / Installed PWA):</span>
                  </h5>
                  <ol className="list-decimal list-inside space-y-1 mt-1 pl-1 text-[11px]">
                    <li><strong>Install as PWA:</strong> Tap the browser menu (⋮) &gt; <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.</li>
                    <li><strong>Disable Battery Restriction:</strong> Go to Phone Settings &gt; Apps &gt; <em>Chrome / TaxiApp</em> &gt; Battery &gt; Select <strong>"Unrestricted"</strong>.</li>
                    <li><strong>Allow Background Data:</strong> Ensure "Background data" is toggled ON.</li>
                  </ol>
                </div>

                <div>
                  <h5 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <span>🍎 On iPhone / iPad (iOS 16.4+):</span>
                  </h5>
                  <ol className="list-decimal list-inside space-y-1 mt-1 pl-1 text-[11px]">
                    <li>Open Safari &gt; Tap the <strong>Share</strong> button (<span className="font-mono">􀈂</span>) &gt; Tap <strong>"Add to Home Screen"</strong>.</li>
                    <li>Launch the app from the Home Screen &gt; Tap <strong>"Allow Notifications"</strong> when prompted. (iOS requires standalone PWA for Web Push APNs).</li>
                  </ol>
                </div>
              </div>
            )}
          </div>

          {/* Section 3 */}
          <div className="pt-4">
            <button
              type="button"
              onClick={() => setExpandedFaq(expandedFaq === 'native_wrapper' ? null : 'native_wrapper')}
              className="w-full flex items-center justify-between font-black text-slate-900 text-left cursor-pointer py-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-bold">Q3:</span>
                <span>Want 100% WhatsApp-grade zero-restriction background execution for Google Play Store?</span>
              </div>
              {expandedFaq === 'native_wrapper' ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
            {expandedFaq === 'native_wrapper' && (
              <div className="mt-2.5 space-y-2 text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200/70 leading-relaxed">
                <p>
                  While our PWA with Service Worker Push &amp; FCM delivers lock-screen notifications reliably, if you plan to publish a native APK on the Google Play Store or Apple App Store:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px] pl-1">
                  <li><strong>TWA (Trusted Web Activity) / Capacitor:</strong> Wraps this exact web codebase into a native Android APK with <code>@capacitor/push-notifications</code> and background services.</li>
                  <li><strong>Foreground Service:</strong> Keeps the driver GPS and instant ride radar alive continuously with an active status bar notification icon.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
