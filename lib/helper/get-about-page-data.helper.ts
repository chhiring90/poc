import { ABOUT_DEFAULTS } from "@/lib/const/about.const";
import { isRecord } from "@/lib/helper/is-record.helper";
import { parseMedia } from "@/lib/seo/parse";
import type { AboutPageData, AboutTeamMember } from "@/lib/type/about.type";

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

/** CMS list if it has rows, otherwise the starting copy. */
function orDefault<T>(list: T[], fallback: T[]): T[] {
  return list.length > 0 ? list : fallback;
}

function toTeamMember(value: unknown): AboutTeamMember[] {
  if (!isRecord(value) || !text(value.name)) return [];
  if (typeof value.id !== "number" && typeof value.id !== "string") return [];
  return [
    {
      id: value.id,
      name: text(value.name),
      role: text(value.role),
      bio: text(value.bio),
      photo: parseMedia(value.profile),
    },
  ];
}

/**
 * Normalises the `about` global (fetched at depth 2, so team photos are
 * populated). Empty fields fall back to the starting copy in ABOUT_DEFAULTS.
 */
export function getAboutPageData(value: unknown): AboutPageData {
  const doc = group(value);
  const D = ABOUT_DEFAULTS;
  const hero = group(doc.hero);
  const story = group(doc.story);
  const values = group(doc.values);
  const team = group(doc.team);
  const closing = group(doc.closing);
  const cta = group(closing.cta);

  return {
    hero: {
      eyebrow: text(hero.subheading) || D.hero.eyebrow,
      heading: text(hero.heading) || D.hero.heading,
      description: text(hero.description) || D.hero.description,
      image: parseMedia(hero.image),
    },
    facts: rows(doc.facts, "value").map((row) => ({
      id: rowId(row),
      value: text(row.value),
      label: text(row.label),
    })),
    story: {
      eyebrow: text(story.eyebrow) || D.story.eyebrow,
      chapters: orDefault(
        rows(story.chapters, "title").map((row) => ({
          id: rowId(row),
          title: text(row.title),
          body: text(row.body),
        })),
        D.story.chapters,
      ),
    },
    values: {
      eyebrow: text(values.subtitle) || D.values.eyebrow,
      heading: text(values.title) || D.values.heading,
      description: text(values.description) || D.values.description,
      items: orDefault(
        rows(values["value-lists"], "title").map((row) => ({
          id: rowId(row),
          icon: text(row.icon),
          title: text(row.title),
          tagline: text(row.tagline),
          description: text(row.description),
        })),
        D.values.items,
      ),
    },
    team: {
      show: team.show === true,
      eyebrow: text(team.subheading) || D.team.eyebrow,
      heading: text(team.heading) || D.team.heading,
      members: Array.isArray(team.members)
        ? team.members.flatMap(toTeamMember)
        : [],
    },
    closing: {
      heading: text(closing.heading) || D.closing.heading,
      description: text(closing.description) || D.closing.description,
      cta: {
        label: text(cta.label) || D.closing.cta.label,
        url: text(cta.url) || D.closing.cta.url,
      },
    },
  };
}
