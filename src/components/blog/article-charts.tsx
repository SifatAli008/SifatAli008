"use client";

import { useId, useMemo, type ReactNode } from "react";
import type { ArticleChartConfig } from "@/lib/blog/parse-article-chart";

export type { ArticleChartConfig, ArticleChartType } from "@/lib/blog/parse-article-chart";

const COLORS = ["#0A0A0A", "#FF3B00", "#3D5A4C", "#C45C26", "#5B4B8A"];

function ChartShell({
  title,
  source,
  type,
  children,
}: {
  title: string;
  source?: string;
  type: string;
  children: ReactNode;
}) {
  return (
    <figure className="my-10 overflow-hidden border-[3px] border-ink bg-white shadow-[5px_5px_0_0_#0A0A0A]">
      <div className="flex items-start justify-between gap-4 border-b-[3px] border-ink bg-[#f5f0e8] px-5 py-4">
        <div className="min-w-0">
          <p className="label-mono text-accent">{type} chart</p>
          <h4 className="mt-1 font-sans text-lg font-bold leading-snug text-ink md:text-xl">
            {title}
          </h4>
          {source ? (
            <p className="mt-2 text-xs leading-relaxed text-ink/55">{source}</p>
          ) : null}
        </div>
        <span className="hidden shrink-0 border-2 border-ink bg-white px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-ink sm:inline">
          Data
        </span>
      </div>
      <div className="bg-[linear-gradient(to_right,#0A0A0A08_1px,transparent_1px),linear-gradient(to_bottom,#0A0A0A08_1px,transparent_1px)] bg-[size:24px_24px] p-5 md:p-6">
        {children}
      </div>
    </figure>
  );
}

function useRows(config: ArticleChartConfig) {
  return useMemo(
    () =>
      config.items.map((item, i) => ({
        ...item,
        color: COLORS[i % COLORS.length],
        display: item.display ?? `${item.value}${config.unit ?? ""}`,
      })),
    [config]
  );
}

function BarChartView({ config }: { config: ArticleChartConfig }) {
  const rows = useRows(config);
  const max = Math.max(...rows.map((r) => r.value), 1);
  const w = 400;
  const h = 220;
  const pad = { t: 24, r: 12, b: 48, l: 12 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const gap = 12;
  const barW = Math.min(56, (innerW - gap * (rows.length - 1)) / rows.length);

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img">
        {[0.25, 0.5, 0.75, 1].map((t) => {
          const y = pad.t + innerH - t * innerH;
          return (
            <line
              key={t}
              x1={pad.l}
              x2={w - pad.r}
              y1={y}
              y2={y}
              stroke="#0A0A0A18"
              strokeWidth="1"
            />
          );
        })}
        {rows.map((row, i) => {
          const bh = Math.max(4, (row.value / max) * innerH);
          const x = pad.l + i * (barW + gap) + (innerW - rows.length * barW - (rows.length - 1) * gap) / 2;
          const y = pad.t + innerH - bh;
          return (
            <g key={row.label}>
              <rect x={x} y={y} width={barW} height={bh} fill={row.color} stroke="#0A0A0A" strokeWidth="2" />
              <text
                x={x + barW / 2}
                y={y - 8}
                textAnchor="middle"
                className="fill-ink"
                style={{ fontSize: 11, fontFamily: "ui-monospace, monospace", fontWeight: 700 }}
              >
                {row.display}
              </text>
              <text
                x={x + barW / 2}
                y={h - 16}
                textAnchor="middle"
                className="fill-ink/70"
                style={{ fontSize: 10, fontFamily: "ui-monospace, monospace" }}
              >
                {row.label.length > 12 ? `${row.label.slice(0, 11)}…` : row.label}
              </text>
            </g>
          );
        })}
      </svg>
      <Legend rows={rows} />
    </div>
  );
}

function LineChartView({ config }: { config: ArticleChartConfig }) {
  const rows = useRows(config);
  const max = Math.max(...rows.map((r) => r.value), 1);
  const min = Math.min(...rows.map((r) => r.value), 0);
  const span = Math.max(max - min, 1);
  const w = 420;
  const h = 220;
  const pad = { t: 28, r: 16, b: 40, l: 16 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const pts = rows.map((row, i) => {
    const x = pad.l + (rows.length === 1 ? innerW / 2 : (i / (rows.length - 1)) * innerW);
    const y = pad.t + innerH - ((row.value - min) / span) * innerH;
    return { x, y, ...row };
  });
  const line = pts.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `${pad.l},${pad.t + innerH} ${line} ${pts[pts.length - 1].x},${pad.t + innerH}`;
  const gradId = useId().replace(/:/g, "");

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" role="img">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FF3B00" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#FF3B00" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <polygon points={area} fill={`url(#${gradId})`} />
        <polyline
          points={line}
          fill="none"
          stroke="#FF3B00"
          strokeWidth="3.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {pts.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="6" fill="#fff" stroke="#0A0A0A" strokeWidth="2.5" />
            <circle cx={p.x} cy={p.y} r="2.5" fill="#FF3B00" />
            <text
              x={p.x}
              y={p.y - 12}
              textAnchor="middle"
              style={{ fontSize: 11, fontFamily: "ui-monospace, monospace", fontWeight: 700 }}
            >
              {p.display}
            </text>
            <text
              x={p.x}
              y={h - 14}
              textAnchor="middle"
              style={{ fontSize: 10, fontFamily: "ui-monospace, monospace", fill: "#0A0A0A99" }}
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function DonutChartView({ config }: { config: ArticleChartConfig }) {
  const rows = useRows(config);
  const total = rows.reduce((s, r) => s + r.value, 0) || 1;
  const r = 68;
  const cx = 90;
  const cy = 90;
  const stroke = 28;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-6 md:flex-row md:items-center">
      <svg viewBox="0 0 180 180" className="h-52 w-52 shrink-0" role="img">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f5f0e8" strokeWidth={stroke} />
        {rows.map((row) => {
          const len = (row.value / total) * c;
          const el = (
            <circle
              key={row.label}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={row.color}
              strokeWidth={stroke}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform={`rotate(-90 ${cx} ${cy})`}
            />
          );
          offset += len;
          return el;
        })}
        <circle cx={cx} cy={cy} r={r - stroke / 2 - 2} fill="#fff" stroke="#0A0A0A" strokeWidth="2" />
        <text
          x={cx}
          y={cy - 4}
          textAnchor="middle"
          style={{ fontSize: 22, fontWeight: 800, fontFamily: "ui-sans-serif, system-ui" }}
        >
          100%
        </text>
        <text
          x={cx}
          y={cy + 16}
          textAnchor="middle"
          style={{ fontSize: 10, fontFamily: "ui-monospace, monospace", fill: "#0A0A0A88" }}
        >
          MIX
        </text>
      </svg>
      <Legend rows={rows} stacked />
    </div>
  );
}

function HBarChartView({ config }: { config: ArticleChartConfig }) {
  const rows = useRows(config);
  const max = Math.max(...rows.map((r) => r.value), 1);

  return (
    <div className="space-y-4">
      {rows.map((row) => {
        const pct = Math.max(4, Math.round((row.value / max) * 100));
        return (
          <div key={row.label}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="text-sm font-semibold text-ink">{row.label}</span>
              <span className="label-mono text-[11px] text-accent">{row.display}</span>
            </div>
            <div className="h-5 border-2 border-ink bg-[#f5f0e8]">
              <div
                className="h-full border-r-2 border-ink transition-[width] duration-500"
                style={{ width: `${pct}%`, backgroundColor: row.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TimelineChartView({ config }: { config: ArticleChartConfig }) {
  const rows = useRows(config);
  return (
    <ol className="relative space-y-0 border-l-[3px] border-ink pl-7">
      {rows.map((row, i) => (
        <li key={row.label} className="relative pb-7 last:pb-0">
          <span
            className="absolute -left-[37px] top-0.5 flex h-5 w-5 items-center justify-center border-2 border-ink text-[10px] font-bold text-cream"
            style={{ backgroundColor: row.color }}
          >
            {i + 1}
          </span>
          <p className="label-mono text-[11px] text-accent">{row.label}</p>
          <p className="mt-1 font-sans text-base font-bold text-ink">
            {row.display}
          </p>
          {row.note ? (
            <p className="mt-1 text-sm leading-relaxed text-ink/60">{row.note}</p>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

function Legend({
  rows,
  stacked,
}: {
  rows: { label: string; display: string; color: string }[];
  stacked?: boolean;
}) {
  return (
    <ul
      className={
        stacked
          ? "w-full flex-1 space-y-2"
          : "mt-4 flex flex-wrap gap-2"
      }
    >
      {rows.map((row) => (
        <li
          key={row.label}
          className={
            stacked
              ? "flex items-center justify-between gap-3 border-2 border-ink bg-[#f5f0e8] px-3 py-2.5"
              : "inline-flex items-center gap-2 border-2 border-ink bg-[#f5f0e8] px-2.5 py-1"
          }
        >
          <span className="flex min-w-0 items-center gap-2 text-sm text-ink">
            <span
              className="h-3 w-3 shrink-0 border border-ink"
              style={{ backgroundColor: row.color }}
            />
            <span className="truncate font-medium">{row.label}</span>
          </span>
          {stacked ? (
            <span className="label-mono shrink-0 text-[11px] text-ink/55">
              {row.display}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export function ArticleChart({ config }: { config: ArticleChartConfig }) {
  const body =
    config.type === "bar" ? (
      <BarChartView config={config} />
    ) : config.type === "line" ? (
      <LineChartView config={config} />
    ) : config.type === "donut" ? (
      <DonutChartView config={config} />
    ) : config.type === "hbar" ? (
      <HBarChartView config={config} />
    ) : (
      <TimelineChartView config={config} />
    );

  return (
    <ChartShell title={config.title} source={config.source} type={config.type}>
      {body}
    </ChartShell>
  );
}
