import { isRecord } from "@/lib/helper/is-record.helper";
import { getRichTextPlainText } from "@/lib/helper/get-rich-text-plain-text.helper";

export type BlogPostCardData = {
  id: string | number;
  title: string;
  slug: string;
  excerpt: string;
  categories: string[];
  coverImage: { url: string; alt: string } | null;
  author: string;
  publishedAt: string;
  readTime: number;
};

export function toBlogPost(value: unknown): BlogPostCardData | null {
  if (
    !isRecord(value) ||
    (typeof value.id !== "string" && typeof value.id !== "number") ||
    typeof value.title !== "string" ||
    typeof value.slug !== "string"
  ) {
    return null;
  }

  const contentText = getRichTextPlainText(value.content);
  const categories = Array.isArray(value.categories)
    ? value.categories
        .filter(
        (category): category is Record<string, unknown> & { title: string } =>
            isRecord(category) && typeof category.title === "string",
        )
      .map((category) => category.title)
    : [];
  const author = isRecord(value.author)
    ? [value.author.firstName, value.author.lastName]
        .filter((name): name is string => typeof name === "string" && !!name)
        .join(" ")
    : "";
  const coverImage =
    isRecord(value.coverImage) &&
    typeof value.coverImage.url === "string" &&
    value.coverImage.url.length > 0
      ? {
          url: value.coverImage.url,
          alt:
            typeof value.coverImage.alt === "string"
              ? value.coverImage.alt
              : value.title,
        }
      : null;
  const publishedAt =
    typeof value.publishedAt === "string" ? value.publishedAt : "";
  const wordCount = contentText.trim().split(/\s+/).filter(Boolean).length;

  return {
    id: value.id,
    title: value.title,
    slug: value.slug,
    excerpt:
      typeof value.excerpt === "string" && value.excerpt
        ? value.excerpt
        : contentText,
    categories,
    coverImage,
    author: author || "POC Team",
    publishedAt,
    readTime: Math.max(1, Math.ceil(wordCount / 200)),
  };
}
