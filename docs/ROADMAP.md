# Roadmap

**Author:** Colin Dixon  
**Updated:** 2026-08-16

---

## Live now

The hall is on [cantexplain.au](https://cantexplain.au). Rooms, loudness, tag lookup, admin desk, and sourced cards are in production.

| Item | Status |
|---|---|
| Astro static + Worker (`cantexplain`) | live |
| `cantexplain.au` + `.com.au` 301 | live |
| Entry model, `/evidence/`, validate | live |
| Homepage (loudest 8), hall, card, about, method, FAQ | live |
| Filters: search, person, room, year, loudness, tag | live |
| Four rooms: health, climate, money, speech | live |
| Admin at `/admin` (GitHub commit; Access still to enable) | live |
| `npm run new` + `npm run validate` | live |

---

## Next (ops, not a new product)

- Cloudflare Access on `/admin` and `/api/admin*` (Zero Trust not enabled on this account yet). See [DEPLOY.md](./DEPLOY.md).
- DMARC TXT if still missing. Always Use HTTPS on the zone.
- Workers Builds from GitHub so an admin save goes live without a local `npm run deploy`.
- Confirm GSC sitemap. Mailbox `ce@cantexplain.au`.

---

## Later

- Moderated tip form (email or a small Worker). No public posting.
- Light AI collect on a written watch list ([AI-PIPELINE.md](./AI-PIPELINE.md)).
- Cross-links to Election Tracker where a card depends on an election fact.
- Optional cartoons / side-by-sides as `media`. Spoken claims still need a transcript in `/evidence`.
- Archive.org batching on publish.

Still not a comments section. Still not a daily news desk.

---

## Deliberately later, or never

- User-generated cards that go live without a human.
- Notifications, membership, or a newsletter that duplicates Oze Unleashed.
- Native apps.
- Scoring politicians, “derangement indexes”, or leaderboards.
- Extra rooms for education, history, left/right, truth, or lies. Those are tags or verdicts.
- Switching off Astro or Cloudflare because a template looked nicer.
