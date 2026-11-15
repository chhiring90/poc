import type { CollectionConfig } from "payload";

export const Packages: CollectionConfig = {
  slug: "packages",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "price", "updatedAt"],
  },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "description", type: "textarea" },
    {
      name: "price",
      type: "text",
      admin: { description: 'For example, "$2,500" or "Starting at $2,500".' },
    },
    {
      name: "features",
      type: "array",
      admin: { initCollapsed: false },
      fields: [{ name: "feature", type: "text", required: true }],
    },
  ],
};
