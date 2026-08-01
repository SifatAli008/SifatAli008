import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import { parseArticleChart } from "@/lib/blog/parse-article-chart";

const ArticleChart = dynamic(
  () =>
    import("@/components/blog/article-charts").then((m) => m.ArticleChart),
  {
    ssr: false,
    loading: () => (
      <div className="my-10 h-72 animate-pulse border-[3px] border-ink/20 bg-white" />
    ),
  }
);

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <div className="article-prose max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSlug]}
        components={{
          h2: ({ children, id }) => (
            <h2
              id={id}
              className="mt-14 scroll-mt-28 border-b-2 border-ink pb-3 font-display text-[1.75rem] uppercase leading-none tracking-tight text-ink first:mt-0 md:text-[2.1rem]"
            >
              {children}
            </h2>
          ),
          h3: ({ children, id }) => (
            <h3
              id={id}
              className="mt-10 scroll-mt-28 font-sans text-xl font-bold text-ink md:text-[1.35rem]"
            >
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="mt-5 text-[17px] leading-[1.85] text-ink/85">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-ink">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic text-ink/80">{children}</em>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              className="font-medium text-accent underline decoration-accent/40 underline-offset-2 hover:decoration-accent"
              target={href?.startsWith("http") ? "_blank" : undefined}
              rel={href?.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {children}
            </a>
          ),
          ul: ({ children }) => (
            <ul className="mt-5 list-disc space-y-2 pl-6 text-[17px] leading-relaxed text-ink/85 marker:text-accent">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mt-5 list-decimal space-y-2 pl-6 text-[17px] leading-relaxed text-ink/85 marker:font-mono marker:text-accent">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="pl-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="my-8 border-l-4 border-accent bg-[#fff8ef] px-5 py-4 text-lg italic leading-relaxed text-ink/80">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="my-8 overflow-x-auto border-[3px] border-ink bg-white shadow-[4px_4px_0_0_#0A0A0A]">
              <table className="w-full min-w-[520px] border-collapse text-left text-sm">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-ink text-cream">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border-b-2 border-ink px-4 py-3 font-mono text-[11px] uppercase tracking-[0.12em]">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-t border-ink/15 px-4 py-3 align-top text-[14px] leading-relaxed text-ink/85">
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr className="even:bg-[#f5f0e8]">{children}</tr>
          ),
          hr: () => (
            <hr className="my-12 border-0 border-t-2 border-black/20" />
          ),
          pre: ({ children }) => <>{children}</>,
          code: ({ className, children }) => {
            const lang = /language-(\w+)/.exec(className ?? "")?.[1];
            const raw = String(children).replace(/\n$/, "");

            if (lang === "chart") {
              const config = parseArticleChart(raw);
              if (config) return <ArticleChart config={config} />;
              return (
                <p className="my-6 border-2 border-accent bg-[#fff8ef] px-4 py-3 text-sm text-ink">
                  Chart data could not be parsed.
                </p>
              );
            }

            if (lang) {
              return (
                <pre className="my-6 overflow-x-auto border-[3px] border-ink bg-ink p-4 text-cream shadow-[4px_4px_0_0_#FF3B00]">
                  <code className={`${className ?? ""} font-mono text-sm`}>
                    {children}
                  </code>
                </pre>
              );
            }

            return (
              <code className="rounded-sm border border-black/20 bg-[#f5f0e8] px-1.5 py-0.5 font-mono text-[0.85em] text-ink">
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
