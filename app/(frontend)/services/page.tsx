import Link from "next/link";
import { connection } from "next/server";
import { getPayload } from "payload";
import { RichText } from "@payloadcms/richtext-lexical/react";
import config from "@payload-config";
import { Footer } from "@/components/layouts/home";
import { icons } from "lucide-react";
import { getServiceHref } from "@/lib/helper/get-service-by-slug.helper";
import type { FAQItem } from "@/lib/type/faq.type";
import type {
  ServiceListItem,
  ServicesPageData,
} from "@/lib/type/service.type";

export default async function Services() {
  await connection();
  const payload = await getPayload({ config });
  const [servicesPage, { docs: faqs }] = await Promise.all([
    payload.findGlobal({ slug: "servicesPage", depth: 2 }),
    payload.find({ collection: "faqs", sort: "order", pagination: false }),
  ]);
  const { heading, subheading, description } = servicesPage as ServicesPageData;
  const services = (servicesPage.services ?? []) as ServiceListItem[];

  return (
    <div className={`bg-background text-foreground min-h-screen`}>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-5 lg:px-10 pt-36 pb-20">
        {subheading && (
          <p className="font-mono text-xs uppercase tracking-widest ${muted} mb-4 block">
            {"// "}
            {subheading}
          </p>
        )}
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-6">
          {heading}
        </h1>

        {description && (
          <p className="max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </section>

      {/* Service cards */}
      {services.length > 0 && (
        <section className="max-w-7xl mx-auto px-5 lg:px-10 pb-28">
          <div className="space-y-5">
            {services.map(
              ({
                id,
                name,
                slug,
                icon,
                subtitle,
                eyebrow,
                technologies,
                deliverables,
              }) => {
                const Icon = icons[icon as keyof typeof icons];
                return (
                  <div
                    key={id}
                    className="group rounded-none border border-border bg-card p-8 transition-all hover:border-primary/20"
                  >
                    <div className="grid gap-8 md:grid-cols-3">
                      <div className="md:col-span-2">
                        <div className="mb-4 flex items-center gap-3">
                          {Icon && (
                            <span className="text-2xl text-primary">
                              <Icon />
                            </span>
                          )}
                          {eyebrow && (
                            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                              {eyebrow}
                            </span>
                          )}
                        </div>

                        <h3 className="mb-3 font-display text-2xl font-bold text-foreground">
                          <Link
                            href={getServiceHref(slug)}
                            className="underline-offset-4 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {name}
                          </Link>
                        </h3>
                        {subtitle && (
                          <p className="mb-3 text-lg text-muted-foreground">
                            {subtitle}
                          </p>
                        )}

                        {technologies && technologies.length > 0 && (
                          <div className="mt-4 flex flex-wrap gap-2">
                            {technologies.map(({ id, technology }) => (
                              <span
                                key={id ?? technology}
                                className="rounded-none border border-border px-3 py-1 font-mono text-xs text-muted-foreground"
                              >
                                {technology}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      {deliverables && deliverables.length > 0 && (
                        <div>
                          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                            Deliverables
                          </p>
                          <ul className="space-y-2">
                            {deliverables.map(({ id, deliverable }) => (
                              <li
                                key={id ?? deliverable}
                                className="flex items-center gap-2 text-sm"
                              >
                                <span className="h-1 w-1 rounded-none bg-primary" />
                                <span className="text-muted-foreground">
                                  {deliverable}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="bg-muted/40 py-28">
          <div className="max-w-7xl mx-auto px-5 lg:px-10">
            <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {"// faq"}
            </span>
            <h2 className="mb-12 font-display text-4xl font-bold tracking-tight">
              Questions we actually get
            </h2>
            <div className="max-w-2xl space-y-4">
              {faqs.map((faq) => {
                const item = faq as FAQItem;
                return (
                  <details
                    key={item.id}
                    className="group overflow-hidden rounded-none border border-border bg-card"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between p-5 font-medium text-foreground">
                      {item.question}
                      <span className="text-lg text-primary transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground">
                      <RichText data={item.ans} />
                    </div>
                  </details>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 text-center">
          <h2 className="mb-4 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
            Ready to build?
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/70">
            Let&apos;s scope your project in a free 30-minute call.
          </p>
          <Link
            href="/contact"
            className="rounded-none bg-foreground px-8 py-4 text-base font-bold text-background transition-opacity hover:opacity-90"
          >
            Start a project →
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
