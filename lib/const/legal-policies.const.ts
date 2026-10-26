export const LEGACY_LEGAL_POLICIES = [
  {
    key: "termsAndConditions",
    slug: "terms-and-condition",
    title: "Terms and Conditions",
  },
  {
    key: "privacyPolicy",
    slug: "privacy-policies",
    title: "Privacy Policy",
  },
  {
    key: "dataProtection",
    slug: "data-protection-statement",
    title: "Data Protection Statement",
  },
  { key: "safeAI", slug: "safe-ai", title: "Safe AI" },
  {
    key: "modernSlavery",
    slug: "modern-slavery-statement",
    title: "Modern Slavery Statement",
  },
  {
    key: "environmentalSustainability",
    slug: "environmental-sustainability",
    title: "Environmental Sustainability",
  },
] as const;

const RESERVED_POLICY_SLUGS = new Set([
  "about",
  "admin",
  "api",
  "blogs",
  "contact",
  "services",
  "sitemap-xml",
  "works",
]);

export function isValidPolicySlug(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) &&
    !RESERVED_POLICY_SLUGS.has(value)
  );
}
