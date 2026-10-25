import type { GlobalConfig } from "payload";

export const BlogPage: GlobalConfig = {
  slug: "blogPage",
  access: { read: () => true },
  fields: [
    {
      name: "heading",
      type: "text",
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
      name: "posts",
      type: "relationship",
      relationTo: "posts",
      hasMany: true,
    },
    {
      name: "cta",
      type: "group",
      fields: [
        {
          name: "title",
          type: "text",
        },
        {
          name: "subtitle",
          type: "text",
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "button",
          type: "text",
        },
        {
          name: "buttonUrl",
          type: "text",
        },
      ],
    },
  ],
};
