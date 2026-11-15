import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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

/** Faint grid-paper texture, faded towards the bottom of the hero. */
function GridPaper() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.09] [mask-image:linear-gradient(to_bottom,#000_55%,transparent)] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:56px_56px]"
    />
  );
}

export async function Hero({
  heading,
  subheading,
  description,
  ctaPrimary,
  ctaSecondary,
}: HeroData) {
  const ctas = [ctaPrimary, ctaSecondary].filter(
    (cta): cta is HeroData["ctaPrimary"] => Boolean(cta?.label && cta.url),
  );

  return (
    <section className="relative overflow-hidden border-b-2 border-border">
      <GridPaper />

      <div className="relative mx-auto flex md:min-h-[min(100svh,58rem)] w-full max-w-7xl flex-col px-5 pb-10 pt-32 lg:px-10 lg:pt-36">
        {subheading && (
          <div className="flex items-center gap-4">
            <span className="font-mono text-sm font-medium text-primary">
              {subheading}
            </span>
            <span aria-hidden="true" className="h-0.5 w-16 bg-primary" />
          </div>
        )}

        <div className="flex flex-1 items-center py-14 lg:py-16">
          {heading && <HighlightedText text={heading} />}
        </div>

        {(description || ctas.length > 0) && (
          <div className="grid gap-8 border-t-2 border-border pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-16">
            {description && (
              <p className="max-w-[46ch] text-lg leading-relaxed text-muted-foreground md:text-xl">
                {description}
              </p>
            )}
            {ctas.length > 0 && (
              <div className="flex flex-col gap-4 sm:flex-row">
                {ctas.map((cta, index) => {
                  const isMain = index === ctas.length - 1;

                  return (
                    <Button
                      key={cta.url}
                      asChild
                      size="lg"
                      variant={isMain ? "default" : "outline"}
                      className="h-12 px-7 text-base"
                    >
                      <Link href={cta.url}>{cta.label}</Link>
                    </Button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/**
 * Splits "Ideas In *Innovation* Out" into stacked lines. The part wrapped in
 * asterisks is set inside a brick-red block, so the headline reads as
 * input -> process -> output.
 */
export function HighlightedText({ text }: { text: string }) {
  if (!text) return null;

  const parts = text
    .split(/(\*[^*]+\*)/g)
    .map((part) => part.trim())
    .filter(Boolean);
  const delays = ["", "delay-150", "delay-300", "delay-500"];

  return (
    <h1 className="w-full font-display text-[clamp(2.75rem,10.5vw,9.5rem)] font-bold leading-[0.92] tracking-[-0.045em]">
      {parts.map((part, index) => {
        const isHighlight = part.startsWith("*") && part.endsWith("*");
        const isLast = index === parts.length - 1 && parts.length > 1;

        return (
          <span
            key={`${part}-${index}`}
            className={cn(
              "block animate-in fade-in slide-in-from-bottom-6 fill-mode-both duration-700 motion-reduce:animate-none",
              delays[Math.min(index, delays.length - 1)],
              isHighlight && "my-[0.12em] md:pl-[0.6em]",
              isLast && "md:text-right",
            )}
          >
            {isHighlight ? (
              <span className="inline-block border-[3px] border-foreground bg-primary px-[0.18em] pb-[0.08em] text-primary-foreground shadow-[0.08em_0.08em_0_var(--color-shadow)]">
                {part.replaceAll("*", "")}
              </span>
            ) : (
              part
            )}
          </span>
        );
      })}
    </h1>
  );
}

export function HeroSkeleton() {
  return (
    <section className="relative overflow-hidden border-b-2 border-border">
      <div className="relative mx-auto flex md:min-h-[min(100svh,58rem)] w-full max-w-7xl flex-col px-5 pb-10 pt-32 lg:px-10 lg:pt-36">
        <Skeleton className="h-5 w-44 rounded-none" />
        <div className="flex flex-1 flex-col justify-center gap-4 py-14">
          <Skeleton className="h-16 w-1/2 rounded-none md:h-32" />
          <Skeleton className="h-16 w-3/4 rounded-none md:h-32" />
          <Skeleton className="h-16 w-1/3 self-end rounded-none md:h-32" />
        </div>
        <div className="grid gap-8 border-t-2 border-border pt-8 md:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            <Skeleton className="h-5 w-full max-w-md rounded-none" />
            <Skeleton className="h-5 w-2/3 max-w-sm rounded-none" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-12 w-40 rounded-none" />
            <Skeleton className="h-12 w-40 rounded-none" />
          </div>
        </div>
      </div>
    </section>
  );
}
