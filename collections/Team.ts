import type { CollectionConfig } from "payload";

export const Team: CollectionConfig = {
  slug: "team",
  admin: {
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "bio",
      type: "textarea",
    },
    {
      name: "role",
      type: "text",
    },
    {
      name: "profile",
      type: "upload",
      relationTo: "media",
    },
  ],
};
