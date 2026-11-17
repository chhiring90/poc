import type { Metadata } from "next";
import { cache } from "react";
import { findGlobalCached } from "@/lib/cms/cache";
import { isRecord } from "@/lib/helper/is-record.helper";
import { buildPageMetadata } from "@/lib/seo/build-metadata";

const getGlobalForSeo = cache(
  async (slug: string): Promise<Record<string, unknown>> => {
    try {
      const doc: unknown = await findGlobalCached(slug, 1);
      return isRecord(doc) ? doc : {};
    } catch {
      return {};
    }
  },
);

function field(doc: Record<string, unknown>, path: string): unknown {
  return path
    .split(".")
    .reduce<unknown>((value, key) => (isRecord(value) ? value[key] : undefined), doc);
}

function firstText(
  doc: Record<string, unknown>,
  paths: string[],
): string | null {
  for (const path of paths) {
    const value = field(doc, path);
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

/**
 * Metadata for a page whose content lives in a Payload global.
 * Uses the global's `seo` group first, then the listed content fields.
 */
export async function buildGlobalPageMetadata(options: {
  global: string;
  path: string;
  titleFields?: string[];
  descriptionFields?: string[];
  imageField?: string;
  /** Used when the CMS has no SEO title or heading, so pages never share the bare site name. */
  fallbackTitle?: string;
  /** Used when the CMS has no SEO description and none of descriptionFields are filled. */
  fallbackDescription?: string;
  isHome?: boolean;
}): Promise<Metadata> {
  const doc = await getGlobalForSeo(options.global);

  return buildPageMetadata({
    path: options.path,
    seo: doc.seo,
    title: firstText(doc, options.titleFields ?? []) ?? options.fallbackTitle,
    description:
      firstText(doc, options.descriptionFields ?? []) ??
      options.fallbackDescription,
    image: options.imageField ? field(doc, options.imageField) : undefined,
    isHome: options.isHome,
  });
}
