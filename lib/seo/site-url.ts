/** Public origin of the site, e.g. https://poc.dev. One source of truth for metadata, sitemap and robots. */
export function getSiteUrl(): string {
  const configuredUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL ??
    "http://localhost:3000";
  const url = configuredUrl.startsWith("http")
    ? configuredUrl
    : `https://${configuredUrl}`;

  return new URL(url).origin;
}

export function absoluteUrl(path: string): string {
  return new URL(path, getSiteUrl()).toString();
}
