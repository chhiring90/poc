import type { JsonLdObject } from "@/lib/seo/json-ld";

/** Renders schema.org structured data. `<` is escaped so CMS text can't break out of the script tag. */
export function JsonLd({ data }: { data: (JsonLdObject | null)[] | JsonLdObject }) {
  const items = (Array.isArray(data) ? data : [data]).filter(
    (item): item is JsonLdObject => item !== null,
  );
  if (items.length === 0) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(items.length === 1 ? items[0] : items).replace(
          /</g,
          "\\u003c",
        ),
      }}
    />
  );
}
