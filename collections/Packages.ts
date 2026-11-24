import type { CollectionConfig, Field } from "payload";
import { iconField } from "./fields/iconFields";

/** A heading with a list of short lines, e.g. "Sizes" or "Mobile App options". */
const textItems = (name: string, description: string): Field => ({
  name,
  type: "array",
  admin: { initCollapsed: false, description },
  fields: [{ name: "text", type: "text", required: true }],
});

export const Packages: CollectionConfig = {
  slug: "packages",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "order", "price", "updatedAt"],
    description:
      'Text in [square brackets] is shown as "to confirm" on the site until you replace it.',
  },
  access: { read: () => true },
  defaultSort: "order",
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: 'Used for the link /packages#<slug>, e.g. "website".',
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar", description: "Shown as the package number." },
    },
    iconField("icon"),
    {
      name: "requires",
      label: "Required first",
      type: "relationship",
      relationTo: "packages",
      admin: {
        position: "sidebar",
        description: "A package the client must buy before this one.",
      },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Summary",
          fields: [
            { name: "name", type: "text", required: true },
            {
              name: "tagline",
              type: "text",
              admin: {
                description:
                  'e.g. "Know exactly where you are going, before you build."',
              },
            },
            {
              name: "description",
              label: "Who it is for",
              type: "textarea",
            },
            {
              name: "included",
              type: "textarea",
              admin: { description: "One plain summary of what is included." },
            },
            {
              name: "notIncluded",
              label: "Not included",
              type: "textarea",
            },
            {
              name: "price",
              type: "text",
              admin: {
                description:
                  'For example, "£2,500" or "From £2,500". Leave empty to show "Quoted".',
              },
            },
            {
              name: "priceDependsOn",
              label: "Price depends on",
              type: "textarea",
            },
            { name: "timing", type: "text" },
            {
              name: "features",
              label: "Highlights",
              type: "array",
              admin: {
                initCollapsed: false,
                description:
                  "Short list shown on service pages and the package card.",
              },
              fields: [{ name: "feature", type: "text", required: true }],
            },
          ],
        },
        {
          label: "Options & terms",
          fields: [
            {
              name: "options",
              type: "array",
              admin: {
                initCollapsed: false,
                description:
                  'Choices the client picks from, e.g. "Sizes" or "Mobile App options".',
              },
              fields: [
                { name: "heading", type: "text", required: true },
                {
                  name: "items",
                  type: "array",
                  admin: { initCollapsed: false },
                  fields: [
                    { name: "name", type: "text", required: true },
                    { name: "detail", type: "textarea" },
                  ],
                },
              ],
            },
            {
              name: "terms",
              type: "array",
              admin: {
                initCollapsed: false,
                description:
                  'Short facts, e.g. "Fee credited", "Required for", "Free care".',
              },
              fields: [
                { name: "label", type: "text", required: true },
                { name: "value", type: "textarea", required: true },
              ],
            },
          ],
        },
        {
          label: "What we deliver",
          fields: [
            {
              name: "deliverableGroups",
              label: "Deliverable groups",
              type: "array",
              admin: {
                initCollapsed: false,
                description:
                  'One group per size or part, e.g. "Landing Page" or "Review". Leave the heading empty for a single list.',
              },
              fields: [
                { name: "heading", type: "text" },
                {
                  name: "intro",
                  type: "text",
                  admin: { description: 'e.g. "Everything above, plus".' },
                },
                textItems("items", "One deliverable per line."),
              ],
            },
          ],
        },
      ],
    },
  ],
};
