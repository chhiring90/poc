import type { GlobalConfig } from "payload";
import {
  isValidPolicySlug,
  LEGACY_LEGAL_POLICIES,
} from "@/lib/const/legal-policies.const";
import { isRecord } from "@/lib/helper/is-record.helper";

function migrateLegacyPolicies({
  data,
  originalDoc,
}: {
  data: Record<string, unknown>;
  originalDoc?: Record<string, unknown>;
}) {
  if (originalDoc?.policyPagesMigrated === true || !Array.isArray(data.policyPages)) {
    return data;
  }

  const legacyGroup =
    originalDoc?.policies && typeof originalDoc.policies === "object"
      ? (originalDoc.policies as Record<string, unknown>)
      : {};
  const migratedBySlug = new Map<string, Record<string, unknown>>();

  for (const legacyPolicy of LEGACY_LEGAL_POLICIES) {
    const legacyValue = legacyGroup[legacyPolicy.key];
    const values =
      legacyValue && typeof legacyValue === "object"
        ? (legacyValue as Record<string, unknown>)
        : {};
    migratedBySlug.set(legacyPolicy.slug, {
      slug: legacyPolicy.slug,
      title:
        typeof values.title === "string" && values.title
          ? values.title
          : legacyPolicy.title,
      summary: values.summary,
      content: values.content,
      lastUpdated: values.lastUpdated,
    });
  }

  for (const policy of data.policyPages) {
    if (
      !policy ||
      typeof policy !== "object" ||
      typeof (policy as Record<string, unknown>).slug !== "string"
    ) {
      continue;
    }
    const item = policy as Record<string, unknown>;
    const existing = migratedBySlug.get(item.slug as string);
    migratedBySlug.set(item.slug as string, {
      ...existing,
      ...Object.fromEntries(
        Object.entries(item).filter(([, value]) => value !== undefined),
      ),
    });
  }

  data.policyPages = Array.from(migratedBySlug.values());
  data.policyPagesMigrated = true;
  return data;
}

export const LegalPolicies: GlobalConfig = {
  slug: "legalPolicies",
  label: "Legal & Policies",
  access: { read: () => true },
  hooks: { beforeChange: [migrateLegacyPolicies] },
  fields: [
    {
      name: "policyPages",
      type: "array",
      label: "Policies",
      validate: (value: unknown) => {
        if (!Array.isArray(value)) return true;
        const slugs = value.flatMap((policy) =>
          isRecord(policy) && typeof policy.slug === "string"
            ? [policy.slug]
            : [],
        );
        return new Set(slugs).size === slugs.length
          ? true
          : "Each policy must have a unique URL slug.";
      },
      admin: {
        description:
          "Add, remove, and reorder policies. Each policy is available at /<slug>.",
        components: {
          RowLabel:
            "/components/admin/RowLabel/legalPolicyRowLabel#LegalPolicyRowLabel",
        },
      },
      fields: [
        { name: "title", type: "text", required: true },
        {
          name: "slug",
          type: "text",
          required: true,
          validate: (value: unknown) =>
            isValidPolicySlug(value)
              ? true
              : "Use a unique lowercase slug with letters, numbers, and hyphens that does not conflict with a site route.",
          admin: {
            description:
              "URL path for this policy, for example privacy-policies.",
          },
        },
        { name: "summary", type: "textarea" },
        { name: "content", type: "richText" },
        { name: "lastUpdated", type: "date" },
      ],
    },
    {
      name: "policyPagesMigrated",
      type: "checkbox",
      defaultValue: false,
      admin: { hidden: true },
    },
    {
      name: "policies",
      type: "group",
      admin: { hidden: true },
      fields: LEGACY_LEGAL_POLICIES.map(({ key, title }) => ({
        name: key,
        type: "group" as const,
        fields: [
          { name: "title", type: "text" as const, defaultValue: title },
          { name: "summary", type: "textarea" as const },
          { name: "content", type: "richText" as const },
          { name: "lastUpdated", type: "date" as const },
        ],
      })),
    },
  ],
};
