import type { SeoMedia } from "@/lib/seo/parse";

export type AboutFact = { id?: string | null; value: string; label: string };

export type AboutChapter = { id?: string | null; title: string; body: string };

export type AboutValue = {
  id?: string | null;
  icon: string;
  title: string;
  tagline: string;
  description: string;
};

export type AboutTeamMember = {
  id: number | string;
  name: string;
  role: string;
  bio: string;
  photo: SeoMedia | null;
};

export type AboutPageData = {
  hero: {
    eyebrow: string;
    heading: string;
    description: string;
    image: SeoMedia | null;
  };
  /** Proof points, e.g. years of experience. Hidden while empty. */
  facts: AboutFact[];
  story: { eyebrow: string; chapters: AboutChapter[] };
  values: {
    eyebrow: string;
    heading: string;
    description: string;
    items: AboutValue[];
  };
  team: {
    show: boolean;
    eyebrow: string;
    heading: string;
    members: AboutTeamMember[];
  };
  closing: {
    heading: string;
    description: string;
    cta: { label: string; url: string };
  };
};
