export type PackageFeature = {
  id?: string | null;
  feature: string;
};

export type PackageDocument = {
  id: number | string;
  name: string;
  description?: string | null;
  price?: string | null;
  features?: PackageFeature[] | null;
};

export type PackageReference = PackageDocument | number | string | null;
