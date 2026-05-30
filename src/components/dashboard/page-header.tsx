import Link from "next/link";

interface DashboardPageHeaderProps {
  label?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function DashboardPageHeader({
  label = "DASHBOARD",
  title,
  description,
  action,
}: DashboardPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="label-mono text-accent">{label}</p>
        <h1 className="mt-1 font-display text-4xl leading-none tracking-tight text-cream">
          {title.toUpperCase()}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm text-zinc-400">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function DashboardQuickLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="label-mono border-2 border-white/10 bg-white/[0.03] px-3 py-2 text-[10px] text-zinc-300 transition-colors hover:border-accent hover:text-accent"
    >
      {children}
    </Link>
  );
}
