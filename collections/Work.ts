import type { CollectionConfig } from "payload";

export const Work: CollectionConfig = {
  slug: "works",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "year", "category"],
  },
  access: { read: () => true },
  versions: { drafts: true },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "slug", type: "text", required: true, unique: true, index: true },
    { name: "year", type: "number" },
    {
      name: "category",
      type: "relationship",
      relationTo: "work-categories",
    },
    { name: "description", type: "richText", required: true },
    { name: "coverImage", type: "upload", relationTo: "media" },
    { name: "challenge", type: "richText" },
    { name: "result", type: "richText" },
    {
      name: "technologies",
      type: "array",
      fields: [{ name: "technology", type: "text", required: true }],
    },
  ],
};
