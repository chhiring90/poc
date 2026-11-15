import type { Block } from "payload";

const pointColorOptions = [
  { label: "Automatic", value: "auto" },
  { label: "Palette 1 — Primary", value: "chart1" },
  { label: "Palette 2 — Accent", value: "chart2" },
  { label: "Palette 3 — Info", value: "chart3" },
  { label: "Palette 4 — Success", value: "chart4" },
  { label: "Palette 5 — Neutral", value: "chart5" },
];

export const Chart: Block = {
  slug: "chart",
  labels: {
    singular: "Chart",
    plural: "Charts",
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "description", type: "textarea" },
    { name: "source", type: "text" },
    {
      type: "tabs",
      admin: {
        components: {
          Field: "/components/admin/ChartEditorTabs#ChartEditorTabs",
        },
      },
      tabs: [
        {
          label: "Chart",
          fields: [
            {
              name: "chartType",
              type: "select",
              defaultValue: "bar",
              options: [
                { label: "Bar", value: "bar" },
                { label: "Line", value: "line" },
                { label: "Area", value: "area" },
                { label: "Pie", value: "pie" },
                { label: "Donut", value: "donut" },
                { label: "Radial bar", value: "radialBar" },
              ],
              required: true,
            },
            {
              name: "valueFormat",
              type: "select",
              defaultValue: "number",
              options: [
                { label: "Number", value: "number" },
                { label: "Percentage (enter 25 for 25%)", value: "percentage" },
                { label: "Currency", value: "currency" },
              ],
              required: true,
            },
            {
              name: "currencyCode",
              type: "text",
              defaultValue: "USD",
              admin: {
                condition: (_, siblingData) =>
                  siblingData?.valueFormat === "currency",
              },
            },
            {
              name: "unitSuffix",
              type: "text",
              admin: {
                description:
                  "Optional unit appended to numeric values, e.g. users or hours.",
                condition: (_, siblingData) =>
                  siblingData?.valueFormat === "number",
              },
            },
            {
              name: "valuePrefix",
              type: "text",
              admin: {
                description: "Optional prefix for numeric values, e.g. +.",
                condition: (_, siblingData) =>
                  siblingData?.valueFormat === "number",
              },
            },
            {
              name: "decimalPlaces",
              type: "number",
              min: 0,
              max: 6,
              defaultValue: 2,
              admin: { description: "Maximum displayed decimal places." },
            },
          ],
        },
        {
          label: "Axes & legend",
          fields: [
            { name: "xAxisLabel", type: "text" },
            { name: "yAxisLabel", type: "text" },
            {
              name: "valueLabel",
              type: "text",
              admin: {
                description: "Metric name shown in the legend and data table.",
              },
            },
            {
              name: "color",
              type: "select",
              defaultValue: "primary",
              options: [
                { label: "Primary", value: "primary" },
                { label: "Accent", value: "accent" },
                { label: "Info", value: "info" },
                { label: "Success", value: "success" },
              ],
              admin: {
                description:
                  "Default series color. Pie and donut charts use per-row colors.",
              },
            },
            {
              name: "barMode",
              type: "select",
              defaultValue: "grouped",
              options: [
                { label: "Grouped", value: "grouped" },
                { label: "Stacked", value: "stacked" },
              ],
              admin: {
                description: "Only applies to bar charts.",
                condition: (_, siblingData) =>
                  siblingData?.chartType === "bar",
              },
            },
          ],
        },
        {
          label: "Data",
          fields: [
            {
              name: "series",
              type: "array",
              maxRows: 10,
              admin: {
                initCollapsed: false,
                description:
                  "For grouped/stacked bars and multi-line/area charts. Pie and donut charts use the first series.",
              },
              fields: [
                { name: "name", type: "text", required: true },
                {
                  name: "color",
                  type: "select",
                  defaultValue: "primary",
                  options: [
                    { label: "Primary", value: "primary" },
                    { label: "Accent", value: "accent" },
                    { label: "Info", value: "info" },
                    { label: "Success", value: "success" },
                    { label: "Chart 5", value: "chart5" },
                  ],
                  required: true,
                },
                {
                  name: "data",
                  type: "array",
                  minRows: 1,
                  maxRows: 50,
                  admin: { initCollapsed: false },
                  fields: [
                    { name: "label", type: "text", required: true },
                    { name: "value", type: "number", required: true },
                    {
                      name: "color",
                      type: "select",
                      defaultValue: "auto",
                      options: pointColorOptions,
                      admin: { description: "Optional category color." },
                    },
                  ],
                },
              ],
            },
            {
              name: "data",
              type: "array",
              maxRows: 50,
              admin: {
                initCollapsed: false,
                description:
                  "Single-series data. Use this or multi-series data above. Pie, donut, and radial values should be non-negative.",
                condition: (_, siblingData) => !siblingData?.series?.length,
              },
              fields: [
                { name: "label", type: "text", required: true },
                { name: "value", type: "number", required: true },
                {
                  name: "color",
                  type: "select",
                  defaultValue: "auto",
                  options: pointColorOptions,
                  admin: { description: "Optional category color." },
                },
              ],
            },
          ],
        },
        {
          label: "Display",
          fields: [
            { name: "showTooltip", type: "checkbox", defaultValue: true },
            { name: "showGrid", type: "checkbox", defaultValue: true },
            { name: "showLegend", type: "checkbox", defaultValue: true },
            { name: "showDataTable", type: "checkbox", defaultValue: true },
            {
              name: "showDataLabels",
              type: "checkbox",
              defaultValue: false,
              admin: { description: "Show values on bars." },
            },
          ],
        },
      ],
    },
  ],
};
