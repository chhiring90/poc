import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { GradientWave } from "@/components/ui/gradient-wave";

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
        <div className="absolute -top-40 -right-40 w-150 h-150 rounded-none bg-primary/10 blur-3xl animate-blob" />
        <div className="absolute -bottom-40 -left-20 w-125 h-125 rounded-none bg-secondary/10 blur-3xl animate-blob animation-delay-2000" />
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

      <div className="relative flex max-w-7xl mx-auto px-5 lg:px-10 pt-32 pb-20 w-full">
        <div className="lg:w-1/2">
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
                  className="rounded-none bg-secondary px-6 py-3.5 text-sm font-semibold transition-all hover:opacity-90 hover:scale-[1.02]"
                >
                  {ctaPrimary.label}
                </Link>
              )}

              {ctaSecondary.label && (
                <Link
                  href={ctaSecondary.url}
                  className="rounded-none bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:opacity-90 hover:scale-[1.02]"
                >
                  {ctaSecondary.label}
                </Link>
              )}
            </div>
          )}
        </div>

        <div className="hidden w-1/2 pl-6 xl:block">
          <GradientWave
            speed={1}
            className="w-full ml-auto max-w-6xl aspect-108/79"
          />
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
              stroke="oklch(0.74 0.14 52)"
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
            <Skeleton className="h-11.5 w-40 rounded-none" />
            <Skeleton className="h-11.5 w-44 rounded-none" />
          </div>
        </div>

        <div className="absolute right-10 top-1/2 -translate-y-1/2 hidden xl:block">
          <Skeleton className="h-48 w-80 rounded-none" />
        </div>
      </div>
    </section>
  );
}
