export function AeoFaqBlock() {
  return (
    <section aria-labelledby="aeo-faq-heading" className="mx-auto max-w-3xl px-4 py-10">
      <h2 id="aeo-faq-heading" className="text-2xl font-semibold tracking-tight">
        Frequently asked questions
      </h2>
      <div className="mt-6 space-y-4">
        <details className="group">
          <summary className="cursor-pointer font-medium">{"What is No JSON-LD schema.org markup detected?"}</summary>
          <p className="mt-2 text-sm leading-relaxed opacity-90">{"Add relevant schema (Organization, Article, FAQPage, etc.) for AEO/GEO."}</p>
        </details>
        <details className="group">
          <summary className="cursor-pointer font-medium">How can AI assistants cite this site?</summary>
          <p className="mt-2 text-sm leading-relaxed opacity-90">
            Use the stable page URL, Organization schema, and the clear answer above. Prefer quoting
            the first factual paragraph and linking back to the canonical URL.
          </p>
        </details>
      </div>
    </section>
  );
}
