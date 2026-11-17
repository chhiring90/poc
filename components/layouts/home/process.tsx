type ProcessStep = {
  id?: number | string | null;
  /** Legacy home.process field; numbering always follows list order. */
  step?: string | number;
  title: string;
  description?: string | null;
};

/** Ordered list of steps. Numbers follow the list order, so gaps or repeats in the CMS "step" field don't show. */
export function Process({ process }: { process: ProcessStep[] }) {
  if (process.length === 0) return null;

  return (
    <section
      id="process"
      className="scroll-mt-24 border-y-2 border-border bg-muted"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] lg:gap-20 lg:px-10 lg:py-32">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <p className="mb-5 font-mono text-sm font-medium text-primary">
            {"// how we work"}
          </p>
          <h2 className="max-w-[12ch] text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
            From idea to live product
          </h2>
        </div>

        <ol className="border-t-2 border-border">
          {process.map((item, index) => (
            <li
              key={item.id ?? `${item.title}-${index}`}
              className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4 gap-y-2 border-b-2 border-border py-7 sm:grid-cols-[4.5rem_minmax(0,11rem)_minmax(0,1fr)] sm:gap-x-6"
            >
              <span className="font-mono text-lg font-bold tabular-nums text-primary sm:row-span-1">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="font-display text-2xl font-bold leading-tight">
                {item.title}
              </h3>
              {item.description && (
                <p className="col-start-2 max-w-[48ch] leading-relaxed text-muted-foreground sm:col-start-3 sm:pt-1">
                  {item.description}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
