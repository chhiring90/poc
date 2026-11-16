import type { SiteSettings } from "@/lib/seo/get-site-settings";
import { absoluteUrl, getSiteUrl } from "@/lib/seo/site-url";

export type JsonLdObject = Record<string, unknown>;

/** Drops empty values so the output only describes what actually exists. */
function compact<T extends JsonLdObject>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(
      ([, entry]) =>
        entry !== null &&
        entry !== undefined &&
        entry !== "" &&
        !(Array.isArray(entry) && entry.length === 0),
    ),
  ) as T;
}

export function organizationId() {
  return `${getSiteUrl()}/#organization`;
}

export function organizationJsonLd(settings: SiteSettings): JsonLdObject {
  const { organization: org } = settings;
  const address = compact({
    "@type": "PostalAddress",
    streetAddress: org.address.streetAddress,
    addressLocality: org.address.locality,
    addressRegion: org.address.region,
    postalCode: org.address.postalCode,
    addressCountry: org.address.country,
  });

  return compact({
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": organizationId(),
    name: org.name,
    legalName: org.legalName,
    url: getSiteUrl(),
    logo: org.logo?.url,
    email: org.email,
    telephone: org.telephone,
    address: Object.keys(address).length > 1 ? address : null,
    areaServed: org.areaServed,
    sameAs: org.sameAs,
  });
}

export function websiteJsonLd(settings: SiteSettings): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${getSiteUrl()}/#website`,
    url: getSiteUrl(),
    name: settings.siteName,
    publisher: { "@id": organizationId() },
    inLanguage: settings.locale.replace("_", "-"),
  };
}

export function breadcrumbJsonLd(
  items: { name: string; path: string }[],
): JsonLdObject {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serviceJsonLd(input: {
  name: string;
  description?: string | null;
  path: string;
  settings: SiteSettings;
  offer?: { name: string; price?: string | null } | null;
}): JsonLdObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    serviceType: input.name,
    description: input.description,
    url: absoluteUrl(input.path),
    provider: { "@id": organizationId(), name: input.settings.organization.name },
    areaServed: input.settings.organization.areaServed,
    // Price text is free-form in the CMS, so it is described rather than given as a number.
    offers: input.offer
      ? compact({
          "@type": "Offer",
          name: input.offer.name,
          description: input.offer.price,
        })
      : null,
  });
}

export function faqPageJsonLd(
  faqs: { question: string; answer: string }[],
): JsonLdObject | null {
  const items = faqs.filter((faq) => faq.question && faq.answer);
  if (items.length === 0) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function blogPostingJsonLd(input: {
  title: string;
  description?: string | null;
  path: string;
  image?: string | null;
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authorName?: string | null;
  section?: string | null;
}): JsonLdObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    mainEntityOfPage: absoluteUrl(input.path),
    image: input.image,
    datePublished: input.publishedTime,
    dateModified: input.modifiedTime ?? input.publishedTime,
    author: input.authorName
      ? { "@type": "Person", name: input.authorName }
      : { "@id": organizationId() },
    publisher: { "@id": organizationId() },
    articleSection: input.section,
  });
}

export function creativeWorkJsonLd(input: {
  title: string;
  description?: string | null;
  path: string;
  image?: string | null;
  year?: number | null;
  genre?: string | null;
  keywords?: string[];
}): JsonLdObject {
  return compact({
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: input.title,
    description: input.description,
    url: absoluteUrl(input.path),
    image: input.image,
    dateCreated: input.year ? String(input.year) : null,
    genre: input.genre,
    keywords: input.keywords?.join(", "),
    creator: { "@id": organizationId() },
  });
}
