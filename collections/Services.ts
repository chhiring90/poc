import type { CollectionConfig } from "payload";

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "order", "updatedAt"],
  },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "icon", type: "text" },
    { name: "description", type: "textarea", required: true },
    {
      name: "technologies",
      type: "array",
      fields: [{ name: "technology", type: "text", required: true }],
    },
    {
      name: "deliverables",
      type: "array",
      fields: [{ name: "deliverable", type: "text", required: true }],
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar" },
    },
  ],
};
