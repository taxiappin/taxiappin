import React from "react";
import { cn } from "../../lib/utils";

interface ChipProps {
  label: string;
  icon: any;
  active: boolean;
  onClick: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  icon: Icon,
  active,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-6 py-3 rounded-full whitespace-nowrap transition-all duration-200 text-sm font-bold border-2",
      active
        ? "bg-primary border-primary text-slate-950 shadow-lg scale-105"
        : "bg-white border-transparent text-gray-500 hover:bg-gray-50 shadow-sm"
    )}
  >
    <Icon
      size={20}
      className={cn(active ? "text-slate-950" : "text-gray-400")}
    />
    {label}
  </button>
);
