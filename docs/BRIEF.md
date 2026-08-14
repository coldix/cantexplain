# Can’t Explain — project brief

**Author:** Colin Dixon  
**Canonical domain:** [cantexplain.au](https://cantexplain.au)  
**Also:** cantexplain.com.au  
**Repository:** [github.com/coldix/cantexplain](https://github.com/coldix/cantexplain)  
**Local path:** `/web/cantexplain`  
**Updated:** 2026-08-14

---

## 1. Project overview

**Name:** Can’t Explain

**One-line mission:**  
A fun, viral, evidence-backed “hall of ridiculous claims” that collects low-evidence, high-emotion political accusations, pairs them with original sources and immutable timestamps, and presents them with humour. Inspired by Hanson Derangement Syndrome, but open to any figure or pattern that fits.

**Tone & family:**

- Observational, slightly exaggerated, receipt-first humour (in the spirit of the *Please Explain* cartoons).
- Part of the same family as [ministryofdoubt.com](https://ministryofdoubt.com) (“Suspicion is not proof. Authority is not proof either. Show me the evidence.”).
- Also sits alongside [electiontracker.au](https://electiontracker.au), [ozeunleashed.substack.com](https://ozeunleashed.substack.com), and the broader Oze / Colin Dixon projects.
- Cross-link where natural. Shared design language and values where practical (evidence, independence, checkable sources).

See [FAMILY.md](./FAMILY.md) and [TONE-GUIDE.md](./TONE-GUIDE.md).

---

## 2. Confirmed tech stack (do not change)

| Layer | Choice |
|---|---|
| Framework | Astro (static output) |
| Hosting / CDN | Cloudflare Workers Builds — assets-only Worker (same path as electiontracker.au). Pages remains a valid fallback. |
| Content | Markdown / MDX in `content/entries/` via Astro content collections |
| Evidence | Git-committed files in `/evidence/` — commit history is the immutable timestamp |
| Authoring | AI-assisted drafting; human approval only |

**Why this stack:**

- Already used on electiontracker.au and consistent with the family’s Cloudflare setup.
- Astro is excellent for content-heavy, static-first sites with optional islands.
- Official Cloudflare adapter exists, but **this site does not use it**. Official Astro and Cloudflare docs both say: if you are using Astro as a static site builder, you do not need `@astrojs/cloudflare`. That adapter is for on-demand rendering (SSR, server islands, sessions). Can’t Explain is a static collection with a client-side filter — no request-time compute.
- Deploy config lives in `wrangler.jsonc` and points at `./dist`. No `main` Worker entry, no bindings.

No other framework or host unless there is a clear, documented reason that outweighs consistency with existing projects.

---

## 3. Goals & non-goals

**Goals**

- Fast, shareable, mobile-first collection of ridiculous claims with receipts.
- Low ongoing maintenance (AI collects & drafts → owner approves).
- Clear family membership with ministryofdoubt.com and the rest of the Oze / Dixon sites.
- Launch with a solid Hanson-focused set, then expand sideways.

**Non-goals**

- Not a daily news site or long-form essay platform.
- Not pure rage or partisan campaigning.
- Not a heavy user-generated content free-for-all at launch.

---

## 4. Content model (entry)

Each entry needs:

- Claim / accusation (quote or screenshot)
- Original source URL + date
- Immutable evidence link (Git-committed file preferred)
- Short humorous / observational caption
- Tags (person, claim-type, year, etc.)
- Optional media (cartoon, short clip, side-by-side)
- Status: `draft` | `published` | `featured`

**Launch themes:**  
Hanson Derangement Syndrome, “Gina’s Puppet”, “No Evidence Required”, then broader.

Exact fields and examples: [CONTENT-MODEL.md](./CONTENT-MODEL.md).

---

## 5. Repo & local structure

```
cantexplain/
├── README.md
├── docs/
│   ├── BRIEF.md              ← this document
│   ├── CONTENT-MODEL.md
│   ├── TONE-GUIDE.md
│   ├── AI-PIPELINE.md
│   ├── FAMILY.md
│   └── ROADMAP.md
├── content/entries/
├── evidence/                 ← Git-timestamped screenshots / source files
├── public/
├── src/
├── scripts/                  ← entry helpers + (later) AI collection
├── astro.config.mjs
├── wrangler.jsonc
└── package.json
```

Local development root: `/web/cantexplain`.

---

## 6. Design & family notes

- Keep visual and tonal consistency with the family where it makes sense (evidence emphasis, clean typography, dark/light theme — electiontracker.au already has this).
- Can’t Explain is the fun, viral, claim-collection sibling — not a clone of ministryofdoubt.com.
- Footer / “Elsewhere” links include ministryofdoubt.com, electiontracker.au, and other relevant Oze properties.
- Homepage situates the site in the wider “show me the evidence” approach in one short paragraph, then gets on with the hall.

See [FAMILY.md](./FAMILY.md).

---

## 7. Launch criteria

- Both domains resolve to the site (canonical = cantexplain.au)
- Astro site deployed on Cloudflare
- Homepage explains the concept cleanly
- 15–30 strong, well-sourced entries live
- Every entry has original source + Git-timestamped (or equivalent) evidence
- Search / basic filters
- Mobile-friendly, fast, shareable
- Family links present
- Clear path for owner to add new entries

This scaffold stops **before** bulk content and **before** wiring the AI pipeline. Three labelled format-example entries exist so templates can be reviewed.

---

## 8. Scaffold status (2026-08-14)

Done in this pass:

1. Repository created at `https://github.com/coldix/cantexplain`
2. Astro static project + Cloudflare assets-only Worker config
3. Planning docs in `docs/`
4. Entry content model (Markdown / MDX collection)
5. `/evidence/` convention with Git timestamps
6. Local `npm run dev` from `/web/cantexplain`
7. Homepage, hall listing, single-entry templates, about, method
8. Family cross-links and tone guidance

Stopped, as requested, before bulk content and before complex AI pipeline wiring.
