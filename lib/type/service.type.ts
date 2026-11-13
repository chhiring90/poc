import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";

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

export type ServiceDocument = ServiceListItem & {
  ctaButton?: { label?: string | null; url?: string | null } | null;
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
