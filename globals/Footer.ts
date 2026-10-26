import type { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
  slug: "footer",
  label: "Footer",
  access: { read: () => true },
  fields: [
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      label: "Footer logo",
      admin: {
        description:
          "Recommended: transparent SVG or PNG, 600 x 150 px (4:1 ratio), under 1 MB. Use a version that is readable on both light and dark backgrounds. Add descriptive alt text to the media file.",
      },
    },
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
      name: "backToTopLabel",
      type: "text",
      label: "Back-to-top link label",
      defaultValue: "↑ Back to top",
    },
  ],
};
