import { icons } from "lucide-react";
import { SectionHeading } from "@/components/layouts/home/section-heading";
import { PhotoFrame } from "@/components/layouts/shared/page-blocks";
import { ABOUT_FALLBACK_IMAGE } from "@/lib/const/about.const";
import { renderAsteriskText } from "@/lib/helper/render-asterisk-text.helper";
import { cn } from "@/lib/utils";
import type { AboutPageData } from "@/lib/type/about.type";

const pad = (index: number) => String(index + 1).padStart(2, "0");
const label = (text: string) => (text ? `// ${text.toLowerCase()}` : null);
const chapterAnchor = (index: number) => `chapter-${pad(index)}`;

export function AboutHero({ hero }: Pick<AboutPageData, "hero">) {
  return (
    <section className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-36 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center lg:gap-14 lg:px-10 lg:pb-28">
      <div>
        <p className="mb-5 font-mono text-sm font-medium text-primary">
          {label(hero.eyebrow)}
        </p>
        <h1 className="text-balance font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl">
          {renderAsteriskText(hero.heading)}
        </h1>
        <p className="mt-8 max-w-[44ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
          {hero.description}
        </p>
      </div>
      <PhotoFrame
        image={hero.image ?? ABOUT_FALLBACK_IMAGE}
        sizes="(min-width: 1280px) 680px, (min-width: 1024px) 55vw, 100vw"
        className="aspect-[4/3] lg:aspect-square"
        preload
      />
    </section>
  );
}

/** Proof points under the hero. Hidden until editors add some. */
export function AboutFacts({ facts }: Pick<AboutPageData, "facts">) {
  if (facts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 pb-20 lg:px-10 lg:pb-24">
      <dl
        className={cn(
          "grid border-2 border-border bg-card shadow-[var(--shadow-card)] sm:grid-cols-2",
          facts.length > 2 && "lg:grid-cols-4",
        )}
      >
        {facts.map((fact) => (
          <div
            key={fact.id ?? fact.value}
            // Label (dt) is read first but shown under the value.
            className="flex flex-col-reverse justify-end gap-2 border-b-2 border-border p-6 last:border-b-0 sm:p-8 lg:border-b-0 lg:border-r-2 lg:last:border-r-0"
          >
            <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {fact.label}
            </dt>
            <dd className="font-display text-4xl font-bold tracking-tight text-primary">
              {fact.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

/** The story as numbered chapters, with a sticky chapter index on desktop. */
export function AboutStory({ story }: Pick<AboutPageData, "story">) {
  if (story.chapters.length === 0) return null;

  return (
    <section className="border-y-2 border-border bg-muted">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-20 lg:px-10 lg:py-32">
        <nav
          aria-label="Our story chapters"
          className="lg:sticky lg:top-32 lg:self-start"
        >
          <p className="mb-6 font-mono text-sm font-medium text-primary">
            {label(story.eyebrow)}
          </p>
          <ol className="hidden border-t-2 border-border lg:block">
            {story.chapters.map((chapter, index) => (
              <li
                key={chapter.id ?? chapter.title}
                className="border-b-2 border-border"
              >
                <a
                  href={`#${chapterAnchor(index)}`}
                  className="flex gap-4 py-3 font-medium transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                >
                  <span className="font-mono text-sm font-bold tabular-nums text-primary">
                    {pad(index)}
                  </span>
                  {chapter.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="space-y-14 lg:space-y-20">
          {story.chapters.map((chapter, index) => (
            <article
              key={chapter.id ?? chapter.title}
              id={chapterAnchor(index)}
              className="scroll-mt-28"
            >
              <p className="mb-3 font-mono text-sm font-bold tabular-nums text-primary">
                {pad(index)}
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                {chapter.title}
              </h2>
              {chapter.body && (
                <p className="mt-5 max-w-[62ch] text-lg leading-relaxed text-muted-foreground">
                  {chapter.body}
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * Bento tiles, repeating every four values:
 * desktop  [ 1 1 2 ]   tablet  [ 1 1 ]
 *          [ 3 4 2 ]           [ 2 3 ]
 *                              [ 4 4 ]
 */
const BENTO_TILES = [
  {
    span: "md:col-span-2",
    tone: "bg-primary text-primary-foreground",
    muted: "text-primary-foreground/80",
    accent: "text-primary-foreground/75",
    iconBox: "border-primary-foreground/40",
  },
  {
    span: "lg:row-span-2",
    tone: "bg-card",
    muted: "text-muted-foreground",
    accent: "text-primary",
    iconBox: "border-border bg-primary text-primary-foreground",
  },
  {
    span: "",
    tone: "bg-card",
    muted: "text-muted-foreground",
    accent: "text-primary",
    iconBox: "border-border bg-primary text-primary-foreground",
  },
  {
    span: "md:col-span-2 lg:col-span-1",
    tone: "bg-secondary text-secondary-foreground",
    muted: "text-secondary-foreground/80",
    accent: "text-primary",
    iconBox: "border-border bg-primary text-primary-foreground",
  },
] as const;

export function AboutValues({ values }: Pick<AboutPageData, "values">) {
  if (values.items.length === 0) return null;

  return (
    <section className="border-y-2 border-border bg-muted">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-10 lg:py-32">
        <SectionHeading
          label={label(values.eyebrow)}
          title={values.heading}
          description={values.description}
          className="border-b-0 pb-0"
        />
        <ol className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {values.items.map((value, index) => {
            const tile = BENTO_TILES[index % BENTO_TILES.length];
            const isTall = index % BENTO_TILES.length === 1;
            const Icon =
              value.icon in icons
                ? icons[value.icon as keyof typeof icons]
                : null;
            return (
              <li
                key={value.id ?? value.title}
                className={cn(
                  "flex min-h-72 flex-col border-2 border-border p-7 shadow-[var(--shadow-card)] sm:p-9",
                  tile.span,
                  tile.tone,
                )}
              >
                <div className="flex items-start justify-between gap-6">
                  <p
                    className={cn(
                      "font-mono text-xs font-bold uppercase tracking-widest",
                      tile.accent,
                    )}
                  >
                    {value.title}
                  </p>
                  {Icon && (
                    <span
                      className={cn(
                        "flex shrink-0 items-center justify-center border-2",
                        isTall ? "size-16" : "size-12",
                        tile.iconBox,
                      )}
                    >
                      <Icon
                        aria-hidden="true"
                        className={isTall ? "size-7" : "size-5"}
                      />
                    </span>
                  )}
                </div>
                {/* The tagline is the promise, so it leads; pushed to the bottom of the tile. */}
                <div className="mt-auto pt-10">
                  <h3
                    className={cn(
                      "text-balance font-display font-bold leading-[1.05] tracking-tight",
                      index % BENTO_TILES.length === 0 || isTall
                        ? "text-3xl md:text-4xl lg:text-5xl"
                        : "text-2xl md:text-3xl",
                    )}
                  >
                    {value.tagline || value.title}
                  </h3>
                  {value.description && (
                    <p
                      className={cn(
                        "mt-4 max-w-[52ch] leading-relaxed",
                        tile.muted,
                      )}
                    >
                      {value.description}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/** Off until "Show the team section" is ticked in the CMS and people are chosen. */
export function AboutTeam({ team }: Pick<AboutPageData, "team">) {
  if (!team.show || team.members.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-10 lg:py-28">
      <SectionHeading label={label(team.eyebrow)} title={team.heading} />
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {team.members.map((member) => (
          <li key={member.id}>
            {member.photo && (
              <PhotoFrame
                image={{
                  url: member.photo.url,
                  alt: member.photo.alt ?? member.name,
                }}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                className="mb-5 aspect-[4/5]"
              />
            )}
            <h3 className="font-display text-xl font-bold">{member.name}</h3>
            {member.role && (
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-primary">
                {member.role}
              </p>
            )}
            {member.bio && (
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {member.bio}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
