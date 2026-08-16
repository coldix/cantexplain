# AI pipeline — collect, draft, hand off

**Author:** Colin Dixon  
**Updated:** 2026-08-16

**Status:** specified, not wired. Humans publish. Models may fetch and draft.

The point of the pipeline is low ongoing maintenance without turning the hall into an unsupervised slur generator. Election Tracker already treats “no source, no row” as a build failure. Can’t Explain should treat “no source, no card” the same way.

---

## Roles

| Role | Who | May |
|---|---|---|
| Collector | script + model | Watch a source list, fetch public pages, propose candidates |
| Drafter | model | Fill a draft entry + evidence stub from a candidate |
| Reviewer | Colin Dixon (human) | Edit, reject, or publish |
| Publisher | human + git | Flip `status`, commit evidence, merge |

A model never writes `status: published`. `scripts/validate-entries.mjs` should, once wired, reject that from an AI commit if we ever stamp drafts.

---

## Pipeline (target)

```
watch list  →  fetch  →  extract claim  →  capture evidence
                                              ↓
                              draft Markdown in content/entries/
                                              ↓
                              human review (tone + source + file)
                                              ↓
                              status: published + git commit
```

### 1. Collect

Inputs (to be added under `scripts/` later, not in this pass):

- A small watch list: outlets, search queries, parliament transcripts, named social accounts.
- Watch queries around official slogans (health, climate, money, speech), not a single tribe.
- Dedup against existing `source.url` values.

Outputs: a JSON candidate in `tmp/` or `scripts/inbox/` (gitignored), never a live entry.

A candidate is not an entry. It is:

```json
{
  "claim": "",
  "sourceUrl": "",
  "sourceDate": "",
  "publisher": "",
  "person": "",
  "whyItFits": "",
  "confidence": 0.0
}
```

Drop candidates that are opinion without a specific accusation, or accusations that are already sourced and boring. The hall is for *loud + thin*, not *wrong + documented*.

### 2. Capture

For each candidate the human (or, later, a capture helper) wants to keep:

1. Create `evidence/<year>/<slug>/`.
2. Save a screenshot, HTML, PDF, or transcript.
3. Write `README.md` with URL, UTC/AEST capture time, and user-agent / method.
4. Optional: submit the URL to archive.org and store `archiveUrl`.

The file in git is the receipt. The archive link is a spare key.

### 3. Draft

The drafter reads the capture + candidate and writes `content/entries/<slug>.md` with:

- `status: draft`
- `example: false`
- every required field from [CONTENT-MODEL.md](./CONTENT-MODEL.md)
- a caption that obeys [TONE-GUIDE.md](./TONE-GUIDE.md)
- a short body, or none

Prompt constraints to bake in when this is wired:

- Quote or mark paraphrase. Do not invent a quote.
- One accusation per entry.
- Caption ≤ 2 sentences.
- No second smear in the closer.
- Australian English.
- If the source does not actually contain the claim, abort and say so.

### 4. Hand off

Human review is a page, not a vibe:

1. Open `source.url`. Does the claim exist there, on that date?
2. Open the evidence file. Is it the same thing?
3. Read the caption aloud. Does it still work if you vote the other way?
4. Check person, tags, `claimType`.
5. Either `status: published` or delete / leave as draft.
6. Commit **evidence first**, then the entry, or both in one commit. Do not publish a card whose file is uncommitted.

`npm run new` already scaffolds the pair of files. `npm run validate` already refuses to build published entries with a missing source or missing evidence file.

---

## What not to automate in phase 1

- Public submission inbox that auto-publishes.
- Social posting of new cards (easy to make the hall look like a campaign).
- Model-written “related analysis” that smuggles new claims.
- Scraping behind logins, paywalls, or private groups.
- Anything that stores personal data beyond what the public source already showed.

Phase 2 in [ROADMAP.md](./ROADMAP.md) is a *moderated* submission form, not an open firehose.

---

## Suggested later scripts (names only)

| Script | Job |
|---|---|
| `scripts/collect.mjs` | Run watch list, write inbox candidates |
| `scripts/capture.mjs` | Fetch URL, write `evidence/<year>/<slug>/` |
| `scripts/draft.mjs` | Candidate + capture → draft Markdown |
| `scripts/inbox-report.mjs` | Print a review queue for the owner |

None of these exist yet. The content model and tone are already in use on the live hall.

---

## Failure modes to design against

- **Fluent smear.** The model writes a perfect caption for a claim the source does not make. Defence: human opens the URL; validate cannot catch this.
- **Quote inflation.** The model “tidies” a quote. Defence: keep `source.quote` verbatim; put paraphrase only in `claim` and admit it.
- **Target lock.** The watch list only ever finds one tribe’s sins. Defence: review the watch list the same way Election Tracker reviews source balance — on purpose, in writing.
- **Receipt theatre.** A screenshot of a quote-tweet of a screenshot. Defence: original source URL is required; the evidence file should be *that* page, not a pile of screenshots of screenshots.
