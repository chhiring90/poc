import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ServiceDocument } from "@/lib/type/service.type";

export function ServiceClosing({ service }: { service: ServiceDocument }) {
  const heading = service.closing?.heading;
  const link = service.closing?.secondaryLink;
  const cta = service.ctaButton;

  if (!heading) return null;

  return (
    <section className="border-t-2 border-border bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-10 lg:py-28">
        <h2 className="max-w-[22ch] text-balance font-display text-4xl font-bold leading-tight md:text-6xl">
          {heading}
        </h2>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
          {cta?.label && cta.url && (
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-12 px-7 text-base"
            >
              <Link href={cta.url}>{cta.label}</Link>
            </Button>
          )}
          {link?.label && link.url && (
            <Link
              href={link.url}
              className="font-medium underline decoration-2 underline-offset-4 hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground"
            >
              {link.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
