// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

/**
 * Static-first on purpose.
 *
 * Official Astro + Cloudflare docs: if you are using Astro as a static site
 * builder, you do not need @astrojs/cloudflare. That adapter is for on-demand
 * rendering (SSR, server islands, sessions). This site is a content collection
 * with optional client filters — same family pattern as electiontracker.au.
 *
 * Deploy is an assets-only Worker via wrangler.jsonc (Workers Builds). See
 * docs/BRIEF.md § stack decision and README.md.
 */
export default defineConfig({
  site: "https://cantexplain.au",
  output: "static",
  trailingSlash: "never",
  integrations: [mdx(), sitemap()],
  build: { inlineStylesheets: "auto" },
  devToolbar: { enabled: false },
});
