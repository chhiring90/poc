import type { GlobalConfig } from "payload";

export const WorkPage: GlobalConfig = {
  slug: "workPage",
  access: { read: () => true },
  fields: [
    {
      name: "heading",
      type: "text",
      required: true,
    },
    {
      name: "subheading",
      type: "text",
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "work",
      type: "relationship",
      relationTo: "works",
      hasMany: true,
      admin: {
        description: "Choose the case studies to display on the work page.",
      },
    },
    {
      name: "workCta",
      type: "group",
      fields: [
        { name: "title", type: "text", required: true },
        {
          name: "description",
          type: "textarea",
        },
        { name: "button", type: "text", required: true },
        { name: "buttonUrl", type: "text", required: true },
      ],
    },
  ],
};
