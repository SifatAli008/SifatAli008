"use client";

interface DashboardChartPanelProps {
  label: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function DashboardChartPanel({
  label,
  title,
  description,
  children,
  className = "",
}: DashboardChartPanelProps) {
  return (
    <section className={`glass glow-border rounded-xl p-5 md:p-6 ${className}`}>
      <p className="label-mono text-[10px] text-accent">{label}</p>
      <h2 className="mt-1 font-display text-xl text-cream">{title}</h2>
      {description && <p className="mt-1 text-xs text-zinc-500">{description}</p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function DashboardProgressPanel({
  label,
  title,
  items,
}: {
  label: string;
  title: string;
  items: { label: string; value: number; max?: number }[];
}) {
  return (
    <DashboardChartPanel label={label} title={title}>
      <ul className="space-y-4">
        {items.map((item, i) => {
          const max = item.max ?? 100;
          const pct = Math.min(100, Math.round((item.value / max) * 100));
          return (
            <li key={item.label}>
              <div className="mb-1.5 flex items-center justify-between gap-4">
                <span className="text-sm text-zinc-300">{item.label}</span>
                <span className="label-mono text-[10px] text-zinc-500">{pct}%</span>
              </div>
              <div className="h-2 border border-white/10 bg-white/[0.03]">
                <div
                  className="h-full bg-accent transition-all duration-500"
                  style={{ width: `${pct}%`, transitionDelay: `${i * 50}ms` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </DashboardChartPanel>
  );
}
