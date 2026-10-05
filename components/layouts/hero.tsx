import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/10 blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-20 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
        {/* Grid pattern */}
        <svg
          className="absolute inset-0 h-full w-full text-foreground opacity-5"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-[1280px] mx-auto px-5 lg:px-10 pt-32 pb-20 w-full">
        <div className="max-w-4xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-8">
            <span className="font-mono text-sm text-primary uppercase tracking-widest">
              Hey, we're POC 👋
            </span>
            <span className="w-8 h-px bg-primary" />
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-[84px] font-bold leading-[1.0] tracking-tight mb-8">
            We build apps that{" "}
            <span className="relative inline-block">
              <span className="text-primary">prove</span>
              <svg
                className="absolute -bottom-1 left-0 w-full"
                height="4"
                viewBox="0 0 100 4"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 3 Q25 0 50 3 Q75 6 100 3"
                  fill="none"
                  stroke="#C8FF2E"
                  strokeWidth="1.5"
                />
              </svg>
            </span>{" "}
            themselves.
          </h1>

          <p
            className={`text-lg md:text-xl max-w-2xl mb-10 text-muted-foreground leading-relaxed`}
          >
            A web and mobile app agency turning ideas into scalable products
            with a modern tech stack. From startup MVPs to enterprise rebuilds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/work"
              className="rounded-full bg-secondary px-6 py-3.5 text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.02]"
            >
              View our work
            </Link>

            <Link
              href="/contact"
              className="rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02]"
            >
              Start a project →
            </Link>
          </div>
        </div>

        {/* Floating device mockups */}
        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block">
          <div className="relative">
            {/* Laptop */}
            <div className="flex h-48 w-80 items-center justify-center rounded-xl border-4 border-border bg-card shadow-2xl">
              <div className="w-full h-full p-3 overflow-hidden rounded-lg">
                <div className="mb-2 h-3 rounded bg-muted" />
                <div className="flex gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <div className="w-2 h-2 rounded-full bg-secondary" />
                  <div className="w-2 h-2 rounded-full bg-[#7B5CFF]" />
                </div>
                <div className="mb-1 h-2 w-3/4 rounded bg-muted" />
                <div className="mb-1 h-2 w-1/2 rounded bg-muted" />
                <div className="mb-3 h-2 w-5/6 rounded bg-muted" />
                <div className="flex gap-1.5">
                  <div className="rounded-full bg-primary px-3 py-1 font-mono text-xs font-medium text-primary-foreground">
                    Deploy →
                  </div>
                  <div className="rounded-full bg-muted px-3 py-1 font-mono text-xs text-muted-foreground">
                    v2.4.1
                  </div>
                </div>
              </div>
            </div>
            {/* Base of laptop */}
            <div className="mx-4 h-3 rounded-b-xl bg-muted" />

            {/* Phone */}
            <div className="absolute -right-12 top-4 flex h-40 w-24 flex-col rounded-2xl border-2 border-border bg-card p-2 shadow-2xl">
              <div className="flex justify-center mb-2">
                <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
              </div>
              <div className="flex flex-1 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-primary text-2xl font-mono font-bold">
                  P∘C
                </span>
              </div>
            </div>

            {/* Status badge */}
            <div className="absolute -bottom-4 -left-4 flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5">
              <span className="size-2 animate-pulse rounded-full bg-emerald-500" />
              <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400">
                Deployed in production
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span
          className={`text-xs font-mono uppercase tracking-widest text-muted-foreground`}
        >
          Scroll
        </span>
        <div className="h-8 w-px bg-border" />
      </div>
    </section>
  );
}
