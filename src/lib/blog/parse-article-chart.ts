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

/**
 * Accept site format and common LLM mistakes (Chart.js datasets, missing title).
 */
export function parseArticleChart(raw: string): ArticleChartConfig | null {
  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    if (!parsed || typeof parsed !== "object") return null;

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
