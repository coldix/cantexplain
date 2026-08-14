# Deployment

**Author:** Colin Dixon  
**Updated:** 2026-08-14

Same family path as electiontracker.au: an assets-only Worker on **Col@oze.com.au's Account**.

| Host | Role |
|---|---|
| `cantexplain.au` | Canonical. Serves the site. |
| `cantexplain.com.au` | 301 to the matching path on `cantexplain.au` |
| `www.cantexplain.au` | 301 to apex |
| `www.cantexplain.com.au` | 301 to apex |

The `.com.au` / `www` redirects are a tiny Worker (`cantexplain-comau`), not a zone Redirect Rule. Wrangler OAuth can attach custom domains; it cannot edit zone DNS or Redirect Rules. The visitor-facing result is the same as electiontracker’s rule.

## First-time (done 2026-08-14)

1. Both zones added to Cloudflare and nameservers updated (zones **Active**).
2. `npm run deploy` — uploads `dist/` as Worker `cantexplain`, custom domain `cantexplain.au`.
3. `npm run deploy:redirect` — Worker `cantexplain-comau` on the three redirect hostnames.

Account ID is in `wrangler.jsonc` (`ab29454df8dbb469d259956fcf482075`).

## Redeploy after content or code changes

From `/web/cantexplain`, logged in (`npx wrangler whoami`):

```bash
npm run deploy
```

Only rerun `npm run deploy:redirect` if the redirect worker itself changed.

## Workers Builds (GitHub, optional)

Dashboard → Workers & Pages → Create → connect `coldix/cantexplain`, same as elections:

| Field | Value |
|---|---|
| Project name | `cantexplain` |
| Build command | `npm run build` |
| Deploy command | `npx wrangler deploy` |
| Root | `/` |
| `NODE_VERSION` | `22` |

Until that is connected, deploys are `npm run deploy` from this machine.

## One dashboard click still worth doing

**Always Use HTTPS** on the `cantexplain.au` zone (SSL/TLS → Edge Certificates). Wrangler OAuth cannot change zone settings. Until it is on, `http://cantexplain.au` can serve the HTML without bouncing to HTTPS. `.com.au` already 301s to `https://cantexplain.au`.

## Verify

```bash
# site
curl -sI -A 'Mozilla/5.0' https://cantexplain.au/
# 301 + path preserved
curl -sI -A 'Mozilla/5.0' https://cantexplain.com.au/hall
```

Expect `301` and `location: https://cantexplain.au/hall`.
