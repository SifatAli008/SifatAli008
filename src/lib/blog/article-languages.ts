export const ARTICLE_LANGUAGES = [
  {
    code: "en",
    label: "English",
    native: "EN",
    rtl: false,
    script: "latn",
    /** BCP 47 / hreflang */
    hreflang: "en",
    /** Open Graph locale */
    ogLocale: "en_US",
    schemaLanguage: "en-US",
  },
  {
    code: "bn",
    label: "Bangla",
    native: "বাংলা",
    rtl: false,
    script: "beng",
    hreflang: "bn",
    ogLocale: "bn_BD",
    schemaLanguage: "bn-BD",
  },
  {
    code: "hi",
    label: "Hindi",
    native: "हिन्दी",
    rtl: false,
    script: "deva",
    hreflang: "hi",
    ogLocale: "hi_IN",
    schemaLanguage: "hi-IN",
  },
  {
    code: "ar",
    label: "Arabic",
    native: "العربية",
    rtl: true,
    script: "arab",
    hreflang: "ar",
    ogLocale: "ar_SA",
    schemaLanguage: "ar",
  },
  {
    code: "es",
    label: "Spanish",
    native: "ES",
    rtl: false,
    script: "latn",
    hreflang: "es",
    ogLocale: "es_ES",
    schemaLanguage: "es-ES",
  },
] as const;

export type ArticleLangCode = (typeof ARTICLE_LANGUAGES)[number]["code"];

export const TRANSLATABLE_ARTICLE_LANGS = ARTICLE_LANGUAGES.filter(
  (l) => l.code !== "en"
).map((l) => l.code);

export function isArticleLang(value: string): value is ArticleLangCode {
  return ARTICLE_LANGUAGES.some((l) => l.code === value);
}

export function isTranslatableArticleLang(
  value: string
): value is Exclude<ArticleLangCode, "en"> {
  return TRANSLATABLE_ARTICLE_LANGS.includes(
    value as Exclude<ArticleLangCode, "en">
  );
}

export function articleLangMeta(code: ArticleLangCode) {
  return ARTICLE_LANGUAGES.find((l) => l.code === code)!;
}

/** Latin display fonts (Bebas) lack Bangla glyphs — only uppercase Latin titles. */
export function shouldUppercaseTitle(code: ArticleLangCode) {
  return articleLangMeta(code).script === "latn";
}

/** Canonical path for an article language variant. English has no suffix. */
export function articlePath(slug: string, lang: ArticleLangCode = "en") {
  return lang === "en" ? `/blog/${slug}` : `/blog/${slug}/${lang}`;
}

/** hreflang map for Next.js Metadata.alternates.languages */
export function articleHrefLangMap(slug: string): Record<string, string> {
  const map: Record<string, string> = {
    "x-default": articlePath(slug, "en"),
  };
  for (const lang of ARTICLE_LANGUAGES) {
    map[lang.hreflang] = articlePath(slug, lang.code);
  }
  return map;
}
