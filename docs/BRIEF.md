# Can’t Explain — project brief

**Author:** Colin Dixon  
**Canonical domain:** [cantexplain.au](https://cantexplain.au)  
**Also:** cantexplain.com.au (301)  
**Repository:** [github.com/coldix/cantexplain](https://github.com/coldix/cantexplain)  
**Updated:** 2026-08-16

---

## 1. Project overview

**Name:** Can’t Explain

**One-line mission:**  
A receipt-first hall of loud claims: one slogan, the original source, a Git-timestamped file, and a short observation. The joke is the gap.

**Tone & family:**

- Observational, slightly exaggerated, receipt-first humour (in the spirit of the *Please Explain* cartoons).
- Family of [ministryofdoubt.com](https://ministryofdoubt.com), [electiontracker.au](https://electiontracker.au), [ozeunleashed.substack.com](https://ozeunleashed.substack.com).
- Cross-link where natural. Shared habit: evidence over vibe.

See [FAMILY.md](./FAMILY.md) and [TONE-GUIDE.md](./TONE-GUIDE.md).

---

## 2. Tech stack

| Layer | Choice |
|---|---|
| Framework | Astro 5, static output, `trailingSlash: never` |
| Host | Cloudflare Worker `cantexplain` on Col@oze.com.au’s account |
| Worker | `worker/index.ts` — assets from `dist/`, `/api/admin*` first |
| Content | Markdown in `content/entries/` via Astro content collections |
| Evidence | Git-committed files in `/evidence/` |
| Authoring | Human publish. Admin desk at `/admin` commits via GitHub. AI may draft. |

A static site does not need `@astrojs/cloudflare`. The Worker exists for the admin API and to serve the built assets. Filters are client-side.

Deploy: [DEPLOY.md](./DEPLOY.md).

---

## 3. Goals & non-goals

**Goals**

- Fast, shareable, mobile-first hall with receipts.
- One room per card (health, climate, money, speech). Series on tags.
- Low maintenance: `npm run new`, validate, deploy. Admin for edits.
- Family membership with Ministry of Doubt and Election Tracker.

**Non-goals**

- Not a daily news site or long-form essay platform (that is Unleashed).
- Not a campaign, scoreboard, or how-to-vote.
- Not user-published cards.

---

## 4. Content model

Each live card has: claim, source URL + date, evidence file, caption, person, one `claimType`, year, loudness 1–10, tags.

`featured` is a legacy alias of `published`. The homepage pin is loudness.

Exact fields: [CONTENT-MODEL.md](./CONTENT-MODEL.md).

---

## 5. Repo shape

```
cantexplain/
├── README.md
├── docs/
├── content/entries/
├── evidence/
├── src/
├── worker/                 ← hall Worker + admin API
├── workers/comau-redirect/ ← .com.au / www 301
├── scripts/
├── wrangler.jsonc
└── package.json
```

---

## 6. Launch criteria (met 2026-08)

- Both domains resolve (canonical `cantexplain.au`)
- Hall live with sourced cards, rooms, loudness, tag lookup
- Every live card has a source and a file in git
- Filters: person, room, year, loudness, tag
- Family links, method, about, FAQ
- Path to add cards: `npm run new` and `/admin`
