import type { ArticleLangCode } from "@/lib/blog/article-languages";

const FONT_LINKS: Partial<
  Record<ArticleLangCode, { id: string; href: string }>
> = {
  bn: {
    id: "font-noto-sans-bengali",
    href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap",
  },
};

/**
 * Injects a script-specific webfont only when that language is first used.
 * English / other pages never pay the download cost.
 */
export function ensureArticleScriptFont(lang: ArticleLangCode) {
  if (typeof document === "undefined") return;
  const spec = FONT_LINKS[lang];
  if (!spec) return;
  if (document.getElementById(spec.id)) return;

  if (!document.getElementById("font-googleapis-preconnect")) {
    const pre1 = document.createElement("link");
    pre1.id = "font-googleapis-preconnect";
    pre1.rel = "preconnect";
    pre1.href = "https://fonts.googleapis.com";
    document.head.appendChild(pre1);

    const pre2 = document.createElement("link");
    pre2.id = "font-gstatic-preconnect";
    pre2.rel = "preconnect";
    pre2.href = "https://fonts.gstatic.com";
    pre2.crossOrigin = "anonymous";
    document.head.appendChild(pre2);
  }

  const link = document.createElement("link");
  link.id = spec.id;
  link.rel = "stylesheet";
  link.href = spec.href;
  document.head.appendChild(link);
}
