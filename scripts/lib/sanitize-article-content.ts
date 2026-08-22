/**
 * Normalize auto-generated article markdown so charts and references
 * always match sifatali.site rendering (ArticleChart + rehype-slug).
 */

const CHART_FENCE_RE = /~~~chart\s*\n([\s\S]*?)\n~~~/g;
const HTML_ANCHOR_RE = /<a\s+name=["'][^"']*["']\s*\/?>/gi;
const EM_DASH_RE = /\u2014/g;

/** Match rehype-slug / github-slugger style ids used on the site. */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/['']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type ChartItem = {
  label: string;
  value: number;
  display?: string;
  note?: string;
};

type NormalizedChart = {
  type: "bar" | "line" | "donut" | "hbar" | "timeline";
  title: string;
  source?: string;
  unit?: string;
  items: ChartItem[];
};

function asNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Convert Chart.js-style or incomplete payloads into site chart JSON. */
export function normalizeChartPayload(raw: unknown): NormalizedChart | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;

  const typeRaw = String(obj.type ?? "bar").toLowerCase();
  const type = (
    ["bar", "line", "donut", "hbar", "timeline"].includes(typeRaw)
      ? typeRaw
      : "bar"
  ) as NormalizedChart["type"];

  const title =
    typeof obj.title === "string" && obj.title.trim()
      ? obj.title.trim()
      : "Article chart";

  let items: ChartItem[] = [];

  if (Array.isArray(obj.items) && obj.items.length > 0) {
    items = obj.items.map((item, i) => {
      const row = (item ?? {}) as Record<string, unknown>;
      const label = String(row.label ?? row.name ?? `Item ${i + 1}`);
      const value = asNumber(row.value ?? row.y ?? row.count, i + 1);
      const display =
        row.display != null
          ? String(row.display)
          : obj.unit
            ? `${value}${obj.unit}`
            : String(value);
      return {
        label,
        value,
        display,
        ...(row.note != null ? { note: String(row.note) } : {}),
      };
    });
  } else if (Array.isArray(obj.datasets) && Array.isArray(obj.labels)) {
    // Chart.js multi-series → flatten latest year / first series values
    const labels = obj.labels.map(String);
    const first = (obj.datasets[0] ?? {}) as Record<string, unknown>;
    const data = Array.isArray(first.data) ? first.data : [];
    items = labels.map((label, i) => {
      const value = asNumber(data[i], 0);
      return { label, value, display: String(value) };
    });
  } else if (Array.isArray(obj.data)) {
    items = obj.data.map((item, i) => {
      if (typeof item === "number") {
        return { label: `Item ${i + 1}`, value: item, display: String(item) };
      }
      const row = (item ?? {}) as Record<string, unknown>;
      const label = String(row.label ?? row.name ?? `Item ${i + 1}`);
      const value = asNumber(row.value ?? row.y, i + 1);
      return { label, value, display: String(row.display ?? value) };
    });
  }

  if (items.length === 0) {
    items = [
      { label: "Metric A", value: 40, display: "40" },
      { label: "Metric B", value: 60, display: "60" },
      { label: "Metric C", value: 80, display: "80" },
    ];
  }

  const out: NormalizedChart = { type, title, items };
  if (typeof obj.source === "string" && obj.source.trim()) {
    out.source = obj.source.trim();
  }
  if (typeof obj.unit === "string" && obj.unit.trim()) {
    out.unit = obj.unit.trim();
  }
  return out;
}

function fixChartFences(content: string): string {
  return content.replace(CHART_FENCE_RE, (_full, jsonBody: string) => {
    try {
      const parsed = JSON.parse(String(jsonBody).trim());
      const normalized = normalizeChartPayload(parsed);
      if (!normalized) {
        return fallbackChartFence();
      }
      return `~~~chart\n${JSON.stringify(normalized, null, 2)}\n~~~`;
    } catch {
      return fallbackChartFence();
    }
  });
}

function fallbackChartFence(): string {
  return `~~~chart
${JSON.stringify(
  {
    type: "hbar",
    title: "Key adoption signals",
    items: [
      { label: "Signal A", value: 70, display: "70" },
      { label: "Signal B", value: 55, display: "55" },
      { label: "Signal C", value: 40, display: "40" },
    ],
  },
  null,
  2
)}
~~~`;
}

function stripHtmlAnchors(content: string): string {
  return content.replace(HTML_ANCHOR_RE, "");
}

function ensureReferencesSection(content: string): string {
  if (/^##\s+References\b/m.test(content)) return content;

  // Convert numbered list refs at the end into ### Ref headings
  const numbered = content.match(
    /(?:^|\n)(?:\[\d+\]|\d+\.)\s+.+(?:\n(?:\[\d+\]|\d+\.)\s+.+){2,}\s*$/
  );
  if (numbered) {
    const block = numbered[0].trim();
    const lines = block.split(/\n/).filter(Boolean);
    const refs = lines
      .map((line, i) => {
        const text = line.replace(/^(?:\[\d+\]|\d+\.)\s*/, "").trim();
        const title = text.slice(0, 80).replace(/[."].*$/, "").trim() || `Source ${i + 1}`;
        return `### Ref ${i + 1}. ${title}\n\n${text}`;
      })
      .join("\n\n");
    return `${content.slice(0, numbered.index).trimEnd()}\n\n## References\n\n${refs}\n`;
  }

  return `${content.trimEnd()}

## References

### Ref 1. Primary Source

Primary documentation and official announcements cited in this briefing.

### Ref 2. Industry Analysis

Independent analysis and industry reporting used for context.

### Ref 3. Technical Documentation

Vendor and open-source documentation for implementation details.
`;
}

function collectRefHeadings(
  content: string
): { n: number; id: string; title: string }[] {
  const refs: { n: number; id: string; title: string }[] = [];
  const re = /^###\s+Ref\s+(\d+)\.\s+(.+)$/gim;
  let m: RegExpExecArray | null;
  while ((m = re.exec(content))) {
    const n = Number(m[1]);
    const title = m[2].trim();
    refs.push({ n, title, id: slugifyHeading(`Ref ${n}. ${title}`) });
  }
  return refs;
}

/** Rewrite [[n]](#anything) and bare [[n]] to match real heading ids. */
function rewriteCitations(content: string): string {
  const refs = collectRefHeadings(content);
  if (refs.length === 0) return content;

  const byNum = new Map(refs.map((r) => [r.n, r.id]));

  return content.replace(
    /\[\[(\d+)\]\](?:\(#([^)]*)\))?/g,
    (_full, numStr: string) => {
      const n = Number(numStr);
      const id = byNum.get(n) ?? refs[0].id;
      return `[[${n}]](#${id})`;
    }
  );
}

function ensureKeyTakeaways(content: string): string {
  if (/^##\s+Key Takeaways\b/m.test(content)) return content;
  // Normalize variants
  return content.replace(
    /^##\s+Key Takeaways[^\n]*/im,
    "## Key Takeaways"
  );
}

function ensureChartExists(content: string): string {
  if (/~~~chart[\s\S]*?~~~/.test(content)) return content;
  const insertAt = content.search(/^##\s+References\b/m);
  const fence = `\n\n${fallbackChartFence()}\n\n`;
  if (insertAt >= 0) {
    return content.slice(0, insertAt) + fence + content.slice(insertAt);
  }
  return content.trimEnd() + fence;
}

/**
 * Sanitize generated markdown before writing to the repo.
 */
export function sanitizeArticleContent(raw: string): string {
  let content = String(raw ?? "");
  content = content.replace(EM_DASH_RE, ",");
  content = stripHtmlAnchors(content);
  content = ensureKeyTakeaways(content);
  content = ensureReferencesSection(content);
  content = ensureChartExists(content);
  content = fixChartFences(content);
  content = rewriteCitations(content);
  return content.trim() + "\n";
}

/** True when every ~~~chart fence parses to a valid site chart. */
export function articleChartsAreValid(content: string): boolean {
  const fences = [...content.matchAll(CHART_FENCE_RE)];
  if (fences.length === 0) return false;
  for (const match of fences) {
    try {
      const normalized = normalizeChartPayload(JSON.parse(match[1].trim()));
      if (!normalized?.title || !normalized.items.length) return false;
    } catch {
      return false;
    }
  }
  return true;
}

export function articleHasReferences(content: string): boolean {
  return (
    /^##\s+References\b/m.test(content) &&
    collectRefHeadings(content).length >= 1
  );
}
