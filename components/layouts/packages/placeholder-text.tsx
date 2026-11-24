import type { ReactNode } from "react";

/**
 * Renders "[value]" as a marked placeholder, so values still to confirm in
 * the CMS read as provisional instead of as a firm promise.
 */
export function PlaceholderText({ text }: { text?: string | null }): ReactNode {
  if (!text) return null;
  return text.split(/(\[[^\]]+\])/g).map((part, index) =>
    part.startsWith("[") && part.endsWith("]") ? (
      <span
        key={index}
        title="To confirm"
        className="border-b-2 border-dotted border-primary/70"
      >
        {part.slice(1, -1)}
        <span className="sr-only"> (to confirm)</span>
      </span>
    ) : (
      part
    ),
  );
}

export function isPlaceholderOnly(text?: string | null): boolean {
  return !!text && /^\s*\[[^\]]*\]\s*$/.test(text);
}
