import type { Payload } from "payload";
import {
  SERVICE_COLLECTION_SLUG,
  SERVICES_ROUTE,
} from "@/lib/const/service.const";
import { isServiceDocument } from "@/lib/helper/is-service-document.helper";
import type { ServiceDocument } from "@/lib/type/service.type";

export async function getServiceBySlug(
  payload: Payload,
  slug: string,
): Promise<ServiceDocument | null> {
  const { docs } = await payload.find({
    collection: SERVICE_COLLECTION_SLUG,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  });
  const service: unknown = docs[0];

  return isServiceDocument(service) ? service : null;
}

export function getServiceHref(slug: string): string {
  return `${SERVICES_ROUTE}/${encodeURIComponent(slug)}`;
}
