import type {
  Achievement,
  BlogPost,
  Experience,
  Project,
  Skill,
} from "@/types";
import { assetUrl } from "@/lib/cloudinary/assets";
import { seedProfile } from "@/lib/data/seed-profile";

export { seedProfile };

const now = new Date().toISOString();

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

/** Draft/sample posts only. Published long-form articles live in `articles/`. */
export const seedBlogPosts: Omit<BlogPost, "id">[] = [
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
