export function AISection() {
  return (
    <section className="border-y-2 border-border bg-muted">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-16 lg:px-10">
        <div>
          <p className="mb-4 font-mono text-sm font-medium text-primary">
            {"// third-party validation"}
          </p>
          <h2 className="text-balance font-display text-3xl font-bold tracking-tight md:text-4xl">
            See what AI says about us
          </h2>
          <p className="mt-3 max-w-[44ch] text-lg text-muted-foreground">
            Don&apos;t just take our word for it. Ask the robots.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          {["Ask ChatGPT", "Ask Claude", "Ask Gemini", "Ask Grok"].map(
            (label) => (
              <button
                key={label}
                type="button"
                className="border-2 border-border bg-card px-5 py-3 text-left text-sm font-semibold text-foreground shadow-[var(--shadow-control)] transition-[background-color,transform,box-shadow] hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                {label} →
              </button>
            ),
          )}
        </div>
      </div>
    </section>
  );
}
