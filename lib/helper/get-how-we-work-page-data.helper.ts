import { HOW_WE_WORK_DEFAULTS } from "@/lib/const/how-we-work.const";
import { isRecord } from "@/lib/helper/is-record.helper";
import { parseMedia } from "@/lib/seo/parse";
import type {
  HowWeWorkPageData,
  HowWeWorkSize,
} from "@/lib/type/how-we-work.type";
import type { ProcessStep } from "@/lib/type/process-step.type";

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function group(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function rowId(row: Record<string, unknown>): string | null {
  return typeof row.id === "string" ? row.id : null;
}

/** Array rows that have a value in `key`; rows editors left empty are dropped. */
function rows(value: unknown, key: string): Record<string, unknown>[] {
  return Array.isArray(value)
    ? value.filter(
        (row): row is Record<string, unknown> =>
          isRecord(row) && text(row[key]) !== "",
      )
    : [];
}

/**
 * Normalises the howWeWorkPage global plus the process-steps collection.
 * Until the global has been saved once (no `updatedAt`), the starting copy is
 * shown so the page is never empty; after that the CMS is the source of truth,
 * including fields left blank. Same for steps while the collection is empty.
 */
export function getHowWeWorkPageData(
  value: unknown,
  processSteps: ProcessStep[],
): HowWeWorkPageData {
  const steps =
    processSteps.length > 0 ? processSteps : HOW_WE_WORK_DEFAULTS.process.steps;
  if (!isRecord(value) || !value.updatedAt) {
    return {
      ...HOW_WE_WORK_DEFAULTS,
      process: { ...HOW_WE_WORK_DEFAULTS.process, steps },
    };
  }

  const hero = group(value.hero);
  const cta = group(value.cta);
  const process = group(value.process);
  const commitments = group(value.commitments);
  const sizes = group(value.sizes);
  const tools = group(value.tools);
  const closing = group(value.closing);

  return {
    hero: {
      eyebrow: text(hero.eyebrow),
      heading: text(hero.heading),
      description: text(hero.description),
      image: parseMedia(hero.image),
    },
    cta: {
      label: text(cta.label),
      url: text(cta.url) || HOW_WE_WORK_DEFAULTS.cta.url,
    },
    process: {
      eyebrow: text(process.eyebrow),
      heading: text(process.heading),
      steps,
    },
    commitments: {
      eyebrow: text(commitments.eyebrow),
      heading: text(commitments.heading),
      image: parseMedia(commitments.image),
      items: rows(commitments.items, "title").map((row) => ({
        id: rowId(row),
        icon: text(row.icon),
        title: text(row.title),
        description: text(row.description),
      })),
    },
    sizes: {
      eyebrow: text(sizes.eyebrow),
      heading: text(sizes.heading),
      options: rows(sizes.options, "name").map((row) => ({
        id: rowId(row),
        name: text(row.name),
        description: text(row.description),
        package: isRecord(row.package) ||
          typeof row.package === "number" ||
          typeof row.package === "string"
          ? (row.package as HowWeWorkSize["package"])
          : null,
      })),
      extrasHeading: text(sizes.extrasHeading),
      extras: rows(sizes.extras, "title").map((row) => ({
        id: rowId(row),
        title: text(row.title),
        description: text(row.description),
      })),
    },
    tools: {
      eyebrow: text(tools.eyebrow),
      heading: text(tools.heading),
      groups: rows(tools.groups, "label").map((row) => ({
        id: rowId(row),
        label: text(row.label),
        tools: rows(row.tools, "name").map((tool) => ({
          id: rowId(tool),
          name: text(tool.name),
        })),
      })),
      note: text(tools.note),
    },
    closing: {
      heading: text(closing.heading),
      description: text(closing.description),
    },
  };
}
