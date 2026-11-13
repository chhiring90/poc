import Link from "next/link";
import { connection } from "next/server";
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import { icons } from "lucide-react";
import config from "@payload-config";
import { Footer } from "@/components/layouts/home";
import { RichTextWithTableOfContents } from "@/components/layouts/rich-text/rich-text-with-table-of-contents";
import { getServiceBySlug } from "@/lib/helper/get-service-by-slug.helper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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

  const Icon =
    service.icon && service.icon in icons
      ? icons[service.icon as keyof typeof icons]
      : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-36 lg:px-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)] lg:gap-16">
          <article className="min-w-0">
            <header className="mb-8">
              <div className="mb-5 flex items-center gap-3">
                {Icon && (
                  <Icon aria-hidden="true" className="size-8 text-primary" />
                )}
                {service.eyebrow && (
                  <p className="font-mono text-xs uppercase tracking-widest text-primary">
                    {service.eyebrow}
                  </p>
                )}
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight md:text-6xl">
                {service.name}
              </h1>
              {service.subtitle && (
                <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                  {service.subtitle}
                </p>
              )}
            </header>

            <RichTextWithTableOfContents
              content={service.descriptionRichText}
              showTableOfContents={false}
              className="text-base leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:font-bold [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
            />
          </article>

          <aside className="space-y-6">
            {service.deliverables && service.deliverables.length > 0 && (
              <Card className="rounded-none border-2 border-border py-0 shadow-[var(--shadow-card)] ring-0">
                <CardHeader className="border-b-2 border-border px-5 py-4">
                  <CardTitle className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                    What you get
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 py-5">
                  <ul className="space-y-3">
                    {service.deliverables.map(({ id, deliverable }, index) => (
                      <li key={id ?? `${deliverable}-${index}`}>
                        <Badge
                          variant="outline"
                          className="h-auto whitespace-normal rounded-none border-border px-3 py-1.5 text-left text-sm text-muted-foreground"
                        >
                          {deliverable}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {service.technologies && service.technologies.length > 0 && (
              <Card className="rounded-none border-2 border-border py-0 shadow-[var(--shadow-card)] ring-0">
                <CardHeader className="border-b-2 border-border px-5 py-4">
                  <CardTitle className="font-mono text-xs font-bold uppercase tracking-widest text-foreground">
                    Technologies
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2 px-5 py-5">
                  {service.technologies.map(({ id, technology }, index) => (
                    <Badge
                      key={id ?? `${technology}-${index}`}
                      variant="secondary"
                      className="h-auto rounded-none px-3 py-1 font-mono text-xs"
                    >
                      {technology}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}

            {service.ctaButton?.label && service.ctaButton.url && (
              <Button asChild size="lg" className="w-full whitespace-normal">
                <Link href={service.ctaButton.url}>
                  {service.ctaButton.label}
                </Link>
              </Button>
            )}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}
