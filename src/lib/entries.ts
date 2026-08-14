import { getCollection, type CollectionEntry } from "astro:content";
import { isLive } from "./site";

export type Entry = CollectionEntry<"entries">;

/** Newest filed first. `published` is when we put the card in the hall. */
function byNewest(a: Entry, b: Entry) {
  const published = b.data.published.valueOf() - a.data.published.valueOf();
  if (published !== 0) return published;
  return String(b.data.source.date).localeCompare(String(a.data.source.date));
}

export async function liveEntries(): Promise<Entry[]> {
  const all = await getCollection("entries");
  return all.filter((e) => isLive(e.data.status)).sort(byNewest);
}

export async function featuredEntries(): Promise<Entry[]> {
  const live = await liveEntries();
  const featured = live.filter((e) => e.data.status === "featured");
  return featured.length ? featured : live.slice(0, 3);
}

export function entryHref(entry: Entry) {
  return `/hall/${entry.id}`;
}

export function evidenceHref(path: string) {
  const rel = path.replace(/^\//, "");
  return rel.endsWith(".md") ? `/look/evidence/${rel}` : `/evidence/${rel}`;
}

export function uniqueSorted(values: string[]) {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b, "en-AU"));
}
