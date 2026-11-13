import type { Block } from "payload";

export const Chart: Block = {
  slug: "chart",
  labels: {
    singular: "Chart",
    plural: "Charts",
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "description", type: "textarea" },
    {
      name: "chartType",
      type: "select",
      defaultValue: "bar",
      options: [
        { label: "Bar", value: "bar" },
        { label: "Line", value: "line" },
        { label: "Donut", value: "donut" },
      ],
      required: true,
    },
    {
      name: "data",
      type: "array",
      minRows: 1,
      maxRows: 10,
      fields: [
        { name: "label", type: "text", required: true },
        { name: "value", type: "number", min: 0, required: true },
      ],
    },
  ],
};
