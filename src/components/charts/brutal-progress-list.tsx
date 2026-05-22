"use client";

import { motion } from "framer-motion";

export interface ProgressItem {
  label: string;
  value: number;
  max?: number;
}

interface BrutalProgressListProps {
  items: ProgressItem[];
  className?: string;
}

export function BrutalProgressList({ items, className = "" }: BrutalProgressListProps) {
  return (
    <ul className={`space-y-4 ${className}`}>
      {items.map((item, i) => {
        const max = item.max ?? 100;
        const pct = Math.min(100, Math.round((item.value / max) * 100));
        return (
          <li key={item.label}>
            <div className="mb-1.5 flex items-center justify-between gap-4">
              <span className="font-sans text-sm font-bold text-inherit">{item.label}</span>
              <span className="label-mono text-inherit opacity-70">{pct}%</span>
            </div>
            <div className="h-4 border-2 border-inherit bg-transparent">
              <motion.div
                className="h-full bg-accent"
                initial={{ width: 0 }}
                whileInView={{ width: `${pct}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
