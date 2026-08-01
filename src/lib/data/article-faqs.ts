/** FAQ copy only — do not import article body modules here. */
export const articleFaqsBySlug: Record<
  string,
  { question: string; answer: string }[]
> = {
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
