"use client";

import { useRowLabel } from "@payloadcms/ui";

/** Row label for arrays whose rows have a `title`, `name` or `label`. */
export const TitleRowLabel = () => {
  const { data, rowNumber } = useRowLabel<{
    title?: string;
    name?: string;
    label?: string;
  }>();
  const number = String((rowNumber ?? 0) + 1).padStart(2, "0");
  const text = data?.title || data?.name || data?.label;

  return <div>{text ? `${number} · ${text}` : `Row ${number}`}</div>;
};
