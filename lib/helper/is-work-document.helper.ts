import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { isRecord } from "@/lib/helper/is-record.helper";
import { isRichText } from "@/lib/helper/is-rich-text.helper";
import { isTextItems } from "@/lib/helper/is-text-items.helper";

export type WorkDocument = {
  title: string;
  year?: number | null;
  category?: string | number | { title?: string | null } | null;
  description: DefaultTypedEditorState;
  challenge?: DefaultTypedEditorState | null;
  result?: DefaultTypedEditorState | null;
  technologies?: { id?: string | null; technology: string }[] | null;
  coverImage?:
    | string
    | number
    | { url?: string | null; alt?: string | null }
    | null;
};

export function isWorkDocument(value: unknown): value is WorkDocument {
  if (
    !isRecord(value) ||
    typeof value.title !== "string" ||
    !isRichText(value.description)
  ) {
    return false;
  }

  const validCoverImage =
    value.coverImage === undefined ||
    value.coverImage === null ||
    typeof value.coverImage === "string" ||
    typeof value.coverImage === "number" ||
    (isRecord(value.coverImage) &&
      (value.coverImage.url === undefined ||
        value.coverImage.url === null ||
        typeof value.coverImage.url === "string") &&
      (value.coverImage.alt === undefined ||
        value.coverImage.alt === null ||
        typeof value.coverImage.alt === "string"));

  return (
    (value.year === undefined ||
      value.year === null ||
      typeof value.year === "number") &&
    (value.category === undefined ||
      value.category === null ||
      typeof value.category === "string" ||
      typeof value.category === "number" ||
      (isRecord(value.category) &&
        (value.category.title === undefined ||
          value.category.title === null ||
          typeof value.category.title === "string"))) &&
    (value.challenge === undefined ||
      value.challenge === null ||
      isRichText(value.challenge)) &&
    (value.result === undefined ||
      value.result === null ||
      isRichText(value.result)) &&
    validCoverImage &&
    (value.technologies === undefined ||
      value.technologies === null ||
      isTextItems(value.technologies, "technology"))
  );
}
