# Content model — Entry

**Author:** Colin Dixon  
**Updated:** 2026-08-14

An **entry** is one ridiculous claim, pinned to a source and a receipt. It is not an essay, a news story, or a dunk thread. The unit of work is: *here is the accusation, here is where it was made, here is the file we kept, here is the one-line observation*.

Collection path: `content/entries/*.md` (or `.mdx`).  
Schema: `src/content.config.ts`.  
Public URL: `/hall/<slug>` (slug = filename without extension).

Drafts are built but **not listed**. Featured entries pin to the homepage. `example: true` marks the scaffold format cards so they can be retired without hunting.

---

## Required fields

| Field | Type | Notes |
|---|---|---|
| `title` | string | Short card title. Not the claim itself. |
| `claim` | string | The accusation, as a quote or a faithful paraphrase. If you paraphrase, say so in the body. |
| `caption` | string | One or two sentences of observational humour. Receipt-first. See [TONE-GUIDE.md](./TONE-GUIDE.md). |
| `status` | `draft` \| `published` \| `featured` | Drafts never appear in the hall or homepage. Featured also appear in the homepage pin. |
| `published` | date | Date **we** published the entry (ISO `YYYY-MM-DD`). Not the source date. |
| `person` | string | Primary figure the claim is *about*. Display name, not a slug. |
| `claimType` | enum | Controlled vocabulary below. |
| `year` | integer | Calendar year of the **source**, used for filters. |
| `tags` | string[] | Lowercase kebab or words. Always include a person tag and a theme tag. |
| `source.url` | URL | Original public location of the claim. |
| `source.date` | `YYYY-MM-DD` | Date the source published or uttered it. |
| `source.publisher` | string | Outlet, account, or institution. |
| `evidence.path` | string | Path under `/evidence/`, e.g. `2026/gina-puppet/source.md`. File must exist. |
| `evidence.kind` | enum | `screenshot` \| `html` \| `pdf` \| `transcript` \| `note` |

## Optional fields

| Field | Type | Notes |
|---|---|---|
| `example` | boolean | Default `false`. Scaffold / format demos set this `true`. |
| `source.title` | string | Headline or post title. |
| `source.quote` | string | Verbatim excerpt if the claim field is a paraphrase. |
| `evidence.archiveUrl` | URL | archive.org / archive.is / similar. |
| `evidence.captured` | `YYYY-MM-DD` | When we captured the file. Git still wins for immutability. |
| `media.type` | `image` \| `video` \| `side-by-side` | Extra visual, not a substitute for evidence. |
| `media.src` | string | Public path or remote URL. |
| `media.alt` | string | Required in spirit whenever `media` is set. |
| `media.caption` | string | Optional. |

## Body

Markdown after the frontmatter is optional context: who said it, what was missing, why it belongs in the hall. Keep it short. If it wants to become an essay, it belongs on Oze Unleashed, not here.

---

## Controlled vocabularies

### `status`

- `draft` — in the repo, invisible on the public hall.
- `published` — live.
- `featured` — live, and eligible for the homepage pin.

### `claimType`

Four rooms. The missing receipt is the method, not a type.

| Value | Use for |
|---|---|
| `health` | Bodies, virus, jabs, distance, hotels, lockdowns sold as medicine. |
| `climate` | Reef, GenCost, energy-as-climate, capacity sold as a climate fix. |
| `money` | Taxes, budgets, blowouts, timelines on a spend, $2 a day. |
| `speech` | Claims about a person, tribe, or flotilla. The meter is a character, not a ledger. |

Do not add left/right, truth, or lies. Those are teams and verdicts. Pick the loudest room when a card sits on a join (Snowy cost is money; Snowy “3 million homes” is climate).

Do not invent new `claimType` values in an entry. Extend the schema in `src/content.config.ts` and this doc together.

### Tags (conventions, not a closed list)

Always include:

- a **person** tag (`hanson`, `rinehart`, …)
- a **theme** tag matching launch language where it applies (`hds`, `ginas-puppet`, `no-evidence-required`)
- the **year** as a tag as well as the `year` field (`2024`)

Useful extras: `media`, `social`, `parliament`, `donation`, `conspiracy`.

---

## Evidence convention

Source of truth: repo-root `evidence/`.  
Served at: `/evidence/...` (copied to `public/evidence` on `npm run dev` / `npm run build`).

Recommended layout:

```
evidence/
  YYYY/
    <slug>/
      README.md          ← what was captured, from where, when
      source.png         ← screenshot, or
      source.html        ← saved page, or
      source.pdf
```

`evidence.path` in the entry points at the main file (`2026/slug/source.md`), not the directory.

The **immutable timestamp** is the Git commit that added the file. Do not rewrite evidence files in place to “fix” a capture — add a new file and note it. Optional Archive.org links are a backup, not a replacement.

`npm run validate` fails the build if a `published` or `featured` entry is missing its evidence file, source URL, or source date.

See `evidence/README.md`.

---

## Example (scaffold)

```yaml
---
title: "Format example — Gina’s puppet"
claim: "She’s just Gina Rinehart’s puppet."
caption: "A puppet usually has strings. This one came with a vibe and a headline."
status: published
example: true
published: 2026-08-14
person: Pauline Hanson
claimType: puppet
year: 2024
tags: [hanson, rinehart, ginas-puppet, 2024, format-example]
source:
  url: https://example.com/format-example-gina-puppet
  date: 2024-03-12
  publisher: Format Example Desk
  title: "Someone on the internet settled it"
  quote: "She’s just Gina Rinehart’s puppet."
evidence:
  path: 2024/format-gina-puppet/source.md
  kind: note
  captured: 2026-08-14
---

This card exists so the template can be reviewed. Replace it with a real, sourced entry.
```

Three labelled format examples ship in `content/entries/` covering the launch themes. They are not the launch set.

---

## Adding an entry

```bash
npm run new -- --slug short-descriptive-slug --person "Pauline Hanson" --year 2026
```

That writes a draft Markdown file and an `evidence/<year>/<slug>/` stub. Then:

1. Put the capture in `evidence/<year>/<slug>/`.
2. Fill every required field. Paste a real `source.url`.
3. Write a caption that would survive being read aloud by someone who disagrees with you.
4. Flip `status` to `published` (or `featured`) only after a human has checked the source and the file.
5. `npm run validate` then `npm run dev` and read the card on `/hall`.

AI may draft. AI may not publish. See [AI-PIPELINE.md](./AI-PIPELINE.md).
