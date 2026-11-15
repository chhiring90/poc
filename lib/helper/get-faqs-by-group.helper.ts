import type { Payload } from "payload";
import { isRecord } from "@/lib/helper/is-record.helper";
import { isRichText } from "@/lib/helper/is-rich-text.helper";
import type { FAQGroupReference, FAQItem } from "@/lib/type/faq.type";

function isFAQItem(value: unknown): value is FAQItem {
  return (
    isRecord(value) &&
    (typeof value.id === "string" || typeof value.id === "number") &&
    typeof value.question === "string" &&
    isRichText(value.ans)
  );
}

export function getFAQGroupId(
  group: FAQGroupReference | undefined,
): number | string | null {
  if (typeof group === "number" || typeof group === "string") return group;
  return group?.id ?? null;
}

export async function getFAQsByGroup(
  payload: Payload,
  group: FAQGroupReference | undefined,
): Promise<FAQItem[]> {
  const groupId = getFAQGroupId(group);
  if (groupId === null) return [];

  const { docs } = await payload.find({
    collection: "faqs",
    where: { group: { equals: groupId } },
    sort: "order",
    depth: 0,
    pagination: false,
  });

  return (docs as unknown[]).filter(isFAQItem);
}
