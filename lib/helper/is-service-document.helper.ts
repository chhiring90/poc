import { isRecord } from "@/lib/helper/is-record.helper";
import { isRichText } from "@/lib/helper/is-rich-text.helper";
import type { FAQGroup, FAQItem } from "@/lib/type/faq.type";
import type { PackageDocument } from "@/lib/type/package.type";
import type { ServiceDocument } from "@/lib/type/service.type";

function isOptionalString(value: unknown): boolean {
  return value === undefined || value === null || typeof value === "string";
}

function isTextArray(value: unknown, key: string): boolean {
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

function isPackageDocument(value: unknown): value is PackageDocument {
  return (
    isRecord(value) &&
    (typeof value.id === "string" || typeof value.id === "number") &&
    typeof value.name === "string" &&
    isOptionalString(value.description) &&
    isOptionalString(value.price) &&
    isTextArray(value.features, "feature")
  );
}

function isFAQGroup(value: unknown): value is FAQGroup {
  return (
    isRecord(value) &&
    (typeof value.id === "string" || typeof value.id === "number") &&
    typeof value.name === "string"
  );
}

function isFAQItem(value: unknown): value is FAQItem {
  return (
    isRecord(value) &&
    (typeof value.id === "string" || typeof value.id === "number") &&
    typeof value.question === "string" &&
    isRichText(value.ans) &&
    (value.group === undefined ||
      value.group === null ||
      isRelationshipReference(value.group) ||
      isFAQGroup(value.group))
  );
}

function isRelationshipReference(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    typeof value === "string" ||
    typeof value === "number"
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
  const validPackage =
    isRelationshipReference(value.package) || isPackageDocument(value.package);
  const validFAQGroup =
    isRelationshipReference(value.faqGroup) || isFAQGroup(value.faqGroup);
  const validFAQ = isRelationshipReference(value.faq) || isFAQItem(value.faq);

  return (
    isOptionalString(value.icon) &&
    isOptionalString(value.eyebrow) &&
    isOptionalString(value.subtitle) &&
    isTextArray(value.technologies, "technology") &&
    isTextArray(value.deliverables, "deliverable") &&
    validCTA &&
    validPackage &&
    validFAQGroup &&
    validFAQ
  );
}
