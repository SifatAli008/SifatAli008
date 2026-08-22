"use client";

import { useLocale } from "@/components/i18n/locale-provider";

type ArticleFaqSectionProps = {
  faqs: { question: string; answer: string }[];
};

/** Visible FAQ block for AEO/SEO — pairs with faqPageJsonLd on blog posts. */
export function ArticleFaqSection({ faqs }: ArticleFaqSectionProps) {
  const { t } = useLocale();
  if (!faqs.length) return null;

  return (
    <section
      id="faq"
      aria-labelledby="article-faq-heading"
      className="mt-20 scroll-mt-28 border-t-2 border-ink pt-12"
    >
      <p className="label-mono text-accent">{t("article.faq")}</p>
      <h2
        id="article-faq-heading"
        className="mt-3 font-display text-[1.75rem] uppercase leading-none tracking-tight text-ink md:text-[2.1rem]"
      >
        {t("article.faq")}
      </h2>
      <div className="mt-8 space-y-4">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group border-[3px] border-ink bg-white p-5 shadow-[3px_3px_0_0_#0A0A0A] open:bg-[#fff8ef]"
          >
            <summary className="cursor-pointer list-none font-sans text-lg font-bold text-ink marker:content-none [&::-webkit-details-marker]:hidden">
              {faq.question}
            </summary>
            <p className="mt-4 text-[17px] leading-[1.85] text-ink/85">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
