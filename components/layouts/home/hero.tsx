import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { PixelBuild } from "./pixel-build";

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
  ctaPrimary: { label: string; url: string };
  ctaSecondary: { label: string; url: string };
};

type Cta = HeroData["ctaPrimary"];

function PanelLabel({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-2.5 font-mono text-xs font-medium text-foreground">
      <span aria-hidden="true" className="size-2 bg-foreground" />
      {children}
    </p>
  );
}

export async function Hero({
  heading,
  subheading,
  description,
  ctaPrimary,
  ctaSecondary,
}: HeroData) {
  const ctas = [ctaPrimary, ctaSecondary].filter((cta): cta is Cta =>
    Boolean(cta?.label && cta.url),
  );
  // The last CMS button is the main action, as elsewhere on the site.
  const main = ctas.at(-1);
  const others = ctas.slice(0, -1);

  return (
    <section className="border-b-2 border-border pt-16">
      {/* Fills the screen below the fixed header: 100svh minus the 4rem bar and the 2px rule. */}
      <div className="grid min-h-[calc(100svh-4rem-2px)] grid-rows-[auto_1fr] lg:h-[calc(100svh-4rem-2px)] lg:min-h-[36rem] lg:grid-cols-2 lg:grid-rows-1">
        <div className="flex flex-col justify-center px-5 py-12 md:py-16 lg:px-10 lg:py-12">
          {subheading && <PanelLabel>{subheading}</PanelLabel>}
          {heading && (
            <h1 className="mt-6 max-w-[14ch] font-display text-[clamp(2.75rem,5.6vw,5.5rem)] font-bold leading-[0.98] tracking-[-0.035em]">
              {heading.replaceAll("*", "")}
            </h1>
          )}
          {description && (
            <p className="mt-7 max-w-[46ch] text-lg leading-relaxed text-foreground/80">
              {description}
            </p>
          )}
          {ctas.length > 0 && (
            <div className="mt-10 flex flex-wrap items-center gap-x-10 gap-y-6">
              {main && (
                <Link
                  href={main.url}
                  className="group inline-flex h-14 items-center gap-4 bg-foreground px-8 font-medium text-background shadow-[var(--shadow-control)] transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  {main.label}
                  <ArrowUpRight aria-hidden="true" className="size-4" />
                </Link>
              )}
              {others.map((cta) => (
                <Link
                  key={cta.url}
                  href={cta.url}
                  className="group inline-flex items-center gap-3 border-b-2 border-foreground pb-2 font-medium text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                >
                  {cta.label}
                  <ArrowUpRight
                    aria-hidden="true"
                    className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        <ArtPanel />
      </div>
    </section>
  );
}

/** Brick-red panel with the pixel-art build scene. */
function ArtPanel() {
  return (
    <div className="relative min-h-72 overflow-hidden border-t-2 border-border bg-primary lg:min-h-0 lg:border-l-2 lg:border-t-0">
      {/* Halftone dot texture behind the scene. */}
      <div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 aspect-square w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-[50%] bg-[radial-gradient(#fff9ef_1.1px,transparent_1.4px)] bg-size-[7px_7px] opacity-70 mask-[radial-gradient(circle,#000_25%,transparent_70%)]"
      />
      <PixelBuild className="absolute inset-0 m-auto h-[80%] w-[90%]" />
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="border-b-2 border-border pt-16">
      <div className="grid min-h-[calc(100svh-4rem-2px)] grid-rows-[auto_1fr] lg:h-[calc(100svh-4rem-2px)] lg:min-h-[36rem] lg:grid-cols-2 lg:grid-rows-1">
        <div className="flex flex-col gap-6 px-5 py-20 lg:px-10 lg:py-28">
          <Skeleton className="h-4 w-36 rounded-none" />
          <Skeleton className="h-20 w-4/5 rounded-none" />
          <Skeleton className="h-20 w-3/5 rounded-none" />
          <Skeleton className="h-5 w-full max-w-md rounded-none" />
          <Skeleton className="h-14 w-48 rounded-none" />
        </div>
        <div className="min-h-72 border-t-2 border-border bg-primary lg:border-l-2 lg:border-t-0" />
      </div>
    </section>
  );
}
