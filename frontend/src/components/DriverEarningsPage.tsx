import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, Wallet, ArrowUpRight, ArrowDownLeft, Calendar, 
  Clock, DollarSign, Award, ChevronRight, ShieldCheck, Download,
  CheckCircle2, AlertCircle, RefreshCw
} from 'lucide-react';

interface DriverEarningsPageProps {
  driverId?: string;
  driverName?: string;
  isEmbedded?: boolean;
  onClose?: () => void;
}

export const DriverEarningsPage: React.FC<DriverEarningsPageProps> = ({
  driverId = 'DRV_101',
  driverName = 'Driver Partner',
  isEmbedded = false,
  onClose
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month'>('today');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);

  const earningsData = {
    today: {
      total: 2450,
      trips: 12,
      onlineHours: '7.5 hrs',
      baseFare: 1980,
      tips: 320,
      incentives: 150,
      deductions: 245, // 10% platform fee
      netPayout: 2205,
    },
    week: {
      total: 16840,
      trips: 84,
      onlineHours: '48.2 hrs',
      baseFare: 13900,
      tips: 1840,
      incentives: 1100,
      deductions: 1684,
      netPayout: 15156,
    },
    month: {
      total: 68250,
      trips: 342,
      onlineHours: '194 hrs',
      baseFare: 56700,
      tips: 6550,
      incentives: 5000,
      deductions: 6825,
      netPayout: 61425,
    }
  };

  const currentStats = earningsData[selectedPeriod];

  const recentTransactions = [
    { id: 'TX-901', tripId: 'TRIP-4491', type: 'Ride Earning', amount: 320, time: '35 mins ago', status: 'Settled', isCredit: true },
    { id: 'TX-900', tripId: 'TRIP-4488', type: 'Ride Earning + Tip', amount: 480, time: '2 hours ago', status: 'Settled', isCredit: true },
    { id: 'TX-899', tripId: 'BONUS-WK', type: 'Peak Surge Incentive', amount: 150, time: '4 hours ago', status: 'Credited', isCredit: true },
    { id: 'TX-898', tripId: 'COMM-4488', type: 'Platform Fee (10%)', amount: -48, time: '2 hours ago', status: 'Deducted', isCredit: false },
    { id: 'TX-897', tripId: 'PAYOUT-77', type: 'Bank Instant Transfer', amount: -3500, time: 'Yesterday', status: 'Processed', isCredit: false },
  ];

  const handleWithdraw = () => {
    setIsWithdrawing(true);
    setTimeout(() => {
      setIsWithdrawing(false);
      setWithdrawalSuccess(true);
      setTimeout(() => setWithdrawalSuccess(false), 4000);
    }, 1200);
  };

  const content = (
    <div className="w-full space-y-5 text-left font-sans">
      {/* Top Header Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-amber-950 p-6 text-white shadow-xl border border-neutral-700/40">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
        
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Driver Partner
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">{driverName}</h2>
            <p className="text-xs text-neutral-400 font-mono">ID: {driverId}</p>
          </div>

          {/* Period Toggle */}
          <div className="flex bg-neutral-800/80 p-1 rounded-xl border border-neutral-700 text-xs">
            {(['today', 'week', 'month'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all ${
                  selectedPeriod === period
                    ? 'bg-amber-500 text-neutral-950 font-bold shadow-md'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        {/* Main Balance Display */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-neutral-700/60">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1">
              Net Withdrawable Balance
            </p>
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-400 tracking-tight">
              ₹{currentStats.netPayout.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 inline" /> +14.2% higher than last {selectedPeriod}
            </p>
          </div>

          <div className="flex flex-col justify-end items-start sm:items-end gap-2">
            <button
              onClick={handleWithdraw}
              disabled={isWithdrawing}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
            >
              {isWithdrawing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Processing Payout...
                </>
              ) : (
                <>
                  <Wallet className="w-4 h-4" />
                  Instant UPI Payout
                </>
              )}
            </button>
            {withdrawalSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-medium animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" /> Payout of ₹{currentStats.netPayout.toLocaleString()} initiated!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs font-medium mb-1">
            <DollarSign className="w-4 h-4 text-amber-500" /> Gross Fares
          </div>
          <p className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
            ₹{currentStats.total.toLocaleString()}
          </p>
          <span className="text-[11px] text-neutral-400 font-mono">Gross billed</span>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs font-medium mb-1">
            <Award className="w-4 h-4 text-emerald-500" /> Rides Done
          </div>
          <p className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
            {currentStats.trips}
          </p>
          <span className="text-[11px] text-emerald-500 font-medium">100% completed</span>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-sm">
          <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400 text-xs font-medium mb-1">
            <Clock className="w-4 h-4 text-blue-500" /> Online Time
          </div>
          <p className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
            {currentStats.onlineHours}
          </p>
          <span className="text-[11px] text-neutral-400 font-mono">Avg ₹{(currentStats.total / (parseFloat(currentStats.onlineHours) || 1)).toFixed(0)}/hr</span>
        </div>
      </div>

      {/* Itemized Fare & Deductions Breakdown */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700 shadow-sm">
        <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider mb-3 flex items-center justify-between">
          <span>Earnings & Deductions Summary</span>
          <span className="text-xs text-neutral-400 capitalize">{selectedPeriod}</span>
        </h3>

        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between items-center py-1 border-b border-neutral-100 dark:border-neutral-700/50">
            <span className="text-neutral-600 dark:text-neutral-300">Base Fares & Distance Charges</span>
            <span className="font-semibold text-neutral-900 dark:text-white">₹{currentStats.baseFare.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-neutral-100 dark:border-neutral-700/50">
            <span className="text-neutral-600 dark:text-neutral-300">Passenger Tips (100% to Driver)</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">+₹{currentStats.tips.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-neutral-100 dark:border-neutral-700/50">
            <span className="text-neutral-600 dark:text-neutral-300">Peak Hours & Surge Incentive Bonus</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">+₹{currentStats.incentives.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-1 border-b border-neutral-100 dark:border-neutral-700/50">
            <span className="text-neutral-600 dark:text-neutral-300">Platform Admin Commission (10%)</span>
            <span className="font-semibold text-rose-500">-₹{currentStats.deductions.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center pt-2 text-base font-bold">
            <span className="text-neutral-900 dark:text-white">Net Settled to Bank / Wallet</span>
            <span className="text-amber-500 dark:text-amber-400 text-lg">₹{currentStats.netPayout.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl p-5 border border-neutral-200 dark:border-neutral-700 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
            Recent Ledger Transactions
          </h3>
          <span className="text-xs text-amber-500 font-medium cursor-pointer hover:underline">
            View All Statements
          </span>
        </div>

        <div className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
          {recentTransactions.map((tx) => (
            <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  tx.isCredit ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300' : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300'
                }`}>
                  {tx.isCredit ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white">{tx.type}</p>
                  <p className="text-[11px] text-neutral-400 font-mono">{tx.tripId} • {tx.time}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-bold ${tx.isCredit ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-900 dark:text-neutral-100'}`}>
                  {tx.isCredit ? '+' : ''}₹{Math.abs(tx.amount)}
                </p>
                <span className="text-[10px] text-neutral-400 font-medium">{tx.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  if (isEmbedded) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-50 dark:bg-neutral-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 shadow-2xl border border-neutral-200 dark:border-neutral-800">
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Driver Earnings & Settlements</h2>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 transition"
            >
              ✕
            </button>
          )}
        </div>
        {content}
      </div>
    </div>
  );
};
