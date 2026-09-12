import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Check, 
  Wallet, 
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Zap,
  Sparkles,
  X,
  AlertCircle
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useConfig } from '../lib/ConfigContext';

interface SubscriptionPageProps {
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  setWalletTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  userProfile: any;
  setUserProfile: (profile: any) => void;
  appMode: 'rider' | 'driver';
  onClose: () => void;
  addNotification: (msg: string, type: 'success' | 'info') => void;
  subscriptionPlans?: any[];
  handlePayViaRazorpay: (params: {
    amount: number;
    isWalletAdd?: boolean;
    description?: string;
    onSuccess?: (verifyData?: any) => void;
    onCancel?: (errorDetails?: any) => void;
  }) => void;
  isDarkTheme?: boolean;
}

export default function SubscriptionPage({
  walletBalance,
  setWalletBalance,
  setWalletTransactions,
  userProfile,
  setUserProfile,
  appMode,
  onClose,
  addNotification,
  subscriptionPlans = [],
  handlePayViaRazorpay,
  isDarkTheme = false
}: SubscriptionPageProps) {
  const activeTab = appMode;
  const { config } = useConfig();
  const [checkoutStep, setCheckoutStep] = useState<'plan_select' | 'checkout_success' | 'checkout_failed'>('plan_select');
  const [isProcessingLocal, setIsProcessingLocal] = useState(false);
  const [currentTxnId, setCurrentTxnId] = useState<string>('');
  const [currentRazorpayId, setCurrentRazorpayId] = useState<string>('');

  // Define premium plans following the image flow layout perfectly as fallback USD plans
  const localFallbackPlans = [
    {
      id: activeTab === 'rider' ? 'sub_yearly_rider' : 'sub_yearly_driver',
      name: 'Yearly Pass',
      badge: 'BEST VALUE',
      save: 'Save 50%',
      trial: 'Get 7 Days free',
      price: 120,
      discountPrice: 60,
      cycle: 'Yearly',
      validity: '365 Days',
      benefit: 'Premium Yearly Saver membership with zero matching commission and peak surge protection.',
      features: activeTab === 'rider' ? [
        { name: 'Access entire ride booking system', enabled: true },
        { name: 'Raise custom ride requests', enabled: true },
        { name: 'Direct Rider-to-Driver Payments (Self-Managed)', enabled: true },
        { name: 'Zero Surge Pricing (No Surge Fees)', enabled: true }
      ] : [
        { name: 'Unlimited ride acceptances', enabled: true },
        { name: '0% Platform Commission Fee (Keep 100%)', enabled: true },
        { name: 'Direct Driver-Rider Self-Managed Payments', enabled: true },
        { name: 'Create & offer custom rides', enabled: true }
      ]
    },
    {
      id: activeTab === 'rider' ? 'sub_3months_rider' : 'sub_3months_driver',
      name: '3 Months Pass',
      badge: 'MOST POPULAR',
      save: 'Save 20%',
      trial: 'Get 3 Days free',
      price: 30,
      discountPrice: 24,
      cycle: 'Quarter',
      validity: '90 Days',
      benefit: 'Premium Quarterly Saver membership with zero matching commission and peak surge protection.',
      features: activeTab === 'rider' ? [
        { name: 'Access entire ride booking system', enabled: true },
        { name: 'Raise custom ride requests', enabled: true },
        { name: 'Direct Rider-to-Driver Payments (Self-Managed)', enabled: true },
        { name: 'Zero Surge Pricing (No Surge Fees)', enabled: true }
      ] : [
        { name: 'Unlimited ride acceptances', enabled: true },
        { name: '0% Platform Commission Fee (Keep 100%)', enabled: true },
        { name: 'Direct Driver-Rider Self-Managed Payments', enabled: true },
        { name: 'Create & offer custom rides', enabled: true }
      ]
    },
    {
      id: activeTab === 'rider' ? 'sub_1month_rider' : 'sub_1month_driver',
      name: '1 Month Pass',
      badge: null,
      save: 'Save 16%',
      trial: null,
      price: 10,
      discountPrice: 8.4,
      cycle: 'Monthly',
      validity: '30 Days',
      benefit: 'Premium Monthly Saver membership with zero matching commission and peak surge protection.',
      features: activeTab === 'rider' ? [
        { name: 'Access entire ride booking system', enabled: true },
        { name: 'Raise custom ride requests', enabled: true },
        { name: 'Direct Rider-to-Driver Payments (Self-Managed)', enabled: true },
        { name: 'Zero Surge Pricing (No Surge Fees)', enabled: true }
      ] : [
        { name: 'Unlimited ride acceptances', enabled: true },
        { name: '0% Platform Commission Fee (Keep 100%)', enabled: true },
        { name: 'Direct Driver-Rider Self-Managed Payments', enabled: true },
        { name: 'Create & offer custom rides', enabled: true }
      ]
    }
  ];

  // Process and adapt plans passed from backend/App
  const displayedPlans = React.useMemo(() => {
    // If no custom plans from backend are provided, use local fallback USD plans
    if (!subscriptionPlans || subscriptionPlans.length === 0) {
      return localFallbackPlans;
    }

    // Filter to active plans for the current user role (including free ones)
    const filtered = subscriptionPlans.filter(p => {
      return p.active && (p.userType === activeTab || p.userType === 'both');
    });

    if (filtered.length === 0) {
      return localFallbackPlans;
    }

    // Sort so that free plans are at the top, and other plans are sorted by price ascending
    const sorted = [...filtered].sort((a, b) => {
      const isFreeA = a.id === 'sub_free_rider' || a.id === 'sub_free_driver' || (a.price === 0 && (a.discountPrice === 0 || a.discountPrice === undefined));
      const isFreeB = b.id === 'sub_free_rider' || b.id === 'sub_free_driver' || (b.price === 0 && (b.discountPrice === 0 || b.discountPrice === undefined));
      if (isFreeA && !isFreeB) return -1;
      if (!isFreeA && isFreeB) return 1;
      return (a.price || 0) - (b.price || 0);
    });

    // Map each plan to attach UI metadata (badges, discount info, and trial periods)
    return sorted.map((p, idx) => {
      let badge: string | null = null;
      let save = "";
      let trial: string | null = null;
      let cycle = "Period";

      const valLower = (p.validity || "").toLowerCase();
      const nameLower = (p.name || "").toLowerCase();
      const isFreePlan = p.id === 'sub_free_rider' || p.id === 'sub_free_driver' || p.price === 0;

      // Auto deduce styling matching the design
      if (isFreePlan) {
        badge = "FREE UNLIMITED";
        save = "100% Free Plan";
        trial = "Free Unlimited Access";
        cycle = "Unlimited";
      } else if (valLower.includes("30") || nameLower.includes("monthly") || nameLower.includes("month")) {
        badge = "BEST VALUE";
        save = "Save up to 25%";
        trial = "Get 7 Days free";
        cycle = "Monthly";
      } else if (valLower.includes("7") || valLower.includes("weekly") || nameLower.includes("weekly") || nameLower.includes("week")) {
        badge = "MOST POPULAR";
        save = "Save up to 15%";
        trial = "Get 3 Days free";
        cycle = "Weekly";
      } else if (valLower.includes("365") || nameLower.includes("yearly") || nameLower.includes("year")) {
        badge = "BEST VALUE";
        save = "Save up to 50%";
        trial = "Get 14 Days free";
        cycle = "Yearly";
      } else {
        save = "Instant Activator";
        cycle = "Daily";
      }

      // Fill missing badges by index to keep 100% beautiful visuals
      if (!badge && idx === 0) {
        badge = "BEST VALUE";
      } else if (!badge && idx === 1) {
        badge = "MOST POPULAR";
      }

      return {
        ...p,
        badge,
        save,
        trial,
        cycle,
        features: p.features && p.features.length > 0 ? p.features : (
          activeTab === 'rider' ? [
            { name: 'Access entire ride booking system', enabled: true },
            { name: 'Raise custom ride requests', enabled: true },
            { name: 'Direct Rider-to-Driver Payments (Self-Managed)', enabled: true },
            { name: 'Zero Surge Pricing (No Surge Fees)', enabled: true }
          ] : [
            { name: 'Unlimited ride acceptances', enabled: true },
            { name: '0% Platform Commission Fee (Keep 100%)', enabled: true },
            { name: 'Direct Driver-Rider Self-Managed Payments', enabled: true },
            { name: 'Create & offer custom rides', enabled: true }
          ]
        )
      };
    });
  }, [subscriptionPlans, activeTab]);

  const [selectedPlanId, setSelectedPlanId] = useState<string>(() => {
    return displayedPlans[0]?.id || '';
  });

  // Keep selection synchronized if plans change
  React.useEffect(() => {
    if (displayedPlans.length > 0) {
      const exists = displayedPlans.some(p => p.id === selectedPlanId);
      if (!exists) {
        setSelectedPlanId(displayedPlans[0].id);
      }
    }
  }, [displayedPlans]);

  const selectedPlan = displayedPlans.find(p => p.id === selectedPlanId) || displayedPlans[0] || localFallbackPlans[0];

  // Handle plan failure syncing and UI
  const handlePaymentFailure = (plan: any, razorpayOrderId?: string) => {
    const price = plan.discountPrice !== undefined ? plan.discountPrice : plan.price;
    const txnId = 'TXN-FAIL-' + Math.floor(10000000 + Math.random() * 90000000).toString() + '-WEB';
    
    setCurrentTxnId(txnId);
    setCurrentRazorpayId(razorpayOrderId || 'N/A');
    setCheckoutStep('checkout_failed');

    // Sync transaction to Backend database (Failed)
    fetch("/api/subscription/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: txnId,
        razorpayPaymentId: null,
        razorpayOrderId: razorpayOrderId || null,
        userId: userProfile.id || 'usr_unknown',
        userName: userProfile.name?.replace(/\s*\((driver|rider)\)/i, '') || "Rider",
        userEmail: userProfile.email || "rider@test.com",
        userType: activeTab,
        planId: plan.id,
        planName: plan.name,
        amount: price,
        currency: "INR",
        status: "Failed",
        paymentMethod: "Razorpay Gateway"
      })
    }).catch(err => console.error("Error logging failed subscription transaction on backend:", err));
  };

  // Handle plan purchase activation
  const processPlanActivation = (plan: any, isPaidViaGateway: boolean, razorpayPaymentId?: string, razorpayOrderId?: string) => {
    const price = plan.discountPrice !== undefined ? plan.discountPrice : plan.price;
    const valStr = (plan.validity || '').toLowerCase();
    const days = valStr.includes('365') ? 365 : valStr.includes('90') ? 90 : valStr.includes('30') ? 30 : valStr.includes('7') ? 7 : 1;
    const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // 1. Deduct balance if paid via wallet
    if (!isPaidViaGateway) {
      setWalletBalance(prev => parseFloat((prev - price).toFixed(2)));
    }

    // 2. Add transaction record
    const txnId = 'TXN-' + Math.floor(10000000 + Math.random() * 90000000).toString() + '-WEB';
    setCurrentTxnId(txnId);
    if (razorpayPaymentId) {
      setCurrentRazorpayId(razorpayPaymentId);
    } else {
      setCurrentRazorpayId(isPaidViaGateway ? 'N/A' : 'Wallet Deducted');
    }

    const newTxn = {
      id: "txn_" + Date.now(),
      type: "payment",
      amount: price,
      title: `${plan.name} Membership`,
      timestamp: new Date().toISOString(),
      status: "success",
      label: isPaidViaGateway ? "Paid via Razorpay Checkout" : "Deducted from Wallet",
      date: "Just Now"
    };
    setWalletTransactions(prev => [newTxn, ...prev]);

    // 3. Update User Profile
    const isRider = activeTab === 'rider';
    const updatedProfile = {
      ...userProfile,
      activePlanId: plan.id,
      activePlanName: plan.name,
      activePlanExpiresAt: expiryDate,
      activePlanBenefit: plan.benefit,
      ...(isRider ? {
        riderPlanId: plan.id,
        riderPlanName: plan.name,
        riderPlanExpiresAt: expiryDate,
        riderPlanBenefit: plan.benefit
      } : {
        driverPlanId: plan.id,
        driverPlanName: plan.name,
        driverPlanExpiresAt: expiryDate,
        driverPlanBenefit: plan.benefit
      })
    };
    setUserProfile(updatedProfile);
    localStorage.setItem("ride-buddy-user-profile", JSON.stringify(updatedProfile));

    // 4. Save subscriber in active subscribers list
    try {
      const currentSubscribers = JSON.parse(localStorage.getItem('ride-buddy-active-subscribers') || '[]');
      const newSubscriberRecord = {
        id: 'suber_' + Date.now(),
        name: userProfile.name?.replace(/\s*\((driver|rider)\)/i, '') || "Rider",
        email: userProfile.email || "rider@test.com",
        phone: userProfile.phone || "+91 99887 76655",
        avatar: (userProfile.name || "Rider").substring(0, 2).toUpperCase(),
        userType: activeTab,
        planId: plan.id,
        planName: plan.name,
        type: 'subscription',
        amountPaid: price,
        paymentStatus: 'Paid',
        transactionId: txnId,
        razorpayPaymentId: razorpayPaymentId || null,
        paymentMethod: isPaidViaGateway ? "Razorpay Gateway" : "Wallet Balance",
        startedAt: new Date().toISOString().split('T')[0],
        expiresAt: expiryDate,
        status: 'Active'
      };
      localStorage.setItem('ride-buddy-active-subscribers', JSON.stringify([newSubscriberRecord, ...currentSubscribers]));
    } catch (e) {
      console.error("Error writing subscriber record", e);
    }

    // 5. Sync subscription transaction to Backend database (Success)
    fetch("/api/subscription/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: txnId,
        razorpayPaymentId: razorpayPaymentId || null,
        razorpayOrderId: razorpayOrderId || null,
        userId: userProfile.id || 'usr_unknown',
        userName: userProfile.name?.replace(/\s*\((driver|rider)\)/i, '') || "Rider",
        userEmail: userProfile.email || "rider@test.com",
        userType: activeTab,
        planId: plan.id,
        planName: plan.name,
        amount: price,
        currency: "INR",
        status: "Success",
        paymentMethod: isPaidViaGateway ? "Razorpay Gateway" : "Wallet Balance"
      })
    }).catch(err => console.error("Error logging subscription transaction on backend:", err));

    addNotification(`Activated ${plan.name} successfully!`, "success");
    setCheckoutStep('checkout_success');
  };

  // Handle plan deactivation
  const handleDeactivatePlan = () => {
    setIsProcessingLocal(true);
    setTimeout(() => {
      setIsProcessingLocal(false);
      const defaultFreeId = activeTab === 'rider' ? 'sub_free_rider' : 'sub_free_driver';
      const updatedProfile = {
        ...userProfile,
        activePlanId: defaultFreeId,
        activePlanName: 'Free Standard Plan',
        activePlanExpiresAt: 'N/A',
        activePlanBenefit: 'Standard Booking Access',
        ...(activeTab === 'rider' ? {
          riderPlanId: defaultFreeId,
          riderPlanName: 'Free Standard Plan',
          riderPlanExpiresAt: 'N/A',
          riderPlanBenefit: 'Standard Booking Access'
        } : {
          driverPlanId: defaultFreeId,
          driverPlanName: 'Free Standard Plan',
          driverPlanExpiresAt: 'N/A',
          driverPlanBenefit: 'Standard Booking Access'
        })
      };
      setUserProfile(updatedProfile);
      localStorage.setItem("ride-buddy-user-profile", JSON.stringify(updatedProfile));
      
      try {
        const currentSubscribers = JSON.parse(localStorage.getItem('ride-buddy-active-subscribers') || '[]');
        const updatedSubs = currentSubscribers.map((s: any) => {
          if (s.email === userProfile.email && s.userType === activeTab && s.status === 'Active') {
            return { ...s, status: 'Deactivated' };
          }
          return s;
        });
        localStorage.setItem('ride-buddy-active-subscribers', JSON.stringify(updatedSubs));
      } catch (e) {
        console.error("Error updating subscriber record status", e);
      }

      addNotification(`Your plan "${selectedPlan.name}" has been deactivated.`, "info");
    }, 600);
  };

  // Handle CTA click
  const handleSubscribe = () => {
    const plan = selectedPlan;
    if (plan.id === activePlanId) {
      handleDeactivatePlan();
      return;
    }
    const price = plan.discountPrice !== undefined ? plan.discountPrice : plan.price;
    
    if (price === 0) {
      setIsProcessingLocal(true);
      setTimeout(() => {
        setIsProcessingLocal(false);
        processPlanActivation(plan, false);
      }, 1000);
    } else {
      setIsProcessingLocal(true);
      addNotification(`Redirecting to secure Razorpay checkout for ₹${price}...`, "info");
      handlePayViaRazorpay({
        amount: price,
        isWalletAdd: false,
        description: `Upgrade to ${plan.name} Membership`,
        onSuccess: (verifyData?: any) => {
          setIsProcessingLocal(false);
          processPlanActivation(
            plan, 
            true, 
            verifyData?.razorpay_payment_id, 
            verifyData?.razorpay_order_id
          );
        },
        onCancel: (errorDetails?: any) => {
          setIsProcessingLocal(false);
          handlePaymentFailure(plan, errorDetails?.razorpay_order_id);
          addNotification("Subscription upgrade payment was canceled or failed.", "info");
        }
      });
    }
  };

  // Helper to ensure exactly 3 highlight points by default per card
  const getHighlightPoints = (plan: any) => {
    const points: string[] = [];
    
    // 1. Get enabled capabilities from backend features
    if (plan.features && plan.features.length > 0) {
      const enabledFeats = plan.features
        .filter((f: any) => f.enabled)
        .map((f: any) => f.name);
      points.push(...enabledFeats);
    }
    
    // 2. If fewer than 3, add custom save info
    if (points.length < 3 && plan.save) {
      points.push(plan.save);
    }
    
    // 3. If fewer than 3, add custom trial info
    if (points.length < 3 && plan.trial) {
      points.push(plan.trial);
    }
    
    // 4. Fill to exactly 3 if still fewer
    if (points.length < 3 && plan.benefit) {
      points.push(plan.benefit);
    }
    
    // Return exactly 3 points by default
    return points.slice(0, 3);
  };

  const activePlanId = activeTab === 'rider' ? (userProfile.riderPlanId || 'sub_free_rider') : (userProfile.driverPlanId || 'sub_free_driver');
  const hasAlreadySubscribed = activePlanId && activePlanId !== 'sub_free_rider' && activePlanId !== 'sub_free_driver';

  return (
    <div className={cn(
      "absolute inset-0 z-[9500] flex flex-col h-full overflow-hidden font-sans transition-colors duration-300",
      isDarkTheme ? "bg-[#0F1115] text-white" : "bg-[#F8FAFC] text-slate-800"
    )}>
      <AnimatePresence mode="wait">
        
        {/* STEP 1: PLAN SELECT SCREEN */}
        {checkoutStep === 'plan_select' && (
          <motion.div 
            key="plan_select"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="flex-1 flex flex-col h-full max-w-md mx-auto w-full px-5 py-4 overflow-y-auto no-scrollbar pb-28 relative text-left"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 shrink-0 pt-2 text-left">
              <div className="flex items-center gap-3">
                <button
                  id="btn_back_subscription"
                  onClick={onClose}
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center active:scale-95 transition-all cursor-pointer shrink-0 border",
                    isDarkTheme 
                      ? "bg-slate-900 border-slate-800/85 text-slate-300 hover:text-white" 
                      : "bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-2xs"
                  )}
                >
                  <ArrowLeft size={16} strokeWidth={2.5} />
                </button>
                <h3 className={cn(
                  "text-lg font-bold tracking-tight",
                  isDarkTheme ? "text-white" : "text-slate-900"
                )}>
                  Choose Plan
                </h3>
              </div>
              <span className={cn(
                "text-[9px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider border",
                isDarkTheme 
                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                  : "bg-amber-100 text-amber-700 border-amber-200"
              )}>
                {activeTab.toUpperCase()} PRO
              </span>
            </div>

            {/* Vertical Stack of Cards - Clean Minimalist UI */}
            <div className="space-y-3 shrink-0 mb-4 text-left">
              {displayedPlans.map((plan) => {
                const isSelected = plan.id === selectedPlanId;
                const isCurrentActive = activePlanId === plan.id;

                return (
                  <div
                    key={plan.id}
                    id={`plan_card_${plan.id}`}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={cn(
                      "p-3.5 rounded-xl border transition-all duration-200 relative flex flex-col justify-between cursor-pointer select-none gap-2",
                      isDarkTheme 
                        ? (isSelected 
                            ? "bg-[#181B21] border-[#F2B33D] shadow-xs" 
                            : "bg-[#14161A]/70 border-slate-800/80 hover:border-slate-750")
                        : (isSelected 
                            ? "bg-[#FFFBF2] border-[#F2B33D] shadow-2xs" 
                            : "bg-white border-slate-200 hover:border-slate-300 shadow-2xs")
                    )}
                  >
                    {/* TOP HEADER BADGES ROW */}
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={cn(
                          "text-xs font-black tracking-wide uppercase",
                          isDarkTheme ? "text-white" : "text-slate-900"
                        )}>
                          {plan.name}
                        </span>
                        {plan.badge && (
                          <span className="bg-[#E25C38] text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shrink-0">
                            {plan.badge}
                          </span>
                        )}
                        {isCurrentActive && (
                          <span className={cn(
                            "text-[8px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider shrink-0 border flex items-center gap-1",
                            isDarkTheme 
                              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" 
                              : "bg-emerald-100 text-emerald-800 border-emerald-300"
                          )}>
                            <Check size={9} strokeWidth={3} />
                            ACTIVE
                          </span>
                        )}
                      </div>

                      {/* Pricing block */}
                      <div className="flex items-baseline gap-1 text-right">
                        {plan.price > plan.discountPrice && (
                          <span className="text-[10px] text-slate-400 line-through font-mono">
                            ₹{plan.price}
                          </span>
                        )}
                        <span className={cn(
                          "text-base font-black tracking-tight leading-none font-mono",
                          isDarkTheme ? "text-white" : "text-slate-900"
                        )}>
                          ₹{plan.discountPrice}
                        </span>
                        <span className="text-[9px] text-slate-400 uppercase font-medium">
                          /{plan.cycle}
                        </span>
                      </div>
                    </div>

                    {/* Features Bullet List */}
                    <div className="space-y-1 pt-1">
                      {getHighlightPoints(plan).map((point, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-1.5">
                          <Check size={12} className="text-[#F2B33D] shrink-0 stroke-[3]" />
                          <span className={cn(
                            "text-[10.5px] font-medium leading-tight",
                            isDarkTheme ? "text-slate-300" : "text-slate-600"
                          )}>
                            {point}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Wallet Balance Bar */}
            <div className={cn(
              "border px-3.5 py-2.5 rounded-xl flex items-center justify-between mb-4 shrink-0 text-left transition-colors",
              isDarkTheme 
                ? "bg-[#13161A] border-slate-800/85" 
                : "bg-white border-slate-200 shadow-2xs"
            )}>
              <div className="flex items-center gap-2.5">
                <Wallet size={15} className="text-[#F2B33D]" />
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  isDarkTheme ? "text-slate-400" : "text-slate-500"
                )}>
                  Wallet Balance:
                </span>
                <span className={cn(
                  "text-xs font-black font-mono",
                  isDarkTheme ? "text-white" : "text-slate-900"
                )}>
                  ₹{walletBalance.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Bottom Floating CTA */}
            <div className="mt-auto pt-1 shrink-0 space-y-2">
              {/* Action Button: Deactivate or Subscribe */}
              <button
                id="btn_subscribe_now"
                onClick={handleSubscribe}
                disabled={isProcessingLocal}
                className={cn(
                  "w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 border-none outline-none select-none cursor-pointer active:scale-98",
                  selectedPlan.id === activePlanId
                    ? "bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20"
                    : "bg-[#F2B33D] hover:bg-[#E2A12D] text-black shadow-xs",
                  isProcessingLocal && "opacity-80 cursor-not-allowed"
                )}
              >
                {isProcessingLocal ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : selectedPlan.id === activePlanId ? (
                  <>
                    <span>Deactivate Plan</span>
                    <X size={15} strokeWidth={3} />
                  </>
                ) : (
                  <>
                    <span>{selectedPlan.trial ? "Start free trial" : "Subscribe Now"}</span>
                    <ChevronRight size={14} strokeWidth={3} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: CHECKOUT SUCCESS SCREEN (Image Right side flow) */}
        {checkoutStep === 'checkout_success' && (
          <motion.div 
            key="checkout_success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full px-6 py-10 h-full overflow-y-auto"
          >
            {/* Header / Brand Logo matching image right side */}
            <div className={cn(
              "absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full border",
              isDarkTheme 
                ? "bg-slate-900/40 border-slate-800/50" 
                : "bg-slate-100/80 border-slate-200 shadow-xs"
            )}>
              <div className="flex gap-0.5 items-center">
                <div className="w-1 h-3.5 bg-[#F2B33D] rounded-full animate-pulse-subtle" />
                <div className="w-1 h-5.5 bg-[#F2B33D] rounded-full animate-pulse-subtle delay-75" />
                <div className="w-1 h-6 bg-[#F2B33D] rounded-full animate-pulse-subtle delay-150" />
                <div className="w-1 h-4 bg-[#F2B33D] rounded-full animate-pulse-subtle delay-300" />
              </div>
              <span className={cn(
                "text-sm font-black tracking-widest uppercase font-mono",
                isDarkTheme ? "text-white" : "text-slate-900"
              )}>
                {(config.general?.platformName || "TaxiApp").toUpperCase()}
              </span>
            </div>

            {/* Large glowing success checkmark ring */}
            <div className="relative flex items-center justify-center my-10">
              {/* Ripple animation circles */}
              <div className="absolute w-44 h-44 rounded-full bg-emerald-500/5 animate-subtle-ping" />
              <div className="absolute w-32 h-32 rounded-full bg-emerald-500/10" />
              <div className="absolute w-24 h-24 rounded-full bg-[#3D8B6B]/25 border border-emerald-500/10" />
              
              {/* Verified check circle */}
              <div className="w-20 h-20 rounded-full bg-[#3D8B6B] border border-emerald-400/40 flex items-center justify-center text-white shadow-[0_4px_25px_rgba(61,139,107,0.3)] relative z-10 animate-in zoom-in duration-500">
                <Check size={38} strokeWidth={4} />
              </div>
            </div>

            {/* Success title & info */}
            <h3 className={cn(
              "text-3xl font-black tracking-tight mb-2 uppercase",
              isDarkTheme ? "text-white" : "text-slate-900"
            )}>
              Success!
            </h3>
            
            <p className={cn(
              "text-sm font-semibold text-center max-w-xs mb-8 leading-relaxed",
              isDarkTheme ? "text-slate-300" : "text-slate-600"
            )}>
              Your {selectedPlan.trial ? `${selectedPlan.trial.replace("Get ", "").toLowerCase()}` : "Premium Club"} has started!
            </p>

            {/* Bill Details Box */}
            <div className={cn(
              "w-full border p-4.5 rounded-2xl text-left space-y-3 mb-10 transition-colors",
              isDarkTheme 
                ? "bg-[#13161A] border-slate-800/80" 
                : "bg-white border-slate-200 shadow-xs"
            )}>
              <div className="flex items-center justify-between text-xs">
                <span className={cn(
                  "uppercase tracking-widest text-[9px] font-bold",
                  isDarkTheme ? "text-slate-400" : "text-slate-500"
                )}>
                  Package Name
                </span>
                <span className={cn(
                  "font-black uppercase",
                  isDarkTheme ? "text-white" : "text-slate-900"
                )}>
                  {selectedPlan.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={cn(
                  "uppercase tracking-widest text-[9px] font-bold",
                  isDarkTheme ? "text-slate-400" : "text-slate-500"
                )}>
                  Validity Period
                </span>
                <span className="font-bold text-[#F2B33D] font-mono">
                  {selectedPlan.validity}
                </span>
              </div>

              {/* Transaction & Razorpay IDs side-by-side */}
              <div className={cn(
                "grid grid-cols-2 gap-4 pt-3 border-t text-[10px]",
                isDarkTheme ? "border-slate-800/80" : "border-slate-100"
              )}>
                <div className="space-y-0.5">
                  <span className={cn(
                    "block uppercase tracking-wider text-[8px] font-bold",
                    isDarkTheme ? "text-slate-400" : "text-slate-500"
                  )}>
                    Transaction ID
                  </span>
                  <span className={cn(
                    "font-mono font-bold select-all break-all block",
                    isDarkTheme ? "text-white" : "text-slate-850"
                  )}>
                    {currentTxnId || 'N/A'}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className={cn(
                    "block uppercase tracking-wider text-[8px] font-bold",
                    isDarkTheme ? "text-slate-400" : "text-slate-500"
                  )}>
                    Razorpay ID
                  </span>
                  <span className="font-mono font-bold select-all break-all text-indigo-500 dark:text-indigo-400 block">
                    {currentRazorpayId || 'N/A'}
                  </span>
                </div>
              </div>

              <div className={cn(
                "flex items-center justify-between pt-3 border-t text-xs",
                isDarkTheme ? "border-slate-800/80" : "border-slate-100"
              )}>
                <span className={cn(
                  "font-bold uppercase tracking-wider text-[9px]",
                  isDarkTheme ? "text-slate-300" : "text-slate-500"
                )}>
                  Total Charged
                </span>
                <span className="font-black text-base text-emerald-400 font-mono">
                  ₹{(selectedPlan.discountPrice !== undefined ? selectedPlan.discountPrice : selectedPlan.price).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Security Handshake */}
            <div className={cn(
              "flex items-center gap-2.5 p-3 rounded-2xl w-full max-w-sm mb-12 border",
              isDarkTheme 
                ? "bg-emerald-500/5 border-emerald-500/10" 
                : "bg-emerald-50/50 border-emerald-100"
            )}>
              <ShieldCheck size={16} className="text-[#3D8B6B] shrink-0" />
              <span className="text-[10px] text-[#3D8B6B] font-semibold leading-relaxed text-left">
                Your subscription is synchronized under your active user profile secure directory database.
              </span>
            </div>

            {/* Solid orange rounded-full button to close the subscription flow */}
            <button
              id="btn_success_close"
              onClick={() => {
                onClose();
                setCheckoutStep('plan_select');
              }}
              className="w-full py-4 rounded-full bg-[#F2B33D] hover:bg-[#E2A12D] text-black text-xs font-black uppercase tracking-widest transition-all shadow-[0_4px_25px_rgba(242,179,97,0.15)] flex items-center justify-center gap-2 border-none outline-none select-none cursor-pointer active:scale-98"
            >
              <span>Go to main screen</span>
              <ChevronRight size={14} strokeWidth={3} />
            </button>
          </motion.div>
        )}

        {/* STEP 3: CHECKOUT FAILED SCREEN (Unsuccessful Transaction Screen) */}
        {checkoutStep === 'checkout_failed' && (
          <motion.div 
            key="checkout_failed"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full px-6 py-10 h-full overflow-y-auto"
          >
            {/* Header / Brand Logo matching theme */}
            <div className={cn(
              "absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 rounded-full border",
              isDarkTheme 
                ? "bg-slate-900/40 border-slate-800/50" 
                : "bg-slate-100/80 border-slate-200 shadow-xs"
            )}>
              <span className={cn(
                "text-sm font-black tracking-widest uppercase font-mono",
                isDarkTheme ? "text-white" : "text-slate-900"
              )}>
                {(config.general?.platformName || "TaxiApp").toUpperCase()}
              </span>
            </div>

            {/* Large glowing failure ring */}
            <div className="relative flex items-center justify-center my-10">
              {/* Ripple animation circles */}
              <div className="absolute w-44 h-44 rounded-full bg-rose-500/5 animate-subtle-ping" />
              <div className="absolute w-32 h-32 rounded-full bg-rose-500/10" />
              <div className="absolute w-24 h-24 rounded-full bg-rose-950/25 border border-rose-500/10" />
              
              {/* Error icon circle */}
              <div className="w-20 h-20 rounded-full bg-rose-600 border border-rose-450 flex items-center justify-center text-white shadow-[0_4px_25px_rgba(220,38,38,0.3)] relative z-10 animate-in zoom-in duration-500">
                <X size={38} strokeWidth={4} />
              </div>
            </div>

            {/* Title & Info */}
            <h3 className={cn(
              "text-3xl font-black tracking-tight mb-2 uppercase text-rose-500",
              isDarkTheme ? "text-rose-400" : "text-rose-600"
            )}>
              Failed!
            </h3>
            
            <p className={cn(
              "text-sm font-semibold text-center max-w-xs mb-8 leading-relaxed",
              isDarkTheme ? "text-slate-300" : "text-slate-600"
            )}>
              Your subscription upgrade payment was canceled or unsuccessful.
            </p>

            {/* Bill Details Box */}
            <div className={cn(
              "w-full border p-4.5 rounded-2xl text-left space-y-3 mb-10 transition-colors",
              isDarkTheme 
                ? "bg-[#13161A] border-slate-800/80" 
                : "bg-white border-slate-200 shadow-xs"
            )}>
              <div className="flex items-center justify-between text-xs">
                <span className={cn(
                  "uppercase tracking-widest text-[9px] font-bold",
                  isDarkTheme ? "text-slate-400" : "text-slate-500"
                )}>
                  Package Name
                </span>
                <span className={cn(
                  "font-black uppercase",
                  isDarkTheme ? "text-white" : "text-slate-900"
                )}>
                  {selectedPlan.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={cn(
                  "uppercase tracking-widest text-[9px] font-bold",
                  isDarkTheme ? "text-slate-400" : "text-slate-500"
                )}>
                  Payment Status
                </span>
                <span className="font-black text-rose-500 uppercase tracking-wider text-[10px] font-mono">
                  UNSUCCESSFUL
                </span>
              </div>

              {/* Transaction & Razorpay IDs side-by-side */}
              <div className={cn(
                "grid grid-cols-2 gap-4 pt-3 border-t text-[10px]",
                isDarkTheme ? "border-slate-800/80" : "border-slate-100"
              )}>
                <div className="space-y-0.5">
                  <span className={cn(
                    "block uppercase tracking-wider text-[8px] font-bold",
                    isDarkTheme ? "text-slate-400" : "text-slate-500"
                  )}>
                    Transaction ID
                  </span>
                  <span className={cn(
                    "font-mono font-bold select-all break-all block",
                    isDarkTheme ? "text-white" : "text-slate-850"
                  )}>
                    {currentTxnId || 'N/A'}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className={cn(
                    "block uppercase tracking-wider text-[8px] font-bold",
                    isDarkTheme ? "text-slate-400" : "text-slate-500"
                  )}>
                    Razorpay ID
                  </span>
                  <span className="font-mono font-bold select-all break-all text-rose-500 dark:text-rose-400 block">
                    {currentRazorpayId || 'N/A'}
                  </span>
                </div>
              </div>

              <div className={cn(
                "flex items-center justify-between pt-3 border-t text-xs",
                isDarkTheme ? "border-slate-800/80" : "border-slate-100"
              )}>
                <span className={cn(
                  "font-bold uppercase tracking-wider text-[9px]",
                  isDarkTheme ? "text-slate-300" : "text-slate-500"
                )}>
                  Total Attempted
                </span>
                <span className="font-black text-base text-rose-500 font-mono">
                  ₹{(selectedPlan.discountPrice !== undefined ? selectedPlan.discountPrice : selectedPlan.price).toFixed(2)}
                </span>
              </div>
            </div>

            {/* Error Handshake */}
            <div className={cn(
              "flex items-center gap-2.5 p-3 rounded-2xl w-full max-w-sm mb-12 border",
              isDarkTheme 
                ? "bg-rose-500/5 border-rose-500/10" 
                : "bg-rose-50/50 border-rose-100"
            )}>
              <AlertCircle size={16} className="text-rose-500 shrink-0" />
              <span className="text-[10px] text-rose-600 dark:text-rose-450 font-semibold leading-relaxed text-left">
                If money was deducted, it will be refunded back to your payment account automatically in 3-5 working days.
              </span>
            </div>

            {/* Retry Button */}
            <button
              id="btn_failed_retry"
              onClick={() => {
                setCheckoutStep('plan_select');
              }}
              className="w-full py-4 rounded-full bg-rose-500 hover:bg-rose-600 text-white text-xs font-black uppercase tracking-widest transition-all shadow-[0_4px_25px_rgba(239,68,68,0.15)] flex items-center justify-center gap-2 border-none outline-none select-none cursor-pointer active:scale-98"
            >
              <span>Retry / Choose another plan</span>
              <ChevronRight size={14} strokeWidth={3} />
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
