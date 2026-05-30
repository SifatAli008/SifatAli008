"use client";

import { motion } from "framer-motion";

export interface DashboardDonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DashboardDonutChartProps {
  segments: DashboardDonutSegment[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
  className?: string;
}

export function DashboardDonutChart({
  segments,
  size = 148,
  centerLabel,
  centerValue,
  className = "",
}: DashboardDonutChartProps) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 36;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className={`flex flex-col gap-6 sm:flex-row sm:items-center ${className}`}>
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
          {segments.map((seg, i) => {
            const len = (seg.value / total) * c;
            const dash = `${len} ${c - len}`;
            const el = (
              <motion.circle
                key={seg.label}
                cx="50"
                cy="50"
                r={r}
                fill="none"
                stroke={seg.color}
                strokeWidth="12"
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {centerValue && (
            <span className="font-display text-2xl leading-none text-cream">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="label-mono mt-1 text-[9px] text-zinc-500">{centerLabel}</span>
          )}
        </div>
      </div>
      <ul className="min-w-0 flex-1 space-y-2">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2 text-zinc-400">
              <span
                className="h-2.5 w-2.5 shrink-0 border border-white/20"
                style={{ backgroundColor: seg.color }}
              />
              <span className="truncate">{seg.label}</span>
            </span>
            <span className="label-mono shrink-0 text-[10px] text-zinc-500">
              {seg.value} · {Math.round((seg.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
