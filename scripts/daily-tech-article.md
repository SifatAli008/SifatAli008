# Daily Tech Article (Auto)

Automated pipeline for **two verified long-form posts per day** in **Asia/Dhaka**:

| Slot | Local time | UTC cron | Topic focus |
| --- | --- | --- | --- |
| `afternoon` | **3:00 PM** | `0 9 * * *` | **NLP** preferred (transformers, embeddings, ClinicalBERT, retrieval) |
| `evening` | **8:00 PM** | `0 14 * * *` | AI agents, cloud, developer tools, shipping lessons, NLP when relevant |

## How it works

1. GitHub Action `.github/workflows/daily-article.yml` runs twice daily.
2. `npm run daily:article -- --slot=afternoon|evening` calls Gemini and writes:
   - `src/lib/data/articles/<file>.ts`
   - Updates `index.ts`, `article-faqs.ts`, `blog-meta.ts`, `blog-fallback.ts`
3. Action commits and pushes to `main`.
4. Optional: `npm run publish:article` syncs to Firestore when admin secrets exist.

Max **2 articles per Dhaka calendar day** (one per slot). Re-running the same slot is a no-op unless `--force`.

## Required GitHub secrets

| Secret | Required |
| --- | --- |
| `GEMINI_API_KEY` | Yes (or use OpenRouter below) |
| `OPENROUTER_API_KEY` | Optional fallback when Gemini quota is hit |
| `FIREBASE_ADMIN_PROJECT_ID` | Optional (Firestore sync) |
| `FIREBASE_ADMIN_CLIENT_EMAIL` | Optional |
| `FIREBASE_ADMIN_PRIVATE_KEY` | Optional |

### One-time setup (fixes "Missing AI key")

1. Open **https://github.com/SifatAli008/SifatAli008/settings/secrets/actions**
2. Click **New repository secret**
3. Add **`GEMINI_API_KEY`**
   - Get a key at **https://aistudio.google.com/apikey**
   - Name must be exactly `GEMINI_API_KEY`
4. *(Optional)* Add **`OPENROUTER_API_KEY`** as fallback
   - Get a key at **https://openrouter.ai/keys**
5. Re-run the workflow: **Actions → Daily auto blog post → Run workflow**

Local dev: copy `.env.example` to `.env.local` and set the same keys there.

## Manual run

```bash
# Local (uses .env.local GEMINI_API_KEY)
npm run daily:article -- --slot=afternoon
npm run daily:article -- --slot=evening

# Preview generation only
npm run daily:article -- --slot=afternoon --dry-run

# Force another post for the same slot
npm run daily:article -- --slot=evening --force
```

## Trigger workflow manually

GitHub → **Actions → Daily auto blog post → Run workflow**  
Pick slot: `auto`, `afternoon`, or `evening`.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| Workflow never runs | Enable Actions on repo; default branch must include workflow file |
| "Missing GEMINI_API_KEY" / "Missing AI key" | Add `GEMINI_API_KEY` or `OPENROUTER_API_KEY` under repo **Settings → Secrets → Actions**, then re-run workflow |
| No commit pushed | That slot's article may already exist (idempotent skip) |
| Post not on site | Wait for Vercel/host redeploy after push, or run publish locally |
