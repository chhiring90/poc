"use client";

import dynamic from "next/dynamic";

/**
 * Loads ChartBlock (and recharts) in its own chunk, so rich-text pages
 * without a chart don't download the charting library.
 */
export const ChartBlock = dynamic(() =>
  import("@/components/layouts/rich-text/chart-block").then(
    (mod) => mod.ChartBlock,
  ),
);
