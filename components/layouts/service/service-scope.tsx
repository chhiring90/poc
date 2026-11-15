import { Check } from "lucide-react";
import type { ServiceDocument } from "@/lib/type/service.type";

/** Capabilities as a ruled list, with "What you get" as a printed checklist beside it. */
export function ServiceScope({ service }: { service: ServiceDocument }) {
  const capabilities = service.capabilities ?? [];
  const deliverables = service.deliverables ?? [];
  const technologies = service.technologies ?? [];

  if (capabilities.length === 0 && deliverables.length === 0) return null;

  return (
    <section className="border-y-2 border-border bg-card/60">
      <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 lg:grid-cols-[minmax(0,1.6fr)_minmax(19rem,1fr)] lg:gap-16 lg:px-10">
        {capabilities.length > 0 && (
          <div>
            <h2 className="mb-8 font-display text-3xl font-bold">
              Our capabilities
            </h2>
            <dl className="border-t-2 border-border">
              {capabilities.map((item, index) => (
                <div
                  key={item.id ?? `${item.title}-${index}`}
                  className="grid gap-1 border-b border-border/40 py-5 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:gap-8"
                >
                  <dt className="font-display text-lg font-bold leading-snug">
                    {item.title}
                  </dt>
                  {item.description && (
                    <dd className="leading-relaxed text-muted-foreground">
                      {item.description}
                    </dd>
                  )}
                </div>
              ))}
            </dl>
          </div>
        )}

        {deliverables.length > 0 && (
          <aside
            aria-labelledby="what-you-get-heading"
            className="self-start border-2 border-border bg-background shadow-[var(--shadow-card)] lg:sticky lg:top-28"
          >
            <h2
              id="what-you-get-heading"
              className="border-b-2 border-border bg-secondary px-6 py-4 font-display text-xl font-bold text-secondary-foreground"
            >
              What you get
            </h2>
            <ul className="space-y-4 px-6 py-6">
              {deliverables.map(({ id, deliverable }, index) => (
                <li
                  key={id ?? `${deliverable}-${index}`}
                  className="flex gap-3 leading-snug"
                >
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center border-2 border-border bg-card text-primary"
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span>{deliverable}</span>
                </li>
              ))}
            </ul>
            {technologies.length > 0 && (
              <div className="border-t-2 border-dashed border-border px-6 py-5">
                <h3 className="mb-3 text-sm font-bold">Tools we use</h3>
                <ul className="flex flex-wrap gap-2">
                  {technologies.map(({ id, technology }, index) => (
                    <li
                      key={id ?? `${technology}-${index}`}
                      className="border border-border bg-muted px-2 py-0.5 font-mono text-xs"
                    >
                      {technology}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        )}
      </div>
    </section>
  );
}
