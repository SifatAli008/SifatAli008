import GithubSlugger from "github-slugger";

export type TocItem = {
  id: string;
  title: string;
  level: 2 | 3;
};

/** Extract H2/H3 headings for sidebar table of contents */
export function extractToc(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split("\n");
  const slugger = new GithubSlugger();

  for (const line of lines) {
    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2) {
      const title = h2[1].replace(/\*\*/g, "").trim();
      // Skip in-body TOC section if present
      if (/^table of contents$/i.test(title)) continue;
      items.push({ id: slugger.slug(title), title, level: 2 });
      continue;
    }
    if (h3) {
      const title = h3[1].replace(/\*\*/g, "").trim();
      items.push({ id: slugger.slug(title), title, level: 3 });
    }
  }

  return items;
}
