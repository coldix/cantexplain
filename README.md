# Can’t Explain

**Author:** Colin Dixon  
**Live:** [cantexplain.au](https://cantexplain.au)  
**Repo:** [github.com/coldix/cantexplain](https://github.com/coldix/cantexplain)

A receipt-first hall of loud claims. Each card is one slogan, the original source, a Git-timestamped file, and a short observation. The joke is the gap.

> The claim was loud. The evidence was not.

Sibling of [ministryofdoubt.com](https://ministryofdoubt.com) and [electiontracker.au](https://electiontracker.au). Same rule — *show me the evidence* — applied to claims that arrive already shouting. See [docs/FAMILY.md](docs/FAMILY.md).

Contact: [ce@cantexplain.au](mailto:ce@cantexplain.au).

## Stack

Astro 5 static site, served by a Cloudflare Worker (`worker/index.ts`) that also runs the private `/admin` desk. Assets from `dist/`. Alternate host `cantexplain.com.au` 301s to the apex via a tiny redirect Worker.

## Local development

Node 22 (`.node-version`). From this directory:

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

```bash
npm run validate   # source + evidence checks
npm run build      # sync evidence, validate, write AI guides, build to dist/
npm run preview    # serve the build
npm run deploy     # build + wrangler deploy to cantexplain.au
npm run new -- --slug my-slug --person "Name" --year 2026
```

## How to add a card

1. `npm run new -- --slug short-descriptive-slug --person "Name" --year 2026`
2. Drop the capture in `evidence/<year>/<slug>/` and point `evidence.path` at it.
3. Fill the frontmatter. Quote or mark paraphrase. Caption obeys [docs/TONE-GUIDE.md](docs/TONE-GUIDE.md).
4. Leave `status: draft` until a human has opened the source URL and the file.
5. Flip to `published`, set `loudness` (1–10, reach not truth), pick one room (`health` | `climate` | `money` | `speech`).
6. `npm run validate` and read `/hall/<slug>`.

Homepage pins the loudest live cards. The hall filters by person, room, year, loudness, and tag (`/hall?tag=education`). A card lives in **one** room; series (education, history, CRT, Dark Emu) live on tags.

Field reference: [docs/CONTENT-MODEL.md](docs/CONTENT-MODEL.md).  
AI may draft, not publish: [docs/AI-PIPELINE.md](docs/AI-PIPELINE.md).  
Deploy and admin: [docs/DEPLOY.md](docs/DEPLOY.md).

## Docs

| Doc | What |
|---|---|
| [docs/BRIEF.md](docs/BRIEF.md) | Project brief |
| [docs/CONTENT-MODEL.md](docs/CONTENT-MODEL.md) | Entry fields, rooms, loudness, tags |
| [docs/TONE-GUIDE.md](docs/TONE-GUIDE.md) | Voice and caption rules |
| [docs/DEPLOY.md](docs/DEPLOY.md) | Domains, Worker, admin, DNS leftovers |
| [docs/AI-PIPELINE.md](docs/AI-PIPELINE.md) | Collect → draft → human handoff |
| [docs/FAMILY.md](docs/FAMILY.md) | Ministry, Election Tracker, Oze |
| [docs/ROADMAP.md](docs/ROADMAP.md) | What is live, what is later |

## Licence

MIT. See [LICENSE](LICENSE).
