import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";

interface MarkdownContentProps {
  content: string;
}

export function MarkdownContent({ content }: MarkdownContentProps) {
  return (
    <article className="prose-brutal max-w-none [&_a]:text-accent [&_a]:underline [&_code]:font-mono [&_code]:text-sm [&_h2]:font-display [&_h2]:text-3xl [&_h2]:uppercase [&_h3]:font-sans [&_h3]:text-xl [&_h3]:font-bold [&_p]:text-ink/85">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeSlug]}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}
