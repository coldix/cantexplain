/** Site-level constants. Presentation concerns, not the content schema. */

export const SITE = {
  name: "Can’t Explain",
  short: "Can’t Explain",
  url: "https://cantexplain.au",
  domain: "cantexplain.au",
  altDomain: "cantexplain.com.au",
  tagline: "The claim was loud. The evidence was not.",
  descriptionLong:
    "A receipt-first hall of ridiculous claims: low-evidence, high-emotion accusations, " +
    "pinned to original sources and Git-timestamped evidence. Observational humour. " +
    "Sibling of ministryofdoubt.com and electiontracker.au.",
  repo: "https://github.com/coldix/cantexplain",
  issues: "https://github.com/coldix/cantexplain/issues/new",
  email: "ce@cantexplain.au",
  publisher: "Oze",
  publisherUrl: "https://oze.au",
  gaMeasurementId: "G-J0TM5BKG3S",
  // DNS verification is already on the zone. HTML tag is a second method.
  googleSiteVerification: "qJJ2QZd7hTZNj0ZTvH6ybVEWhsejOgJZUtl2MEL1muM",
};

/** Bump when terms, privacy or the disclaimer change materially. */
export const LEGAL_UPDATED = "2026-08-14";

export const MAINTAINER = {
  name: "Colin Dixon",
  x: "https://x.com/colindixon",
  xHandle: "@colindixon",
  linkedin: "https://www.linkedin.com/in/colindixon/",
  publisherUrl: SITE.publisherUrl,
};

export const FAMILY = [
  {
    name: "Ministry of Doubt",
    href: "https://ministryofdoubt.com",
    line: "Suspicion is not proof. Authority is not proof either.",
  },
  {
    name: "Election Tracker",
    href: "https://electiontracker.au",
    line: "Sourced Australian election ledger. Not a forecast.",
  },
  {
    name: "Oze Unleashed",
    href: "https://ozeunleashed.substack.com",
    line: "Longer essays. Still sourced.",
  },
] as const;

export const CLAIM_TYPE_LABEL: Record<string, string> = {
  health: "Health",
  climate: "Climate",
  money: "Money",
  speech: "Speech",
};

/** How far the slogan travelled. Not how true. Not a Google hit-count. */
export const LOUDNESS_HINT: Record<number, string> = {
  10: "Official instruction to the public",
  9: "PM, Premier, or regulator headline",
  8: "Minister, agency refrain, or national campaign",
  7: "Major-outlet splash or opposition campaign",
  6: "State project line, repeated",
  5: "Rally, campus, or one interview that travelled",
  4: "Niche but sourced",
  3: "Thin circulation",
  2: "Format example",
  1: "Draft",
};

export const loudnessOf = (n: number | undefined) => {
  const v = Number(n);
  if (Number.isInteger(v) && v >= 1 && v <= 10) return v;
  return 5;
};

/**
 * Date-only strings must not shift by build-host timezone.
 * Parse as noon UTC and format in Melbourne, same as electiontracker.au.
 */
export const formatDate = (iso: string | Date, opts: Intl.DateTimeFormatOptions = {}) => {
  const raw = iso instanceof Date ? iso.toISOString().slice(0, 10) : iso;
  if (!raw) return null;
  return new Date(`${raw}T12:00:00Z`).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "Australia/Melbourne",
    ...opts,
  });
};

export const formatDateLong = (iso: string | Date) =>
  formatDate(iso, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

export const isLive = (status: string) => status === "published" || status === "featured";
