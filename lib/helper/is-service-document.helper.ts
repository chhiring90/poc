import { isRecord } from "@/lib/helper/is-record.helper";
import { isRichText } from "@/lib/helper/is-rich-text.helper";
import type { FAQGroup } from "@/lib/type/faq.type";
import { isPackageDocument } from "@/lib/helper/is-package-document.helper";
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

function isOptionalGroup(
  value: unknown,
  keys: string[],
): boolean {
  return (
    value === undefined ||
    value === null ||
    (isRecord(value) && keys.every((key) => isOptionalString(value[key])))
  );
}

function isTitledItems(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    (Array.isArray(value) &&
      value.every(
        (item) =>
          isRecord(item) &&
          typeof item.title === "string" &&
          isOptionalString(item.description) &&
          isOptionalString(item.note) &&
          isOptionalString(item.id),
      ))
  );
}

function isFAQGroup(value: unknown): value is FAQGroup {
  return (
    isRecord(value) &&
    (typeof value.id === "string" || typeof value.id === "number") &&
    typeof value.name === "string"
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

  const validCTA = isOptionalGroup(value.ctaButton, ["label", "url"]);
  const closing = value.closing;
  const validClosing =
    isOptionalGroup(closing, ["heading"]) &&
    (!isRecord(closing) ||
      isOptionalGroup(closing.secondaryLink, ["label", "url"]));
  const validPackage =
    isRelationshipReference(value.package) || isPackageDocument(value.package);
  const validFAQGroup =
    isRelationshipReference(value.faqGroup) || isFAQGroup(value.faqGroup);

  return (
    isOptionalString(value.icon) &&
    isOptionalString(value.eyebrow) &&
    isOptionalString(value.subtitle) &&
    isOptionalString(value.headline) &&
    isOptionalString(value.reassurance) &&
    isOptionalString(value.whyItMatters) &&
    isTitledItems(value.startHere) &&
    isTitledItems(value.process) &&
    isTitledItems(value.capabilities) &&
    isOptionalGroup(value.proof, ["client", "result"]) &&
    validClosing &&
    isTextArray(value.technologies, "technology") &&
    isTextArray(value.deliverables, "deliverable") &&
    validCTA &&
    validPackage &&
    validFAQGroup
  );
}
