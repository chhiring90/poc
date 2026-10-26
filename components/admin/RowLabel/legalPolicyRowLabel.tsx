"use client";

import { useRowLabel } from "@payloadcms/ui";

export const LegalPolicyRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{ title?: string; slug?: string }>();
  const fallback = `Policy ${String((rowNumber ?? 0) + 1).padStart(2, "0")}`;

  return <div>{data?.title || data?.slug || fallback}</div>;
};
