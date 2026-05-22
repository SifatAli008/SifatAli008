"use client";

import { motion } from "framer-motion";

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface BrutalDonutProps {
  segments: DonutSegment[];
  size?: number;
  centerLabel?: string;
  centerValue?: string;
  className?: string;
}

export function BrutalDonut({
  segments,
  size = 160,
  centerLabel,
  centerValue,
  className = "",
}: BrutalDonutProps) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 36;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className={`flex flex-col items-center gap-6 md:flex-row md:items-center md:gap-10 ${className}`}>
      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#F5F0E8" strokeWidth="14" />
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
                strokeWidth="14"
                strokeDasharray={dash}
                strokeDashoffset={-offset}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {centerValue && (
            <span className="font-display text-3xl leading-none text-ink">{centerValue}</span>
          )}
          {centerLabel && (
            <span className="label-mono mt-1 text-muted">{centerLabel}</span>
          )}
        </div>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {segments.map((seg) => (
          <li key={seg.label} className="flex items-center gap-2">
            <span
              className="h-3 w-3 border border-ink"
              style={{ backgroundColor: seg.color }}
            />
            <span className="label-mono text-ink">
              {seg.label}{" "}
              <span className="text-muted">
                ({Math.round((seg.value / total) * 100)}%)
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
