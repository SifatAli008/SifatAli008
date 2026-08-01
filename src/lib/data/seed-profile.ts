import type { Profile } from "@/types";
import { assetUrl } from "@/lib/cloudinary/assets";

/** Isolated from blog seed content so client forms do not pull article payloads. */
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
