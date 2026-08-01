import type { ReactNode } from "react";
import Link from "next/link";

type LegalSection = {
  title: string;
  body: ReactNode;
};

export function LegalPage({
  eyebrow,
  title,
  updated,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updated: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <article className="border-b-[3px] border-ink bg-cream">
      <div className="site-container section-pad max-w-3xl">
        <p className="label-mono text-accent">{eyebrow}</p>
        <h1 className="mt-3 font-display text-[clamp(40px,8vw,72px)] leading-none tracking-wide text-ink">
          {title}
        </h1>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/55">
          Last updated {updated}
        </p>
        <p className="mt-8 text-lg leading-relaxed text-ink/85">{intro}</p>

        <div className="mt-12 space-y-10">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-3xl tracking-wide text-ink">
                {section.title}
              </h2>
              <div className="mt-4 space-y-3 text-base leading-relaxed text-ink/80 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                {section.body}
              </div>
            </section>
          ))}
        </div>

        <p className="mt-14 border-t-[3px] border-ink pt-6 font-mono text-[11px] uppercase tracking-[0.15em] text-ink/55">
          Questions?{" "}
          <Link href="/contact" className="text-accent">
            Contact
          </Link>{" "}
          or email{" "}
          <a href="mailto:sifatali008@gmail.com">sifatali008@gmail.com</a>
        </p>
      </div>
    </article>
  );
}
