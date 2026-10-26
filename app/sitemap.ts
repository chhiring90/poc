import type { MetadataRoute } from "next";
import { connection } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";
import { getLegalPolicies } from "@/lib/legal-policy";

function getSiteUrl() {
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connection();

  const siteUrl = getSiteUrl();
  const payload = await getPayload({ config });
  const legalPolicies = await getLegalPolicies();
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/works",
    "/blogs",
    "/contact",
    ...legalPolicies.map(({ slug }) => `/${slug}`),
  ].map((path) => ({ url: new URL(path, siteUrl).toString() }));

  const [posts, works] = await Promise.all([
    getPublishedDocuments(payload, "posts"),
    getPublishedDocuments(payload, "works"),
  ]);

  const postRoutes = posts.flatMap((post) =>
    typeof post.slug === "string"
      ? [
          {
            url: new URL(`/blogs/${post.slug}`, siteUrl).toString(),
            lastModified: post.publishedAt ?? post.updatedAt,
          },
        ]
      : [],
  );
  const workRoutes = works.flatMap((work) =>
    typeof work.slug === "string"
      ? [
          {
            url: new URL(`/works/${work.slug}`, siteUrl).toString(),
            lastModified: work.updatedAt,
          },
        ]
      : [],
  );

  return [...staticRoutes, ...postRoutes, ...workRoutes];
}

async function getPublishedDocuments(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: "posts" | "works",
) {
  const docs = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const result = await payload.find({
      collection,
      depth: 0,
      limit: 500,
      page,
      where: { _status: { equals: "published" } },
    });
    docs.push(...result.docs);
    hasNextPage = result.hasNextPage;
    page += 1;
  }

  return docs;
}
