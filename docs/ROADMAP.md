# Roadmap

**Author:** Colin Dixon  
**Updated:** 2026-08-14

Three phases. This repository is the start of Phase 1 — scaffold and docs, not a launch.

---

## Phase 1 — Launch the hall

**Goal:** a fast, shareable, mobile-first site with a solid Hanson-focused set and a path for the owner to add cards.

| Item | Status |
|---|---|
| Repo under `coldix/cantexplain` | done |
| Astro static + Cloudflare assets-only Worker | done (scaffold) |
| Planning docs | done |
| Entry model + `/evidence/` convention | done |
| Homepage, hall, single-entry, about, method | done |
| Search / tag / year / person filters | done (client-side) |
| Family links + dark/light theme | done |
| `npm run new` + `npm run validate` | done |
| Format-example cards (3) | done — replace before launch |
| Custom domains `cantexplain.au` + `.com.au` | not in this pass |
| Cloudflare project + first deploy | not in this pass |
| 15–30 real, sourced entries | not in this pass |
| OG image / share cards | stub only |
| AI collect / draft scripts | specified, not built |

**Exit:** launch criteria in [BRIEF.md](./BRIEF.md) § 7. Real entries only — retire `example: true` cards or keep at most one “how a card works” meta-entry.

**Suggested first real cluster**

1. Hanson Derangement Syndrome — the pattern, then 8–12 instances.
2. “Gina’s Puppet” — the control claim, sourced each time it is made.
3. “No Evidence Required” — certainty with the footnote missing.

Do not pad to 15 with weak cards. A tight 15 beats a soggy 30.

---

## Phase 2 — Broader themes + submissions

**Goal:** the hall is not only Hanson, and other people can send a tip without becoming the CMS.

- Expand `claimType` / tags only when a real cluster appears.
- Moderated tip form (email or a small Worker + notification). No public posting.
- Light AI collect on a written watch list ([AI-PIPELINE.md](./AI-PIPELINE.md)).
- Cross-links to Election Tracker where a card depends on an election fact.
- Share polish: OG images per entry, maybe a “copy receipt” snippet.
- `cantexplain.com.au` → 301 to the matching path on `cantexplain.au`.

Still not a comments section. Still not a daily news desk.

---

## Phase 3 — Richer media

**Goal:** the *Please Explain* energy in the layout, not just the captions.

- Original cartoons / side-by-sides as optional `media`.
- Short clips where the claim is spoken (still need a transcript file in `/evidence`).
- Collections / “pattern” pages (HDS, puppet, no-evidence) as curated views, not auto-tags only.
- Optional archive.org batching on publish.
- Only then consider on-demand Cloudflare features (and the official adapter) if a form or image pipeline actually needs them.

---

## Deliberately later, or never

- User-generated cards that go live without a human.
- Notifications, membership, or a newsletter that duplicates Oze Unleashed.
- Native apps.
- Scoring politicians, “derangement indexes”, or leaderboards. That turns a hall into a campaign tool.
- Switching off Astro or Cloudflare because a template looked nicer.

---

## Deploy note (when we get there)

Match electiontracker.au unless Cloudflare’s dashboard forces a documented change:

| Field | Value |
|---|---|
| Project | `cantexplain` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Output | `dist/` (see `wrangler.jsonc`) |
| Node | `22` (`.node-version`) |

Canonical host: `cantexplain.au`. Alternate host redirects; it does not serve a second copy.
