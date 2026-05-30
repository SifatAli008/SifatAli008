"use client";

import { motion } from "framer-motion";

export interface DashboardLinePoint {
  label: string;
  value: number;
}

interface DashboardLineChartProps {
  data: DashboardLinePoint[];
  height?: number;
  className?: string;
}

export function DashboardLineChart({
  data,
  height = 160,
  className = "",
}: DashboardLineChartProps) {
  if (data.length === 0) {
    return (
      <div
        className={`flex items-center justify-center border-2 border-dashed border-white/10 text-xs text-zinc-600 ${className}`}
        style={{ height }}
      >
        No data yet
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.value), 1);
  const width = 100;
  const pad = 8;
  const innerH = height - 40;
  const step = data.length > 1 ? (width - pad * 2) / (data.length - 1) : 0;

  const points = data.map((d, i) => {
    const x = pad + i * step;
    const y = pad + innerH - (d.value / max) * innerH;
    return { x, y, ...d };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  const areaPath = `${linePath} L ${points[points.length - 1]?.x ?? pad} ${pad + innerH} L ${pad} ${pad + innerH} Z`;

  return (
    <div className={className}>
      <svg
        viewBox={`0 0 ${width} ${height - 24}`}
        className="w-full overflow-visible"
        preserveAspectRatio="none"
        style={{ height: height - 24 }}
      >
        <defs>
          <linearGradient id="dashboard-area-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF3B00" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF3B00" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75].map((pct) => (
          <line
            key={pct}
            x1={pad}
            x2={width - pad}
            y1={pad + innerH * (1 - pct)}
            y2={pad + innerH * (1 - pct)}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="0.5"
          />
        ))}
        <motion.path
          d={areaPath}
          fill="url(#dashboard-area-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
        />
        <motion.path
          d={linePath}
          fill="none"
          stroke="#FF3B00"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        {points.map((p) => (
          <circle
            key={p.label}
            cx={p.x}
            cy={p.y}
            r="1.8"
            fill="#F5F0E8"
            stroke="#FF3B00"
            strokeWidth="0.8"
          />
        ))}
      </svg>
      <div className="mt-2 flex justify-between gap-1">
        {data.map((d) => (
          <span key={d.label} className="label-mono flex-1 truncate text-center text-[8px] text-zinc-600">
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
