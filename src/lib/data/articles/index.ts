import type { BlogPost } from "@/types";
import { cloudAgentOrchestrationScalingLessonsArticle } from "./cloud-agent-orchestration-scaling-lessons-aug-29";
import { aiAgentsCloudDevToolsArticle } from "./ai-agents-cloud-dev-aug-27-2026";
import { nlpProductionPipelinesArticle } from "./nlp-production-pipelines-aug-26-2026";
import { aiAgentCloudIntegrationArticle } from "./ai-agents-cloud-integration-aug-24-2026";
import { domainSpecificNLPProductionArticle } from "./domain-nlp-production-aug-24-2026";
import { cloudAgentScalingLessonsArticle } from "./cloud-agent-scaling-lessons-aug-22";
import { advancesInClinicalNLPAndRagArticle } from "./clinical-nlp-rag-aug-22-2026";
import { nlpAgentSynergyArticle } from "./nlp-agent-synergy-aug-21-2026";
import { cloudAgentOrchestrationScalingLessonsArticle } from "./cloud-agent-scaling-lessons-aug-20-2026";
import { aiAgentCloudDevToolsShippingLessonsArticle } from "./ai-agents-cloud-dev-aug-19-2026";
import { august19NlpAgentsArticle } from "./aug19-nlp-agents-cloud";
import { aiAgentCloudIntegrationArticle as aiAgentCloudAug18Article } from "./ai-agent-cloud-aug-18-2026";
import { domainSpecificNlpProductionArticle } from "./domain-nlp-prod-aug-18-2026";
import { cloudAgentOrchestrationLessonsArticle as cloudAgentOrchestrationAug17Article } from "./cloud-agent-orchestration-aug-17";
import { advancesInDomainSpecificNLPArticle } from "./advances-domain-nlp-aug-17";
import { aiAgentCloudIntegrationArticle } from "./ai-agent-cloud-integration-august-16";
import { advancesInClinicalNLPaug16Article } from "./clinical-nlp-aug16";
import { nlpEvaluationMetricsArticle } from "./nlp-evaluation-metrics-august-15-2026";
import { cloudAgentOrchestrationLessonsArticle } from "./cloud-agent-orchestration-aug-14-2026";
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
  aiAgentsCloudDevToolsArticle,
  nlpProductionPipelinesArticle,
  domainSpecificNLPProductionArticle,
  cloudAgentScalingLessonsArticle,
  advancesInClinicalNLPAndRagArticle,
  nlpAgentSynergyArticle,
  cloudAgentOrchestrationScalingLessonsArticle,
  aiAgentCloudDevToolsShippingLessonsArticle,
  august19NlpAgentsArticle,
  aiAgentCloudAug18Article,
  domainSpecificNlpProductionArticle,
  cloudAgentOrchestrationAug17Article,
  advancesInDomainSpecificNLPArticle,
  aiAgentCloudIntegrationArticle,
  advancesInClinicalNLPaug16Article,
  nlpEvaluationMetricsArticle,
  cloudAgentOrchestrationLessonsArticle,
  productionNlpPipelinesArticle,
  nlpAgentIntegrationArticle,
  aiAgentAdvancementsArticle,
  euAiActAugust2026Article,
  clinicalBertHealthcareArticle,
  firebaseRealtimeLessonsArticle,
  pyqt5DashboardsArticle,
];
