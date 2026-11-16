import { isRecord } from "@/lib/helper/is-record.helper";

export type SeoMedia = {
  url: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
};

export type SeoFields = {
  title?: string | null;
  description?: string | null;
  image?: SeoMedia | null;
  noIndex?: boolean;
};

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

/** A populated Payload upload, or null for ids / missing values. */
export function parseMedia(value: unknown): SeoMedia | null {
  if (!isRecord(value) || typeof value.url !== "string" || !value.url) {
    return null;
  }

  return {
    url: value.url,
    alt: optionalString(value.alt),
    width: typeof value.width === "number" ? value.width : null,
    height: typeof value.height === "number" ? value.height : null,
  };
}

/** Reads the shared `seo` group (collections/fields/seo.ts) from any document. */
export function parseSeo(value: unknown): SeoFields {
  if (!isRecord(value)) return {};

  return {
    title: optionalString(value.title),
    description: optionalString(value.description),
    image: parseMedia(value.image),
    noIndex: value.noIndex === true,
  };
}

/** Removes the *highlight* markers editors use in headings. */
export function toPlainText(value: unknown): string | null {
  const text = optionalString(value);
  return text ? text.replaceAll("*", "").replace(/\s+/g, " ").trim() : null;
}

/** Trims to a length at a word boundary, for meta descriptions. */
export function truncate(value: string | null | undefined, max = 160) {
  if (!value) return null;
  const text = value.replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;

  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,.;:–-]+$/, "")}…`;
}
