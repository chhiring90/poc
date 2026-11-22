import Link from "next/link";
import { ArrowDown, Plus, icons } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/layouts/home/section-heading";
import {
  ClosingBand,
  PhotoFrame,
} from "@/components/layouts/shared/page-blocks";
import { renderAsteriskText } from "@/lib/helper/render-asterisk-text.helper";
import type { SeoMedia } from "@/lib/seo/parse";
import { cn } from "@/lib/utils";
import type {
  HowWeWorkLink,
  HowWeWorkPageData,
} from "@/lib/type/how-we-work.type";

const pad = (index: number) => String(index + 1).padStart(2, "0");
const stepAnchor = (index: number) => `step-${pad(index)}`;
const label = (text: string) => (text ? `// ${text.toLowerCase()}` : null);

function CtaButton({ cta }: { cta: HowWeWorkLink }) {
  if (!cta.label) return null;
  return (
    <Button asChild size="lg" className="h-12 px-7 text-base">
      <Link href={cta.url}>{cta.label}</Link>
    </Button>
  );
}

export function HowWeWorkHero({
  hero,
  cta,
  process,
  closing,
}: Pick<HowWeWorkPageData, "hero" | "cta" | "process" | "closing">) {
  const { steps } = process;

  return (
    <section className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-36 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-16 lg:px-10 lg:pb-28">
      <div>
        {hero.eyebrow && (
          <p className="mb-5 font-mono text-sm font-medium text-primary">
            {label(hero.eyebrow)}
          </p>
        )}
        <h1 className="text-balance font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl xl:text-7xl">
          {renderAsteriskText(hero.heading)}
        </h1>
        {hero.description && (
          <p className="mt-8 max-w-[52ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
            {hero.description}
          </p>
        )}
        {/* Button + reassurance, matching the service page hero. */}
        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
          <CtaButton cta={cta} />
          {(closing.heading || closing.description) && (
            <p className="max-w-[34ch] text-sm leading-snug text-muted-foreground">
              {[closing.heading, closing.description].filter(Boolean).join(" ")}
            </p>
          )}
        </div>
      </div>

      {steps.length > 0 && (
        <nav
          aria-label="Steps at a glance"
          className="border-2 border-border bg-card shadow-[var(--shadow-card)]"
        >
          <div className="flex items-center justify-between border-b-2 border-border px-6 py-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
            <span>Your route</span>
            <span>{steps.length} steps</span>
          </div>
          <ol>
            {steps.map((step, index) => (
              <li
                key={step.id ?? step.title}
                className="border-b border-border/25 last:border-b-0"
              >
                <a
                  href={`#${stepAnchor(index)}`}
                  className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-center gap-3 px-6 py-3.5 transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                >
                  <span className="font-mono text-sm font-bold tabular-nums text-primary">
                    {pad(index)}
                  </span>
                  <span className="truncate font-medium">{step.title}</span>
                  <ArrowDown
                    aria-hidden="true"
                    className="size-4 text-muted-foreground transition-transform group-hover:translate-y-0.5 group-hover:text-primary motion-reduce:transition-none"
                  />
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </section>
  );
}

/** Wide photo between the hero and the steps. Hidden until an image is set. */
export function HowWeWorkImageBand({ image }: { image: SeoMedia | null }) {
  if (!image) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 pb-24 lg:px-10 lg:pb-28">
      <PhotoFrame
        image={image}
        sizes="(min-width: 1280px) 1200px, 100vw"
        className="aspect-[4/3] sm:aspect-[16/9] lg:aspect-[21/9]"
      />
    </section>
  );
}

export function HowWeWorkSteps({
  process,
}: Pick<HowWeWorkPageData, "process">) {
  if (process.steps.length === 0) return null;

  return (
    <section
      id="process"
      className="scroll-mt-24 border-y-2 border-border bg-muted"
    >
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-10 lg:py-32">
        <SectionHeading
          label={label(process.eyebrow)}
          title={process.heading}
        />
        <ol>
          {process.steps.map((step, index) => {
            const isLast = index === process.steps.length - 1;
            return (
              <li
                key={step.id ?? step.title}
                id={stepAnchor(index)}
                className={cn(
                  "relative grid scroll-mt-28 grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 sm:grid-cols-[4.5rem_minmax(0,1fr)] sm:gap-x-8",
                  !isLast && "pb-10 sm:pb-12",
                )}
              >
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-7 top-14 w-0.5 -translate-x-1/2 bg-border sm:left-9 sm:top-18"
                  />
                )}
                <span className="relative flex size-14 items-center justify-center border-2 border-border bg-card font-mono text-lg font-bold tabular-nums text-primary shadow-[var(--shadow-control)] sm:size-18 sm:text-xl">
                  {pad(index)}
                </span>
                <div className="grid gap-4 border-2 border-border bg-card p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-12">
                  <div>
                    <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      Step {pad(index)}
                    </p>
                    <h3 className="font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                      {step.title}
                    </h3>
                    {step.tagline && (
                      <p className="mt-2 font-display text-lg font-medium text-primary">
                        {step.tagline}
                      </p>
                    )}
                  </div>
                  {step.description && (
                    <p className="max-w-[52ch] leading-relaxed text-muted-foreground lg:pt-7">
                      {step.description}
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

export function HowWeWorkCommitments({
  commitments,
}: Pick<HowWeWorkPageData, "commitments">) {
  if (commitments.items.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-10 lg:py-28">
      <SectionHeading
        label={label(commitments.eyebrow)}
        title={commitments.heading}
      />
      <div
        className={cn(
          "grid gap-6",
          commitments.image && "lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]",
        )}
      >
        <div
          className={cn(
            "grid gap-6 md:grid-cols-2",
            commitments.image && "lg:grid-cols-1",
          )}
        >
          {commitments.items.map((item) => {
            const Icon =
              item.icon in icons
                ? icons[item.icon as keyof typeof icons]
                : null;
            return (
              <div
                key={item.id ?? item.title}
                className="flex gap-5 border-2 border-border bg-card p-7 shadow-[var(--shadow-card)] sm:p-8"
              >
                {Icon && (
                  <span className="flex size-12 shrink-0 items-center justify-center border-2 border-border bg-card text-primary">
                    <Icon aria-hidden="true" className="size-5" />
                  </span>
                )}
                <div>
                  <h3 className="font-display text-xl font-bold">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-2 leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {commitments.image && (
          // Portrait on small screens; on desktop it matches the height of the cards.
          <PhotoFrame
            image={commitments.image}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[4/5] md:aspect-[16/9] lg:aspect-auto lg:min-h-80"
          />
        )}
      </div>
    </section>
  );
}

export function HowWeWorkSizes({ sizes }: Pick<HowWeWorkPageData, "sizes">) {
  const { options, extras } = sizes;
  if (options.length === 0 && extras.length === 0) return null;

  return (
    <section className="border-y-2 border-border bg-muted">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-10 lg:py-28">
        <SectionHeading label={label(sizes.eyebrow)} title={sizes.heading} />

        {options.length > 0 && (
          <ol
            className={cn(
              "grid gap-6",
              options.length > 1 && "md:grid-cols-2",
              options.length > 2 && "lg:grid-cols-3",
            )}
          >
            {options.map((option, index) => (
              <li
                key={option.id ?? option.name}
                className="flex flex-col border-2 border-border bg-card p-7 shadow-[var(--shadow-card)] sm:p-8"
              >
                <div className="mb-10 flex items-center justify-between gap-4">
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Size {pad(index)}
                  </span>
                  {/* Scale: one filled block per size step, so bigger options read as bigger. */}
                  <span aria-hidden="true" className="flex items-end gap-1">
                    {options.map((_, block) => (
                      <span
                        key={block}
                        className={cn(
                          "w-2.5 border-2 border-border",
                          block <= index ? "bg-primary" : "bg-transparent",
                        )}
                        style={{ height: `${0.75 + block * 0.375}rem` }}
                      />
                    ))}
                  </span>
                </div>
                <h3 className="font-display text-3xl font-bold tracking-tight">
                  {option.name}
                </h3>
                {option.description && (
                  <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                    {option.description}
                  </p>
                )}
              </li>
            ))}
          </ol>
        )}

        {extras.length > 0 && (
          <div className="mt-12 grid border-2 border-border bg-background lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
            <div className="border-b-2 border-border p-7 sm:p-8 lg:border-b-0 lg:border-r-2">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">
                {"// add-ons"}
              </p>
              <h3 className="font-display text-2xl font-bold tracking-tight">
                {sizes.extrasHeading}
              </h3>
            </div>
            <ul className="grid divide-y-2 divide-border sm:grid-cols-2 sm:divide-x-2 sm:divide-y-0">
              {extras.map((extra) => (
                <li
                  key={extra.id ?? extra.title}
                  className="flex gap-4 p-7 sm:p-8"
                >
                  <Plus
                    aria-hidden="true"
                    className="mt-1 size-5 shrink-0 text-primary"
                  />
                  <div>
                    <p className="font-display text-lg font-bold">
                      {extra.title}
                    </p>
                    {extra.description && (
                      <p className="mt-1 leading-relaxed text-muted-foreground">
                        {extra.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}

export function HowWeWorkTools({ tools }: Pick<HowWeWorkPageData, "tools">) {
  if (tools.groups.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-10 lg:py-28">
      <SectionHeading label={label(tools.eyebrow)} title={tools.heading} />
      <dl className="border-t-2 border-border">
        {tools.groups.map((group) => (
          <div
            key={group.id ?? group.label}
            className="grid gap-4 border-b-2 border-border py-7 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:items-center md:gap-10"
          >
            <dt className="font-display text-xl font-bold">{group.label}</dt>
            <dd className="flex flex-wrap gap-3">
              {group.tools.map((tool) => (
                <span
                  key={tool.id ?? tool.name}
                  className="border-2 border-border bg-secondary px-4 py-2 font-mono text-sm text-secondary-foreground"
                >
                  {tool.name}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>
      {tools.note && (
        <p className="mt-8 font-mono text-sm text-muted-foreground">
          {`// ${tools.note}`}
        </p>
      )}
    </section>
  );
}

export function HowWeWorkClosing({
  closing,
  cta,
}: Pick<HowWeWorkPageData, "closing" | "cta">) {
  return (
    <ClosingBand
      heading={closing.heading}
      description={closing.description}
      cta={cta}
    />
  );
}
