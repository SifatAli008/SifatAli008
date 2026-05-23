export function MarqueeStrip() {
  const text =
    "REACT — NEXT.JS — NODE — RAG — WORDPRESS — ELEMENTOR — UNITY — FIREBASE — TENSORFLOW — DOCKER — C# — TYPESCRIPT — TAILWIND — ";

  return (
    <div className="overflow-hidden border-y-2 border-ink bg-cream py-4">
      <div className="marquee-track">
        <span className="label-mono whitespace-nowrap px-8 text-ink/20">
          {text}
        </span>
        <span className="label-mono whitespace-nowrap px-8 text-ink/20" aria-hidden>
          {text}
        </span>
      </div>
    </div>
  );
}
