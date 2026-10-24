"use client";

import { useRowLabel } from "@payloadcms/ui";

export const NavItemRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ label?: string; link?: string }>();
  const fallback = `Nav Item ${String((rowNumber ?? 0) + 1).padStart(2, "0")}`;
  return <div>{data?.label || fallback}</div>;
};
