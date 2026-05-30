import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getPortfolioWork,
  getPortfolioWorkBySlug,
  getProjectBySlug,
} from "@/lib/firebase/queries";
import { breadcrumbJsonLd, buildPageMetadata, softwareAppJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/seo/json-ld";
import { MarkdownContent } from "@/components/blog/markdown-content";

export const revalidate = 3600;

export async function generateStaticParams() {
  const portfolio = await getPortfolioWork();
  return portfolio.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const item = await getPortfolioWorkBySlug(params.slug);
  if (!item) return { title: "Project Not Found" };
  return buildPageMetadata({
    title: item.title,
    description: item.tagline || item.description,
    path: `/projects/${item.slug}`,
    tags: item.techStack,
  });
}

const sections = [
  { id: "challenge", title: "CHALLENGE", field: "challenge" as const },
  { id: "process", title: "PROCESS", field: "process" as const },
  { id: "architecture", title: "ARCHITECTURE", field: "architecture" as const },
  { id: "features", title: "FEATURES", field: "features" as const },
  { id: "technical", title: "TECHNICAL", field: "technicalDecisions" as const },
  { id: "results", title: "RESULTS", field: "results" as const },
];

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: { slug: string };
}) {
  const item = await getPortfolioWorkBySlug(params.slug);
  if (!item) notFound();

  if (item.source === "github") {
    const jsonLd = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Work", path: "/projects" },
      { name: item.title, path: `/projects/${item.slug}` },
    ]);

    return (
      <>
        <JsonLd data={jsonLd} />
        <article className="bg-cream">
          <div className="border-b-[3px] border-ink bg-ink">
            <div className="site-container py-8 md:py-12">
              <span className="tag-brutal-light">{item.category}</span>
              <h1 className="mt-4 font-display text-display leading-none text-cream">
                {item.title.toUpperCase()}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-cream/70">{item.tagline}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {item.techStack.map((tech) => (
                  <span key={tech} className="tag-brutal-light">
                    {tech.toUpperCase()}
                  </span>
                ))}
              </div>
              <p className="label-mono mt-6 text-sm text-cream/50">
                {item.stars} ★ · {item.forks} forks · synced from GitHub
              </p>
            </div>
          </div>

          <div className="site-container section-pad">
            <p className="max-w-2xl text-[17px] leading-relaxed">{item.description}</p>
            <div className="mt-10 flex flex-wrap gap-4">
              <a
                href={item.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-brutal-a"
              >
                VIEW ON GITHUB →
              </a>
              {item.demoUrl && (
                <a
                  href={item.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-brutal-b"
                >
                  LIVE DEMO →
                </a>
              )}
              <Link href="/projects" className="btn-brutal-b">
                ← ALL WORK
              </Link>
            </div>
          </div>
        </article>
      </>
    );
  }

  const project = await getProjectBySlug(params.slug);
  if (!project) notFound();

  const jsonLd = [
    softwareAppJsonLd(project),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Work", path: "/projects" },
      { name: project.title, path: `/projects/${project.slug}` },
    ]),
  ];

  return (
    <>
      <JsonLd data={jsonLd} />
      <article className="bg-cream">
        <div className="border-b-[3px] border-ink bg-ink">
          <div className="site-container py-8 md:py-12">
            <span className="tag-brutal-light">{project.category}</span>
            <h1 className="mt-4 font-display text-display leading-none text-cream">
              {project.title.toUpperCase()}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-cream/70">{project.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {project.techStack.map((t) => (
                <span key={t} className="tag-brutal-light">
                  {t.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="site-container section-pad">
          <div className="grid gap-12 lg:grid-cols-[180px_1fr]">
            <aside className="hidden lg:block">
              <nav className="sticky top-20 space-y-2 border-l-2 border-ink pl-4">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="label-mono block text-muted hover:text-accent"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </aside>

            <div className="space-y-16">
              <p className="text-[17px] leading-relaxed">{project.description}</p>

              {sections.map((section) => {
                const value = project[section.field];
                if (!value) return null;
                return (
                  <section key={section.id} id={section.id}>
                    <h2 className="font-display text-4xl text-ink">
                      {section.title}
                    </h2>
                    <div className="mt-4 h-0.5 w-16 bg-accent" />
                    {section.field === "features" && Array.isArray(value) ? (
                      <ul className="mt-6 space-y-2 font-mono text-sm">
                        {value.map((f) => (
                          <li key={f}>— {f}</li>
                        ))}
                      </ul>
                    ) : (
                      <div className="prose-brutal mt-6 max-w-none text-[17px] leading-relaxed">
                        <MarkdownContent content={String(value)} />
                      </div>
                    )}
                  </section>
                );
              })}

              <Link href="/projects" className="btn-brutal-b">
                ← ALL WORK
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
