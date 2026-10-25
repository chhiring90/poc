import { iconField } from "@/collections/fields";
import type { GlobalConfig } from "payload";

export const ContactPage: GlobalConfig = {
  slug: "contactPage",
  access: { read: () => true },
  fields: [
    {
      name: "eyebrow",
      type: "text",
      label: "Intro label",
    },
    {
      name: "heading",
      type: "text",
      label: "Main heading",
      admin: {
        description:
          "Wrap a phrase in asterisks to highlight it with the primary color.",
      },
    },
    {
      name: "description",
      type: "textarea",
      label: "Intro description",
    },
    {
      name: "contactDetails",
      type: "array",
      label: "Contact details",
      fields: [
        iconField("icon"),
        { name: "title", type: "text", required: true },
        { name: "description", type: "text" },
        { name: "href", type: "text", label: "Optional link" },
      ],
    },
    {
      name: "steps",
      type: "array",
      label: "Project questions",
      admin: {
        description:
          "Add, remove, reorder, and configure each question. Set selection mode to allow one or multiple answers.",
      },
      fields: [
        { name: "key", type: "text", required: true, label: "Unique key" },
        { name: "label", type: "text", required: true, label: "Stepper label" },
        { name: "question", type: "text", required: true },
        { name: "description", type: "textarea" },
        {
          name: "selectionMode",
          type: "select",
          required: true,
          defaultValue: "single",
          options: [
            { label: "Choose one", value: "single" },
            { label: "Choose multiple", value: "multiple" },
          ],
        },
        {
          name: "required",
          type: "checkbox",
          defaultValue: true,
          label: "Require an answer",
        },
        {
          name: "options",
          type: "array",
          fields: [
            { name: "label", type: "text", required: true },
            { name: "value", type: "text", required: true },
          ],
        },
      ],
    },
    {
      name: "form",
      type: "group",
      label: "Contact details step",
      fields: [
        { name: "stepLabel", type: "text", label: "Stepper label" },
        { name: "question", type: "text", label: "Heading" },
        { name: "description", type: "textarea" },
        { name: "nameLabel", type: "text" },
        { name: "namePlaceholder", type: "text" },
        { name: "companyLabel", type: "text" },
        { name: "companyPlaceholder", type: "text" },
        { name: "emailLabel", type: "text" },
        { name: "emailPlaceholder", type: "text" },
        { name: "messageLabel", type: "text" },
        { name: "messagePlaceholder", type: "text" },
        { name: "submitLabel", type: "text" },
      ],
    },
    {
      name: "navigation",
      type: "group",
      label: "Form buttons",
      fields: [
        { name: "nextLabel", type: "text" },
        { name: "backLabel", type: "text" },
        { name: "skipLabel", type: "text" },
      ],
    },
    {
      name: "success",
      type: "group",
      label: "Success screen",
      fields: [
        { name: "eyebrow", type: "text" },
        { name: "title", type: "text" },
        { name: "description", type: "textarea" },
        { name: "signature", type: "text" },
      ],
    },
  ],
};
