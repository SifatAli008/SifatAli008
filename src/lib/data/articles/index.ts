import type { BlogPost } from "@/types";
import { productionNlpPipelinesArticle } from "./production-nlp-pipelines-aug-14-2026";
import { nlpAgentIntegrationArticle } from "./nlp-agent-aug13";
import { aiAgentAdvancementsArticle } from "./ai-agents-aug-13-2026";
import { euAiActAugust2026Article } from "./eu-ai-act-august-2-2026-agentic-ai";
import { clinicalBertHealthcareArticle } from "./clinicalbert-healthcare-ai";
import { firebaseRealtimeLessonsArticle } from "./firebase-realtime-lessons";
import { pyqt5DashboardsArticle } from "./pyqt5-modern-dashboards";

export { articleFaqsBySlug } from "@/lib/data/article-faqs";

/** Published long-form articles shipped with the codebase */
export const publishedArticles: Omit<BlogPost, "id">[] = [
  productionNlpPipelinesArticle,
  nlpAgentIntegrationArticle,
  aiAgentAdvancementsArticle,
  euAiActAugust2026Article,
  clinicalBertHealthcareArticle,
  firebaseRealtimeLessonsArticle,
  pyqt5DashboardsArticle,
];
