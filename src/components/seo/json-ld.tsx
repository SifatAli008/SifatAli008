import { serializeJsonLd } from "@/lib/seo";

type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

interface JsonLdProps {
  data: JsonLdData;
}

function stripContext(node: Record<string, unknown>): Record<string, unknown> {
  const { ["@context"]: _ctx, ...rest } = node;
  return rest;
}

export function JsonLd({ data }: JsonLdProps) {
  const graph = Array.isArray(data) ? data : [data];
  const payload =
    graph.length === 1
      ? graph[0]
      : {
          "@context": "https://schema.org",
          "@graph": graph.map(stripContext),
        };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(payload),
      }}
    />
  );
}
