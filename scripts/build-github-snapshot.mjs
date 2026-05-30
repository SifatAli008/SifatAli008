import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const input = process.argv[2];
const includeForks = process.argv.includes("--forks");

if (!input) {
  console.error("Usage: node scripts/build-github-snapshot.mjs <api-json-file> [--forks]");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(input, "utf8"));
const repos = raw
  .filter((r) => includeForks || !r.fork)
  .sort((a, b) => b.stargazers_count - a.stargazers_count || b.updated_at.localeCompare(a.updated_at))
  .map((r) => ({
    id: r.id,
    name: r.name,
    fullName: r.full_name,
    description: r.description,
    url: r.html_url,
    homepage: r.homepage || null,
    stars: r.stargazers_count,
    forks: r.forks_count,
    language: r.language,
    topics: r.topics ?? [],
    updatedAt: r.updated_at,
    isFork: r.fork,
    isArchived: r.archived,
  }));

const out = path.join(__dirname, "../src/lib/data/github-portfolio-snapshot.json");
fs.writeFileSync(
  out,
  JSON.stringify({ username: "SifatAli008", fetchedAt: new Date().toISOString(), repos }, null, 2)
);
console.log(`Wrote ${repos.length} repos to ${out}`);
