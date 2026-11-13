import type { CollectionConfig } from "payload";
import {
  BlocksFeature,
  CodeBlock,
  EXPERIMENTAL_TableFeature,
  lexicalEditor,
} from "@payloadcms/richtext-lexical";
import { iconField } from "../collections/fields/iconFields";
import { Chart } from "./blocks/Chart";
import { FlowDiagram } from "./blocks/FlowDiagram";

export const Services: CollectionConfig = {
  slug: "services",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "order", "updatedAt"],
  },
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "eyebrow", type: "text", required: true },
    { name: "subtitle", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      required: true,
      admin: { position: "sidebar" },
    },
    {
      name: "ctaButton",
      type: "group",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", required: true },
      ],
    },
    iconField("icon"),
    {
      name: "descriptionRichText",
      label: "Description",
      type: "richText",
      required: true,
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
    {
      name: "technologies",
      type: "array",
      fields: [{ name: "technology", type: "text", required: true }],
    },
    {
      name: "deliverables",
      type: "array",
      fields: [{ name: "deliverable", type: "text", required: true }],
    },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      admin: { position: "sidebar" },
    },
  ],
};
