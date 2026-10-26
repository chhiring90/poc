import { isRecord } from "@/lib/helper/is-record.helper";

export function isTextItems(
  value: unknown,
  field: "tag",
): value is { id?: string | null; tag: string }[];
export function isTextItems(
  value: unknown,
  field: "technology",
): value is { id?: string | null; technology: string }[];
export function isTextItems(
  value: unknown,
  field: "tag" | "technology",
): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item[field] === "string" &&
        (item.id === undefined ||
          item.id === null ||
          typeof item.id === "string"),
    )
  );
}
