import type { CollectionConfig } from "payload";

/** Steps of how we work, shown on the home page and on /how-we-work. */
export const ProcessSteps: CollectionConfig = {
  slug: "process-steps",
  labels: { singular: "Process Step", plural: "Process Steps" },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "tagline", "order", "updatedAt"],
    description:
      "Shown on the home page and the How We Work page, sorted by order and numbered automatically.",
  },
  defaultSort: "order",
  access: { read: () => true },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "tagline",
      type: "text",
      admin: { description: "Short line under the title, e.g. “See it before it is built.”" },
    },
    { name: "description", type: "textarea" },
    {
      name: "order",
      type: "number",
      defaultValue: 0,
      index: true,
      admin: { position: "sidebar", description: "Lower numbers come first." },
    },
  ],
};
