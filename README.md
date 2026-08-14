# Can’t Explain

**Author:** Colin Dixon  
**Live (planned):** [cantexplain.au](https://cantexplain.au)  
**Repo:** [github.com/coldix/cantexplain](https://github.com/coldix/cantexplain)

A fun, viral, evidence-backed hall of ridiculous claims. Low-evidence, high-emotion accusations, paired with the original source and a Git-timestamped receipt, presented with observational humour.

> The claim was loud. The evidence was not.

Sibling of [ministryofdoubt.com](https://ministryofdoubt.com) and [electiontracker.au](https://electiontracker.au). Same rule — *show me the evidence* — applied to the claims that arrive already shouting. See [docs/FAMILY.md](docs/FAMILY.md).

This repository is a **scaffold for review**: site chrome, content model, evidence convention, and planning docs. It is not the launch set. Three cards are labelled format examples.

## Stack

Astro (static) on Cloudflare Workers Builds as an assets-only Worker. No `@astrojs/cloudflare` adapter — official Astro and Cloudflare docs say a static site does not need one. Same family path as electiontracker.au. Details in [docs/BRIEF.md](docs/BRIEF.md).

## Local development

From `/web/cantexplain`:

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

Live: [cantexplain.au](https://cantexplain.au) (`cantexplain.com.au` 301s there).

```bash
npm run build      # sync evidence, validate published entries, build to dist/
npm run preview    # serve the build
npm run deploy     # build + wrangler deploy to cantexplain.au
npm run validate   # evidence + source checks only
npm run new -- --slug my-slug --person "Name" --year 2026
```

Node 22 (see `.node-version`).

## How to add an entry

1. `npm run new -- --slug short-descriptive-slug --person "Pauline Hanson" --year 2026`
2. Drop the capture into `evidence/<year>/<slug>/` and point `evidence.path` at it.
3. Fill the frontmatter. Quote or mark paraphrase. Write a caption that obeys [docs/TONE-GUIDE.md](docs/TONE-GUIDE.md).
4. Leave `status: draft` until a human has opened the source URL and the file.
5. Flip to `published` or `featured`, then `npm run validate` and check `/hall/<slug>`.

Field reference: [docs/CONTENT-MODEL.md](docs/CONTENT-MODEL.md).  
AI may draft, not publish: [docs/AI-PIPELINE.md](docs/AI-PIPELINE.md).

## Docs

| Doc | What |
|---|---|
| [docs/BRIEF.md](docs/BRIEF.md) | Full project brief |
| [docs/CONTENT-MODEL.md](docs/CONTENT-MODEL.md) | Entry fields, vocab, examples |
| [docs/TONE-GUIDE.md](docs/TONE-GUIDE.md) | Voice and caption rules |
| [docs/AI-PIPELINE.md](docs/AI-PIPELINE.md) | Collect → draft → human handoff |
| [docs/FAMILY.md](docs/FAMILY.md) | Ministry, Election Tracker, Oze |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Phase 1–3 |

## Licence

MIT. See [LICENSE](LICENSE).
