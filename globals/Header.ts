import type { GlobalConfig } from "payload";

export const Header: GlobalConfig = {
  slug: "header",
  access: { read: () => true },
  fields: [
    {
      name: "navItems",
      type: "array",
      admin: {
        components: {
          RowLabel:
            "/components/admin/RowLabel/navItemRowLabel#NavItemRowLabel",
        },
      },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "link", type: "text" }, // used when there is no dropdown
        { name: "hasMegaMenu", type: "checkbox", defaultValue: false },
        {
          name: "columns",
          type: "array",
          admin: {
            condition: (_, siblingData) => siblingData?.hasMegaMenu,
            components: {
              RowLabel:
                "/components/admin/RowLabel/columnRowLabel#ColumnRowLabel",
            },
          },
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
              admin: {
                components: {
                  RowLabel:
                    "/components/admin/RowLabel/navItemRowLabel#NavItemRowLabel",
                },
              },
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
