import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export default function NotFound() {
  return (
    <section
      aria-labelledby="not-found-title"
      className="relative isolate flex min-h-screen items-center overflow-hidden bg-background px-5 py-28 text-foreground lg:px-10"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-36 top-1/2 -z-10 size-120 -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <p className="mb-6 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.24em] text-primary">
            <span className="h-px w-8 bg-primary" />
            Error / 404
          </p>
          <h1
            id="not-found-title"
            className="max-w-xl font-display text-5xl font-bold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl"
          >
            This page took a <span className="text-primary">wrong turn.</span>
          </h1>
          <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            The page you’re looking for may have moved, changed, or never
            existed. Let’s get you back on the right path.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center gap-3 bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              <ArrowLeft aria-hidden="true" className="size-4" />
              Back to homepage
            </Link>
            <Link
              href="/works"
              className="inline-flex min-h-12 items-center gap-2 px-3 py-3 text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            >
              Explore our work
              <ArrowUpRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="relative mx-auto flex aspect-square w-full max-w-lg items-center justify-center"
        >
          <div className="absolute inset-[8%] rotate-6 border border-border" />
          <div className="absolute inset-[8%] -rotate-6 border border-primary/30" />
          <div className="absolute inset-[17%] bg-primary/[0.06]" />
          <div className="relative flex items-center font-display text-[clamp(7rem,25vw,15rem)] font-bold leading-none tracking-[-0.1em] text-primary">
            <span>4</span>
            <span className="relative">
              <span className="absolute inset-[19%] rounded-full border-[0.09em] border-current" />
              0
            </span>
            <span>4</span>
          </div>
          <span className="absolute bottom-[11%] right-[4%] font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Page not found
          </span>
        </div>
      </div>
    </section>
  );
}
