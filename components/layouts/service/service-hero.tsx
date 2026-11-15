import Link from "next/link";
import { icons } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ServiceDocument } from "@/lib/type/service.type";

export function ServiceHero({ service }: { service: ServiceDocument }) {
  const Icon =
    service.icon && service.icon in icons
      ? icons[service.icon as keyof typeof icons]
      : null;
  const startHere = service.startHere ?? [];
  const cta = service.ctaButton;

  return (
    <section className="border-b-2 border-border">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-36 lg:grid-cols-[minmax(0,1.45fr)_minmax(20rem,1fr)] lg:items-end lg:gap-16 lg:px-10 lg:pb-24">
        <div>
          {service.eyebrow && (
            <p className="mb-7 inline-flex items-center gap-2 border-2 border-border bg-card px-3 py-1.5 font-mono text-xs font-bold text-primary">
              {Icon && <Icon aria-hidden="true" className="size-4" />}
              {service.eyebrow}
            </p>
          )}
          <h1 className="max-w-[17ch] text-balance font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            {service.headline || service.name}
          </h1>
          {service.subtitle && (
            <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
              {service.subtitle}
            </p>
          )}
          {(cta?.label && cta.url) || service.reassurance ? (
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              {cta?.label && cta.url && (
                <Button asChild size="lg" className="h-12 px-7 text-base">
                  <Link href={cta.url}>{cta.label}</Link>
                </Button>
              )}
              {service.reassurance && (
                <p className="max-w-[34ch] text-sm leading-snug text-muted-foreground">
                  {service.reassurance}
                </p>
              )}
            </div>
          ) : null}
        </div>

        {startHere.length > 0 && (
          <aside aria-labelledby="start-here-heading">
            <h2
              id="start-here-heading"
              className="mb-4 font-display text-xl font-bold"
            >
              Start here
            </h2>
            <ol className="space-y-4">
              {startHere.map((item, index) => (
                <li
                  key={item.id ?? `${item.title}-${index}`}
                  className={`grid grid-cols-[3.25rem_1fr] border-2 border-border shadow-[var(--shadow-card)] ${
                    index === 0 ? "bg-card" : "bg-muted"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`flex items-start justify-center border-r-2 border-dashed border-border pt-5 font-mono text-sm font-bold ${
                      index === 0 ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="p-5">
                    <h3 className="font-display text-lg font-bold leading-snug">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                        {item.description}
                      </p>
                    )}
                    {item.note && (
                      <p className="mt-3 inline-block bg-secondary px-2 py-1 font-mono text-xs text-secondary-foreground">
                        {item.note}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </aside>
        )}
      </div>
    </section>
  );
}
