export const LOCALES = ["en", "bn"] as const;
export type Locale = (typeof LOCALES)[number];

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  bn: "বাং",
};

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "sifat-locale";

export type MessageKey =
  | "nav.about"
  | "nav.featured"
  | "nav.research"
  | "nav.faq"
  | "nav.projects"
  | "nav.github"
  | "nav.writing"
  | "nav.contact"
  | "nav.collaborate"
  | "blog.writing"
  | "blog.allEssays"
  | "blog.intro"
  | "blog.search"
  | "blog.searchPlaceholder"
  | "blog.topic"
  | "blog.allTopics"
  | "blog.essays"
  | "blog.essay"
  | "blog.page"
  | "blog.noMatch"
  | "blog.noMatchHint"
  | "blog.reset"
  | "blog.prev"
  | "blog.next"
  | "blog.min"
  | "article.minRead"
  | "article.toc"
  | "article.related"
  | "article.cite"
  | "article.jump"
  | "article.references"
  | "article.faq"
  | "article.keyTakeaways"
  | "article.langNote"
  | "lang.label";

type Dictionary = Record<MessageKey, string>;

const en: Dictionary = {
  "nav.about": "About",
  "nav.featured": "Featured",
  "nav.research": "Research",
  "nav.faq": "FAQ",
  "nav.projects": "Projects",
  "nav.github": "GitHub",
  "nav.writing": "Writing",
  "nav.contact": "Contact",
  "nav.collaborate": "Collaborate",
  "blog.writing": "Writing",
  "blog.allEssays": "All essays",
  "blog.intro":
    "Engineering notes on AI, RAG, Firebase, desktop tools, and shipping full-stack products. Practical architecture decisions, not fluff.",
  "blog.search": "Search",
  "blog.searchPlaceholder": "Search essays…",
  "blog.topic": "Topic",
  "blog.allTopics": "All topics",
  "blog.essays": "essays",
  "blog.essay": "essay",
  "blog.page": "Page",
  "blog.noMatch": "No essays matched",
  "blog.noMatchHint": "Try another topic or clear the search.",
  "blog.reset": "Reset filters",
  "blog.prev": "Prev",
  "blog.next": "Next",
  "blog.min": "min",
  "article.minRead": "min read",
  "article.toc": "Table of contents",
  "article.related": "Related",
  "article.cite": "Cite this",
  "article.jump": "Jump",
  "article.references": "References",
  "article.faq": "FAQ",
  "article.keyTakeaways": "Key takeaways",
  "article.langNote":
    "Article body stays in English for accuracy. UI language can change anytime.",
  "lang.label": "Language",
};

const bn: Dictionary = {
  "nav.about": "পরিচিতি",
  "nav.featured": "নির্বাচিত",
  "nav.research": "গবেষণা",
  "nav.faq": "প্রশ্নোত্তর",
  "nav.projects": "প্রজেক্ট",
  "nav.github": "GitHub",
  "nav.writing": "লেখা",
  "nav.contact": "যোগাযোগ",
  "nav.collaborate": "সহযোগিতা",
  "blog.writing": "লেখা",
  "blog.allEssays": "সব প্রবন্ধ",
  "blog.intro":
    "AI, RAG, Firebase, ডেস্কটপ টুলস এবং ফুল-স্ট্যাক শিপিং নিয়ে ইঞ্জিনিয়ারিং নোট। ব্যবহারিক আর্কিটেকচার, ফাঁকা কথা নয়।",
  "blog.search": "খুঁজুন",
  "blog.searchPlaceholder": "প্রবন্ধ খুঁজুন…",
  "blog.topic": "বিষয়",
  "blog.allTopics": "সব বিষয়",
  "blog.essays": "প্রবন্ধ",
  "blog.essay": "প্রবন্ধ",
  "blog.page": "পৃষ্ঠা",
  "blog.noMatch": "কোনো প্রবন্ধ মেলেনি",
  "blog.noMatchHint": "অন্য বিষয় চেষ্টা করুন বা সার্চ মুছে ফেলুন।",
  "blog.reset": "ফিল্টার রিসেট",
  "blog.prev": "আগে",
  "blog.next": "পরে",
  "blog.min": "মিনিট",
  "article.minRead": "মিনিট পড়া",
  "article.toc": "সূচিপত্র",
  "article.related": "সম্পর্কিত",
  "article.cite": "উদ্ধৃতি",
  "article.jump": "যান",
  "article.references": "তথ্যসূত্র",
  "article.faq": "প্রশ্নোত্তর",
  "article.keyTakeaways": "মূল পয়েন্ট",
  "article.langNote":
    "নির্ভুলতার জন্য প্রবন্ধের মূল লেখা ইংরেজিতেই থাকে। UI ভাষা যেকোনো সময় বদলাতে পারেন।",
  "lang.label": "ভাষা",
};

export const dictionaries: Record<Locale, Dictionary> = { en, bn };

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "bn";
}
