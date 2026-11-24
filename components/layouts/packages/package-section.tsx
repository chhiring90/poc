import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PackageDeliverables } from "@/components/layouts/packages/package-deliverables";
import { PackageIcon } from "@/components/layouts/packages/package-icon";
import { formatPackageNumber } from "@/components/layouts/packages/packages-hero";
import {
  PlaceholderText,
  isPlaceholderOnly,
} from "@/components/layouts/packages/placeholder-text";
import type { PackageDocument } from "@/lib/type/package.type";

function Scope({
  tone,
  title,
  text,
}: {
  tone: "in" | "out";
  title: string;
  text: string;
}) {
  const Icon = tone === "in" ? Check : Minus;
  return (
    <div
      className={`border-2 p-5 ${
        tone === "in"
          ? "border-border bg-card"
          : "border-dashed border-border bg-transparent"
      }`}
    >
      <h3 className="mb-2 flex items-center gap-2 font-display text-base font-bold">
        <Icon
          aria-hidden="true"
          strokeWidth={3}
          className={`size-4 ${tone === "in" ? "text-primary" : "text-muted-foreground"}`}
        />
        {title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        <PlaceholderText text={text} />
      </p>
    </div>
  );
}

export function PackageSection({
  pkg,
  index,
}: {
  pkg: PackageDocument;
  index: number;
}) {
  const anchor = pkg.slug ?? String(pkg.id);
  const number = formatPackageNumber(pkg.order, index);
  const options = (pkg.options ?? []).filter((o) => (o.items ?? []).length > 0);
  const terms = pkg.terms ?? [];
  const requires =
    pkg.requires && typeof pkg.requires === "object" ? pkg.requires : null;
  const headingId = `${anchor}-heading`;

  return (
    <section
      id={anchor}
      aria-labelledby={headingId}
      className={`scroll-mt-24 border-b-2 border-border ${index % 2 === 1 ? "bg-card/60" : ""}`}
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[minmax(0,1.5fr)_minmax(20rem,1fr)] lg:gap-16 lg:px-10">
        <div>
          <div className="mb-6 flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-primary">
              {number}
            </span>
            <span aria-hidden="true" className="h-0.5 w-10 bg-border" />
            <span className="flex size-9 items-center justify-center border-2 border-border bg-muted text-primary">
              <PackageIcon name={pkg.icon} className="size-4" />
            </span>
          </div>
          <h2
            id={headingId}
            className="font-display text-3xl font-bold tracking-tight md:text-5xl"
          >
            {pkg.name}
          </h2>
          {pkg.tagline && (
            <p className="mt-4 max-w-[40ch] text-balance text-xl leading-snug md:text-2xl">
              {pkg.tagline}
            </p>
          )}
          {pkg.description && (
            <p className="mt-6 max-w-[60ch] leading-relaxed text-muted-foreground">
              <span className="font-bold text-foreground">For: </span>
              {pkg.description}
            </p>
          )}

          {requires && (
            <p className="mt-6 inline-flex flex-wrap items-center gap-2 border-2 border-border bg-accent px-3 py-2 text-sm text-accent-foreground">
              <span className="font-bold">Required first:</span>
              <Link
                href={`#${requires.slug}`}
                className="underline underline-offset-4 hover:no-underline"
              >
                {requires.name}
              </Link>
            </p>
          )}

          {(pkg.included || pkg.notIncluded) && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2">
              {pkg.included && (
                <Scope tone="in" title="Included" text={pkg.included} />
              )}
              {pkg.notIncluded && (
                <Scope tone="out" title="Not included" text={pkg.notIncluded} />
              )}
            </div>
          )}

          {options.map((group, groupIndex) => (
            <div key={group.id ?? groupIndex} className="mt-12">
              <h3 className="mb-5 font-display text-xl font-bold">
                {group.heading}
              </h3>
              <ol
                className={`grid gap-4 ${
                  (group.items ?? []).length > 4
                    ? "grid-cols-2 md:grid-cols-3"
                    : "sm:grid-cols-2"
                }`}
              >
                {(group.items ?? []).map((item, itemIndex) => (
                  <li
                    key={item.id ?? `${item.name}-${itemIndex}`}
                    className={`border-2 border-border bg-background ${item.detail ? "p-5" : "px-4 py-3"}`}
                  >
                    <p className={`font-display font-bold ${item.detail ? "text-lg" : "text-sm"}`}>
                      <PlaceholderText text={item.name} />
                    </p>
                    {item.detail && (
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        <PlaceholderText text={item.detail} />
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}

          {terms.length > 0 && (
            <dl className="mt-12 border-t-2 border-border">
              {terms.map((term, termIndex) => (
                <div
                  key={term.id ?? `${term.label}-${termIndex}`}
                  className="grid gap-1 border-b border-border/40 py-4 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-8"
                >
                  <dt className="font-mono text-xs font-bold uppercase tracking-wider text-primary sm:pt-1">
                    {term.label}
                  </dt>
                  <dd className="leading-relaxed text-muted-foreground">
                    <PlaceholderText text={term.value} />
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        <aside className="space-y-6 self-start lg:sticky lg:top-28">
          <div className="border-2 border-border bg-muted p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Price
            </p>
            <p className="mt-1 font-mono text-3xl font-bold text-primary">
              {pkg.price ? <PlaceholderText text={pkg.price} /> : "Quoted"}
            </p>
            {pkg.priceDependsOn && (
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                <span className="font-bold text-foreground">Depends on: </span>
                <PlaceholderText text={pkg.priceDependsOn} />
              </p>
            )}
            {pkg.timing && (
              <p className="mt-3 text-sm text-muted-foreground">
                <span className="font-bold text-foreground">Timing: </span>
                {isPlaceholderOnly(pkg.timing) ? (
                  "to confirm on the call"
                ) : (
                  <PlaceholderText text={pkg.timing} />
                )}
              </p>
            )}
            <Button asChild size="lg" className="mt-6 w-full whitespace-normal">
              <Link href="/contact">
                Talk to us about {pkg.name}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <PackageDeliverables
            groups={pkg.deliverableGroups ?? []}
            headingId={`${anchor}-deliverables`}
          />
        </aside>
      </div>
    </section>
  );
}
