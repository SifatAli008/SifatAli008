export function AiVisibilityJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        name: "No JSON-LD schema.org markup detected",
        url: "https://www.sifatali.site/archive",
        description: "Add relevant schema (Organization, Article, FAQPage, etc.) for AEO/GEO.",
      },
      {
        "@type": "Organization",
        name: "No JSON-LD schema.org markup detected",
        url: "https://www.sifatali.site/archive",
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What is this page about?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Add relevant schema (Organization, Article, FAQPage, etc.) for AEO/GEO.",
            },
          },
        ],
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
