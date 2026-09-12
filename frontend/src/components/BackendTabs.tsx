import React from 'react';
import { cn } from '../lib/utils';

export interface BackendTabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
}

export interface BackendTabsProps {
  tabs: BackendTabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  tabClassName?: string;
}

export const BackendTabs: React.FC<BackendTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className,
  tabClassName
}) => {
  return (
    <div
      className={cn(
        "bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-1.5 overflow-x-auto no-scrollbar",
        className
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "h-10 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer whitespace-nowrap border",
              isActive
                ? "bg-amber-400 text-slate-950 font-black shadow-xs border-amber-500/50"
                : "bg-slate-50/80 text-slate-700 hover:text-slate-950 hover:bg-slate-100 border-slate-200/80",
              tabClassName
            )}
          >
            {tab.icon && (
              <span className={cn("shrink-0 transition-colors", isActive ? "text-slate-950" : "text-amber-500")}>
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-md text-[10px] font-mono font-bold leading-none",
                  tab.badgeColor || (isActive ? "bg-slate-950/10 text-slate-950" : "bg-amber-100 text-amber-900 border border-amber-300")
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
