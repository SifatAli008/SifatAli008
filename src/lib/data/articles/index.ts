import type { BlogPost } from "@/types";
import { euAiActAugust2026Article } from "./eu-ai-act-august-2-2026-agentic-ai";
import { clinicalBertHealthcareArticle } from "./clinicalbert-healthcare-ai";
import { firebaseRealtimeLessonsArticle } from "./firebase-realtime-lessons";
import { pyqt5DashboardsArticle } from "./pyqt5-modern-dashboards";

export { articleFaqsBySlug } from "@/lib/data/article-faqs";

/** Published long-form articles shipped with the codebase */
export const publishedArticles: Omit<BlogPost, "id">[] = [
  euAiActAugust2026Article,
  clinicalBertHealthcareArticle,
  firebaseRealtimeLessonsArticle,
  pyqt5DashboardsArticle,
];
