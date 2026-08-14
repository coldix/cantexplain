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
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !new URL(page).pathname.startsWith("/admin"),
      serialize(item) {
        const path = new URL(item.url).pathname.replace(/\/$/, "") || "/";
        if (path === "/") {
          item.changefreq = "daily";
          item.priority = 1.0;
        } else if (
          path === "/hall" ||
          path === "/method" ||
          path === "/about" ||
          path === "/faq"
        ) {
          item.changefreq = "daily";
          item.priority = 0.9;
        } else if (path.startsWith("/hall/")) {
          item.changefreq = "weekly";
          item.priority = 0.8;
        } else if (path.startsWith("/look/evidence/")) {
          item.changefreq = "monthly";
          item.priority = 0.5;
        } else if (path.startsWith("/look/")) {
          item.changefreq = "monthly";
          item.priority = 0.3;
        } else {
          item.changefreq = "monthly";
          item.priority = 0.4;
        }
        return item;
      },
    }),
  ],
  build: { inlineStylesheets: "auto" },
  devToolbar: { enabled: false },
});
