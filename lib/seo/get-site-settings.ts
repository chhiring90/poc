import { cache } from "react";
import { findGlobalCached } from "@/lib/cms/cache";
import { isRecord } from "@/lib/helper/is-record.helper";
import { parseMedia, type SeoMedia } from "@/lib/seo/parse";

export type SiteSettings = {
  siteName: string;
  defaultTitle: string | null;
  defaultDescription: string | null;
  defaultImage: SeoMedia | null;
  locale: string;
  twitterHandle: string | null;
  allowIndexing: boolean;
  verification: { google: string | null; bing: string | null };
  organization: {
    name: string;
    legalName: string | null;
    logo: SeoMedia | null;
    email: string | null;
    telephone: string | null;
    address: {
      streetAddress: string | null;
      locality: string | null;
      region: string | null;
      postalCode: string | null;
      country: string | null;
    };
    areaServed: string | null;
    sameAs: string[];
  };
};

const DEFAULT_SITE_NAME = "POC Tech";

function text(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function record(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function urls(values: unknown, key: string): string[] {
  return Array.isArray(values)
    ? values.flatMap((item) => {
        const url = isRecord(item) ? text(item[key]) : null;
        return url && /^https?:\/\//.test(url) ? [url] : [];
      })
    : [];
}

async function findGlobalSafely(slug: string, depth: number) {
  try {
    return record(await findGlobalCached(slug, depth));
  } catch {
    // e.g. the siteSettings table has not been migrated yet; fall back to defaults.
    return {};
  }
}

/** Site-wide SEO settings with safe defaults. The CMS reads are cached across requests. */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const [settings, footer] = await Promise.all([
    findGlobalSafely("siteSettings", 1),
    findGlobalSafely("footer", 0),
  ]);
  const organization = record(settings.organization);
  const address = record(organization.address);
  const verification = record(settings.verification);
  const siteName = text(settings.siteName) ?? DEFAULT_SITE_NAME;
  const sameAs = urls(organization.sameAs, "url");

  return {
    siteName,
    defaultTitle: text(settings.defaultTitle),
    defaultDescription: text(settings.defaultDescription),
    defaultImage: parseMedia(settings.defaultImage),
    locale: text(settings.locale) ?? "en_GB",
    twitterHandle: text(settings.twitterHandle),
    allowIndexing: settings.allowIndexing !== false,
    verification: {
      google: text(verification.google),
      bing: text(verification.bing),
    },
    organization: {
      name: text(organization.name) ?? siteName,
      legalName: text(organization.legalName),
      logo: parseMedia(organization.logo),
      email: text(organization.email),
      telephone: text(organization.telephone),
      address: {
        streetAddress: text(address.streetAddress),
        locality: text(address.locality),
        region: text(address.region),
        postalCode: text(address.postalCode),
        country: text(address.country),
      },
      areaServed: text(organization.areaServed),
      sameAs: sameAs.length > 0 ? sameAs : urls(footer.socialLinks, "url"),
    },
  };
});

/** False when the CMS switch is off or this is a non-production Vercel deployment. */
export function isIndexingAllowed(settings: SiteSettings): boolean {
  const vercelEnv = process.env.VERCEL_ENV;
  return settings.allowIndexing && (!vercelEnv || vercelEnv === "production");
}
