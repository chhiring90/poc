export type PackageFeature = {
  id?: string | null;
  feature: string;
};

export type PackageOptionItem = {
  id?: string | null;
  name: string;
  detail?: string | null;
};

export type PackageOptionGroup = {
  id?: string | null;
  heading: string;
  items?: PackageOptionItem[] | null;
};

export type PackageTerm = {
  id?: string | null;
  label: string;
  value: string;
};

export type PackageDeliverableGroup = {
  id?: string | null;
  heading?: string | null;
  intro?: string | null;
  items?: { id?: string | null; text: string }[] | null;
};

/** The prerequisite package, as a reference (depth 0) or a light document. */
export type PackageRequirement =
  | { id: number | string; name: string; slug: string }
  | number
  | string
  | null;

export type PackageDocument = {
  id: number | string;
  name: string;
  slug?: string | null;
  order?: number | null;
  icon?: string | null;
  tagline?: string | null;
  /** Who it is for. */
  description?: string | null;
  included?: string | null;
  notIncluded?: string | null;
  price?: string | null;
  priceDependsOn?: string | null;
  timing?: string | null;
  features?: PackageFeature[] | null;
  options?: PackageOptionGroup[] | null;
  terms?: PackageTerm[] | null;
  deliverableGroups?: PackageDeliverableGroup[] | null;
  requires?: PackageRequirement;
};

export type PackageReference = PackageDocument | number | string | null;
