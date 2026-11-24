import type { Metadata } from "next";
import Link from "next/link";
import { Footer } from "@/components/layouts/home";
import { PackageSection, PackagesHero } from "@/components/layouts/packages";
import { JsonLd } from "@/components/seo/json-ld";
import { PACKAGES_ROUTE, PACKAGES_SEO } from "@/lib/const/package.const";
import { getPackages } from "@/lib/helper/get-packages.helper";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { breadcrumbJsonLd } from "@/lib/seo/json-ld";

export function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: PACKAGES_ROUTE,
    title: PACKAGES_SEO.title,
    description: PACKAGES_SEO.description,
  });
}

export default async function PackagesPage() {
  const packages = await getPackages();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: PACKAGES_SEO.title, path: PACKAGES_ROUTE },
        ])}
      />
      <PackagesHero packages={packages} />
      {packages.map((pkg, index) => (
        <PackageSection key={pkg.id} pkg={pkg} index={index} />
      ))}

      <section className="bg-primary py-24">
        <div className="mx-auto max-w-7xl px-5 text-center lg:px-10">
          <h2 className="mb-4 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
            Not sure which package fits?
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/80">
            Tell us what you have in mind. We will point you to the right start
            on a free call.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-foreground px-8 py-4 text-base font-bold text-background transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground"
          >
            Book a free call →
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
