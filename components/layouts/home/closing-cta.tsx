import Link from "next/link";

export function ClosingCTA() {
  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,var(--primary-foreground)_1px,transparent_1px),linear-gradient(to_bottom,var(--primary-foreground)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_left,#000,transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-24 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-16 lg:px-10 lg:py-32">
        <div>
          <p className="mb-5 font-mono text-sm font-medium text-primary-foreground/75">
            {"// let's build"}
          </p>
          <h2 className="font-display text-5xl font-bold leading-[0.95] tracking-tight md:text-7xl">
            Got an idea?
            <br />
            Let&apos;s prove it.
          </h2>
        </div>
        <div className="border-t-2 border-primary-foreground/30 pt-8 lg:border-l-2 lg:border-t-0 lg:pl-10 lg:pt-0">
          <p className="mb-8 max-w-[36ch] text-lg leading-relaxed text-primary-foreground/85">
            We&apos;ll scope your project in a free 30-minute call. No pitch
            decks, no BS.
          </p>
          <Link
            href="/contact"
            className="inline-flex h-12 items-center gap-2 border-2 border-foreground bg-background px-7 text-base font-bold text-foreground shadow-[4px_4px_0_var(--foreground)] transition-[transform,box-shadow] hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground active:translate-x-1 active:translate-y-1 active:shadow-none"
          >
            Start a project →
          </Link>
        </div>
      </div>
    </section>
  );
}
