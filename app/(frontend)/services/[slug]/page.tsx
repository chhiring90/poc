import type { Metadata } from "next";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from "@payload-config";
import { Footer } from "@/components/layouts/home";
import { RichTextWithTableOfContents } from "@/components/layouts/rich-text/rich-text-with-table-of-contents";
import { ServiceClosing } from "@/components/layouts/service/service-closing";
import { ServiceFAQ } from "@/components/layouts/service/service-faq";
import { ServiceHero } from "@/components/layouts/service/service-hero";
import {
  ServicePackage,
  ServiceProof,
} from "@/components/layouts/service/service-proof-and-package";
import { ServiceRoute } from "@/components/layouts/service/service-route";
import { ServiceScope } from "@/components/layouts/service/service-scope";
import { ServiceWhy } from "@/components/layouts/service/service-why";
import { getFAQsByGroup } from "@/lib/helper/get-faqs-by-group.helper";
import { getRichTextPlainText } from "@/lib/helper/get-rich-text-plain-text.helper";
import { getCachedServiceBySlug } from "@/lib/helper/get-service-by-slug.helper";
import { JsonLd } from "@/components/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { getSiteSettings } from "@/lib/seo/get-site-settings";
import {
  breadcrumbJsonLd,
  faqPageJsonLd,
  serviceJsonLd,
} from "@/lib/seo/json-ld";
import { parseSeo, truncate } from "@/lib/seo/parse";

type ServicePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = await getCachedServiceBySlug(slug);
  if (!service) return {};

  return buildPageMetadata({
    path: `/services/${slug}`,
    seo: service.seo,
    title: service.name,
    description:
      service.subtitle ||
      getRichTextPlainText(service.descriptionRichText) ||
      service.whyItMatters,
  });
}

export default async function ServiceDetail({ params }: ServicePageProps) {
  await connection();
  const { slug } = await params;
  const service = await getCachedServiceBySlug(slug);
  if (!service) notFound();

  const payload = await getPayload({ config });
  const [faqs, settings] = await Promise.all([
    getFAQsByGroup(payload, service.faqGroup),
    getSiteSettings(),
  ]);
  const path = `/services/${slug}`;
  const pkg =
    service.package && typeof service.package === "object"
      ? service.package
      : null;
  const jsonLd = [
    serviceJsonLd({
      name: service.name,
      description: truncate(
        parseSeo(service.seo).description ?? service.subtitle,
        300,
      ),
      path,
      settings,
      offer: pkg ? { name: pkg.name, price: pkg.price } : null,
    }),
    faqPageJsonLd(
      faqs.map((faq) => ({
        question: faq.question,
        answer: getRichTextPlainText(faq.ans),
      })),
    ),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
      { name: service.name, path },
    ]),
  ];
  const hasDescription =
    getRichTextPlainText(service.descriptionRichText).trim().length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={jsonLd} />
      <div>
        <ServiceHero service={service} />
        <ServiceWhy text={service.whyItMatters} />
        <ServiceRoute steps={service.process ?? []} />
        <ServiceScope service={service} />

        {hasDescription && (
          <section className="mx-auto max-w-7xl px-5 py-24 lg:px-10">
            <RichTextWithTableOfContents
              content={service.descriptionRichText}
              showTableOfContents={false}
              className="max-w-3xl text-base leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:text-foreground [&_h2:first-child]:mt-0 [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-foreground [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
            />
          </section>
        )}

        <ServiceProof proof={service.proof} />
        {service.package && typeof service.package === "object" && (
          <ServicePackage pkg={service.package} cta={service.ctaButton} />
        )}
        <ServiceFAQ faqs={faqs} cta={service.ctaButton} />
        <ServiceClosing service={service} />
      </div>
      <Footer />
    </div>
  );
}
