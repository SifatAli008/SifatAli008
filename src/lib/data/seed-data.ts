import type {
  Achievement,
  BlogPost,
  Experience,
  Profile,
  Project,
  Skill,
} from "@/types";
import { assetUrl } from "@/lib/cloudinary/assets";

const now = new Date().toISOString();

export const seedProfile: Profile = {
  name: "Sifat Ali",
  tagline: "AI/RAG Systems Engineer & Full-Stack Builder",
  headline:
    "COO @ Fluvo Soft · Building scalable AI-automation systems and full-stack products from concept to scale.",
  bio: "Technical founder and engineer with 5+ years in software development. 2× National Hackathon Winner. Shipped Web, EdTech, Bioinformatics, and AI-powered tools across Bangladesh and beyond.",
  aboutStory: `I'm Sifat Ali - COO at Fluvo Soft and an engineer who builds at the intersection of AI/RAG systems, full-stack architecture, and community-driven product delivery.

Over 5+ years I've shipped products from concept to scale: web platforms, EdTech systems, bioinformatics research tooling, and AI-powered automation. I'm a 2× National Hackathon Winner (InnovateX 2025, NextGen Hackathon @ IIUC Tech Fest) and bring that same execution energy to every sprint.

At Fluvo Soft, I align product, engineering, and business operations to deliver high-standard SaaS, web, mobile, and AI systems. At UIU Developers Hub, I build tools like PyDItor and Sir Kothay while mentoring students on React.js, Python, and AI. Previously at Shohoz Skill, I managed 21+ developers, led 12 bootcamps for 300+ students, and built CMS-powered learning platforms that improved course completion by 65%.

I hold a B.Sc. in Computer Science from United International University and care deeply about measurable impact, teaching what I ship, and systems that outlive hype cycles.`,
  engineeringPhilosophy:
    "Integrate technology, business, and people - ship iteratively, measure relentlessly, and build systems that solve real-world problems at scale.",
  values: [
    "AI-automation with production discipline",
    "Teaching as a force multiplier",
    "Community-driven engineering",
    "Product craft with technical depth",
    "Operations that scale teams",
  ],
  email: "sifatali008@gmail.com",
  phone: "+880 1315-576968",
  address: "249/2 South Jatrabari, Dhaka-1204",
  location: "Dhaka, Bangladesh",
  timezone: "GMT+6",
  education: "B.Sc. Computer Science - United International University",
  responseTime: "Within 24–48 hours",
  availableForWork: true,
  avatar: assetUrl("/assets/images/profile-image.jpeg"),
  resumeUrl: "/resume.pdf",
  socials: {
    github: "https://github.com/SifatAli008",
    linkedin: "https://www.linkedin.com/in/sifat-ali/",
    leetcode: "https://leetcode.com/SifatAli008/",
    medium: "https://medium.com/@sifatali008",
  },
  stats: {
    projectsBuilt: 25,
    studentsMentored: 300,
    eventsOrganized: 12,
    yearsExperience: 5,
    hackathonWins: 2,
    bootcampsLed: 12,
    clientsServed: 500,
    leetcode: {
      solved: 100,
      easy: 45,
      medium: 48,
      hard: 7,
    },
  },
  metrics: {
    yearlyImpact: [
      { year: 2019, label: "Freelance start", value: 40 },
      { year: 2021, label: "Shohoz Skill AMD", value: 65 },
      { year: 2023, label: "UIU Dev Hub", value: 80 },
      { year: 2024, label: "AI healthcare", value: 90 },
      { year: 2025, label: "2× hackathon wins", value: 95 },
      { year: 2026, label: "COO Fluvo Soft", value: 100 },
    ],
    activityMix: [
      { label: "BUILD", value: 35 },
      { label: "TEACH", value: 28 },
      { label: "LEET", value: 22 },
      { label: "OPS", value: 15 },
    ],
  },
  typewriterRoles: [
    "COO @ Fluvo Soft",
    "AI/RAG Systems Engineer",
    "Full-Stack Builder",
    "Community Coordinator",
    "2× Hackathon Winner",
  ],
  domains: ["EdTech", "MedTech", "SaaS", "AI"],
};

export const seedProjects: Omit<Project, "id">[] = [
  {
    slug: "smart-shop-manager",
    title: "Smart Shop Manager",
    tagline: "AI-powered retail operations with real-time sync",
    description:
      "Desktop retail management system with AI inventory forecasting, barcode scanning, role-based auth, and Firebase realtime sync.",
    category: "Desktop",
    techStack: ["PyQt5", "Firebase", "Python", "OpenCV"],
    status: "completed",
    featured: true,
    order: 1,
    githubUrl: "https://github.com/SifatAli008",
    challenge:
      "Small retailers lacked affordable tools combining inventory intelligence with offline-capable desktop UX.",
    process:
      "Mapped retail workflows, designed role-based auth layers, integrated barcode pipeline, and connected Firebase for multi-terminal sync.",
    architecture:
      "PyQt5 MVC shell → Python service layer → Firebase Realtime DB + Cloud Functions for sync events.",
    features: [
      "AI inventory forecasting",
      "Barcode scan pipeline",
      "Role-based authentication",
      "Realtime multi-terminal sync",
      "Sales analytics dashboard",
    ],
    technicalDecisions:
      "Chose PyQt5 for native desktop performance; Firebase for rapid realtime without ops overhead.",
    results:
      "Reduced stock reconciliation time by 60% in pilot stores; 3 role tiers deployed across 5 terminals.",
    createdAt: now,
    updatedAt: now,
  },
  {
    slug: "ai-health-diagnosis-system",
    title: "AI Health Diagnosis System",
    tagline: "ClinicalBERT-powered diagnostic assistance",
    description:
      "Healthcare AI system using ClinicalBERT for symptom analysis, predictive insights, and exportable clinical reports - bioinformatics & research aligned.",
    category: "AI",
    techStack: ["ClinicalBERT", "Python", "Pandas", "FastAPI"],
    status: "completed",
    featured: true,
    order: 2,
    challenge:
      "Bridge gap between raw patient symptom data and clinician-ready insights without black-box predictions.",
    process:
      "Fine-tuned ClinicalBERT on domain corpora, built validation pipeline, designed explainable output cards.",
    architecture:
      "FastAPI inference API → ClinicalBERT encoder → scoring + report generator → export module.",
    features: [
      "Symptom-to-condition ranking",
      "Confidence scoring",
      "PDF/CSV export",
      "Dataset validation hooks",
    ],
    technicalDecisions:
      "ClinicalBERT over general BERT for medical vocabulary coverage; Pandas for reproducible preprocessing.",
    results: "92% top-3 condition accuracy on validation set; export used in 3 research demos.",
    createdAt: now,
    updatedAt: now,
  },
  {
    slug: "synthetic-data-schema-generator",
    title: "Synthetic Data Schema Generator",
    tagline: "ML-ready healthcare datasets with schema validation",
    description:
      "Generates validated synthetic healthcare records using ClinicalBERT embeddings and Faker for ML training pipelines.",
    category: "AI",
    techStack: ["ClinicalBERT", "Faker", "Pandas", "Python"],
    status: "completed",
    featured: false,
    order: 3,
    challenge:
      "Healthcare ML projects stall on privacy-compliant, schema-valid training data.",
    process:
      "Defined JSON schema contracts, built Faker generators aligned to ClinicalBERT feature spaces.",
    architecture: "Schema engine → Generator workers → Validation + export to Parquet/CSV.",
    features: [
      "Schema validation",
      "Configurable record volume",
      "ClinicalBERT feature alignment",
      "Export pipelines",
    ],
    results: "Generated 50K+ validated records for 2 university research projects.",
    createdAt: now,
    updatedAt: now,
  },
  {
    slug: "pyditor",
    title: "PyDItor",
    tagline: "Lightweight Python IDE for UIU Developers Hub",
    description:
      "Desktop Python IDE with syntax highlighting, integrated execution panel, and file explorer - built to enhance learning and collaboration at UIU Developers Hub.",
    category: "Tool",
    techStack: ["Python", "PyQt5", "QScintilla"],
    status: "completed",
    featured: false,
    order: 4,
    githubUrl: "https://github.com/SifatAli008",
    challenge: "Students needed a frictionless IDE without heavyweight setup.",
    process: "Built modular editor core with sandboxed execution and file tree navigation.",
    features: ["Syntax highlighting", "Execution panel", "File explorer", "Theme support"],
    createdAt: now,
    updatedAt: now,
  },
  {
    slug: "sir-kothay",
    title: "Sir Kothay",
    tagline: "Location-intelligent service discovery for campus",
    description:
      "Node.js web platform for service discovery with PostgreSQL-backed search and location intelligence - a UIU Developers Hub community tool.",
    category: "Web",
    techStack: ["Node.js", "PostgreSQL", "Leaflet", "Redis"],
    status: "completed",
    featured: false,
    order: 5,
    githubUrl: "https://github.com/SifatAli008",
    challenge: "Users struggled to find verified local services with geospatial relevance.",
    process: "Designed PostGIS queries, ranking algorithm, and admin moderation flows.",
    features: ["Geo search", "Service listings", "Reviews", "Admin dashboard"],
    results: "1.2K+ services indexed; avg search latency under 180ms.",
    createdAt: now,
    updatedAt: now,
  },
  {
    slug: "live-bus-tracker",
    title: "Live Bus Tracker",
    tagline: "Real-time transit tracking with Firebase",
    description:
      "Mobile-first bus tracking app with GPS updates, Firebase Realtime DB, and Uber-inspired UX patterns.",
    category: "Mobile",
    techStack: ["Firebase", "GPS", "React Native", "Realtime DB"],
    status: "completed",
    featured: false,
    order: 6,
    challenge: "Commuters lacked reliable live arrival estimates for university routes.",
    process: "Implemented GPS polling, ETA smoothing, and map-first mobile UI.",
    features: ["Live GPS tracking", "ETA predictions", "Route favorites", "Push alerts"],
    results: "500+ daily active users during campus pilot; 94% location accuracy.",
    createdAt: now,
    updatedAt: now,
  },
  {
    slug: "ascendx",
    title: "AscendX",
    tagline: "RPG-inspired life operating system",
    description:
      "Next.js + Firebase product gamifying habits with XP, levels, quests, and streak mechanics.",
    category: "Web",
    techStack: ["Next.js", "Firebase", "TypeScript", "Framer Motion"],
    status: "in-progress",
    featured: false,
    order: 7,
    challenge: "Habit apps lack long-term engagement without meaningful progression systems.",
    process: "Designed RPG progression loops, quest engine, and Firebase-backed user state.",
    features: ["XP & levels", "Daily quests", "Habit streaks", "Achievement badges"],
    createdAt: now,
    updatedAt: now,
  },
  {
    slug: "pixel-office-unity",
    title: "Pixel Office",
    tagline: "2D Unity prototype · campus workplace sim",
    description:
      "Unity 2D project with tilemaps, character controller, and interactable office scenes - built as a UIU Developers Hub experiment.",
    category: "Game",
    techStack: ["Unity", "C#", "2D Tilemaps", "Animator"],
    status: "in-progress",
    featured: true,
    order: 8,
    coverImage: assetUrl("/assets/pixel art/office.gif"),
    challenge: "Ship a charming playable space without a full art pipeline.",
    process: "Pixel art assets, scene blocking, and input-driven interaction loops in Unity.",
    features: ["Top-down movement", "Interactables", "Scene transitions", "Event-ready build"],
    createdAt: now,
    updatedAt: now,
  },
];

export const seedSkills: Omit<Skill, "id">[] = [
  { name: "TypeScript", category: "Frontend", icon: "typescript", proficiency: 95, order: 1 },
  { name: "Next.js", category: "Frontend", icon: "react", proficiency: 94, order: 2 },
  { name: "Tailwind CSS", category: "Frontend", icon: "tailwind", proficiency: 95, order: 3 },
  { name: "React.js", category: "Frontend", icon: "react", proficiency: 92, order: 4 },
  { name: "Framer Motion", category: "Frontend", icon: "motion", proficiency: 85, order: 5 },
  { name: "Node.js", category: "Backend", icon: "node", proficiency: 88, order: 6 },
  { name: "Firebase", category: "Backend", icon: "firebase", proficiency: 90, order: 7 },
  { name: "Python", category: "AI & Data", icon: "python", proficiency: 94, order: 8 },
  { name: "TensorFlow", category: "AI & Data", icon: "brain", proficiency: 84, order: 9 },
  { name: "RAG", category: "AI & Data", icon: "brain", proficiency: 90, order: 10 },
  { name: "AI / RAG Systems", category: "AI & Data", icon: "brain", proficiency: 88, order: 11 },
  { name: "ClinicalBERT / NLP", category: "AI & Data", icon: "brain", proficiency: 86, order: 12 },
  { name: "Pandas / NumPy", category: "AI & Data", icon: "chart", proficiency: 88, order: 13 },
  { name: "WordPress", category: "CMS", icon: "wordpress", proficiency: 88, order: 14 },
  { name: "Elementor", category: "CMS", icon: "elementor", proficiency: 86, order: 15 },
  { name: "PyQt5", category: "Tools", icon: "desktop", proficiency: 85, order: 16 },
  { name: "Git / CI", category: "Tools", icon: "git", proficiency: 90, order: 17 },
  { name: "Docker", category: "Tools", icon: "docker", proficiency: 86, order: 18 },
  { name: "Unity", category: "Games", icon: "unity", proficiency: 80, order: 19 },
  { name: "C#", category: "Games", icon: "csharp", proficiency: 78, order: 20 },
];

export const seedExperience: Omit<Experience, "id">[] = [
  {
    company: "Fluvo Soft",
    role: "Chief Operating Officer (COO)",
    duration: "Jan 2026 - Present",
    location: "Dhaka, Bangladesh",
    description:
      "Leading operations at Fluvo Soft - aligning product, engineering, and business to deliver scalable web, mobile, AI, and SaaS solutions.",
    impact: [
      "Orchestrate cross-functional delivery across product, engineering, and business",
      "Drive high-standard SaaS offerings aligned to client requirements",
      "Integrate technology, business, and teams for steady growth",
    ],
    stack: ["Next.js", "TypeScript", "AI/RAG", "SaaS Operations"],
    order: 1,
  },
  {
    company: "UIU Developers Hub",
    role: "Developer & Community Coordinator",
    duration: "Oct 2024 - Present",
    location: "United International University · United City R/A",
    description:
      "Building community tools (PyDItor, Sir Kothay) and coordinating events, content, and technical mentorship for students and faculty.",
    impact: [
      "Shipped PyDItor and Sir Kothay to enhance learning and collaboration",
      "Mentor students on React.js, Python, and AI",
      "Grow the community through events and shared resources",
    ],
    stack: ["React.js", "Python", "PyQt5", "Node.js", "Community Ops"],
    order: 2,
  },
  {
    company: "Shohoz Skill",
    role: "Assistant Managing Director",
    duration: "Apr 2021 - Nov 2022",
    location: "Dhaka, Bangladesh",
    description:
      "Managed developer bootcamp programs and built CMS-powered learning platforms at Shohoz Skill.",
    impact: [
      "Managed 21+ developers through structured bootcamp programs",
      "Built React + CMS learning platform; improved course completion by 65%",
      "Scaled instructional operations across multiple cohorts",
    ],
    stack: ["React", "CMS", "Team Management", "EdTech"],
    order: 3,
  },
  {
    company: "Shohoz Skill",
    role: "Web Development Instructor",
    duration: "Feb 2019 - Apr 2021",
    location: "Jatrabari, Dhaka",
    description:
      "Developed frontend curriculum adopted by corporate training programs and led intensive bootcamps.",
    impact: [
      "Led 12 bootcamps serving 300+ students",
      "Frontend curriculum adopted by corporate training partners",
      "Hands-on React and modern web stack instruction",
    ],
    stack: ["HTML/CSS/JS", "React", "Curriculum Design"],
    order: 4,
  },
  {
    company: "Freelance",
    role: "Frontend Developer",
    duration: "Feb 2019 - Apr 2022",
    location: "Remote",
    description:
      "Delivered frontend solutions for global and local clients with a focus on growth and operational scalability.",
    impact: [
      "Acquired and managed 500+ global and local clients",
      "Drove business growth through strategic operational support",
      "Shipped production UIs across diverse product domains",
    ],
    stack: ["React", "JavaScript", "UI/UX", "Client Delivery"],
    order: 5,
  },
];

export const seedAchievements: Omit<Achievement, "id">[] = [
  {
    title: "2× National Hackathon Winner",
    description: "InnovateX Hackathon 2025 and NextGen Hackathon @ IIUC Tech Fest.",
    year: 2025,
    category: "Achievement",
    metrics: { wins: 2 },
    order: 1,
  },
  {
    title: "COO @ Fluvo Soft",
    description: "Leading operations for scalable AI, web, mobile, and SaaS delivery.",
    year: 2026,
    category: "Job",
    metrics: {},
    order: 2,
  },
  {
    title: "UIU Developers Hub - Community Builder",
    description: "Developer & Community Coordinator building PyDItor, Sir Kothay, and mentorship programs.",
    year: 2024,
    category: "Community",
    metrics: { tools: 2 },
    order: 3,
  },
  {
    title: "Shohoz Skill - 300+ Students Trained",
    description: "Led 12 bootcamps and improved course completion by 65% on CMS platform.",
    year: 2021,
    category: "Learning",
    metrics: { bootcamps: 12, students: 300 },
    order: 4,
  },
  {
    title: "Google Analytics & Digital Marketing",
    description: "Google Analytics Academy and Fundamental of Digital Marketing certifications.",
    year: 2024,
    category: "Learning",
    metrics: { certs: 2 },
    order: 5,
  },
  {
    title: "Prompt Engineering Certification",
    description: "Smarter Use of AI for Everyone - production-minded AI literacy.",
    year: 2024,
    category: "Research",
    metrics: {},
    order: 6,
  },
  {
    title: "B.Sc. Computer Science - UIU",
    description: "United International University, Computer Science.",
    year: 2022,
    category: "Achievement",
    metrics: {},
    order: 7,
  },
];

export const seedBlogPosts: Omit<BlogPost, "id">[] = [
  {
    slug: "building-ai-healthcare-systems-clinicalbert",
    title: "Building AI Healthcare Systems with ClinicalBERT",
    excerpt:
      "How to architect explainable healthcare AI with ClinicalBERT, validation pipelines, and clinician-ready exports.",
    content: `## Introduction

Healthcare AI demands more than accuracy - it demands trust, explainability, and rigorous validation.

## Architecture

We use a three-layer pipeline: ingestion → ClinicalBERT inference → explainable scoring.

## Lessons Learned

- Domain-specific models outperform general LLMs for medical vocabulary
- Export formats matter as much as model metrics
- Always pair predictions with confidence intervals

## Conclusion

ClinicalBERT is a force multiplier when embedded in disciplined engineering workflows.`,
    tags: ["AI", "Healthcare", "ClinicalBERT"],
    status: "draft",
    readingTime: 6,
    createdAt: now,
    updatedAt: now,
  },
  {
    slug: "real-time-firebase-lessons",
    title: "Real-Time Firebase Lessons from Production",
    excerpt:
      "Patterns for Realtime Database sync, security rules, and scaling live tracking apps.",
    content: `## Why Firebase

Speed to market without sacrificing realtime guarantees.

## Key Patterns

- Optimistic UI with conflict resolution
- Geo-indexed listeners for tracking apps
- Security rules as your first line of defense

## Pitfalls

Avoid unbounded listeners and always structure data for query patterns.`,
    tags: ["Firebase", "Backend"],
    status: "draft",
    readingTime: 5,
    createdAt: now,
    updatedAt: now,
  },
  {
    slug: "designing-pyqt5-dashboards",
    title: "Designing PyQt5 Dashboards That Feel Modern",
    excerpt:
      "Bringing SaaS-grade UX to desktop Python with PyQt5, custom widgets, and performance tuning.",
    content: `## Desktop UX in 2025

Desktop apps can feel premium - if you treat them like products.

## Widget Strategy

Custom cards, glass surfaces, and async workers keep UI responsive.

## Takeaway

PyQt5 rewards engineers who invest in design systems, not just logic.`,
    tags: ["PyQt5", "Desktop", "UX"],
    status: "draft",
    readingTime: 4,
    createdAt: now,
    updatedAt: now,
  },
  {
    slug: "journey-ai-fullstack-developer",
    title: "My Journey as an AI & Full Stack Developer",
    excerpt:
      "From Shohoz Skill bootcamps to Fluvo Soft COO - building systems, teaching others, and winning national hackathons.",
    content: `## The Beginning

I started with frontend freelancing and teaching web development at Shohoz Skill.

## Inflection Points

- Managing 21+ developers and 300+ bootcamp students
- Building PyDItor and Sir Kothay at UIU Developers Hub
- 2× National Hackathon Winner
- COO @ Fluvo Soft - scaling AI-automation and SaaS delivery

## What I Believe

Engineering is a craft of clarity. The best engineers teach, measure, and ship.`,
    tags: ["Career", "AI", "Community"],
    status: "draft",
    readingTime: 7,
    createdAt: now,
    updatedAt: now,
  },
];
