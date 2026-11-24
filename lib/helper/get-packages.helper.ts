import { findCached } from "@/lib/cms/cache";
import {
  PACKAGE_COLLECTION_SLUG,
  PACKAGES_ROUTE,
} from "@/lib/const/package.const";
import { isPackageDocument } from "@/lib/helper/is-package-document.helper";
import type { PackageDocument } from "@/lib/type/package.type";

/** Every package in display order. `requires` is populated (depth 1). */
export async function getPackages(): Promise<PackageDocument[]> {
  const { docs } = await findCached({
    collection: PACKAGE_COLLECTION_SLUG,
    sort: "order",
    depth: 1,
    pagination: false,
  });
  return (docs as unknown[]).filter(isPackageDocument);
}

export function getPackageHref(slug?: string | null): string {
  return slug
    ? `${PACKAGES_ROUTE}#${encodeURIComponent(slug)}`
    : PACKAGES_ROUTE;
}
