import type { ReactNode } from "react";

export function renderAsteriskText(
  text: string | null | undefined,
  className = "text-primary",
): ReactNode {
  if (!text) return null;
  return text.split(/(\*[^*]+\*)/g).map((part, index) =>
    part.startsWith("*") && part.endsWith("*") ? (
      <span key={index} className={className}>
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    ),
  );
}
