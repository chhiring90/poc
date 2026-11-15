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
import { isRecord } from "@/lib/helper/is-record.helper";

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
      admin: { position: "sidebar" },
    },
    {
      name: "faq",
      label: "FAQ Item",
      type: "relationship",
      relationTo: "faqs",
      filterOptions: ({ siblingData }) => {
        const group = isRecord(siblingData) ? siblingData.faqGroup : undefined;
        const groupId = isRecord(group) ? group.id : group;

        return typeof groupId === "number" || typeof groupId === "string"
          ? { group: { equals: groupId } }
          : false;
      },
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
      admin: { initCollapsed: false },
      fields: [{ name: "technology", type: "text", required: true }],
    },
    {
      name: "deliverables",
      type: "array",
      admin: { initCollapsed: false },
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
