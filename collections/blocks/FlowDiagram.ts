import type { Block } from "payload";

export const FlowDiagram: Block = {
  slug: "flowDiagram",
  labels: {
    singular: "Flow diagram",
    plural: "Flow diagrams",
  },
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "direction",
      type: "select",
      defaultValue: "horizontal",
      options: [
        { label: "Left to right", value: "horizontal" },
        { label: "Top to bottom", value: "vertical" },
      ],
      required: true,
    },
    {
      name: "steps",
      type: "array",
      minRows: 2,
      maxRows: 8,
      labels: {
        singular: "Step",
        plural: "Steps",
      },
      fields: [
        { name: "title", type: "text", required: true },
        { name: "description", type: "textarea" },
      ],
    },
  ],
};
