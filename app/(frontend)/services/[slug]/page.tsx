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
import { getServiceBySlug } from "@/lib/helper/get-service-by-slug.helper";

export default async function ServiceDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const payload = await getPayload({ config });
  const service = await getServiceBySlug(payload, slug);
  if (!service) notFound();

  const faqs = await getFAQsByGroup(payload, service.faqGroup);
  const hasDescription =
    getRichTextPlainText(service.descriptionRichText).trim().length > 0;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
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
      </main>
      <Footer />
    </div>
  );
}
