/**
 * Admin API + Access gate for /admin and /api/admin.
 * Public pages stay static assets.
 */
const ADMIN_EMAIL = "col@oze.com.au";
const REPO = "coldix/cantexplain";
const BRANCH = "main";

interface Env {
  ASSETS: Fetcher;
  GITHUB_TOKEN?: string;
  ACCESS_TEAM_DOMAIN?: string;
  ACCESS_AUD?: string;
}

interface AccessIdentity {
  email: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith("/api/admin")) {
      const identity = await requireAdmin(request, env, ctx);
      if (identity instanceof Response) return identity;
      return handleAdminApi(request, env, identity);
    }
    return env.ASSETS.fetch(request);
  },
};

async function requireAdmin(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<AccessIdentity | Response> {
  const access = (ctx as ExecutionContext & {
    access?: { getIdentity: () => Promise<{ email?: string } | null> };
  }).access;
  if (access) {
    const id = await access.getIdentity();
    const email = (id?.email || "").toLowerCase();
    if (email === ADMIN_EMAIL) return { email };
    return deny(403, "This desk is only for col@oze.com.au.");
  }

  const headerEmail = (request.headers.get("Cf-Access-Authenticated-User-Email") || "").toLowerCase();
  const jwt = request.headers.get("Cf-Access-Jwt-Assertion") || "";
  if (!jwt) {
    return deny(
      401,
      "Sign in with Cloudflare Access. Protect /admin and /api/admin for col@oze.com.au.",
    );
  }

  if (env.ACCESS_TEAM_DOMAIN && env.ACCESS_AUD) {
    const verified = await verifyAccessJwt(jwt, env.ACCESS_TEAM_DOMAIN, env.ACCESS_AUD);
    if (!verified) return deny(401, "Access token was not valid.");
    if (verified !== ADMIN_EMAIL) return deny(403, "This desk is only for col@oze.com.au.");
    return { email: verified };
  }

  if (headerEmail === ADMIN_EMAIL) return { email: headerEmail };
  return deny(401, "Access is not configured. Set ACCESS_TEAM_DOMAIN and ACCESS_AUD.");
}

function deny(status: number, message: string): Response {
  return new Response(message, {
    status,
    headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" },
  });
}

async function verifyAccessJwt(token: string, team: string, aud: string): Promise<string | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  let header: { kid?: string; alg?: string };
  let payload: { aud?: string | string[]; email?: string; exp?: number };
  try {
    header = JSON.parse(b64urlJson(h));
    payload = JSON.parse(b64urlJson(p));
  } catch {
    return null;
  }
  if (header.alg !== "RS256" || !header.kid) return null;
  const expectedAud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!expectedAud.includes(aud)) return null;
  if (payload.exp && payload.exp * 1000 < Date.now()) return null;

  const certs = await fetch(`https://${team}.cloudflareaccess.com/cdn-cgi/access/certs`).then(
    (r) => r.json() as Promise<{ keys: JsonWebKey[] }>,
  );
  const jwk = (certs.keys || []).find((k) => (k as JsonWebKey & { kid?: string }).kid === header.kid);
  if (!jwk) return null;
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const ok = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    key,
    b64urlBytes(s),
    new TextEncoder().encode(`${h}.${p}`),
  );
  if (!ok) return null;
  const email = (payload.email || "").toLowerCase();
  return email || null;
}

function b64urlJson(part: string): string {
  return new TextDecoder().decode(b64urlBytes(part));
}

function b64urlBytes(part: string): Uint8Array {
  const pad = "=".repeat((4 - (part.length % 4)) % 4);
  const b64 = (part + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function handleAdminApi(request: Request, env: Env, identity: AccessIdentity): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, "");

  if (path === "/api/admin/me" && request.method === "GET") {
    return json({ email: identity.email });
  }

  if (!env.GITHUB_TOKEN) {
    return json({ error: "GITHUB_TOKEN secret is not set on the Worker." }, 500);
  }

  if (path === "/api/admin/entries" && request.method === "GET") {
    let files: { name: string; path: string; sha: string }[];
    try {
      files = await githubList(env, "content/entries");
    } catch (err) {
      return json({ error: err instanceof Error ? err.message : String(err) }, 500);
    }
    const entries = files
      .filter((f) => f.name.endsWith(".md") || f.name.endsWith(".mdx"))
      .map((f) => ({ slug: f.name.replace(/\.(md|mdx)$/, ""), path: f.path, sha: f.sha }));
    const detailed = await Promise.all(
      entries.map(async (e) => {
        try {
          const file = await githubGet(env, e.path);
          const parsed = parseEntry(file.text);
          return {
            slug: e.slug,
            path: e.path,
            sha: file.sha,
            title: parsed.data.title || e.slug,
            person: parsed.data.person || "",
            status: parsed.data.status || "draft",
            claimType: parsed.data.claimType || "",
            year: parsed.data.year || "",
            published: parsed.data.published || "",
          };
        } catch {
          return { ...e, title: e.slug, person: "", status: "draft", claimType: "", year: "", published: "" };
        }
      }),
    );
    detailed.sort((a, b) => String(b.published).localeCompare(String(a.published)));
    return json({ entries: detailed });
  }

  const one = path.match(/^\/api\/admin\/entries\/([a-z0-9-]+)$/);
  if (one && request.method === "GET") {
    try {
      const slug = one[1];
      const file = await githubGet(env, `content/entries/${slug}.md`);
      const parsed = parseEntry(file.text);
      return json({ slug, sha: file.sha, path: file.path, data: parsed.data, body: parsed.body, raw: file.text });
    } catch (err) {
      return json({ error: err instanceof Error ? err.message : String(err) }, 500);
    }
  }

  try {
    if (one && request.method === "PUT") {
      const slug = one[1];
      const body = (await request.json()) as {
        sha?: string;
        message?: string;
        data: Record<string, unknown>;
        body: string;
      };
      if (!body?.data) return json({ error: "Missing data" }, 400);
      const markdown = serializeEntry(body.data, body.body || "");
      const saved = await githubPut(env, {
        path: `content/entries/${slug}.md`,
        content: markdown,
        sha: body.sha,
        message: body.message || `Edit hall card: ${slug}`,
      });
      return json({ ok: true, sha: saved.sha, commit: saved.commit });
    }

    if (path === "/api/admin/entries" && request.method === "POST") {
      const body = (await request.json()) as {
        slug?: string;
        data: Record<string, unknown>;
        body?: string;
        message?: string;
      };
      const slug = (body.slug || "").trim().toLowerCase().replace(/[^a-z0-9-]+/g, "-");
      if (!slug) return json({ error: "Need a slug" }, 400);
      const existing = await githubGet(env, `content/entries/${slug}.md`).catch(() => null);
      if (existing) return json({ error: `Slug already exists: ${slug}` }, 409);
      const year = String(body.data.year || new Date().getFullYear());
      if (!body.data.evidence || !(body.data.evidence as { path?: string }).path) {
        body.data.evidence = {
          path: `${year}/${slug}/source.md`,
          kind: "note",
          captured: new Date().toISOString().slice(0, 10),
        };
      }
      const markdown = serializeEntry(body.data, body.body || "Short context. Who said it, what was missing.");
      const saved = await githubPut(env, {
        path: `content/entries/${slug}.md`,
        content: markdown,
        message: body.message || `Add hall card: ${slug}`,
      });
      const evPath = String((body.data.evidence as { path?: string }).path || `${year}/${slug}/source.md`);
      await githubPut(env, {
        path: `evidence/${evPath}`,
        content: `# Evidence — ${slug}\n\n- **Captured:** ${new Date().toISOString().slice(0, 10)}\n- **Note:** Stub from the admin desk. Replace with the real capture.\n`,
        message: `Add evidence stub: ${slug}`,
      }).catch(() => null);
      return json({ ok: true, slug, sha: saved.sha, commit: saved.commit });
    }
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : String(err) }, 500);
  }

  return json({ error: "Not found" }, 404);
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });
}

async function githubList(env: Env, path: string) {
  const res = await github(env, path);
  if (!res.ok) throw new Error(`GitHub list ${res.status}`);
  return (await res.json()) as { name: string; path: string; sha: string }[];
}

async function githubGet(env: Env, path: string) {
  const res = await github(env, path);
  if (res.status === 404) throw new Error("not found");
  if (!res.ok) throw new Error(`GitHub get ${res.status}`);
  const data = (await res.json()) as { path: string; sha: string; content: string; encoding: string };
  const text = data.encoding === "base64" ? atob(data.content.replace(/\n/g, "")) : data.content;
  return { path: data.path, sha: data.sha, text };
}

async function githubPut(
  env: Env,
  opts: { path: string; content: string; sha?: string; message: string },
) {
  const payload: Record<string, string> = {
    message: opts.message,
    content: btoa(unescape(encodeURIComponent(opts.content))),
    branch: BRANCH,
  };
  if (opts.sha) payload.sha = opts.sha;
  const res = await github(env, opts.path, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`GitHub put ${res.status}: ${err}`);
  }
  const data = (await res.json()) as { content?: { sha: string }; commit?: { sha: string } };
  return { sha: data.content?.sha, commit: data.commit?.sha };
}

function github(env: Env, path: string, init: RequestInit = {}) {
  return fetch(`https://api.github.com/repos/${REPO}/contents/${path}`, {
    ...init,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${env.GITHUB_TOKEN}`,
      "user-agent": "cantexplain-admin",
      "x-github-api-version": "2022-11-28",
      ...(init.body ? { "content-type": "application/json" } : {}),
      ...(init.headers || {}),
    },
  });
}

function parseEntry(raw: string): { data: Record<string, unknown>; body: string } {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: raw };
  return { data: parseSimpleYaml(m[1]), body: m[2].replace(/^\n/, "") };
}

function parseSimpleYaml(src: string): Record<string, unknown> {
  const root: Record<string, unknown> = {};
  let current: Record<string, unknown> | null = null;
  let currentKey = "";
  for (const line of src.split("\n")) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const nest = line.match(/^  ([A-Za-z][\w]*):\s*(.*)$/);
    if (nest && current) {
      current[nest[1]] = coerce(nest[2]);
      continue;
    }
    const top = line.match(/^([A-Za-z][\w]*):\s*(.*)$/);
    if (top) {
      if (top[2] === "") {
        current = {};
        currentKey = top[1];
        root[currentKey] = current;
      } else {
        current = null;
        root[top[1]] = coerce(top[2]);
      }
    }
  }
  return root;
}

function coerce(raw: string): unknown {
  const v = raw.trim();
  if (v === "true") return true;
  if (v === "false") return false;
  if (/^-?\d+$/.test(v)) return Number(v);
  if ((v.startsWith("[") && v.endsWith("]")) || (v.startsWith('"') && v.endsWith('"'))) {
    try {
      if (v.startsWith("[")) {
        return v
          .slice(1, -1)
          .split(",")
          .map((s) => s.trim().replace(/^['"]|['"]$/g, ""))
          .filter(Boolean);
      }
    } catch {
      /* fall through */
    }
  }
  return v.replace(/^['"]|['"]$/g, "");
}

function serializeEntry(data: Record<string, unknown>, body: string): string {
  const tags = Array.isArray(data.tags) ? data.tags : String(data.tags || "").split(",").map((t) => t.trim()).filter(Boolean);
  const source = (data.source || {}) as Record<string, unknown>;
  const evidence = (data.evidence || {}) as Record<string, unknown>;
  const lines = [
    "---",
    `title: ${yamlQuote(data.title)}`,
    `claim: ${yamlQuote(data.claim)}`,
    `caption: ${yamlQuote(data.caption)}`,
    `status: ${data.status || "draft"}`,
    `example: ${data.example === true || data.example === "true" ? "true" : "false"}`,
    `published: ${data.published || new Date().toISOString()}`,
    `person: ${yamlQuote(data.person)}`,
    `claimType: ${data.claimType || "other"}`,
    `year: ${Number(data.year) || new Date().getFullYear()}`,
    `tags: [${tags.map((t) => yamlQuote(t)).join(", ")}]`,
    "source:",
    `  url: ${source.url || "https://example.com/replace-me"}`,
    `  date: ${yamlQuote(source.date)}`,
    `  publisher: ${yamlQuote(source.publisher)}`,
  ];
  if (source.title) lines.push(`  title: ${yamlQuote(source.title)}`);
  if (source.quote) lines.push(`  quote: ${yamlQuote(source.quote)}`);
  lines.push("evidence:");
  lines.push(`  path: ${evidence.path || ""}`);
  lines.push(`  kind: ${evidence.kind || "note"}`);
  if (evidence.archiveUrl) lines.push(`  archiveUrl: ${evidence.archiveUrl}`);
  if (evidence.captured) lines.push(`  captured: ${yamlQuote(evidence.captured)}`);
  lines.push("---");
  lines.push("");
  lines.push(body.replace(/\s+$/, "") + "\n");
  return lines.join("\n");
}

function yamlQuote(value: unknown): string {
  const s = String(value ?? "");
  if (s === "") return '""';
  if (/[:#{}[\],&*?|<>=!%@`'"\\\n]/.test(s) || /^(true|false|null|yes|no)$/i.test(s)) {
    return JSON.stringify(s);
  }
  return s;
}
