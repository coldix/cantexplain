# Scripts

**Author:** Colin Dixon

| Script | Job |
|---|---|
| `sync-evidence.mjs` | Copy `evidence/` → `public/evidence/` (gitignored copy) |
| `validate-entries.mjs` | Fail the build if a live entry lacks a source or file |
| `write-ai-guides.mjs` | Write `public/llms-full.txt` from live entries |
| `new-entry.mjs` | Scaffold a draft Markdown entry + evidence stub |

AI collect / draft helpers are specified in [docs/AI-PIPELINE.md](../docs/AI-PIPELINE.md) and are **not wired yet**.
