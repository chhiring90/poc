---
name: nextjs-seo
description: Add or audit SEO in this Next.js 16 + Payload CMS site — page titles and descriptions (metadata / generateMetadata), canonical URLs, Open Graph and Twitter cards, OG images, sitemap.ts, robots.ts, JSON-LD structured data, headings and semantic HTML, and indexing rules for drafts and admin. Use when creating a new public page, when the user mentions SEO, metadata, meta tags, social previews, sitemap, robots, structured data, schema.org, or rankings, or before launching a page.
---

# SEO for this Next.js 16 + Payload site

This is **Next.js 16** (App Router). Its APIs differ from older versions: `params` is a Promise, metadata can stream, and so on. When you're unsure about a metadata API, read the bundled docs, not memory:

- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/generate-metadata.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/` (sitemap, robots, opengraph-image, manifest)
- `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`

Public routes live in `app/(frontend)/`. The Payload admin is in `app/(payload)/` and must never be indexed.

## 1. Site-wide defaults (root layout)

`app/(frontend)/layout.tsx` should export this. Check that it does before adding per-page metadata.

```ts
import type { Metadata } from "next";
import { getSiteUrl } from "@/lib/helper/get-site-url.helper";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),           // lets every page use relative URLs
  title: { default: "POC Tech", template: "%s | POC Tech" },
  description: "…one plain sentence about the agency…",
  openGraph: { type: "website", siteName: "POC Tech", locale: "en_GB" },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};
```

- Without `metadataBase`, relative URLs in `openGraph.images` or `alternates` **fail the build**.
- Work out the site URL in one place. `app/sitemap.ts` already has a `getSiteUrl()` that reads `NEXT_PUBLIC_SITE_URL`, then the Vercel variables, then localhost. Move it to `lib/helper/get-site-url.helper.ts` and import it everywhere. Don't copy it.
- Page titles then only set the page part (`title: "Strategy and Roadmap"`), and the template adds the brand. Use `title: { absolute: "…" }` only for the home page, if it needs a different format.

## 2. Per-page metadata

**Static pages** (about, contact, listing pages) export `metadata`.

**CMS-driven pages** (`[slug]` routes) export `generateMetadata`. Rules:

```ts
import type { Metadata } from "next";
import { cache } from "react";

// Payload's local API isn't `fetch`, so it isn't memoised automatically.
// Wrap the lookup in React `cache` so generateMetadata and the page share one query.
const getService = cache(async (slug: string) => {
  const payload = await getPayload({ config });
  return getServiceBySlug(payload, slug);
});

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await params;
  const service = await getService(slug);
  if (!service) return {};                       // the page itself calls notFound()

  const title = service.headline || service.name;
  const description = service.subtitle ?? undefined;
  const path = `/services/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, url: path, type: "website" },
  };
}
```

- A single file can't export both `metadata` and `generateMetadata`.
- Both work only in server components. Never add them to a `"use client"` file.
- Take titles and descriptions from fields that already exist:

  | Route | Title | Description | Image |
  |---|---|---|---|
  | `/services/[slug]` | `headline` or `name` | `subtitle` | — |
  | `/blogs/[slug]` | `title` | `excerpt` | `coverImage.url` |
  | `/works/[slug]` | `title` | plain text of `description`, via `getRichTextPlainText` (trimmed) | `coverImage.url` |
  | `/(policies)/[slug]` | `title` | `summary` | — (already done) |

- Blog posts use `openGraph.type: "article"` and include `publishedTime` and `authors`.
- If editors need to override the defaults, add an optional `seo` group (`title`, `description`, `image`) to the collection. Use the `payload-collection` skill for that, and fall back to the fields above when it's empty. Don't install `@payloadcms/plugin-seo` without asking.

### Text rules

- Titles: about 50–60 characters including the brand suffix, unique for every page, with the main term first.
- Descriptions: about 140–160 characters. Write a plain sentence about what the page offers, and never stuff keywords. Trim CMS text at a word boundary, not mid-word.
- Never ship a placeholder like "Web Agency" or "Untitled" as a description.

## 3. Social images

- **Static image:** put `opengraph-image.png` (1200×630, under 8 MB) plus `opengraph-image.alt.txt` in a route folder. It applies to that route and everything below it.
- **Generated image:** `opengraph-image.tsx` with `ImageResponse` from `next/og`. Export `size = { width: 1200, height: 630 }`, `contentType = "image/png"` and `alt`. Follow the `brand-guidelines` skill: paper background `#f4ebdd`, ink `#2c241c`, brick `#9f3f32`, Space Grotesk bold, 2px border and a hard offset shadow. Load the font with `readFile`, as the docs show.
- **CMS image:** pass `coverImage.url` with `width` and `height` in `openGraph.images`. Media URLs are absolute R2 URLs, so `metadataBase` doesn't apply to them.
- File-based metadata takes priority over `metadata` and `generateMetadata`. Don't set both for the same route.

## 4. sitemap.ts and robots.ts

- `app/sitemap.ts` already exists. When you add a public route or a CMS collection with pages, add it there. Only include **published** documents (`_status: "published"` for collections with drafts, i.e. Posts and Work), and set `lastModified`.
  - Services are not in the sitemap yet. Add `/services/[slug]` from the `services` collection.
- `app/robots.ts` must exist:
  ```ts
  import type { MetadataRoute } from "next";
  export default function robots(): MetadataRoute.Robots {
    return {
      rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
      sitemap: `${getSiteUrl()}/sitemap.xml`,
    };
  }
  ```
- Preview, staging and Vercel preview deployments must not be indexed. When the URL isn't production, return `disallow: "/"` from `robots.ts`, or set `robots: { index: false }` in the root metadata.
- Pages that should stay out of search (thank-you pages, internal tools) set `robots: { index: false, follow: true }`.

## 5. Structured data (JSON-LD)

Render a `<script type="application/ld+json">` inside the page component, as `json-ld.md` describes. **Always escape `<`**, because CMS content can contain it:

```tsx
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
/>
```

Put a reusable `<JsonLd data={…} />` server component in `components/seo/json-ld.tsx`.

| Page | schema.org type |
|---|---|
| Home (or root layout) | `Organization` (name, url, logo, `sameAs` from footer social links) and `WebSite` |
| `/services/[slug]` | `Service` (`name`, `description`, `provider` → Organization, `areaServed`) and `FAQPage` built from the group's FAQs |
| `/blogs/[slug]` | `BlogPosting` (`headline`, `datePublished`, `dateModified`, `author`, `image`) |
| `/works/[slug]` | `CreativeWork` |
| Any nested page | `BreadcrumbList` |

- Only describe content that's actually visible on the page. Never invent ratings, reviews, prices or addresses. If the package price is shown, an `Offer` is fine.
- For `FAQPage`, use `getRichTextPlainText(faq.ans)` for the answer text, and only include FAQs rendered on that page.
- Check the result with Google's Rich Results Test, or ask the user to, since it's an external site.

## 6. On-page rules (check these in every page you touch)

- **Headings:** exactly one `<h1>` per page, matching the page's topic and close to its title. Don't skip heading levels; section headings are `<h2>`. The home sections use the shared `SectionHeading` component, which renders `<h2>`.
- **Semantic HTML:** use `<main>`, `<article>` for posts and case studies, `<nav>`, `<time dateTime>`, and `<figure>`/`<figcaption>`.
- **Links:** use `next/link` for internal links. Link text should describe the destination (avoid "click here"). Use `rel="noopener noreferrer"` on `target="_blank"`.
- **Images:**
  - Every image needs meaningful `alt` text, or `alt=""` if it's decorative. Fall back to the document title when the CMS alt is empty.
  - Prefer `next/image` with `width`/`height` (or `fill` with `sizes`) to avoid layout shift.
  - The hero or LCP image gets `priority`.
  - Several components use raw `<img>` with an eslint-disable. Convert them when you're editing that component anyway.
- **Content in HTML:** don't hide primary content behind client-only rendering. Pages are server components; keep it that way.
- **Performance** is part of SEO (Core Web Vitals):
  - Avoid heavy client JS above the fold. The old WebGL hero is an example to avoid.
  - Load fonts through `next/font`, which is already done.
- **URLs:** lowercase kebab-case slugs. Never change a published slug without adding a redirect in `next.config.ts` (`redirects()`) from the old URL.
- **Language:** `<html lang="en">` is set. If the site targets the UK, use `en-GB` consistently in dates (`toLocaleDateString("en-GB")`) and in `openGraph.locale`.

## 7. Checklist before finishing

1. The page has a unique `title` and `description`, a canonical URL, and Open Graph data. Check them in the rendered `<head>`:
   ```bash
   curl -s -A "facebookexternalhit/1.1" http://localhost:3000/<path> | grep -Eo '<(title|meta|link rel="canonical")[^>]*>' | head -30
   ```
   Use an HTML-limited bot user agent like this one. For normal browsers Next 16 streams metadata into `<body>`, so a plain curl can miss it.
2. `/sitemap.xml` and `/robots.txt` return 200 and list the new route.
3. JSON-LD is valid JSON and matches what's visible on the page.
4. One `<h1>`, and every image has alt text.
5. Run the `check` skill.

Report what you added and what's still missing. Don't claim rankings or traffic improvements.
