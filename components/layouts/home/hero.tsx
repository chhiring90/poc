import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

export type HeroData = {
  heading: string;
  subheading: string | null;
  description: string | null;
  image:
    | number
    | string
    | {
        id: number | string;
        url?: string | null;
        alt?: string | null;
      }
    | null;
  ctaPrimary: {
    label: string;
    url: string;
  };
  ctaSecondary: {
    label: string;
    url: string;
  };
};

export async function Hero({
  heading,
  subheading,
  description,
  ctaPrimary,
  ctaSecondary,
}: HeroData) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-150 h-150 rounded-full bg-primary/10 blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-20 w-125 h-125 rounded-full bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
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

      <div className="relative max-w-7xl mx-auto px-5 lg:px-10 pt-32 pb-20 w-full">
        <div className="max-w-4xl">
          {subheading && (
            <div className="inline-flex items-center gap-2 mb-8">
              <span className="font-mono text-sm text-primary uppercase tracking-widest">
                {subheading}
              </span>
              <span className="w-8 h-px bg-primary"></span>
            </div>
          )}

          {heading && <HighlightedText text={heading} />}

          {description && (
            <p className="text-lg md:text-xl max-w-2xl mb-10 text-muted-foreground leading-relaxed">
              {description}
            </p>
          )}

          {ctaPrimary && ctaSecondary && (
            <div className="flex flex-col sm:flex-row gap-4">
              {ctaPrimary.label && (
                <Link
                  href={ctaPrimary.url}
                  className="rounded-full bg-secondary px-6 py-3.5 text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.02]"
                >
                  {ctaPrimary.label}
                </Link>
              )}

              {ctaSecondary.label && (
                <Link
                  href={ctaSecondary.url}
                  className="rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02]"
                >
                  {ctaSecondary.label}
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block">
          <div className="relative">
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
            <div className="mx-4 h-3 rounded-b-xl bg-muted" />

            <div className="absolute -right-12 top-4 flex h-40 w-24 flex-col rounded-2xl border-2 border-border bg-card p-2 shadow-2xl">
              <div className="flex justify-center mb-2">
                <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
              </div>
              <div className="flex flex-1 items-center justify-center rounded-lg bg-primary/10">
                <span className="text-primary text-xl font-mono font-bold">
                  [POC]
                </span>
              </div>
            </div>

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

export function HighlightedText({ text }: { text: string }) {
  if (!text) return null;
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);

  return (
    <>
      <h1 className="font-display text-5xl md:text-7xl lg:text-[84px] font-bold leading-none tracking-tight mb-8">
        {parts.slice(0, 1)}
        <span className="relative inline-block">
          <span className="text-primary">
            {parts
              .filter((p) => p.startsWith("*"))
              .map((p) => p.replaceAll("*", ""))}
          </span>
          <svg
            className="absolute -bottom-1 left-0 w-full"
            height="4"
            viewBox="0 0 100 4"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 3 Q25 0 50 3 Q75 6 100 3"
              fill="none"
              stroke="oklch(0.6 0.23 285)"
              strokeWidth="1.5"
            />
          </svg>
        </span>

        {parts.slice(-1)}
      </h1>
    </>
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-5 lg:px-10 pt-32 pb-20 w-full">
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 mb-8">
            <Skeleton className="h-4 w-44" />
            <span className="w-8 h-px bg-primary/40" />
          </div>

          <Skeleton className="h-12 w-4/5 mb-3 md:h-18 lg:h-21" />
          <Skeleton className="h-12 w-2/5 mb-8 md:h-18 lg:h-21" />

          <div className="max-w-2xl mb-10 space-y-3">
            <Skeleton className="h-5 w-full md:h-6" />
            <Skeleton className="h-5 w-11/12 md:h-6" />
            <Skeleton className="h-5 w-2/3 md:h-6" />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-11.5 w-40 rounded-full" />
            <Skeleton className="h-11.5 w-44 rounded-full" />
          </div>
        </div>

        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block">
          <Skeleton className="h-48 w-80 rounded-xl" />
        </div>
      </div>
    </section>
  );
}
