import type { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
  access: { read: () => true },
  fields: [
    {
      name: "description",
      type: "textarea",
      label: "Brand description",
      defaultValue: "We turn ideas into proven products, fast.",
    },
    {
      name: "socialLinks",
      type: "array",
      label: "Social links",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", required: true },
        {
          name: "openInNewTab",
          type: "checkbox",
          label: "Open in a new tab",
          defaultValue: true,
        },
      ],
    },
    {
      name: "columns",
      type: "array",
      label: "Footer link columns",
      admin: {
        description:
          "Add and reorder footer columns. Use an absolute path (for example, /about) for internal pages or a full URL for external sites.",
      },
      fields: [
        { name: "heading", type: "text", required: true },
        {
          name: "links",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "url", type: "text", required: true },
            {
              name: "openInNewTab",
              type: "checkbox",
              label: "Open in a new tab",
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: "copyright",
      type: "text",
      label: "Copyright text",
      defaultValue: "© 2026 POC Ltd. All rights reserved.",
    },
    {
      name: "backToTopLabel",
      type: "text",
      label: "Back-to-top link label",
      defaultValue: "↑ Back to top",
    },
  ],
};
