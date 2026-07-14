import Link from "next/link";
import { Minus, Plus } from "lucide-react";

const faqs = [
  {
    q: "What does Sifat Ali offer?",
    a: "AI/RAG system design, full-stack web apps (Next.js, Firebase), product execution from Fluvo Soft COO experience, and advisory for EdTech, MedTech, and SaaS teams that need to ship reliable AI features.",
  },
  {
    q: "Who is this for?",
    a: "Founders, CTOs, and product teams hiring an AI/RAG engineer or full-stack builder; schools and clinics needing practical AI tools; and collaborators who want hackathon-hardened delivery, not slideware.",
  },
  {
    q: "How does hiring or pricing work?",
    a: "Engagements are scoped by project, not a public rate card. Share goals, timeline, and stack constraints by email or booking form - Sifat replies with fit, approach, and next steps. Typical work includes AI/RAG pipelines, Next.js products, and Firebase backends.",
  },
  {
    q: "What are the key strengths?",
    a: "RAG and applied AI, Next.js/TypeScript full-stack builds, Firebase and production operations, community and education work, and 2× national hackathon results under real deadlines.",
  },
  {
    q: "How can I contact Sifat Ali?",
    a: "Email sifatali008@gmail.com or use the contact page to book a call. Prefer Bangla or English - same channels.",
  },
];

/** Visible Q&A for AEO/GEO - keeps answers crawlable as real HTML, not schema-only. */
export function FaqSection() {
  return (
    <section
      id="faq"
      className="border-t-[3px] border-ink bg-cream"
      aria-labelledby="faq-heading"
    >
      <div className="border-b-2 border-ink bg-ink">
        <div className="site-container flex h-12 flex-wrap items-center justify-between gap-2">
          <span className="font-display text-xl text-cream">08 / FAQ</span>
          <span className="label-mono text-cream/70">ANSWERS · HIRE · CONTACT</span>
        </div>
      </div>

      <div className="site-container section-pad">
        <h2
          id="faq-heading"
          className="font-display text-display leading-none text-ink"
        >
          STRAIGHT ANSWERS
        </h2>
        <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-ink/70">
          Clear facts about what Sifat builds, who he works with, and how to reach
          him.
        </p>

        <ul className="mt-10 space-y-3">
          {faqs.map((item, index) => (
            <li key={item.q}>
              <details
                className="group border-[3px] border-ink bg-cream open:bg-white open:shadow-[4px_4px_0_0_#0a0a0a]"
                open={index === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-4 outline-none marker:content-none focus-visible:bg-ink/[0.04] [&::-webkit-details-marker]:hidden md:px-5 md:py-5">
                  <span className="font-sans text-base font-bold leading-snug text-ink md:text-lg">
                    {item.q}
                  </span>
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center border-2 border-ink bg-accent text-cream transition-colors group-open:bg-ink"
                    aria-hidden
                  >
                    <Plus
                      className="h-5 w-5 group-open:hidden"
                      strokeWidth={2.5}
                    />
                    <Minus
                      className="hidden h-5 w-5 group-open:block"
                      strokeWidth={2.5}
                    />
                  </span>
                </summary>
                <div className="border-t-2 border-ink px-4 pb-5 pt-4 md:px-5 md:pb-6">
                  <p className="max-w-2xl text-[15px] leading-[1.75] text-ink/75 md:text-base">
                    {item.a}
                  </p>
                </div>
              </details>
            </li>
          ))}
        </ul>

        <p className="mt-10 max-w-xl label-mono text-sm leading-relaxed text-ink/55">
          Ready to talk scope?{" "}
          <Link
            href="/contact"
            className="font-bold text-accent underline underline-offset-4 hover:text-ink"
          >
            Book a call
          </Link>{" "}
          or email sifatali008@gmail.com.
        </p>
      </div>
    </section>
  );
}
