import type { MetadataRoute } from "next";
import config from "@payload-config";
import { cacheLife, cacheTag } from "next/cache";
import { getPayload, type Where } from "payload";
import { findGlobalCached } from "@/lib/cms/cache";
import { CMS_CACHE_TAG } from "@/lib/cms/cache-tag";
import { getLegalPolicies } from "@/lib/legal-policy";
import { isRecord } from "@/lib/helper/is-record.helper";
import {
  getSiteSettings,
  isIndexingAllowed,
} from "@/lib/seo/get-site-settings";
import { parseSeo } from "@/lib/seo/parse";
import { getSiteUrl } from "@/lib/seo/site-url";

/** Listing pages and the global that holds their content (and SEO settings). */
const STATIC_PAGES = [
  { path: "", global: "home", priority: 1 },
  { path: "/services", global: "servicesPage", priority: 0.9 },
  { path: "/works", global: "workPage", priority: 0.8 },
  { path: "/how-we-work", global: "howWeWorkPage", priority: 0.7 },
  { path: "/about", global: "about", priority: 0.7 },
  { path: "/blogs", global: "blogPage", priority: 0.7 },
  { path: "/contact", global: "contactPage", priority: 0.6 },
] as const;

/** Collections that have their own public detail page. */
const COLLECTION_PAGES = [
  { collection: "services", prefix: "/services", drafts: false, priority: 0.8 },
  { collection: "works", prefix: "/works", drafts: true, priority: 0.6 },
  { collection: "posts", prefix: "/blogs", drafts: true, priority: 0.6 },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings();
  if (!isIndexingAllowed(settings)) return [];

  const siteUrl = getSiteUrl();
  const toUrl = (path: string) => new URL(path, siteUrl).toString();
  const [globals, collections, legalPolicies] = await Promise.all([
    Promise.all(
      STATIC_PAGES.map(async (page) => ({
        page,
        doc: await findGlobalCached(page.global, 0).catch(() => null),
      })),
    ),
    Promise.all(
      COLLECTION_PAGES.map(async (entry) => ({
        entry,
        docs: await getIndexableDocuments(entry.collection, entry.drafts),
      })),
    ),
    getLegalPolicies(),
  ]);

  const staticRoutes = globals.flatMap(({ page, doc }) =>
    isRecord(doc) && parseSeo(doc.seo).noIndex
      ? []
      : [
          {
            url: toUrl(page.path || "/"),
            lastModified: isRecord(doc) ? toDate(doc.updatedAt) : undefined,
            changeFrequency: "weekly" as const,
            priority: page.priority,
          },
        ],
  );

  const detailRoutes = collections.flatMap(({ entry, docs }) =>
    docs.map((doc) => ({
      url: toUrl(`${entry.prefix}/${doc.slug}`),
      lastModified: doc.lastModified,
      changeFrequency: "monthly" as const,
      priority: entry.priority,
    })),
  );

  const policyRoutes = legalPolicies
    .filter((policy) => !parseSeo(policy.seo).noIndex)
    .map((policy) => ({
      url: toUrl(`/${policy.slug}`),
      lastModified: toDate(policy.lastUpdated),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    }));

  return [...staticRoutes, ...detailRoutes, ...policyRoutes];
}

function toDate(value: unknown): Date | undefined {
  return typeof value === "string" && value ? new Date(value) : undefined;
}

async function getIndexableDocuments(
  collection: (typeof COLLECTION_PAGES)[number]["collection"],
  drafts: boolean,
) {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_CACHE_TAG);
  const payload = await getPayload({ config });
  const where: Where | undefined = drafts
    ? { _status: { equals: "published" } }
    : undefined;
  const docs: { slug: string; lastModified?: Date }[] = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const result = await payload.find({
      collection,
      depth: 0,
      limit: 500,
      page,
      where,
      select: { slug: true, updatedAt: true, publishedAt: true, seo: true },
    });

    for (const doc of result.docs as unknown[]) {
      if (!isRecord(doc) || typeof doc.slug !== "string") continue;
      // Filtered here: a NULL "noIndex" on older rows would fail a `not_equals` query.
      if (parseSeo(doc.seo).noIndex) continue;
      docs.push({
        slug: doc.slug,
        lastModified: toDate(doc.updatedAt) ?? toDate(doc.publishedAt),
      });
    }

    hasNextPage = result.hasNextPage;
    page += 1;
  }

  return docs;
}
