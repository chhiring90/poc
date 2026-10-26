import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { cache } from "react";
import config from "@payload-config";
import { getPayload } from "payload";
import { isRecord } from "@/lib/helper/is-record.helper";
import { isRichText } from "@/lib/helper/is-rich-text.helper";
import {
  isValidPolicySlug,
  LEGACY_LEGAL_POLICIES,
} from "@/lib/const/legal-policies.const";

export type LegalPolicy = {
  slug: string;
  title: string;
  summary?: string | null;
  content?: DefaultTypedEditorState | null;
  lastUpdated?: string | null;
};

function toLegalPolicy(value: unknown): LegalPolicy | null {
  if (
    !isRecord(value) ||
    !isValidPolicySlug(value.slug) ||
    typeof value.title !== "string"
  ) {
    return null;
  }

  return {
    slug: value.slug,
    title: value.title,
    summary:
      typeof value.summary === "string" || value.summary === null
        ? value.summary
        : null,
    content: isRichText(value.content) ? value.content : null,
    lastUpdated:
      typeof value.lastUpdated === "string" || value.lastUpdated === null
        ? value.lastUpdated
        : null,
  };
}

export const getLegalPolicies = cache(async (): Promise<LegalPolicy[]> => {
  const payload = await getPayload({ config });
  const legalPolicies = await payload.findGlobal({ slug: "legalPolicies" });
  if (legalPolicies.policyPagesMigrated === true) {
    return Array.isArray(legalPolicies.policyPages)
      ? legalPolicies.policyPages
          .map(toLegalPolicy)
          .filter((policy): policy is LegalPolicy => policy !== null)
      : [];
  }

  const legacyPolicies = isRecord(legalPolicies.policies)
    ? legalPolicies.policies
    : {};
  return LEGACY_LEGAL_POLICIES.flatMap((legacyPolicy) => {
    const legacyValue = legacyPolicies[legacyPolicy.key];
    const values = isRecord(legacyValue) ? legacyValue : {};
    const policy = toLegalPolicy({
      ...values,
      slug: legacyPolicy.slug,
      title:
        typeof values.title === "string" && values.title
          ? values.title
          : legacyPolicy.title,
    });

    return policy ? [policy] : [];
  });
});

export const getLegalPolicy = cache(
  async (slug: string): Promise<LegalPolicy | null> => {
    const policies = await getLegalPolicies();
    return policies.find((policy) => policy.slug === slug) ?? null;
  },
);
