import type { GlobalConfig } from "payload";

const policies = [
  { name: "termsAndConditions", title: "Terms and Conditions" },
  { name: "privacyPolicy", title: "Privacy Policy" },
  { name: "dataProtection", title: "Data Protection Statement" },
  { name: "safeAI", title: "Safe AI" },
  { name: "modernSlavery", title: "Modern Slavery Statement" },
  {
    name: "environmentalSustainability",
    title: "Environmental Sustainability",
  },
] as const;

export const LegalPolicies: GlobalConfig = {
  slug: "legalPolicies",
  label: "Legal & Policies",
  access: { read: () => true },
  fields: [
    {
      name: "policies",
      type: "group",
      fields: policies.map(({ name, title }) => ({
        type: "collapsible" as const,
        label: title,
        admin: { initCollapsed: true },
        fields: [
          {
            name,
            type: "group" as const,
            label: "",
            admin: { hideGutter: true },
            fields: [
              { name: "title", type: "text" as const, defaultValue: title },
              { name: "summary", type: "textarea" as const },
              { name: "content", type: "richText" as const },
              { name: "lastUpdated", type: "date" as const },
            ],
          },
        ],
      })),
    },
  ],
};
