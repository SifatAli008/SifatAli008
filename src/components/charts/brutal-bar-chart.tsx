"use client";

import { motion } from "framer-motion";

export interface BarChartItem {
  label: string;
  value: number;
  display?: string;
  color?: "ink" | "accent" | "cream";
}

interface BrutalBarChartProps {
  data: BarChartItem[];
  max?: number;
  height?: number;
  showValues?: boolean;
  className?: string;
}

const barColors = {
  ink: "bg-ink",
  accent: "bg-accent",
  cream: "bg-cream",
};

export function BrutalBarChart({
  data,
  max,
  height = 120,
  showValues = true,
  className = "",
}: BrutalBarChartProps) {
  const peak = max ?? Math.max(...data.map((d) => d.value), 1);

  return (
    <div className={`flex items-end gap-2 md:gap-3 ${className}`} style={{ height }}>
      {data.map((item, i) => {
        const pct = Math.round((item.value / peak) * 100);
        const color = item.color ?? (i === data.length - 1 ? "accent" : "ink");
        return (
          <div
            key={item.label}
            className="flex min-w-0 flex-1 flex-col items-center justify-end gap-2"
          >
            {showValues && (
              <span className="label-mono text-[10px] text-muted md:text-[11px]">
                {item.display ?? item.value}
              </span>
            )}
            <div
              className="relative w-full border-2 border-ink bg-cream"
              style={{ height: height - 32 }}
            >
              <motion.div
                className={`absolute bottom-0 left-0 right-0 border-t-2 border-ink ${barColors[color]}`}
                initial={{ height: 0 }}
                whileInView={{ height: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: "easeOut" }}
              />
            </div>
            <span className="label-mono max-w-full truncate text-center text-[9px] md:text-[10px]">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
