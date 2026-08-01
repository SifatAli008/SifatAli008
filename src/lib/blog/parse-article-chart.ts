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

export function parseArticleChart(raw: string): ArticleChartConfig | null {
  try {
    const parsed = JSON.parse(raw) as ArticleChartConfig;
    if (
      !parsed?.type ||
      !parsed?.title ||
      !Array.isArray(parsed.items) ||
      parsed.items.length === 0
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}
