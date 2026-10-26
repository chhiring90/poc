import { cache } from "react";
import config from "@payload-config";
import { getPayload } from "payload";

export const legalPolicies = [
  {
    slug: "terms-and-condition",
    key: "termsAndConditions",
    title: "Terms and Conditions",
  },
  {
    slug: "privacy-policies",
    key: "privacyPolicy",
    title: "Privacy Policy",
  },
  {
    slug: "data-protection-statement",
    key: "dataProtection",
    title: "Data Protection Statement",
  },
  { slug: "safe-ai", key: "safeAI", title: "Safe AI" },
  {
    slug: "modern-slavery-statement",
    key: "modernSlavery",
    title: "Modern Slavery Statement",
  },
  {
    slug: "environmental-sustainability",
    key: "environmentalSustainability",
    title: "Environmental Sustainability",
  },
] as const;

export type LegalPolicySlug = (typeof legalPolicies)[number]["slug"];
export type LegalPolicyKey = (typeof legalPolicies)[number]["key"];

export function isLegalPolicySlug(slug: string): slug is LegalPolicySlug {
  return legalPolicies.some((policy) => policy.slug === slug);
}

export const getLegalPolicy = cache(async (slug: LegalPolicySlug) => {
  const policyRoute = legalPolicies.find((policy) => policy.slug === slug);
  if (!policyRoute) return null;

  const payload = await getPayload({ config });
  const legalPoliciesGlobal = await payload.findGlobal({
    slug: "legalPolicies",
  });
  const policy = legalPoliciesGlobal.policies?.[policyRoute.key];

  return {
    ...policyRoute,
    title: policy?.title || policyRoute.title,
    summary: policy?.summary,
    content: policy?.content,
    lastUpdated: policy?.lastUpdated,
  };
});
