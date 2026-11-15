import type { CollectionConfig } from "payload";

export const FAQGroups: CollectionConfig = {
  slug: "faq-groups",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "order", "updatedAt"],
  },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar" },
    },
  ],
};
