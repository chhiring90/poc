import { isRecord } from "@/lib/helper/is-record.helper";
import type { PackageDocument } from "@/lib/type/package.type";

function isOptionalString(value: unknown): boolean {
  return value === undefined || value === null || typeof value === "string";
}

function isId(value: unknown): value is number | string {
  return typeof value === "number" || typeof value === "string";
}

/** Array rows: every row is a record whose `required` keys are strings. */
function isRows(
  value: unknown,
  required: string[],
  optional: string[] = [],
  check: (row: Record<string, unknown>) => boolean = () => true,
): boolean {
  return (
    value === undefined ||
    value === null ||
    (Array.isArray(value) &&
      value.every(
        (row) =>
          isRecord(row) &&
          isOptionalString(row.id) &&
          required.every((key) => typeof row[key] === "string") &&
          optional.every((key) => isOptionalString(row[key])) &&
          check(row),
      ))
  );
}

function isRequirement(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    isId(value) ||
    (isRecord(value) &&
      isId(value.id) &&
      typeof value.name === "string" &&
      typeof value.slug === "string")
  );
}

export function isPackageDocument(value: unknown): value is PackageDocument {
  return (
    isRecord(value) &&
    isId(value.id) &&
    typeof value.name === "string" &&
    isOptionalString(value.slug) &&
    (value.order === undefined ||
      value.order === null ||
      typeof value.order === "number") &&
    isOptionalString(value.icon) &&
    isOptionalString(value.tagline) &&
    isOptionalString(value.description) &&
    isOptionalString(value.included) &&
    isOptionalString(value.notIncluded) &&
    isOptionalString(value.price) &&
    isOptionalString(value.priceDependsOn) &&
    isOptionalString(value.timing) &&
    isRows(value.features, ["feature"]) &&
    isRows(value.options, ["heading"], [], (row) =>
      isRows(row.items, ["name"], ["detail"]),
    ) &&
    isRows(value.terms, ["label", "value"]) &&
    isRows(value.deliverableGroups, [], ["heading", "intro"], (row) =>
      isRows(row.items, ["text"]),
    ) &&
    isRequirement(value.requires)
  );
}
