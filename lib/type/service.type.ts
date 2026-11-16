import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import type { FAQGroupReference } from "@/lib/type/faq.type";
import type { PackageReference } from "@/lib/type/package.type";

export type ServiceListItem = {
  id: number | string;
  name: string;
  slug: string;
  icon?: string | null;
  subtitle?: string | null;
  eyebrow?: string | null;
  descriptionRichText: DefaultTypedEditorState;
  technologies?: { id?: string | null; technology: string }[] | null;
  deliverables?: { id?: string | null; deliverable: string }[] | null;
};

export type ServiceTitledItem = {
  id?: string | null;
  title: string;
  description?: string | null;
  note?: string | null;
};

export type ServiceLink = { label?: string | null; url?: string | null };

export type ServiceDocument = ServiceListItem & {
  headline?: string | null;
  reassurance?: string | null;
  whyItMatters?: string | null;
  startHere?: ServiceTitledItem[] | null;
  process?: ServiceTitledItem[] | null;
  capabilities?: ServiceTitledItem[] | null;
  proof?: { client?: string | null; result?: string | null } | null;
  closing?: {
    heading?: string | null;
    secondaryLink?: ServiceLink | null;
  } | null;
  ctaButton?: ServiceLink | null;
  package?: PackageReference;
  faqGroup?: FAQGroupReference;
  /** Raw `seo` group; read with parseSeo(). */
  seo?: unknown;
};

export type HomeExpertiseItem = {
  title: string;
  description: string;
  icon: string;
  url: string;
};

export type ServicesPageData = {
  heading?: string | null;
  subheading?: string | null;
  description?: string | null;
  subtitle?: string | null;
  services?: ServiceListItem[] | null;
};
