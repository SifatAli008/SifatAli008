/** FAQ copy only — do not import article body modules here. */
export const articleFaqsBySlug: Record<
  string,
  { question: string; answer: string }[]
> = {
  "cloud-agent-orchestration-scaling-lessons-august-14-2026": [
    {
      question: "What are the primary cloud cost concerns when deploying AI agents?",
      answer: "The primary cloud cost concerns revolve around the significant expense of LLM inference. This includes the cost per token, API calls, and GPU time, which can escalate rapidly with scale. Other factors include data storage, networking, and the compute required for agent state management and coordination.",
    },
    {
      question: "How can I improve the reliability and predictability of my AI agents?",
      answer: "Improving reliability involves implementing robust error handling and fallback mechanisms, ensuring consistent state management and persistence, developing strong guardrails and safety constraints, and conducting thorough testing and simulation. Understanding the probabilistic nature of LLMs and building systems that account for potential deviations is key.",
    },
    {
      question: "Which developer tools are most helpful for orchestrating AI agents?",
      answer: "Emerging frameworks like LangChain and LlamaIndex are crucial for chaining LLM calls, managing memory, and integrating tools. Enhanced observability and debugging tools are also vital for understanding agent behavior. Cloud provider services offering managed LLM endpoints and AI orchestration are also becoming increasingly important.",
    },
    {
      question: "What are the key metrics for measuring the success of an AI agent?",
      answer: "Key metrics include task completion rate (without human intervention), user satisfaction scores, quantifiable efficiency gains or cost savings achieved, and reduction in errors. Traditional metrics like uptime and latency are also important but don't capture the full effectiveness of an agent.",
    },
    {
      question: "Should AI agents always operate autonomously, or is a human in the loop necessary?",
      answer: "While full autonomy is the goal for many applications, a 'human in the loop' strategy remains beneficial. This can involve human supervision for critical decisions, agents assisting humans, or humans providing feedback for agent training. This approach enhances reliability, builds trust, and provides valuable data for continuous improvement.",
    },
    {
      question: "How does prompt engineering impact the cost and performance of AI agents?",
      answer: "Effective prompt engineering is critical. Concise and well-structured prompts can significantly reduce the number of tokens processed, thereby lowering inference costs. They also improve the quality and relevance of the LLM's output, directly impacting the agent's performance and ability to complete tasks successfully.",
    },
  ],
  "production-nlp-pipelines-august-14-2026": [
    {
      question: "What is the primary driver behind the evolution of production NLP pipelines?",
      answer: "The increasing sophistication and widespread adoption of AI agents are the primary drivers. These agents demand real-time, highly accurate, cost-effective, and explainable NLP capabilities, pushing pipelines towards more modular, scalable, and resilient architectures.",
    },
    {
      question: "How do microservices benefit production NLP pipelines?",
      answer: "Microservices break down complex NLP tasks into smaller, independent services. This allows for individual scaling, easier maintenance, independent deployment, and improved fault tolerance, making the entire pipeline more robust and flexible.",
    },
    {
      question: "What role do vector databases play in modern NLP production?",
      answer: "Vector databases are crucial for efficiently storing and retrieving high-dimensional embeddings. They are fundamental to Retrieval-Augmented Generation (RAG) systems, semantic search, and other applications where finding semantically similar information quickly is vital for grounding LLM responses.",
    },
    {
      question: "What are some key strategies for optimizing NLP inference costs?",
      answer: "Key strategies include model quantization and pruning (reducing model size), knowledge distillation (training smaller models), dynamic batching (processing multiple requests simultaneously), and strategic cloud resource allocation (e.g., using serverless or reserved instances).",
    },
    {
      question: "Why is explainability important for production NLP, especially with AI agents?",
      answer: "As AI agents take on more critical roles, understanding *why* an NLP model made a particular decision is essential for building trust, debugging errors, ensuring regulatory compliance, and identifying potential biases. Tools like LIME and SHAP provide these crucial insights.",
    },
    {
      question: "How can data drift impact an NLP pipeline and how is it managed?",
      answer: "Data drift, or changes in the distribution of input data over time, can significantly degrade an NLP model's performance. It's managed through continuous monitoring of data statistics, automated data validation, and triggering model retraining when significant drift is detected to ensure the model remains relevant and accurate.",
    },
  ],
  "nlp-agent-synergy-august-13-2026": [
    {
      question: "How does RAG help NLP agents stay accurate?",
      answer:
        "Retrieval-Augmented Generation pulls relevant documents into the prompt before generation, so agents ground answers in retrieved context instead of relying only on model memory. That reduces hallucinations and supports private or frequently updated knowledge bases.",
    },
    {
      question: "Why use domain-specific NLP models like ClinicalBERT?",
      answer:
        "General LLMs often miss specialized vocabulary and norms. Domain models and fine-tunes improve precision for healthcare, finance, and legal text where terminology and risk tolerance differ from open-web language.",
    },
    {
      question: "What cloud pieces matter most for production NLP agents?",
      answer:
        "Plan for scalable inference (often GPU), a managed or self-hosted vector store for RAG, container orchestration for agent services, and observability for latency, cost, and task success rates.",
    },
    {
      question: "How should teams allocate effort when shipping an NLP agent?",
      answer:
        "Expect most work in model/data quality and RAG preparation, then orchestration logic, with smaller but essential shares for deployment and continuous evaluation. Skipping evaluation usually creates silent production failures.",
    },
    {
      question: "What is a practical first use case for founders?",
      answer:
        "Pick one high-value workflow with clear success criteria, such as support ticket summarization or internal doc Q&A. Ship a RAG-backed agent with human review before expanding autonomy.",
    },
  ],
  "ai-agent-advancements-august-13-2026": [
    {
      question: "What is the primary difference between current AI agents and earlier AI systems?",
      answer: "Current AI agents, especially those leveraging LLMs and advanced planning, can autonomously perceive, reason, and act to achieve complex, multi-step goals. Earlier AI systems were typically limited to narrow, pre-defined tasks with less adaptability and independent decision-making capability.",
    },
    {
      question: "How are AI agents impacting the role of software developers?",
      answer: "AI agents are increasingly assisting developers by automating code generation, debugging, testing, and even project management. This allows developers to focus on higher-level design and innovation, potentially accelerating development cycles significantly.",
    },
    {
      question: "What kind of cloud infrastructure is most crucial for deploying AI agents?",
      answer: "Deploying advanced AI agents often requires scalable compute resources, particularly GPUs and specialized AI accelerators for training and inference. Efficient, low-latency storage and integration with edge computing solutions are also becoming increasingly important, depending on the agent's application.",
    },
    {
      question: "What are the biggest safety concerns with AI agents?",
      answer: "The primary safety concerns revolve around ensuring agents operate reliably, predictably, and ethically. This includes preventing unintended harmful actions, ensuring robustness against adversarial attacks, and building trust through explainable decision-making processes.",
    },
    {
      question: "Are AI agents currently cost-prohibitive for small businesses?",
      answer: "While the computational resources for advanced AI agents can be substantial, the cost is decreasing due to hardware advancements and more efficient software. Emerging tools and platforms are also aiming to make AI agent technology more accessible, though significant operational costs can still be a factor for complex, large-scale deployments.",
    },
    {
      question: "What is the 'ReAct' framework in AI agents?",
      answer: "ReAct stands for Reasoning and Acting. It's an architectural framework that allows AI agents to interleave thought processes (reasoning) with the execution of actions using external tools. This synergy helps agents tackle more complex problems by combining LLM-based reasoning with practical task execution.",
    },
  ],
  "eu-ai-act-august-2-2026-agentic-ai-enterprise-governance": [
    {
      question: "Does the EU AI Act fully apply on 2 August 2026?",
      answer:
        "The Regulation's general application date is 2 August 2026, but obligations remain staggered. Key high-risk Chapter III duties were moved by the Digital Omnibus to later dates, notably December 2027 and August 2028 for many systems.",
    },
    {
      question: "Did high-risk AI rules get delayed?",
      answer:
        "Yes. Official Omnibus text and major law-firm analyses state that Annex III high-risk obligations apply from 2 December 2027, and many Annex I high-risk obligations from 2 August 2028, instead of the original August 2026 high-risk target.",
    },
    {
      question: "What is agentic AI in enterprise terms?",
      answer:
        "Agentic AI refers to AI systems that can pursue goals through multi-step plans and tool use, not only generate text. Enterprises pair these systems with registries, identity controls, and gateways so actions remain observable and reversible.",
    },
    {
      question: "What did Manulife announce with Microsoft?",
      answer:
        "A five-year expansion on 22 July 2026 covering Frontier Suite adoption, Copilot for more than 30,000 employees, and Microsoft Agent 365 as an enterprise agent control plane, plus reported AI value and productivity metrics.",
    },
    {
      question: "How did OpenAI change GPT-5.6 pricing in late July 2026?",
      answer:
        "On 30 July 2026, OpenAI reduced Luna pricing by 80% and Terra by 20%, listing Luna at $0.20/$1.20 and Terra at $2/$12 per million input/output tokens.",
    },
    {
      question: "What should startups do this month?",
      answer:
        "Inventory AI systems, classify risk, add tool-call logging, avoid overclaiming agents, and put Omnibus dates on the compliance calendar, especially transparency and new prohibition reviews before December 2026.",
    },
  ],
  "building-ai-healthcare-systems-clinicalbert": [
    {
      question: "Is ClinicalBERT better than GPT for all healthcare tasks?",
      answer:
        "No. Use ClinicalBERT-style encoders for structured prediction and retrieval features. Use LLMs carefully for drafting with grounding and human review.",
    },
    {
      question: "Do I need MIMIC access to start?",
      answer:
        "Not always. You can fine-tune on licensed institutional notes or public clinical datasets your counsel approves. Never train on PHI without legal clearance.",
    },
    {
      question: "What is the fastest path to a useful pilot?",
      answer:
        "Pick one narrow task such as negation-aware symptom flags, ship explanations plus CSV export, and measure clinician override rate before expanding scope.",
    },
    {
      question: "How should we handle notes longer than 512 tokens?",
      answer:
        "Use section-aware splits when possible, otherwise overlapping windows with an explicit aggregation rule. Log which chunk drove the final score.",
    },
    {
      question: "What monitoring matters after go-live?",
      answer:
        "Override rate, confidence calibration drift, null/error rate, p95 latency, and input mix shifts by specialty or site.",
    },
  ],
  "real-time-firebase-lessons": [
    {
      question: "Realtime Database or Firestore for a new app?",
      answer:
        "Start with Firestore for most CRUD and queries. Add Realtime Database for presence or ultra-chatty paths if needed.",
    },
    {
      question: "How do I stop read costs exploding?",
      answer:
        "Bound listeners, cache aggressively, denormalize list views, and throttle writes. Watch the Usage tab weekly during growth.",
    },
    {
      question: "Can I rely on client validation alone?",
      answer:
        "No. Client validation is UX. Security rules and App Check are the real control plane.",
    },
    {
      question: "How often should a tracking app write location?",
      answer:
        "Prefer meaningful movement or a 2 to 5 second throttle, not a fixed 1 Hz stream. Split public presence from private payloads.",
    },
    {
      question: "What belongs in Cloud Functions vs the client?",
      answer:
        "Use Functions for trusted fan-out, aggregations, and privilege-sensitive writes. Keep clients on least-privilege paths enforced by rules.",
    },
  ],
  "designing-pyqt5-dashboards": [
    {
      question: "Should I use PyQt5 or PySide6 for a new project?",
      answer:
        "PySide6 tracks current Qt and has different licensing. PyQt5 remains common in existing codebases. For greenfield, evaluate PySide6; the UX patterns in this article still apply.",
    },
    {
      question: "Can I make it look exactly like a web app?",
      answer:
        "Close enough for operators. Prioritize clarity and speed over pixel-perfect CSS-style animation.",
    },
    {
      question: "How do I handle large tables?",
      answer:
        "Use model/view virtualization, paginate or window rows, and avoid one widget per cell for huge datasets.",
    },
    {
      question: "Why does my UI freeze during refresh?",
      answer:
        "Work is likely on the GUI thread. Move fetch and transform to a worker, emit a view model, and update widgets only on the GUI thread.",
    },
    {
      question: "How do I keep charts smooth with live data?",
      answer:
        "Update series in place, downsample, and avoid reconstructing the chart widget on every tick. Prefer pyqtgraph when scientific speed matters.",
    },
  ],
};
