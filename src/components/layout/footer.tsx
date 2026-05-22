export function Footer() {
  return (
    <footer className="border-t-[3px] border-accent bg-ink">
      <div className="site-container flex h-16 flex-col items-start justify-center gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="label-mono text-cream">SIFAT ALI © {new Date().getFullYear()}</p>
        <p className="label-mono text-cream/30">
          NEXT.JS · FIREBASE · TAILWIND
        </p>
      </div>
    </footer>
  );
}
