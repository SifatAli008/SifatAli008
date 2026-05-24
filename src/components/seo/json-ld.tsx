import { serializeJsonLd } from "@/lib/seo";

type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

interface JsonLdProps {
  data: JsonLdData;
}

export function JsonLd({ data }: JsonLdProps) {
  const graph = Array.isArray(data) ? data : [data];

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: serializeJsonLd(
          graph.length === 1 ? graph[0] : { "@context": "https://schema.org", "@graph": graph }
        ),
      }}
    />
  );
}
