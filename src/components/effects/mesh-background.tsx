export function MeshBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-mesh-gradient opacity-80" />
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-accent-indigo/20 blur-[100px] animate-pulse-soft" />
      <div className="absolute -right-24 top-40 h-96 w-96 rounded-full bg-accent-violet/15 blur-[120px] animate-pulse-soft" />
      <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-accent-indigo/10 blur-[80px]" />
      <div className="absolute inset-0 dot-grid opacity-30" />
      <div className="noise-overlay absolute inset-0" />
    </div>
  );
}
