import type { GlobalConfig } from "payload";
import { iconField } from "../collections/fields/iconFields";

export const Home: GlobalConfig = {
  slug: "home",
  admin: {
    preview: ({ slug }) => "/",
  },
  access: { read: () => true },
  fields: [
    {
      name: "hero",
      type: "group",
      fields: [
        { name: "heading", type: "text", required: true },
        { name: "subheading", type: "textarea" },
        { name: "description", type: "textarea" },
        { name: "image", type: "upload", relationTo: "media" },
        {
          name: "ctaPrimary",
          type: "group",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "url", type: "text", required: true },
          ],
        },
        {
          name: "ctaSecondary",
          type: "group",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "url", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "techstack",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true },
        { name: "logo", type: "upload", relationTo: "media" },
      ],
    },
    {
      name: "whoAreWe",
      type: "array",
      fields: [
        { name: "subTitle", type: "text", required: true },
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea", required: true },
        {
          name: "stats",
          type: "array",
          fields: [
            { name: "value", type: "number", required: true },
            { name: "suffix", type: "text" },
            { name: "label", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "featuredWork",
      type: "group",
      fields: [
        { name: "subtitle", type: "text", required: true },
        { name: "title", type: "text", required: true },
        {
          name: "projects",
          type: "relationship",
          relationTo: "work",
          hasMany: true,
        },
      ],
    },
    {
      name: "expertise",
      type: "array",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea" },
        iconField("icon"),
        { name: "url", type: "text", required: true },
      ],
    },
    {
      name: "process",
      type: "array",
      fields: [
        { name: "step", type: "number", required: true },
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea" },
      ],
    },
    {
      name: "reviews",
      type: "relationship",
      relationTo: "testimonials",
      hasMany: true,
    },
    {
      name: "insights",
      type: "group",
      label: "Insights",
      fields: [
        { name: "heading", type: "text", required: true },
        { name: "subheading", type: "textarea" },
        { name: "description", type: "textarea" },
        {
          name: "source",
          type: "radio",
          defaultValue: "latest",
          options: [
            { label: "Newest posts (automatic)", value: "latest" },
            { label: "Pick posts manually", value: "manual" },
          ],
        },
        {
          name: "posts",
          type: "relationship",
          relationTo: "posts",
          hasMany: true,
          maxRows: 4,
          admin: {
            description: "Choose up to 4 posts.",
            condition: (_, siblingData) => siblingData?.source === "manual",
          },
        },
        { name: "ctaLabel", type: "text", defaultValue: "View all posts" },
        { name: "ctaHref", type: "text", defaultValue: "/blogs" },
      ],
    },
  ],
};
