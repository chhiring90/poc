import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPackageHref } from "@/lib/helper/get-packages.helper";
import type { PackageDocument } from "@/lib/type/package.type";
import type { ServiceDocument } from "@/lib/type/service.type";

export function ServiceProof({ proof }: { proof: ServiceDocument["proof"] }) {
  if (!proof?.result) return null;

  return (
    <section className="border-b-2 border-border bg-accent text-accent-foreground">
      <figure className="mx-auto max-w-7xl px-5 py-20 lg:px-10">
        <blockquote className="max-w-[30ch] text-balance font-display text-3xl font-bold leading-tight md:text-4xl">
          {proof.result}
        </blockquote>
        {proof.client && (
          <figcaption className="mt-6 font-mono text-sm font-bold">
            {proof.client}
          </figcaption>
        )}
      </figure>
    </section>
  );
}

export function ServicePackage({
  pkg,
  cta,
}: {
  pkg: PackageDocument;
  cta: ServiceDocument["ctaButton"];
}) {
  const features = pkg.features ?? [];

  return (
    <section
      aria-labelledby="package-heading"
      className="mx-auto max-w-7xl px-5 pt-24 lg:px-10"
    >
      <h2 id="package-heading" className="mb-8 font-display text-3xl font-bold">
        Package
      </h2>
      <div className="grid border-2 border-border bg-card shadow-[var(--shadow-card)] md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div className="p-7 md:p-9">
          <h3 className="font-display text-2xl font-bold">{pkg.name}</h3>
          {pkg.tagline && (
            <p className="mt-2 text-lg leading-snug">{pkg.tagline}</p>
          )}
          {pkg.description && (
            <p className="mt-3 max-w-[50ch] leading-relaxed text-muted-foreground">
              {pkg.description}
            </p>
          )}
          {features.length > 0 && (
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {features.map(({ id, feature }, index) => (
                <li key={id ?? `${feature}-${index}`} className="flex gap-2 text-sm">
                  <span aria-hidden="true" className="font-bold text-primary">
                    +
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          )}
          <Link
            href={getPackageHref(pkg.slug)}
            className="mt-6 inline-block text-sm font-bold text-primary underline underline-offset-4 hover:no-underline"
          >
            See everything in this package →
          </Link>
        </div>
        <div className="flex flex-col justify-between gap-6 border-t-2 border-border bg-muted p-7 md:border-l-2 md:border-t-0 md:p-9">
          <p className="font-mono text-3xl font-bold text-primary">
            {pkg.price || "Quoted"}
          </p>
          {cta?.label && cta.url && (
            <Button asChild size="lg" className="w-full whitespace-normal">
              <Link href={cta.url}>{cta.label}</Link>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
