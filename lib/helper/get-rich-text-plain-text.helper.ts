import { isRecord } from "@/lib/helper/is-record.helper";

export function getRichTextPlainText(value: unknown): string {
  if (!isRecord(value)) return "";

  if (isRecord(value.root)) {
    return getRichTextPlainText(value.root);
  }

  if (!Array.isArray(value.children)) {
    return typeof value.text === "string" ? value.text : "";
  }

  return value.children
    .map(getRichTextPlainText)
    .filter(Boolean)
    .join(" ");
}
