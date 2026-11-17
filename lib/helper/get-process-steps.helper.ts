import { findCached } from "@/lib/cms/cache";
import { isRecord } from "@/lib/helper/is-record.helper";
import type { ProcessStep } from "@/lib/type/process-step.type";

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Normalises process-steps documents; rows without a title are dropped. */
export function toProcessSteps(docs: unknown[]): ProcessStep[] {
  return docs.flatMap((doc) =>
    isRecord(doc) && text(doc.title)
      ? [
          {
            id:
              typeof doc.id === "number" || typeof doc.id === "string"
                ? doc.id
                : null,
            title: text(doc.title),
            tagline: text(doc.tagline),
            description: text(doc.description),
          },
        ]
      : [],
  );
}

/** Every process step, in display order. */
export async function getProcessSteps(): Promise<ProcessStep[]> {
  const { docs } = await findCached({
    collection: "process-steps",
    sort: "order",
    depth: 0,
    pagination: false,
  });
  return toProcessSteps(docs);
}
