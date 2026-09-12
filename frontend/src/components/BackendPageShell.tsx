import React from 'react';
import { RefreshCw, Sparkles, ChevronRight, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';

export interface StatItem {
  label: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export interface BackendPageShellProps {
  title: string;
  subtitle?: string;
  badge?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  stats?: StatItem[];
  onRefresh?: () => void;
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * BackendPageShell
 * Standardized container layout for ALL current and future backend admin pages.
 * Ensures consistent typography, spacing, card hierarchy, headers, and action bars.
 */
export const BackendPageShell: React.FC<BackendPageShellProps> = ({
  title,
  subtitle,
  badge,
  icon,
  actions,
  stats,
  onRefresh,
  isLoading,
  children,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`backend-admin-page space-y-6 text-slate-800 ${className}`}
    >
      {/* Standardized Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            {icon && (
              <div className="w-9 h-9 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-700 flex items-center justify-center shrink-0">
                {icon}
              </div>
            )}
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight font-sans">
              {title}
            </h1>
            {badge && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300/60 uppercase tracking-wider">
                {badge}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls Slot */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              disabled={isLoading}
              className="p-2.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:text-slate-900 transition-all cursor-pointer shadow-xs disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin text-amber-600' : ''} />
            </button>
          )}
          {actions}
        </div>
      </div>

      {/* Metric Stat Overview Cards (Optional) */}
      {stats && stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-2 hover:border-slate-300 transition-all"
            >
              <div className="flex items-center justify-between text-slate-500">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {stat.label}
                </span>
                {stat.icon && (
                  <div className="p-1.5 rounded-lg bg-slate-100 text-slate-600">
                    {stat.icon}
                  </div>
                )}
              </div>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-2xl font-bold text-slate-900 tracking-tight">
                  {stat.value}
                </span>
                {stat.change && (
                  <span
                    className={`text-xs font-bold inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md ${
                      stat.isPositive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {stat.isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {stat.change}
                  </span>
                )}
              </div>
              {stat.description && (
                <p className="text-[11px] text-slate-400 font-medium truncate">
                  {stat.description}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main Page Content */}
      <div className="space-y-6">{children}</div>
    </motion.div>
  );
};

/**
 * Standard Status Badge Component
 */
export const BackendStatusBadge: React.FC<{
  status: string;
  variant?: 'green' | 'red' | 'amber' | 'blue' | 'gray';
}> = ({ status, variant }) => {
  const normalized = (status || '').toLowerCase();

  let style = 'bg-slate-100 text-slate-700 border-slate-200';

  if (variant === 'green' || ['active', 'published', 'verified', 'completed', 'paid', 'success', 'online'].includes(normalized)) {
    style = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
  } else if (variant === 'red' || ['failed', 'rejected', 'suspended', 'cancelled', 'blocked', 'inactive', 'high', 'error'].includes(normalized)) {
    style = 'bg-rose-50 text-rose-800 border-rose-200/80';
  } else if (variant === 'amber' || ['pending', 'draft', 'review', 'warning', 'medium', 'in_progress'].includes(normalized)) {
    style = 'bg-amber-50 text-amber-800 border-amber-200/80';
  } else if (variant === 'blue' || ['open', 'processing', 'scheduled', 'info'].includes(normalized)) {
    style = 'bg-sky-50 text-sky-800 border-sky-200/80';
  }

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border inline-flex items-center gap-1 uppercase tracking-wider ${style}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
};

/**
 * Standard Card Panel Component
 */
export const BackendCard: React.FC<{
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, action, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 md:p-6 space-y-4 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            {title && <h3 className="text-base font-bold text-slate-900">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-500 font-medium mt-0.5">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
