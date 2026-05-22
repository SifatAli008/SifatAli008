# LinkedIn post images

Save screenshots from your LinkedIn posts here, then set `image` in `src/lib/data/featured.ts`:

| File (example)        | Post              |
|-----------------------|-------------------|
| `nextzen-iiuc.jpg`    | NextZen 4th place |
| `innovatex-bubt.jpg`  | InnovateX runner-up |
| `hackday-announce.jpg`| HackDay 2026 announce |
| `hackday-recap.jpg`   | HackDay recap     |

Example:

```ts
image: "/assets/linkedin/nextzen-iiuc.jpg",
```

If `image` is set, it replaces the LinkedIn embed preview.
