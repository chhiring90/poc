import type { PackageReference } from "@/lib/type/package.type";
import type { SeoMedia } from "@/lib/seo/parse";
import type { ProcessStep } from "@/lib/type/process-step.type";

export type HowWeWorkLink = { label: string; url: string };

export type HowWeWorkCommitment = {
  id?: string | null;
  icon: string;
  title: string;
  description: string;
};

export type HowWeWorkSize = {
  id?: string | null;
  name: string;
  description: string;
  /** Recommended package; an id at depth 0, the document at depth 1+. */
  package?: PackageReference;
};

export type HowWeWorkExtra = {
  id?: string | null;
  title: string;
  description: string;
};

export type HowWeWorkToolGroup = {
  id?: string | null;
  label: string;
  tools: { id?: string | null; name: string }[];
};

export type HowWeWorkPageData = {
  hero: {
    eyebrow: string;
    heading: string;
    description: string;
    image: SeoMedia | null;
  };
  cta: HowWeWorkLink;
  process: {
    eyebrow: string;
    heading: string;
    /** From the process-steps collection, not the global. */
    steps: ProcessStep[];
  };
  commitments: {
    eyebrow: string;
    heading: string;
    image: SeoMedia | null;
    items: HowWeWorkCommitment[];
  };
  sizes: {
    eyebrow: string;
    heading: string;
    options: HowWeWorkSize[];
    extrasHeading: string;
    extras: HowWeWorkExtra[];
  };
  tools: {
    eyebrow: string;
    heading: string;
    groups: HowWeWorkToolGroup[];
    note: string;
  };
  closing: { heading: string; description: string };
};
