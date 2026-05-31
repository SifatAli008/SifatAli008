"use client";

import { motion } from "framer-motion";
import { ExternalLink, FileText, FlaskConical, Loader2 } from "lucide-react";
import { SectionReveal } from "@/components/motion/section-reveal";
import type { ResearchPaper, ResearchSectionSettings } from "@/types";

interface AcademicResearchSectionProps {
  settings: ResearchSectionSettings;
  papers: ResearchPaper[];
}

export function AcademicResearchSection({ settings, papers }: AcademicResearchSectionProps) {
  const showPapers = settings.status === "published" && papers.length > 0;

  return (
    <SectionReveal id="research" className="border-t-[3px] border-ink bg-cream">
      <div className="border-b-2 border-ink bg-ink">
        <motion.div
          className="site-container flex h-12 flex-wrap items-center justify-between gap-4"
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35 }}
        >
          <span className="font-display text-xl text-cream">{settings.sectionLabel}</span>
          <span className="label-mono flex items-center gap-2 text-cream/70">
            <FlaskConical className="h-4 w-4 text-accent" strokeWidth={2.5} />
            {settings.statusBadge}
          </span>
        </motion.div>
      </div>

      <div className="site-container section-pad">
        {showPapers ? (
          <div className="space-y-6">
            {papers.map((paper, index) => (
              <motion.article
                key={paper.id}
                className="border-[3px] border-ink bg-cream p-6 md:p-8"
                style={{ boxShadow: "8px 8px 0 0 #0a0a0a" }}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <div className="flex flex-wrap items-center gap-3">
                  <span className="label-mono text-accent">{paper.year}</span>
                  <span className="tag-brutal">{paper.venue}</span>
                </div>
                <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] leading-none text-ink">
                  {paper.title}
                </h2>
                <p className="label-mono mt-2 text-muted">{paper.authors}</p>
                <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ink/70">
                  {paper.abstract}
                </p>
                {(paper.href || paper.pdfUrl) && (
                  <div className="mt-5 flex flex-wrap gap-3">
                    {paper.href && (
                      <a
                        href={paper.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-3d inline-flex items-center gap-2 border-2 border-ink bg-ink px-4 py-2 font-sans text-xs font-bold uppercase tracking-widest text-cream"
                      >
                        Read paper
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                    {paper.pdfUrl && (
                      <a
                        href={paper.pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 border-2 border-ink px-4 py-2 font-sans text-xs font-bold uppercase tracking-widest text-ink"
                      >
                        <FileText className="h-3.5 w-3.5" />
                        PDF
                      </a>
                    )}
                  </div>
                )}
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div
            className="flex min-h-[280px] flex-col items-center justify-center border-[3px] border-ink bg-cream px-6 py-16 text-center md:min-h-[320px]"
            style={{ boxShadow: "8px 8px 0 0 #0a0a0a" }}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <motion.span
              className="icon-3d-box mb-6 flex h-16 w-16 items-center justify-center border-2 border-ink bg-accent"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="h-8 w-8 text-cream" strokeWidth={2.5} />
            </motion.span>
            <p className="label-mono text-accent">STATUS</p>
            <h2 className="mt-3 font-display text-[clamp(2.5rem,6vw,4.5rem)] leading-none text-ink">
              {settings.headline}
            </h2>
            <p className="label-mono mt-6 max-w-md text-muted">{settings.message}</p>
            <span className="label-mono mt-8 inline-flex items-center gap-2 border-2 border-ink bg-ink px-4 py-2 text-cream">
              <span className="inline-block h-2 w-2 bg-accent pulse-dot" />
              {settings.statusBadge}
            </span>
          </motion.div>
        )}
      </div>
    </SectionReveal>
  );
}
