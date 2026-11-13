import { isRecord } from "@/lib/helper/is-record.helper";
import { isRichText } from "@/lib/helper/is-rich-text.helper";
import type { ServiceDocument } from "@/lib/type/service.type";

function isOptionalString(value: unknown): boolean {
  return value === undefined || value === null || typeof value === "string";
}

function isTextArray(value: unknown, key: "technology" | "deliverable"): boolean {
  return (
    value === undefined ||
    value === null ||
    (Array.isArray(value) &&
      value.every(
        (item) =>
          isRecord(item) &&
          typeof item[key] === "string" &&
          (item.id === undefined ||
            item.id === null ||
            typeof item.id === "string"),
      ))
  );
}

export function isServiceDocument(value: unknown): value is ServiceDocument {
  if (
    !isRecord(value) ||
    (typeof value.id !== "string" && typeof value.id !== "number") ||
    typeof value.name !== "string" ||
    typeof value.slug !== "string" ||
    !isRichText(value.descriptionRichText)
  ) {
    return false;
  }

  const ctaButton = value.ctaButton;
  const validCTA =
    ctaButton === undefined ||
    ctaButton === null ||
    (isRecord(ctaButton) &&
      isOptionalString(ctaButton.label) &&
      isOptionalString(ctaButton.url));

  return (
    isOptionalString(value.icon) &&
    isOptionalString(value.eyebrow) &&
    isOptionalString(value.subtitle) &&
    isTextArray(value.technologies, "technology") &&
    isTextArray(value.deliverables, "deliverable") &&
    validCTA
  );
}
