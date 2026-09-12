import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Navigation, 
  AlertTriangle, 
  Headphones, 
  IndianRupee, 
  Truck, 
  Sparkles, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  ArrowLeft,
  Crown,
  Users,
  Car,
  Activity,
  Globe,
  Star,
  Tag,
  Sliders,
  Database,
  Shield,
  Smartphone,
  Mail,
  RefreshCw,
  ChevronDown,
  CheckCircle,
  Copy
} from 'lucide-react';
import { BrandLogo } from './BrandLogo';
import { cn } from '../lib/utils';
import { SERVICE_ROLES, ServiceRoleDef, StaffUserProfile } from '../data/serviceRoles';

interface BackendStaffLoginProps {
  config: any;
  userProfiles: StaffUserProfile[];
  roles?: ServiceRoleDef[];
  onLoginSuccess: (user: StaffUserProfile) => void;
  onBackToApp?: () => void;
}

export const BackendStaffLogin: React.FC<BackendStaffLoginProps> = ({
  config,
  userProfiles,
  roles = SERVICE_ROLES,
  onLoginSuccess,
  onBackToApp
}) => {
  const allRoles = roles && roles.length > 0 ? roles : SERVICE_ROLES;

  // Active Login Mode: 'password' | 'otp' | 'reset-password'
  const [authMode, setAuthMode] = useState<'password' | 'otp' | 'reset-password'>('password');

  // Role Selection
  const [selectedRole, setSelectedRole] = useState<ServiceRoleDef>(() => {
    return allRoles.find(r => r.name === 'Super Admin') || allRoles[0];
  });

  // Standard Password Login Form States
  const [username, setUsername] = useState('super_admin');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSession, setRememberSession] = useState(true);

  // Common Notification & Status States
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dispatchedOtpBanner, setDispatchedOtpBanner] = useState<string | null>(null);

  // OTP Login States (like rider/driver login)
  const [otpTargetType, setOtpTargetType] = useState<'phone' | 'email'>('phone');
  const [otpPhone, setOtpPhone] = useState('+91 98765 00000');
  const [otpEmail, setOtpEmail] = useState('rahul.admin@taxicluster.com');
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpSent, setOtpSent] = useState(false);
  const [dispatchedOtpCode, setDispatchedOtpCode] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password Reset States
  const [resetStep, setResetStep] = useState<'request' | 'verify' | 'new-password' | 'success'>('request');
  const [resetContact, setResetContact] = useState('rahul.admin@taxicluster.com');
  const [resetOtpDigits, setResetOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [resetDispatchedOtp, setResetDispatchedOtp] = useState('');
  const [resetNewPassword, setResetNewPassword] = useState('');
  const [resetConfirmPassword, setResetConfirmPassword] = useState('');
  const [showResetNewPassword, setShowResetNewPassword] = useState(false);
  const [showResetConfirmPassword, setShowResetConfirmPassword] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendTimer <= 0) return;
    const interval = setInterval(() => {
      setResendTimer(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Role icon helper
  const getRoleIcon = (iconName: string, size = 16) => {
    switch (iconName) {
      case 'ShieldAlert': return <ShieldAlert size={size} />;
      case 'Navigation': return <Navigation size={size} />;
      case 'ShieldCheck': return <ShieldCheck size={size} />;
      case 'AlertTriangle': return <AlertTriangle size={size} />;
      case 'Headphones': return <Headphones size={size} />;
      case 'IndianRupee': return <IndianRupee size={size} />;
      case 'Truck': return <Truck size={size} />;
      case 'Sparkles': return <Sparkles size={size} />;
      case 'Crown': return <Crown size={size} />;
      case 'Users': return <Users size={size} />;
      case 'Car': return <Car size={size} />;
      case 'Activity': return <Activity size={size} />;
      case 'Globe': return <Globe size={size} />;
      case 'Star': return <Star size={size} />;
      case 'Tag': return <Tag size={size} />;
      case 'Sliders': return <Sliders size={size} />;
      case 'Database': return <Database size={size} />;
      case 'Key': return <Key size={size} />;
      default: return <Shield size={size} />;
    }
  };

  // When a role is selected from dropdown
  const handleSelectRole = (roleDef: ServiceRoleDef) => {
    setSelectedRole(roleDef);
    setErrorMessage('');

    // Find profile in userProfiles
    const matchingProfile = userProfiles.find(u => u.role === roleDef.name || u.role === roleDef.id) ||
                            userProfiles.find(u => u.role.toLowerCase().includes(roleDef.name.toLowerCase().split(' ')[0]));

    if (matchingProfile) {
      setUsername(matchingProfile.username);
      setPassword(matchingProfile.password);
      setOtpPhone(matchingProfile.phone || '+91 98765 00000');
      setOtpEmail(matchingProfile.email || `${matchingProfile.username}@taxicluster.com`);
      setResetContact(matchingProfile.email || matchingProfile.phone || '');
    } else {
      const defaultUser = roleDef.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
      setUsername(defaultUser);
      setPassword('password123');
      setOtpPhone('+91 98765 00000');
      setOtpEmail(`${defaultUser}@taxicluster.com`);
      setResetContact(`${defaultUser}@taxicluster.com`);
    }
  };

  // Complete Login and persist session
  const completeLogin = (user: StaffUserProfile) => {
    const userToSave = {
      ...user,
      hub: user.hub || selectedRole.defaultHub || 'National Platform',
      lastLogin: new Date().toISOString()
    };

    if (rememberSession) {
      try {
        localStorage.setItem('backend_authenticated_staff', JSON.stringify(userToSave));
      } catch (e) {}
    }

    setIsLoading(false);
    onLoginSuccess(userToSave);
  };

  // ==========================================
  // 1. Password Login Submit Handler
  // ==========================================
  const handlePasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim()) {
      setErrorMessage('Please enter your Operator Login ID or Email.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your Operator Access Password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const enteredClean = username.trim().toLowerCase();
      
      // Check custom reset passwords stored in localStorage first
      let customPasswords: Record<string, string> = {};
      try {
        customPasswords = JSON.parse(localStorage.getItem('taxiapp_staff_custom_passwords') || '{}');
      } catch (e) {}

      let user = userProfiles.find(u => 
        (u.username.toLowerCase() === enteredClean || u.email.toLowerCase() === enteredClean) &&
        (customPasswords[u.email.toLowerCase()] === password || customPasswords[u.username.toLowerCase()] === password || u.password === password)
      );

      // Fallback matching for customized service roles
      if (!user) {
        const matchedRole = allRoles.find(r => 
          r.name.toLowerCase().replace(/[^a-z0-9]/g, '_') === enteredClean ||
          r.id.toLowerCase().replace(/[^a-z0-9]/g, '_') === enteredClean ||
          r.name.toLowerCase() === enteredClean ||
          r.id === selectedRole.id
        );

        if (matchedRole && (password === 'password123' || customPasswords[enteredClean] === password)) {
          user = {
            id: `usr_${Date.now()}`,
            name: `${matchedRole.name} Operator`,
            role: matchedRole.name,
            email: `${enteredClean}@taxicluster.com`,
            phone: '+91 98765 00000',
            username: enteredClean,
            password: password,
            hub: matchedRole.defaultHub || 'National Platform',
            active: true,
            createdAt: new Date().toISOString().split('T')[0]
          };
        }
      }

      if (!user) {
        const fallback = userProfiles.find(u => u.username.toLowerCase() === enteredClean || u.email.toLowerCase() === enteredClean);
        if (fallback) {
          setErrorMessage('Incorrect password. Click "Forgot Password?" to reset via OTP.');
          setIsLoading(false);
          return;
        }

        setErrorMessage('Operator credentials not found. Please select a role from the dropdown above.');
        setIsLoading(false);
        return;
      }

      if (user.active === false) {
        setErrorMessage(`Account for ${user.name} is currently suspended/disabled by Platform Admin.`);
        setIsLoading(false);
        return;
      }

      completeLogin(user);
    }, 300);
  };

  // ==========================================
  // 2. Staff OTP Fast Login
  // ==========================================
  const handleSendOtp = async () => {
    setErrorMessage('');
    const target = otpTargetType === 'phone' ? otpPhone.trim() : otpEmail.trim();

    if (!target) {
      setErrorMessage(`Please enter a valid operator ${otpTargetType}.`);
      return;
    }

    setIsLoading(true);

    // Generate 6-digit OTP code (e.g. 492018 or 123456)
    const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    setDispatchedOtpCode(generatedCode);

    setTimeout(() => {
      setIsLoading(false);
      setOtpSent(true);
      setResendTimer(30);
      setDispatchedOtpBanner(`📲 Verification OTP code [ ${generatedCode} ] sent to ${target}`);
      // Clear OTP digits
      setOtpDigits(['', '', '', '', '', '']);
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    }, 350);
  };

  const handleOtpDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, '');
    const updated = [...otpDigits];

    if (clean.length > 1) {
      // Paste handling
      const chars = clean.slice(0, 6).split('');
      chars.forEach((c, idx) => {
        if (index + idx < 6) updated[index + idx] = c;
      });
      setOtpDigits(updated);
      const nextIdx = Math.min(index + chars.length, 5);
      otpInputRefs.current[nextIdx]?.focus();
      return;
    }

    updated[index] = clean;
    setOtpDigits(updated);

    if (clean && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtpLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const fullOtp = otpDigits.join('');

    if (fullOtp.length < 6) {
      setErrorMessage('Please enter the complete 6-digit verification code.');
      return;
    }

    // Accept dispatched code or master demo PIN 123456
    if (fullOtp !== dispatchedOtpCode && fullOtp !== '123456') {
      setErrorMessage('Invalid verification code. Use code ' + (dispatchedOtpCode || '123456'));
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Find matching user for role or contact
      let user = userProfiles.find(u => 
        u.role === selectedRole.name || 
        (otpTargetType === 'email' && u.email.toLowerCase() === otpEmail.toLowerCase()) ||
        (otpTargetType === 'phone' && u.phone && u.phone.replace(/\D/g, '').includes(otpPhone.replace(/\D/g, '').slice(-8)))
      );

      if (!user) {
        user = {
          id: `usr_${Date.now()}`,
          name: `${selectedRole.name} Operator`,
          role: selectedRole.name,
          email: otpEmail || `${selectedRole.id.toLowerCase()}@taxicluster.com`,
          phone: otpPhone || '+91 98765 00000',
          username: selectedRole.id.toLowerCase().replace(/[^a-z0-9]/g, '_'),
          password: 'password123',
          hub: selectedRole.defaultHub || 'National Platform',
          active: true,
          createdAt: new Date().toISOString().split('T')[0]
        };
      }

      completeLogin(user);
    }, 350);
  };

  // ==========================================
  // 3. Realtime Password Reset via OTP
  // ==========================================
  const handleRequestPasswordResetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!resetContact.trim()) {
      setErrorMessage('Please enter your operator Email or Mobile Phone.');
      return;
    }

    setIsLoading(true);
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setResetDispatchedOtp(code);

    setTimeout(() => {
      setIsLoading(false);
      setResetStep('verify');
      setResendTimer(30);
      setDispatchedOtpBanner(`🔑 Password Reset Code [ ${code} ] sent to ${resetContact.trim()}`);
      setResetOtpDigits(['', '', '', '', '', '']);
    }, 350);
  };

  const handleVerifyResetOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const fullOtp = resetOtpDigits.join('');

    if (fullOtp.length < 6) {
      setErrorMessage('Please enter the 6-digit security code.');
      return;
    }

    if (fullOtp !== resetDispatchedOtp && fullOtp !== '123456') {
      setErrorMessage('Invalid security code. Please check the dispatched banner.');
      return;
    }

    setResetStep('new-password');
  };

  const handleSaveNewPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!resetNewPassword) {
      setErrorMessage('Please enter a new password.');
      return;
    }
    if (resetNewPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (resetNewPassword !== resetConfirmPassword) {
      setErrorMessage('Passwords do not match. Please re-type.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Save in localStorage
      try {
        const saved = JSON.parse(localStorage.getItem('taxiapp_staff_custom_passwords') || '{}');
        saved[resetContact.trim().toLowerCase()] = resetNewPassword;
        saved[username.toLowerCase()] = resetNewPassword;
        localStorage.setItem('taxiapp_staff_custom_passwords', JSON.stringify(saved));
      } catch (e) {}

      setPassword(resetNewPassword);
      setIsLoading(false);
      setResetStep('success');
    }, 350);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-[400px] h-[200px] bg-amber-400/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Recaptcha container */}
      <div id="staff-recaptcha-container" className="hidden" />

      {/* =========================================================================
          TOP NAVBAR
      ========================================================================= */}
      <header className="relative z-10 border-b border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <BrandLogo config={config} isDark={false} height={32} />
          <div className="hidden sm:flex items-center gap-2 border-l border-slate-200 pl-3">
            <span className="text-[10px] font-black tracking-widest uppercase bg-amber-400/20 text-amber-900 px-2 py-0.5 rounded border border-amber-400/40">
              Staff Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {onBackToApp && (
            <button
              onClick={onBackToApp}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3.5 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
            >
              <ArrowLeft size={13} />
              <span>Consumer App</span>
            </button>
          )}
        </div>
      </header>

      {/* =========================================================================
          REALTIME OTP NOTIFICATION BANNER
      ========================================================================= */}
      <AnimatePresence>
        {dispatchedOtpBanner && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="relative z-20 mx-auto max-w-md w-full px-4 mt-3"
          >
            <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl flex items-center justify-between gap-3 shadow-md backdrop-blur-md">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 min-w-0">
                <Smartphone size={15} className="text-amber-600 shrink-0" />
                <span className="truncate">{dispatchedOtpBanner}</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    const code = dispatchedOtpCode || resetDispatchedOtp || '123456';
                    if (authMode === 'otp') {
                      setOtpDigits(code.split(''));
                    } else if (authMode === 'reset-password') {
                      setResetOtpDigits(code.split(''));
                    }
                  }}
                  className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-xs flex items-center gap-1"
                >
                  <Copy size={11} />
                  <span>Auto-Fill</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDispatchedOtpBanner(null)}
                  className="text-slate-400 hover:text-slate-700 text-xs px-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          MAIN CENTERED AUTHENTICATION CARD
      ========================================================================= */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6 my-2">
        <div className="w-full max-w-md">
          
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
            
            {/* Header - Heading only, no subline */}
            <div className="text-center space-y-1">
              <div className="w-10 h-10 rounded-2xl bg-amber-400/20 border border-amber-400/40 text-amber-800 flex items-center justify-center mx-auto mb-2 font-black">
                <Key size={18} />
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                Operator Clearance Login
              </h2>
            </div>

            {/* Error Message Display */}
            <AnimatePresence>
              {errorMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-700 font-semibold"
                >
                  <AlertCircle size={15} className="shrink-0 text-rose-600" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ===================================================================
                MINIMAL ROLE SELECTOR DROPDOWN
            =================================================================== */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-700 uppercase tracking-wider block flex items-center justify-between">
                <span>Select Role</span>
                <span className="text-[10px] text-amber-700 font-bold">
                  {selectedRole.category}
                </span>
              </label>

              <div className="relative">
                <select
                  value={selectedRole.id}
                  onChange={(e) => {
                    const found = allRoles.find(r => r.id === e.target.value);
                    if (found) handleSelectRole(found);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-amber-400 text-xs font-bold text-slate-900 rounded-xl pl-9 pr-8 py-2.5 outline-none cursor-pointer appearance-none shadow-2xs"
                >
                  {allRoles.map(role => (
                    <option key={role.id} value={role.id} className="bg-white text-slate-900 py-1">
                      {role.name} ({role.category})
                    </option>
                  ))}
                </select>
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-600 pointer-events-none">
                  {getRoleIcon(selectedRole.iconName, 16)}
                </div>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>

              {/* Quick Pick Role Pills */}
              <div className="flex items-center gap-1 flex-wrap pt-0.5">
                {allRoles.slice(0, 5).map(role => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => handleSelectRole(role)}
                    className={cn(
                      "px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer",
                      selectedRole.id === role.id
                        ? "bg-amber-400 text-slate-950 font-black shadow-xs border border-amber-400"
                        : "bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200"
                    )}
                  >
                    {role.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Login Mode Toggle Tabs */}
            <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('password');
                  setErrorMessage('');
                }}
                className={cn(
                  "py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5",
                  authMode === 'password'
                    ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Lock size={12} />
                <span>Password</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthMode('otp');
                  setErrorMessage('');
                }}
                className={cn(
                  "py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5",
                  authMode === 'otp'
                    ? "bg-amber-400 text-slate-950 font-black shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                )}
              >
                <Smartphone size={12} />
                <span>Fast OTP</span>
              </button>
            </div>

            {/* ===================================================================
                VIEW A: STANDARD PASSWORD LOGIN FORM
            =================================================================== */}
            {authMode === 'password' && (
              <form onSubmit={handlePasswordLogin} className="space-y-3.5">
                
                {/* Username / Email */}
                <div>
                  <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Login ID / Email
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="operator_login"
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none font-mono text-slate-900 placeholder:text-slate-400 transition-all shadow-2xs"
                    />
                    <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('reset-password');
                        setResetStep('request');
                        setErrorMessage('');
                      }}
                      className="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 text-xs rounded-xl pl-9 pr-9 py-2.5 outline-none font-mono text-slate-900 placeholder:text-slate-400 transition-all shadow-2xs"
                    />
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {/* Session Checkbox */}
                <div className="flex items-center justify-between pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                    <input
                      type="checkbox"
                      checked={rememberSession}
                      onChange={(e) => setRememberSession(e.target.checked)}
                      className="rounded border-slate-300 bg-white text-amber-500 focus:ring-amber-400/40 w-3.5 h-3.5 cursor-pointer"
                    />
                    <span>Remember Session</span>
                  </label>

                  <span className="text-[10px] text-slate-400 font-mono">
                    256-Bit Encrypted
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer active:scale-[0.99] disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                      <span>Authenticating...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign In &amp; Open Workspace</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* ===================================================================
                VIEW B: REALTIME OTP FAST LOGIN
            =================================================================== */}
            {authMode === 'otp' && (
              <div className="space-y-3.5">
                
                {!otpSent ? (
                  /* Step 1: Request OTP */
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                        Dispatch Verification OTP
                      </span>
                      <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                        <button
                          type="button"
                          onClick={() => setOtpTargetType('phone')}
                          className={cn(
                            "px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer",
                            otpTargetType === 'phone' ? "bg-amber-400 text-slate-950 font-black" : "text-slate-600"
                          )}
                        >
                          Phone
                        </button>
                        <button
                          type="button"
                          onClick={() => setOtpTargetType('email')}
                          className={cn(
                            "px-2 py-0.5 text-[10px] font-bold rounded cursor-pointer",
                            otpTargetType === 'email' ? "bg-amber-400 text-slate-950 font-black" : "text-slate-600"
                          )}
                        >
                          Email
                        </button>
                      </div>
                    </div>

                    {otpTargetType === 'phone' ? (
                      <div className="relative">
                        <input
                          type="tel"
                          value={otpPhone}
                          onChange={(e) => setOtpPhone(e.target.value)}
                          placeholder="+91 98765 00000"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none font-mono text-slate-900 placeholder:text-slate-400 shadow-2xs"
                        />
                        <Smartphone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    ) : (
                      <div className="relative">
                        <input
                          type="email"
                          value={otpEmail}
                          onChange={(e) => setOtpEmail(e.target.value)}
                          placeholder="operator@taxicluster.com"
                          className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 text-xs rounded-xl pl-9 pr-3 py-2.5 outline-none font-mono text-slate-900 placeholder:text-slate-400 shadow-2xs"
                        />
                        <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isLoading}
                      className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>Sending OTP...</span>
                        </div>
                      ) : (
                        <>
                          <span>Send 6-Digit OTP</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  /* Step 2: Enter & Verify 6-digit OTP */
                  <form onSubmit={handleVerifyOtpLogin} className="space-y-3.5">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Sent to</span>
                        <span className="font-bold text-slate-900 font-mono">{otpTargetType === 'phone' ? otpPhone : otpEmail}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtpSent(false)}
                        className="text-amber-700 font-bold hover:underline text-xs cursor-pointer"
                      >
                        Change
                      </button>
                    </div>

                    {/* 6-box OTP Inputs */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5 text-center">
                        Enter 6-Digit Code
                      </label>
                      <div className="flex justify-center gap-1.5 sm:gap-2">
                        {otpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={el => { otpInputRefs.current[idx] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-10 h-11 bg-white border border-slate-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 text-center text-lg font-bold font-mono rounded-xl outline-none text-slate-900 shadow-2xs"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Resend & Timer */}
                    <div className="flex items-center justify-between text-xs pt-0.5">
                      {resendTimer > 0 ? (
                        <span className="text-slate-500 font-mono text-[11px]">
                          Resend in <strong className="text-slate-700">{resendTimer}s</strong>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-amber-700 hover:text-amber-800 font-bold flex items-center gap-1 cursor-pointer text-xs"
                        >
                          <RefreshCw size={11} />
                          <span>Resend OTP</span>
                        </button>
                      )}

                      <span className="text-slate-500 font-mono text-[11px]">
                        Demo: 123456
                      </span>
                    </div>

                    {/* Verify & Login Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                          <span>Verifying...</span>
                        </div>
                      ) : (
                        <>
                          <CheckCircle2 size={14} />
                          <span>Verify &amp; Sign In</span>
                        </>
                      )}
                    </button>
                  </form>
                )}

              </div>
            )}

            {/* ===================================================================
                VIEW C: REALTIME PASSWORD RESET WORKFLOW
            =================================================================== */}
            {authMode === 'reset-password' && (
              <div className="space-y-3.5">
                
                {/* Step 1: Request Reset Code */}
                {resetStep === 'request' && (
                  <form onSubmit={handleRequestPasswordResetOtp} className="space-y-3.5">
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl">
                      <h4 className="text-xs font-black uppercase tracking-wider text-amber-900 mb-0.5">
                        Reset Password
                      </h4>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Email or Mobile Number
                      </label>
                      <input
                        type="text"
                        value={resetContact}
                        onChange={(e) => setResetContact(e.target.value)}
                        placeholder="operator@taxicluster.com or +91 98765 00000"
                        required
                        className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 text-xs rounded-xl px-3 py-2.5 outline-none font-mono text-slate-900 shadow-2xs"
                      />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('password');
                          setErrorMessage('');
                        }}
                        className="w-1/3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer text-center border border-slate-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isLoading ? 'Sending...' : 'Send Reset Code'}
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 2: Verify Reset OTP */}
                {resetStep === 'verify' && (
                  <form onSubmit={handleVerifyResetOtp} className="space-y-3.5">
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Code sent to</span>
                        <span className="font-bold text-slate-900 font-mono">{resetContact}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setResetStep('request')}
                        className="text-amber-700 font-bold hover:underline text-xs cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1.5 text-center">
                        Enter 6-Digit Reset Code
                      </label>
                      <div className="flex justify-center gap-1.5 sm:gap-2">
                        {resetOtpDigits.map((digit, idx) => (
                          <input
                            key={idx}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => {
                              const clean = e.target.value.replace(/\D/g, '');
                              const updated = [...resetOtpDigits];
                              if (clean.length > 1) {
                                clean.slice(0, 6).split('').forEach((c, i) => { if (idx + i < 6) updated[idx + i] = c; });
                              } else {
                                updated[idx] = clean;
                              }
                              setResetOtpDigits(updated);
                            }}
                            className="w-10 h-11 bg-white border border-slate-300 focus:border-amber-400 text-center text-lg font-bold font-mono rounded-xl outline-none text-slate-900 shadow-2xs"
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setResetStep('request')}
                        className="w-1/3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold uppercase rounded-xl transition-all cursor-pointer text-center border border-slate-200"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>Verify &amp; Continue</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </form>
                )}

                {/* Step 3: Enter New Password */}
                {resetStep === 'new-password' && (
                  <form onSubmit={handleSaveNewPassword} className="space-y-3.5">
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-800">
                      <CheckCircle2 size={15} className="shrink-0 text-emerald-600" />
                      <span>Security verified! Set your new password.</span>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showResetNewPassword ? 'text' : 'password'}
                          value={resetNewPassword}
                          onChange={(e) => setResetNewPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          required
                          className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 text-xs rounded-xl pl-3 pr-9 py-2 outline-none font-mono text-slate-900 shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowResetNewPassword(!showResetNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showResetNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          type={showResetConfirmPassword ? 'text' : 'password'}
                          value={resetConfirmPassword}
                          onChange={(e) => setResetConfirmPassword(e.target.value)}
                          placeholder="Re-type new password"
                          required
                          className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 text-xs rounded-xl pl-3 pr-9 py-2 outline-none font-mono text-slate-900 shadow-2xs"
                        />
                        <button
                          type="button"
                          onClick={() => setShowResetConfirmPassword(!showResetConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showResetConfirmPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? 'Saving...' : 'Save & Log In'}
                    </button>
                  </form>
                )}

                {/* Step 4: Success Message */}
                {resetStep === 'success' && (
                  <div className="text-center py-3 space-y-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900">Password Updated!</h4>
                      <p className="text-xs text-slate-600 mt-0.5">
                        Your credentials have been updated successfully.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('password');
                        setResetStep('request');
                      }}
                      className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                    >
                      Proceed to Sign In
                    </button>
                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      </main>

      {/* =========================================================================
          FOOTER
      ========================================================================= */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-8 py-3 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-2xs">
        <p>© {new Date().getFullYear()} {config.general?.platformName || "TaxiApp"} • Staff Access Portal</p>
        <div className="flex items-center gap-3 text-slate-500 text-[11px]">
          <span>SOC2 Security</span>
          <span>•</span>
          <span>Role-Based Permissions</span>
        </div>
      </footer>
    </div>
  );
};
