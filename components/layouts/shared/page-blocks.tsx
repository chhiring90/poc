import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { SeoMedia } from "@/lib/seo/parse";
import { cn } from "@/lib/utils";

/**
 * Brand frame for photos: square corners, 2px border, hard offset shadow,
 * and a light warm tint so photos from different sources sit with the palette.
 */
export function PhotoFrame({
  image,
  sizes,
  className,
  preload,
}: {
  image: Pick<SeoMedia, "url" | "alt">;
  sizes: string;
  className?: string;
  /** Set for the page's main (above the fold) image. */
  preload?: boolean;
}) {
  return (
    <figure
      className={cn(
        "relative overflow-hidden border-2 border-border bg-muted shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <Image
        src={image.url}
        alt={image.alt ?? ""}
        fill
        sizes={sizes}
        preload={preload}
        className="object-cover saturate-[.85] sepia-[.12]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-secondary opacity-20 mix-blend-multiply"
      />
    </figure>
  );
}

/** Brick-red closing band with a heading, a line of text and one button. */
export function ClosingBand({
  eyebrow,
  heading,
  description,
  cta,
}: {
  eyebrow?: string | null;
  heading: string;
  description?: string | null;
  cta: { label: string; url: string };
}) {
  if (!heading && !cta.label) return null;

  return (
    <section className="relative overflow-hidden bg-primary text-primary-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.12] [background-image:linear-gradient(to_right,var(--primary-foreground)_1px,transparent_1px),linear-gradient(to_bottom,var(--primary-foreground)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:linear-gradient(to_left,#000,transparent_70%)]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-24 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-16 lg:px-10 lg:py-32">
        <div>
          {eyebrow && (
            <p className="mb-5 font-mono text-sm font-medium text-primary-foreground/75">
              {`// ${eyebrow.toLowerCase()}`}
            </p>
          )}
          {heading && (
            <h2 className="text-balance font-display text-4xl font-bold leading-[1] tracking-tight md:text-6xl">
              {heading}
            </h2>
          )}
        </div>
        <div className="border-t-2 border-primary-foreground/30 pt-8 lg:border-l-2 lg:border-t-0 lg:pl-10 lg:pt-0">
          {description && (
            <p className="mb-8 max-w-[36ch] text-lg leading-relaxed text-primary-foreground/85">
              {description}
            </p>
          )}
          {cta.label && (
            <Link
              href={cta.url}
              className="inline-flex h-12 items-center gap-2 border-2 border-foreground bg-background px-7 text-base font-bold text-foreground shadow-[4px_4px_0_var(--foreground)] transition-[transform,box-shadow] hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground active:translate-x-1 active:translate-y-1 active:shadow-none"
            >
              {cta.label}
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
