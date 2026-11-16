import type { GlobalConfig } from "payload";
import { iconField } from "@/collections/fields";

export const Header: GlobalConfig = {
  slug: "header",
  access: { read: () => true },
  fields: [
    {
      name: "branding",
      type: "group",
      label: "Branding",
      fields: [
        {
          name: "lightLogo",
          type: "upload",
          relationTo: "media",
          label: "Logo for light theme",
          admin: {
            description:
              "Used on light backgrounds. Recommended: transparent SVG or PNG, 600 x 150 px (4:1 ratio), under 1 MB. Rendered at up to 160 x 40 px. Add descriptive alt text to the media file.",
          },
        },
        {
          name: "darkLogo",
          type: "upload",
          relationTo: "media",
          label: "Logo for dark theme",
          admin: {
            description:
              "Used on dark backgrounds. Recommended: transparent SVG or PNG, 600 x 150 px (4:1 ratio), under 1 MB. Use the same canvas dimensions as the light-theme logo. Rendered at up to 160 x 40 px. Add descriptive alt text to the media file.",
          },
        },
      ],
    },
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
                {
                  ...iconField("icon"),
                  admin: {
                    ...iconField("icon").admin,
                    description:
                      "Shown beside the link in the dropdown. Pick from the icon library.",
                  },
                },
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
