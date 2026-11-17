import config from "@payload-config";
import { cacheLife, cacheTag } from "next/cache";
import {
  getPayload,
  type CollectionSlug,
  type GlobalSlug,
  type Sort,
  type Where,
} from "payload";
import { CMS_CACHE_TAG } from "@/lib/cms/cache-tag";

/**
 * Cached Payload reads for the public site.
 *
 * Results are kept until an editor changes content: every collection and
 * global revalidates CMS_CACHE_TAG on save/delete (see revalidate-hooks.ts).
 * One shared tag is used because pages populate relationships (depth > 0),
 * so a change to e.g. a media item or post can affect many cached entries.
 *
 * Errors are not cached, so a failed query is retried on the next request.
 */

export async function findGlobalCached<TSlug extends GlobalSlug>(
  slug: TSlug,
  depth?: number,
) {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_CACHE_TAG);
  const payload = await getPayload({ config });
  return payload.findGlobal({ slug, depth });
}

export type CachedFindArgs<TSlug extends CollectionSlug> = {
  collection: TSlug;
  where?: Where;
  sort?: Sort;
  limit?: number;
  page?: number;
  depth?: number;
  pagination?: boolean;
};

export async function findCached<TSlug extends CollectionSlug>(
  args: CachedFindArgs<TSlug>,
) {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_CACHE_TAG);
  const payload = await getPayload({ config });
  return payload.find(args);
}

/** Slugs of every document in a collection, for generateStaticParams. */
export async function findSlugsCached(
  collection: CollectionSlug,
): Promise<string[]> {
  "use cache";
  cacheLife("max");
  cacheTag(CMS_CACHE_TAG);
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection,
    depth: 0,
    pagination: false,
    select: { slug: true },
  });
  return (docs as unknown[]).flatMap((doc) =>
    typeof doc === "object" &&
    doc !== null &&
    "slug" in doc &&
    typeof doc.slug === "string" &&
    doc.slug
      ? [doc.slug]
      : [],
  );
}
