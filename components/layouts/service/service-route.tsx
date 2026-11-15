import type { ServiceTitledItem } from "@/lib/type/service.type";

/** "How we do it": the steps drawn as stops on a route, joined by a dashed line. */
export function ServiceRoute({ steps }: { steps: ServiceTitledItem[] }) {
  if (steps.length === 0) return null;

  return (
    <section
      aria-labelledby="how-heading"
      className="mx-auto max-w-7xl px-5 py-24 lg:px-10"
    >
      <h2 id="how-heading" className="mb-14 font-display text-3xl font-bold">
        How we do it
      </h2>
      <ol
        className="grid gap-0 md:gap-8"
        style={{
          gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))`,
        }}
      >
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;

          return (
            <li
              key={step.id ?? `${step.title}-${index}`}
              className="relative col-span-full grid grid-cols-[3rem_1fr] gap-5 pb-12 last:pb-0 md:col-span-1 md:block md:pb-0"
            >
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-6 top-12 border-l-2 border-dashed border-border md:bottom-auto md:left-14 md:right-[-2rem] md:top-6 md:border-l-0 md:border-t-2"
                />
              )}
              <span
                className={`relative z-10 flex size-12 items-center justify-center border-2 border-border font-mono text-base font-bold shadow-[var(--shadow-control)] ${
                  isLast
                    ? "bg-accent text-accent-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                <span className="sr-only">Step </span>
                {index + 1}
              </span>
              <div className="md:mt-7">
                <h3 className="font-display text-2xl font-bold leading-snug">
                  {step.title}
                </h3>
                {step.description && (
                  <p className="mt-2 max-w-[38ch] leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
