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
        description: "ISO 4217 code, for example USD, EUR, or GBP.",
        condition: (_, siblingData) => siblingData?.valueFormat === "currency",
      },
    },
    {
      name: "unitSuffix",
      type: "text",
      admin: {
        description:
          "Optional unit appended to values, e.g. users, hours, or %. Not applied to currency or percentage formats.",
        condition: (_, siblingData) => siblingData?.valueFormat === "number",
      },
    },
    {
      name: "valuePrefix",
      type: "text",
      admin: {
        description:
          "Optional prefix for numeric values, e.g. +. Not applied to currency or percentage formats.",
        condition: (_, siblingData) => siblingData?.valueFormat === "number",
      },
    },
    { name: "xAxisLabel", type: "text" },
    { name: "yAxisLabel", type: "text" },
    {
      name: "valueLabel",
      type: "text",
      admin: {
        description:
          "Name for the metric shown in the legend and data table, e.g. Monthly revenue.",
      },
    },
    {
      name: "decimalPlaces",
      type: "number",
      min: 0,
      max: 6,
      defaultValue: 2,
      admin: {
        description: "Maximum decimal places used for displayed values.",
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
          "Used by bar, line, and area charts. Pie and donut charts use the full palette.",
      },
    },
    { name: "showTooltip", type: "checkbox", defaultValue: true },
    { name: "showGrid", type: "checkbox", defaultValue: true },
    { name: "showLegend", type: "checkbox", defaultValue: true },
    { name: "showDataTable", type: "checkbox", defaultValue: true },
    {
      name: "showDataLabels",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description: "Show values on bars. Only applies to bar charts.",
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
        description:
          "Choose whether multiple series sit side by side or stack. Only applies to bar charts.",
        condition: (_, siblingData) => siblingData?.chartType === "bar",
      },
    },
    {
      name: "series",
      type: "array",
      maxRows: 10,
      admin: {
        initCollapsed: false,
        description:
          "Optional multi-series data for grouped/stacked bars and multi-line/area charts. Each series has its own category/value rows. Pie and donut charts use the first series.",
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
          "Single-series data. Leave empty when using the multi-series field above. Use non-negative values for pie, donut, and radial charts.",
        condition: (_, siblingData) => !siblingData?.series?.length,
      },
      fields: [
        { name: "label", type: "text", required: true },
        { name: "value", type: "number", required: true },
      ],
    },
  ],
};
