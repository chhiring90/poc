import type { CollectionConfig, Field } from "payload";
import {
  BlocksFeature,
  CodeBlock,
  EXPERIMENTAL_TableFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { iconField } from "../collections/fields/iconFields";
import { seoTab } from "./fields/seo";
import { Chart } from "./blocks/Chart";
import { FlowDiagram } from "./blocks/FlowDiagram";

const linkFields: Field[] = [
  { name: "label", type: "text" },
  { name: "url", type: "text" },
];

function titledItems(
  name: string,
  label: string,
  description: string,
  extraFields: Field[] = [],
): Field {
  return {
    name,
    label,
    type: "array",
    admin: { initCollapsed: false, description },
    fields: [
      { name: "title", type: "text", required: true },
      { name: "description", type: "textarea" },
      ...extraFields,
    ],
  };
}

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "updatedAt", "eyebrow"],
  },
  access: { read: () => true },
  fields: [
    {
      name: "slug",
      type: "text",
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "package",
      type: "relationship",
      relationTo: "packages",
      admin: { position: "sidebar" },
    },
    {
      name: "faqGroup",
      label: "FAQ Group",
      type: "relationship",
      relationTo: "faq-groups",
      admin: {
        position: "sidebar",
        description: "Every FAQ in this group is shown on the service page.",
      },
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar" },
    },
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            {
              name: "name",
              type: "text",
              required: true,
              admin: { description: "Service name, used in listings." },
            },
            {
              name: "eyebrow",
              type: "text",
              required: true,
              admin: {
                description:
                  'Small line above the headline, e.g. "Strategy and Roadmap".',
              },
            },
            {
              name: "headline",
              type: "text",
              admin: {
                description:
                  "Big headline on the service page. Falls back to the name.",
              },
            },
            {
              name: "subtitle",
              label: "Plain line",
              type: "text",
              required: true,
              admin: {
                description: "One plain sentence saying what the client gets.",
              },
            },
            {
              name: "ctaButton",
              label: "Main button",
              type: "group",
              admin: {
                description: "Used in the hero and the closing section.",
              },
              fields: [
                { name: "label", type: "text", required: true },
                { name: "url", type: "text", required: true },
              ],
            },
            iconField("icon"),
            {
              name: "reassurance",
              type: "text",
              admin: {
                description:
                  'Short line under the button, e.g. "No jargon, no pressure."',
              },
            },
          ],
        },
        {
          label: "Content",
          fields: [
            {
              name: "whyItMatters",
              label: "Why you need it",
              type: "textarea",
            },
            titledItems(
              "startHere",
              "Start here",
              "Ways to get started, e.g. a free call and a paid sprint.",
              [
                {
                  name: "note",
                  type: "text",
                  admin: {
                    description:
                      'Optional detail, e.g. "About one to two weeks".',
                  },
                },
              ],
            ),
            titledItems(
              "process",
              "How we do it",
              "Steps in order. Shown as a numbered route.",
            ),
            titledItems(
              "capabilities",
              "Our capabilities",
              "What this service covers.",
            ),
            {
              name: "deliverables",
              label: "What you get",
              type: "array",
              admin: { initCollapsed: false },
              fields: [{ name: "deliverable", type: "text", required: true }],
            },
            {
              name: "technologies",
              type: "array",
              admin: { initCollapsed: false },
              fields: [{ name: "technology", type: "text", required: true }],
            },
            {
              name: "descriptionRichText",
              label: "Description",
              type: "richText",
              required: true,
              admin: {
                description: "Longer detail, shown in the middle of the page.",
              },
              editor: lexicalEditor({
                features: ({ defaultFeatures }) => [
                  ...defaultFeatures,
                  EXPERIMENTAL_TableFeature(),
                  BlocksFeature({
                    blocks: [CodeBlock(), Chart, FlowDiagram],
                  }),
                ],
              }),
            },
            {
              name: "description",
              type: "textarea",
              admin: { hidden: true },
              access: { read: () => false },
            },
          ],
        },
        {
          label: "Proof & closing",
          fields: [
            {
              name: "proof",
              type: "group",
              admin: {
                description:
                  "Leave empty until you have a real result. Hidden when empty.",
              },
              fields: [
                { name: "client", type: "text" },
                {
                  name: "result",
                  type: "textarea",
                  admin: { description: "One result and how it was measured." },
                },
              ],
            },
            {
              name: "closing",
              type: "group",
              fields: [
                {
                  name: "heading",
                  type: "text",
                  admin: {
                    description:
                      'e.g. "Have an idea or a goal? Tell us, and we will show you the way."',
                  },
                },
                {
                  name: "secondaryLink",
                  type: "group",
                  admin: { description: 'e.g. "See how we work".' },
                  fields: linkFields,
                },
              ],
            },
          ],
        },
        seoTab(),
      ],
    },
  ],
};
