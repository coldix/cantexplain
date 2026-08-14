import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

export const claimTypes = ["health", "climate", "money", "speech"] as const;

export const entryStatuses = ["draft", "published", "featured"] as const;

export const evidenceKinds = [
  "screenshot",
  "html",
  "pdf",
  "transcript",
  "note",
] as const;

/** YAML unquoted 2024-03-12 becomes a Date; unquoted 2024 in a tag list becomes a number. */
const isoDay = z.union([
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  z.date().transform((d) => d.toISOString().slice(0, 10)),
]);
const tag = z.union([z.string(), z.number()]).transform((v) => String(v));

const entries = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./content/entries" }),
  schema: z.object({
    title: z.string(),
    claim: z.string(),
    caption: z.string(),
    status: z.enum(entryStatuses),
    example: z.boolean().default(false),
    published: z.coerce.date(),
    person: z.string(),
    claimType: z.enum(claimTypes),
    year: z.number().int(),
    tags: z.array(tag),
    source: z.object({
      url: z.string().url(),
      date: isoDay,
      publisher: z.string(),
      title: z.string().optional(),
      quote: z.string().optional(),
    }),
    evidence: z.object({
      path: z.string(),
      kind: z.enum(evidenceKinds),
      archiveUrl: z.string().url().optional(),
      captured: isoDay.optional(),
    }),
    media: z
      .object({
        type: z.enum(["image", "video", "side-by-side"]),
        src: z.string(),
        alt: z.string().optional(),
        caption: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = { entries };
