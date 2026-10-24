import type { GlobalConfig } from "payload";

export const About: GlobalConfig = {
  slug: "about",
  label: "About",
  fields: [
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "subheading", type: "text", required: true },
        { name: "heading", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        { name: "image", type: "upload", relationTo: "media", required: true },
      ],
    },
    {
      name: "values",
      type: "group",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "subtitle", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        {
          name: "value-lists",
          type: "array",
          fields: [
            { name: "icon", type: "text", required: true },
            { name: "title", type: "text", required: true },
            { name: "description", type: "textarea", required: true },
          ],
        },
      ],
    },
    {
      name: "team",
      type: "group",
      fields: [
        { name: "heading", type: "text", required: true },
        { name: "subheading", type: "text", required: true },
      ],
    },
    {
      name: "career",
      type: "group",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        {
          name: "cta",
          type: "group",
          fields: [
            { name: "caption", type: "text", required: true },
            { name: "url", type: "text", required: true },
          ],
        },
      ],
    },
  ],
};
