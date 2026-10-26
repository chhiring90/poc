import type { CollectionConfig } from "payload";

export const WorkCategories: CollectionConfig = {
  slug: "work-categories",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug"],
  },
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "description", type: "textarea" },
  ],
};
