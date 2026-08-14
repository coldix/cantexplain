import { SITE } from "./site";

export function withUtm(url: string, source: string) {
  const u = new URL(url, SITE.url);
  u.searchParams.set("utm_source", source);
  u.searchParams.set("utm_medium", "share");
  u.searchParams.set("utm_campaign", "receipt");
  return u.href;
}

export function sharePack(url: string, text: string, source = "copy") {
  const link = withUtm(url, source);
  return `${text}\n${link}\n\nvia ${SITE.domain} — ${SITE.tagline}`;
}

export type ShareTarget = {
  key: string;
  label: string;
  href: string;
};

export function shareTargets(url: string, text: string): ShareTarget[] {
  const encodedText = encodeURIComponent(text);
  return [
    {
      key: "x",
      label: "X",
      href: `https://x.com/intent/tweet?text=${encodedText}&url=${encodeURIComponent(withUtm(url, "x"))}`,
    },
    {
      key: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(withUtm(url, "facebook"))}`,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(withUtm(url, "linkedin"))}`,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${text} ${withUtm(url, "whatsapp")}`)}`,
    },
    {
      key: "telegram",
      label: "Telegram",
      href: `https://t.me/share/url?url=${encodeURIComponent(withUtm(url, "telegram"))}&text=${encodedText}`,
    },
    {
      key: "email",
      label: "Email",
      href: `mailto:?subject=${encodedText}&body=${encodeURIComponent(sharePack(url, text, "email"))}`,
    },
  ];
}

/** Map a repo markdown URL to the pretty /look/ path, or null. */
export function lookPathFromHref(href: string, origin: string) {
  let u: URL;
  try {
    u = new URL(href, origin);
  } catch {
    return null;
  }
  if (!/\.md$/i.test(u.pathname)) return null;

  if (u.origin === new URL(origin).origin) {
    const path = u.pathname.replace(/\/$/, "");
    if (path.startsWith("/look/")) return path;
    return `/look${path}`;
  }

  const gh = u.pathname.match(
    /^\/coldix\/cantexplain\/(?:blob|raw)\/[^/]+\/(.+\.md)$/i,
  );
  if (u.hostname === "github.com" && gh) return `/look/${gh[1]}`;

  return null;
}
