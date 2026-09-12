import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Car,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  Plus,
  Trash2,
  Calendar,
  X,
  Check,
  Fuel,
  Receipt,
  Wrench,
  Utensils,
  Shield,
  Tag,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  ChevronRight,
  Filter,
  DollarSign
} from 'lucide-react';
import { cn } from '../lib/utils';

export interface LedgerItem {
  id: string;
  driverId?: string;
  driverName?: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  note: string;
  timestamp: number;
  dateStr: string; // YYYY-MM-DD
}

interface DriverEarningsPageProps {
  driverId?: string;
  driverName?: string;
  completedTrips?: any[];
  onClose?: () => void;
  isEmbedded?: boolean;
}

const EXPENSE_CATEGORIES = [
  { id: 'Fuel', label: 'Fuel / Gas', icon: Fuel, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'Toll', label: 'Toll & Parking', icon: Receipt, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'Maintenance', label: 'Vehicle Service', icon: Wrench, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'Food', label: 'Food & Refreshment', icon: Utensils, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'Commission', label: 'Platform Fee / Tax', icon: Tag, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'Other', label: 'Other Expenses', icon: DollarSign, color: 'text-slate-600 bg-slate-50 border-slate-200' },
];

export const DriverEarningsPage: React.FC<DriverEarningsPageProps> = ({
  driverId = 'default_driver',
  driverName = 'Driver',
  completedTrips = [],
  onClose,
  isEmbedded = false
}) => {
  const [timeFilter, setTimeFilter] = useState<'today' | 'week' | 'month'>('today');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [addType, setAddType] = useState<'expense' | 'income'>('expense');
  
  // Form fields
  const [amountInput, setAmountInput] = useState<string>('');
  const [categoryInput, setCategoryInput] = useState<string>('Fuel');
  const [noteInput, setNoteInput] = useState<string>('');
  const [dateInput, setDateInput] = useState<string>(() => new Date().toISOString().split('T')[0]);

  // Ledger state loaded from local storage & API
  const [ledger, setLedger] = useState<LedgerItem[]>(() => {
    try {
      const saved = localStorage.getItem(`taxiapp_driver_ledger_${driverId}`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error reading driver ledger', e);
    }
    return [
      {
        id: 'init_1',
        driverId,
        driverName,
        type: 'income',
        category: 'Trip Fare',
        amount: 320,
        note: 'Completed Ride #TRP8821',
        timestamp: Date.now() - 3600000 * 2,
        dateStr: new Date().toISOString().split('T')[0]
      },
      {
        id: 'init_2',
        driverId,
        driverName,
        type: 'expense',
        category: 'Fuel',
        amount: 200,
        note: 'Petrol refill at Shell pump',
        timestamp: Date.now() - 3600000 * 5,
        dateStr: new Date().toISOString().split('T')[0]
      }
    ];
  });

  // Save to localStorage & notify backend
  useEffect(() => {
    try {
      localStorage.setItem(`taxiapp_driver_ledger_${driverId}`, JSON.stringify(ledger));
      fetch('/api/driver/ledger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ driverId, driverName, ledger })
      }).catch(err => console.error('Ledger sync error:', err));
    } catch (e) {
      console.error('Error saving driver ledger', e);
    }
  }, [ledger, driverId, driverName]);

  // Filter items based on selected timeframe
  const filteredItems = useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    
    // Start of current week (Sunday or Monday)
    const dayOfWeek = now.getDay();
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek).getTime();
    
    // Start of current month
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

    let cutoff = startOfToday;
    if (timeFilter === 'week') cutoff = startOfWeek;
    if (timeFilter === 'month') cutoff = startOfMonth;

    return ledger.filter(item => item.timestamp >= cutoff);
  }, [ledger, timeFilter]);

  // Calculate totals
  const stats = useMemo(() => {
    let income = 0;
    let expenses = 0;
    let tripCount = 0;

    filteredItems.forEach(item => {
      if (item.type === 'income') {
        income += item.amount;
        if (item.category === 'Trip Fare' || item.category === 'Ride Fare') {
          tripCount += 1;
        }
      } else if (item.type === 'expense') {
        expenses += item.amount;
      }
    });

    const netEarnings = income - expenses;
    const avgPerTrip = tripCount > 0 ? Math.round(income / tripCount) : 0;

    // Calculate biggest expense in time range
    const expenseItems = filteredItems.filter(i => i.type === 'expense');
    let biggestExpense: LedgerItem | null = null;
    if (expenseItems.length > 0) {
      biggestExpense = expenseItems.reduce((max, curr) => (curr.amount > max.amount ? curr : max), expenseItems[0]);
    }

    return {
      income,
      expenses,
      netEarnings,
      tripCount,
      avgPerTrip,
      biggestExpense
    };
  }, [filteredItems]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amountInput);
    if (!numAmount || isNaN(numAmount) || numAmount <= 0) return;

    const newItem: LedgerItem = {
      id: `led_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      driverId,
      driverName,
      type: addType,
      category: addType === 'income' ? 'Manual Fare' : categoryInput,
      amount: numAmount,
      note: noteInput.trim() || (addType === 'income' ? 'Manual trip earnings' : `${categoryInput} expense`),
      timestamp: dateInput ? new Date(dateInput).getTime() : Date.now(),
      dateStr: dateInput || new Date().toISOString().split('T')[0]
    };

    setLedger(prev => [newItem, ...prev]);
    setShowAddModal(false);
    setAmountInput('');
    setNoteInput('');
  };

  const handleDeleteEntry = (id: string) => {
    setLedger(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className={cn("w-full transition-colors duration-300 space-y-4 font-sans", isEmbedded ? "p-0" : "p-4 max-w-lg mx-auto")}>
      {/* Timeframe Filter Tabs (Pill Buttons) */}
      <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 rounded-xl p-3 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-semibold">
          <Shield size={14} className="text-emerald-600 shrink-0" />
          <span>Driver Payout Account <code className="text-[10px] bg-emerald-100 dark:bg-emerald-900/60 px-1.5 py-0.5 rounded font-mono">driver_payout_earnings</code></span>
        </div>
        <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-white dark:bg-slate-900 px-2 py-1 rounded-md border border-emerald-200 shadow-2xs">
          Separate from Rider Wallet
        </span>
      </div>

      <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#EFECE6] dark:bg-slate-800/60 rounded-xl border border-[#E8E6E0] dark:border-slate-800">
        {(['today', 'week', 'month'] as const).map(tab => {
          const labels = { today: 'Today', week: 'This week', month: 'This month' };
          const isActive = timeFilter === tab;
          return (
            <button
              key={tab}
              onClick={() => setTimeFilter(tab)}
              className={cn(
                "py-2 px-3 rounded-lg text-xs font-black tracking-tight transition-all cursor-pointer text-center",
                isActive
                  ? "bg-[#F2B33D] text-slate-950 shadow-xs border border-amber-500/30"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Net Earnings Hero Card */}
      <div className="bg-white dark:bg-[#1b202a] rounded-2xl p-5 border border-[#E8E6E0] dark:border-slate-800 shadow-xs text-center relative overflow-hidden">
        {/* Subtle Vertical Stripes Overlay */}
        <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none bg-[repeating-linear-gradient(90deg,transparent,transparent_12px,#000_12px,#000_13px)]" />

        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">
          NET EARNINGS · {timeFilter === 'today' ? 'TODAY' : timeFilter === 'week' ? 'THIS WEEK' : 'THIS MONTH'}
        </p>
        <div className="text-3xl sm:text-4xl font-black text-[#F2B33D] tracking-tight my-1 flex items-center justify-center gap-0.5">
          <span>₹</span>
          <span>{stats.netEarnings.toLocaleString('en-IN')}</span>
        </div>
        <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
          take-home after costs
        </p>
      </div>

        {/* 2x2 Snapshot Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Income Card */}
          <div className="bg-white dark:bg-[#1b202a] rounded-2xl p-4 border border-[#E8E6E0] dark:border-slate-800 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <TrendingUp size={16} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                ₹{stats.income.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Income
              </p>
            </div>
          </div>

          {/* Expenses Card */}
          <div className="bg-white dark:bg-[#1b202a] rounded-2xl p-4 border border-[#E8E6E0] dark:border-slate-800 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <TrendingDown size={16} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                ₹{stats.expenses.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Expenses
              </p>
            </div>
          </div>

          {/* Trips Logged Card */}
          <div className="bg-white dark:bg-[#1b202a] rounded-2xl p-4 border border-[#E8E6E0] dark:border-slate-800 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Car size={16} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                {stats.tripCount}
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Trips logged
              </p>
            </div>
          </div>

          {/* Avg / trip Card */}
          <div className="bg-white dark:bg-[#1b202a] rounded-2xl p-4 border border-[#E8E6E0] dark:border-slate-800 shadow-2xs space-y-2">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <IndianRupee size={16} strokeWidth={2.5} />
            </div>
            <div>
              <div className="text-lg font-black text-slate-900 dark:text-slate-100 tracking-tight">
                ₹{stats.avgPerTrip.toLocaleString('en-IN')}
              </div>
              <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                Avg / trip
              </p>
            </div>
          </div>
        </div>

        {/* Biggest Cost Card */}
        <div className="bg-white dark:bg-[#1b202a] rounded-2xl p-4 border border-[#E8E6E0] dark:border-slate-800 shadow-2xs">
          <p className="text-[12px] font-black text-slate-900 dark:text-slate-100 mb-1">
            Biggest cost · {timeFilter === 'today' ? 'today' : timeFilter === 'week' ? 'this week' : 'this month'}
          </p>
          {stats.biggestExpense ? (
            <div className="flex items-center justify-between text-xs mt-2 p-2.5 bg-rose-50/60 dark:bg-rose-950/20 rounded-xl border border-rose-100 dark:border-rose-900/40">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                <span className="font-extrabold text-slate-900 dark:text-slate-200">{stats.biggestExpense.category}</span>
                <span className="text-slate-400">• {stats.biggestExpense.note}</span>
              </div>
              <span className="font-black text-rose-600 dark:text-rose-400">₹{stats.biggestExpense.amount}</span>
            </div>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              No expenses logged {timeFilter === 'today' ? 'today' : timeFilter === 'week' ? 'this week' : 'this month'}.
            </p>
          )}
        </div>

        {/* Recent Activity Card */}
        <div className="bg-white dark:bg-[#1b202a] rounded-2xl p-4 border border-[#E8E6E0] dark:border-slate-800 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[12px] font-black text-slate-900 dark:text-slate-100">
              Recent activity
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  setAddType('expense');
                  setShowAddModal(true);
                }}
                className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 text-[10px] font-black flex items-center gap-1 hover:bg-rose-100 transition-colors cursor-pointer"
              >
                <Plus size={11} /> Expense
              </button>
              <button
                onClick={() => {
                  setAddType('income');
                  setShowAddModal(true);
                }}
                className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 text-[10px] font-black flex items-center gap-1 hover:bg-emerald-100 transition-colors cursor-pointer"
              >
                <Plus size={11} /> Income
              </button>
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <p className="text-xs text-slate-500 dark:text-slate-400 py-2">
              Nothing logged yet.
            </p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 font-bold",
                      item.type === 'income' ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    )}>
                      {item.type === 'income' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold text-slate-900 dark:text-slate-200 truncate">
                        {item.note || item.category}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {item.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={cn(
                      "font-black text-xs",
                      item.type === 'income' ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"
                    )}>
                      {item.type === 'income' ? '+' : '-'}₹{item.amount}
                    </span>
                    <button
                      onClick={() => handleDeleteEntry(item.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                      title="Delete log"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      {/* Add Expense / Income Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[12000] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-[#191e26] rounded-3xl p-5 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-2xl relative"
            >
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X size={18} />
              </button>

              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight mb-4">
                Add {addType === 'expense' ? 'Expense' : 'Income / Fare'} Log
              </h3>

              <form onSubmit={handleAddEntry} className="space-y-3.5">
                {/* Type toggle */}
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setAddType('expense')}
                    className={cn(
                      "py-2 text-xs font-black rounded-lg transition-all cursor-pointer",
                      addType === 'expense' ? "bg-secondary text-white shadow-xs" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddType('income')}
                    className={cn(
                      "py-2 text-xs font-black rounded-lg transition-all cursor-pointer",
                      addType === 'income' ? "bg-emerald-600 text-white shadow-xs" : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                    )}
                  >
                    Income
                  </button>
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 350"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-base font-black focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  />
                </div>

                {/* Category (if expense) */}
                {addType === 'expense' && (
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                      Category
                    </label>
                    <select
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                    >
                      {EXPENSE_CATEGORIES.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Note / Remarks */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Note / Description
                  </label>
                  <input
                    type="text"
                    placeholder={addType === 'expense' ? "e.g. Shell Petrol Pump fill" : "e.g. Extra tip / Cash ride"}
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  />
                </div>

                {/* Date */}
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className={cn(
                    "w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest active:scale-95 transition-all mt-2 cursor-pointer shadow-md flex items-center justify-center gap-2",
                    addType === 'expense' ? "bg-secondary hover:bg-secondary/90 text-white shadow-secondary/20" : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20"
                  )}
                >
                  Save {addType === 'expense' ? 'Expense' : 'Income'} Log
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
