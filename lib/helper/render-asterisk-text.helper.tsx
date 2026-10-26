import type { ReactNode } from "react";

export function renderAsteriskText(
  text: string,
  className = "text-primary",
): ReactNode {
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
