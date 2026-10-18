import type { GlobalConfig } from "payload";

export const Header: GlobalConfig = {
  slug: "header",
  access: { read: () => true },
  fields: [
    {
      name: "navItems",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "link", type: "text" }, // used when there is no dropdown
        { name: "hasMegaMenu", type: "checkbox", defaultValue: false },
        {
          name: "columns",
          type: "array",
          admin: { condition: (_, siblingData) => siblingData?.hasMegaMenu },
          fields: [
            { name: "heading", type: "text" },
            {
              name: "links",
              type: "array",
              fields: [
                { name: "label", type: "text", required: true },
                { name: "url", type: "text", required: true },
                { name: "description", type: "text" },
                { name: "icon", type: "upload", relationTo: "media" },
              ],
            },
          ],
        },
        {
          name: "featuredPost",
          type: "relationship",
          relationTo: "posts",
          admin: { condition: (_, siblingData) => siblingData?.hasMegaMenu },
        },
      ],
    },
  ],
};
