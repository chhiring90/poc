import Link from "next/link";
import { ArrowDownRight } from "lucide-react";
import { PackageIcon } from "@/components/layouts/packages/package-icon";
import { PlaceholderText } from "@/components/layouts/packages/placeholder-text";
import type { PackageDocument } from "@/lib/type/package.type";

export function formatPackageNumber(order: number | null | undefined, index: number) {
  return String(order && order > 0 ? order : index + 1).padStart(2, "0");
}

export function PackagesHero({ packages }: { packages: PackageDocument[] }) {
  return (
    <section className="border-b-2 border-border">
      <div className="mx-auto max-w-7xl px-5 pb-20 pt-36 lg:px-10">
        <p className="mb-5 font-mono text-xs uppercase tracking-widest text-primary">
          {"// packages"}
        </p>
        <h1 className="max-w-[18ch] text-balance font-display text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          Clear packages. No surprises.
        </h1>
        <p className="mt-6 max-w-[56ch] text-lg leading-relaxed text-muted-foreground">
          Start with a plan, then design, build and look after it. Each package
          says who it is for, what you get, what is not included and what
          moves the price.
        </p>

        {packages.length > 0 && (
          <nav aria-label="Packages" className="mt-14">
            <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {packages.map((pkg, index) => (
                <li key={pkg.id}>
                  <Link
                    href={`#${pkg.slug ?? pkg.id}`}
                    className="group flex h-full flex-col border-2 border-border bg-card p-6 shadow-[var(--shadow-card)] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--color-shadow)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                  >
                    <span className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-primary">
                        {formatPackageNumber(pkg.order, index)}
                      </span>
                      <span className="flex size-9 items-center justify-center border-2 border-border bg-muted text-primary">
                        <PackageIcon name={pkg.icon} className="size-4" />
                      </span>
                    </span>
                    <span className="mt-6 font-display text-xl font-bold leading-snug">
                      {pkg.name}
                    </span>
                    {pkg.tagline && (
                      <span className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {pkg.tagline}
                      </span>
                    )}
                    <span className="mt-auto flex items-end justify-between gap-4 pt-6">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider">
                        {pkg.price ? <PlaceholderText text={pkg.price} /> : "Quoted"}
                      </span>
                      <ArrowDownRight
                        aria-hidden="true"
                        className="size-5 text-primary transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                      />
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </section>
  );
}
