export const SITE_URL = "https://optanwar.vercel.app";

export function getSiteUrl(site?: URL | string | undefined): string {
  if (site) {
    const value = typeof site === "string" ? site : site.toString();
    return value.replace(/\/$/, "");
  }
  return SITE_URL;
}

export const TWITTER_HANDLE = "@optanwar";
