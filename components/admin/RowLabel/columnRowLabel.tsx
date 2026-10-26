"use client";

import { useRowLabel } from "@payloadcms/ui";

export const ColumnRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ heading?: string }>();
  const fallback = `Column ${String((rowNumber ?? 0) + 1).padStart(2, "0")}`;
  return <div>{data?.heading || fallback}</div>;
};
