export type ArticleChartType = "bar" | "line" | "donut" | "hbar" | "timeline";

export type ArticleChartConfig = {
  type: ArticleChartType;
  title: string;
  source?: string;
  unit?: string;
  items: {
    label: string;
    value: number;
    display?: string;
    note?: string;
  }[];
};

const VALID_TYPES = new Set<ArticleChartType>([
  "bar",
  "line",
  "donut",
  "hbar",
  "timeline",
]);

function asNumber(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

/** Pull a JSON object from noisy LLM fence content. */
function extractJsonObject(raw: string): Record<string, unknown> | null {
  const trimmed = raw
    .trim()
    .replace(/^\uFEFF/, "")
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const tryParse = (text: string) => {
    try {
      return JSON.parse(text) as Record<string, unknown>;
    } catch {
      return null;
    }
  };

  const direct = tryParse(trimmed);
  if (direct && typeof direct === "object") return direct;

  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    return tryParse(trimmed.slice(start, end + 1));
  }
  return null;
}

/**
 * Accept site format and common LLM mistakes (missing title, Chart.js datasets).
 */
export function parseArticleChart(raw: string): ArticleChartConfig | null {
  try {
    const parsed = extractJsonObject(raw);
    if (!parsed) return null;

    const typeRaw = String(parsed.type ?? "bar").toLowerCase();
    const type = (
      VALID_TYPES.has(typeRaw as ArticleChartType) ? typeRaw : "bar"
    ) as ArticleChartType;

    const title =
      typeof parsed.title === "string" && parsed.title.trim()
        ? parsed.title.trim()
        : "Chart";

    let items: ArticleChartConfig["items"] = [];

    if (Array.isArray(parsed.items) && parsed.items.length > 0) {
      items = parsed.items.map((item, i) => {
        const row = (item ?? {}) as Record<string, unknown>;
        const label = String(row.label ?? row.name ?? `Item ${i + 1}`);
        const value = asNumber(row.value ?? row.y ?? row.count, i + 1);
        return {
          label,
          value,
          display:
            row.display != null
              ? String(row.display)
              : parsed.unit
                ? `${value}${parsed.unit}`
                : String(value),
          ...(row.note != null ? { note: String(row.note) } : {}),
        };
      });
    } else if (Array.isArray(parsed.datasets) && Array.isArray(parsed.labels)) {
      const labels = parsed.labels.map(String);
      const first = (parsed.datasets[0] ?? {}) as Record<string, unknown>;
      const data = Array.isArray(first.data) ? first.data : [];
      items = labels.map((label, i) => {
        const value = asNumber(data[i], 0);
        return { label, value, display: String(value) };
      });
    } else if (Array.isArray(parsed.data) && parsed.data.length > 0) {
      items = parsed.data.map((item, i) => {
        if (typeof item === "number") {
          return { label: `Item ${i + 1}`, value: item, display: String(item) };
        }
        const row = (item ?? {}) as Record<string, unknown>;
        const label = String(row.label ?? row.name ?? `Item ${i + 1}`);
        const value = asNumber(row.value ?? row.y, i + 1);
        return { label, value, display: String(row.display ?? value) };
      });
    }

    if (items.length === 0) return null;

    return {
      type,
      title,
      items,
      ...(typeof parsed.source === "string" ? { source: parsed.source } : {}),
      ...(typeof parsed.unit === "string" ? { unit: parsed.unit } : {}),
    };
  } catch {
    return null;
  }
}
