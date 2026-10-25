import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { isRecord } from "@/lib/helper/is-record.helper";
import { isRichText } from "@/lib/helper/is-rich-text.helper";

type BlogCategory = {
  id?: string | number;
  title: string;
};

type BlogAuthor = {
  firstName?: string | null;
  lastName?: string | null;
};

type BlogCoverImage = {
  url?: string | null;
  alt?: string | null;
};

export type BlogDocument = {
  title: string;
  slug: string;
  excerpt?: string | null;
  content?: DefaultTypedEditorState | null;
  publishedAt?: string | null;
  coverImage?: BlogCoverImage | string | number | null;
  author?: BlogAuthor | string | number | null;
  categories?: (BlogCategory | string | number)[] | null;
};

export function isBlogDocument(value: unknown): value is BlogDocument {
  if (
    !isRecord(value) ||
    typeof value.title !== "string" ||
    typeof value.slug !== "string"
  ) {
    return false;
  }

  const validContent =
    value.content === undefined ||
    value.content === null ||
    isRichText(value.content);
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
  const validAuthor =
    value.author === undefined ||
    value.author === null ||
    typeof value.author === "string" ||
    typeof value.author === "number" ||
    (isRecord(value.author) &&
      (value.author.firstName === undefined ||
        value.author.firstName === null ||
        typeof value.author.firstName === "string") &&
      (value.author.lastName === undefined ||
        value.author.lastName === null ||
        typeof value.author.lastName === "string"));
  const validCategories =
    value.categories === undefined ||
    value.categories === null ||
    (Array.isArray(value.categories) &&
      value.categories.every(
        (category) =>
          typeof category === "string" ||
          typeof category === "number" ||
          (isRecord(category) &&
            typeof category.title === "string" &&
            (category.id === undefined ||
              typeof category.id === "string" ||
              typeof category.id === "number")),
      ));

  return (
    validContent &&
    (value.excerpt === undefined ||
      value.excerpt === null ||
      typeof value.excerpt === "string") &&
    (value.publishedAt === undefined ||
      value.publishedAt === null ||
      typeof value.publishedAt === "string") &&
    validCoverImage &&
    validAuthor &&
    validCategories
  );
}
