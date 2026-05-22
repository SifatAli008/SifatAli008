interface PageShellProps {
  children: React.ReactNode;
  title: string;
  label?: string;
  dark?: boolean;
}

export function PageShell({
  children,
  title,
  label,
  dark = false,
}: PageShellProps) {
  return (
    <div className={dark ? "bg-ink text-cream" : "bg-cream text-ink"}>
      <div className="border-b-[3px] border-ink bg-ink">
        <div className="site-container py-4">
          {label && <p className="label-mono text-accent">{label}</p>}
          <h1 className="font-display text-display leading-none text-cream">
            {title}
          </h1>
        </div>
      </div>
      <div className="site-container section-pad">{children}</div>
    </div>
  );
}
