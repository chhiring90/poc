import { revalidateTag } from "next/cache";
import type { CollectionConfig, GlobalConfig } from "payload";
import { CMS_CACHE_TAG } from "@/lib/cms/cache-tag";

/**
 * Expires the public site's CMS cache. Runs inside Payload hooks, which are
 * called from Next route handlers / server actions (admin and REST API).
 * Outside Next (e.g. `payload migrate` or seed scripts) there is no cache to
 * clear and revalidateTag throws, so that case is ignored.
 */
function revalidateCms(context: Record<string, unknown> | undefined) {
  if (context?.disableRevalidate) return;
  try {
    // expire: 0 — the next visitor gets fresh content, so editors see their change right away.
    revalidateTag(CMS_CACHE_TAG, { expire: 0 });
  } catch {
    // Not running inside a Next.js request.
  }
}

export function withCollectionRevalidation(
  collection: CollectionConfig,
): CollectionConfig {
  const hooks = collection.hooks ?? {};
  return {
    ...collection,
    hooks: {
      ...hooks,
      afterChange: [
        ...(hooks.afterChange ?? []),
        ({ doc, context }) => {
          revalidateCms(context);
          return doc;
        },
      ],
      afterDelete: [
        ...(hooks.afterDelete ?? []),
        ({ doc, context }) => {
          revalidateCms(context);
          return doc;
        },
      ],
    },
  };
}

export function withGlobalRevalidation(global: GlobalConfig): GlobalConfig {
  const hooks = global.hooks ?? {};
  return {
    ...global,
    hooks: {
      ...hooks,
      afterChange: [
        ...(hooks.afterChange ?? []),
        ({ doc, context }) => {
          revalidateCms(context);
          return doc;
        },
      ],
    },
  };
}
