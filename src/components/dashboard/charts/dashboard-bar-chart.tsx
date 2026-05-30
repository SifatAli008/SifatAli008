"use client";

import { motion } from "framer-motion";

export interface DashboardBarItem {
  label: string;
  value: number;
  color?: string;
}

interface DashboardBarChartProps {
  data: DashboardBarItem[];
  max?: number;
  height?: number;
  className?: string;
}

export function DashboardBarChart({
  data,
  max,
  height = 140,
  className = "",
}: DashboardBarChartProps) {
  const peak = max ?? Math.max(...data.map((d) => d.value), 1);
  const barArea = height - 48;

  return (
    <div className={`flex items-end gap-2 md:gap-3 ${className}`} style={{ height }}>
      {data.map((item, i) => {
        const pct = Math.max(4, Math.round((item.value / peak) * 100));
        const color = item.color ?? (i === data.length - 1 ? "#FF3B00" : "#F5F0E8");
        return (
          <div
            key={item.label}
            className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
          >
            <span className="label-mono text-[10px] text-zinc-400">{item.value}</span>
            <div
              className="relative w-full border-2 border-white/10 bg-white/[0.03]"
              style={{ height: barArea }}
            >
              <motion.div
                className="absolute bottom-0 left-0 right-0 border-t-2 border-white/20"
                style={{ backgroundColor: color }}
                initial={{ height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
              />
            </div>
            <span className="label-mono max-w-full truncate text-center text-[9px] text-zinc-500">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
