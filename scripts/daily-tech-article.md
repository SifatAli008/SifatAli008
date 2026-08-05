# Daily Tech Article (Auto)

Automated pipeline for **one verified long-form post per day** at **8:30 PM Asia/Dhaka**.

## How it works

1. GitHub Action `.github/workflows/daily-article.yml` runs on cron `30 14 * * *` (UTC).
2. `npm run daily:article` calls Gemini and writes:
   - `src/lib/data/articles/<file>.ts`
   - Updates `index.ts`, `article-faqs.ts`, `blog-meta.ts`, `blog-fallback.ts`
3. Action commits and pushes to `main`.
4. Optional: `npm run publish:article` syncs to Firestore when admin secrets exist.

## Required GitHub secrets

| Secret | Required |
| --- | --- |
| `GEMINI_API_KEY` | Yes (or use OpenRouter below) |
| `OPENROUTER_API_KEY` | Optional fallback when Gemini quota is hit |
| `FIREBASE_ADMIN_PROJECT_ID` | Optional (Firestore sync) |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Optional |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Optional |

Add secrets: **GitHub repo → Settings → Secrets and variables → Actions**

## Manual run

```bash
# Local (uses .env.local GEMINI_API_KEY)
npm run daily:article

# Preview generation only
npm run daily:article -- --dry-run

# Force another post same day
npm run daily:article -- --force
```

## Trigger workflow manually

GitHub → **Actions** → **Daily auto blog post** → **Run workflow**

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Workflow never runs | Enable Actions on repo; default branch must include workflow file |
| "Missing GEMINI_API_KEY" | Add secret in GitHub Actions |
| No commit pushed | Article for today may already exist (idempotent skip) |
| Post not on site | Wait for Vercel/host redeploy after push, or run publish locally |
