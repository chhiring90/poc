import type { Metadata } from "next";
import Link from "next/link";
import { cache } from "react";
import { notFound } from "next/navigation";
import config from "@payload-config";
import { connection } from "next/server";
import { getPayload } from "payload";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Footer } from "@/components/layouts/home";
import { JsonLd } from "@/components/seo/json-ld";
import { getRichTextPlainText } from "@/lib/helper/get-rich-text-plain-text.helper";
import { isRecord } from "@/lib/helper/is-record.helper";
import { isWorkDocument } from "@/lib/helper/is-work-document.helper";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { breadcrumbJsonLd, creativeWorkJsonLd } from "@/lib/seo/json-ld";
import { parseMedia, parseSeo, truncate } from "@/lib/seo/parse";

type WorkPageProps = { params: Promise<{ slug: string }> };

/** Raw case study, shared by generateMetadata and the page in one request. */
const getWorkBySlug = cache(async (slug: string) => {
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "works",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  });
  const doc: unknown = docs[0];
  return isRecord(doc) && isWorkDocument(doc) ? doc : null;
});

function getCategoryTitle(category: unknown) {
  return isRecord(category) && typeof category.title === "string"
    ? category.title
    : null;
}

export async function generateMetadata({
  params,
}: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getWorkBySlug(slug);
  if (!project) return {};

  return buildPageMetadata({
    path: `/works/${slug}`,
    seo: project.seo,
    title: project.title,
    description: truncate(getRichTextPlainText(project.description), 300),
    image: project.coverImage,
    noIndex: project._status === "draft",
  });
}

export default async function WorkCaseStudy({ params }: WorkPageProps) {
  await connection();
  const { slug } = await params;
  const project = await getWorkBySlug(slug);

  if (!project) notFound();
  const path = `/works/${slug}`;
  const jsonLd = [
    creativeWorkJsonLd({
      title: project.title,
      description:
        parseSeo(project.seo).description ??
        truncate(getRichTextPlainText(project.description), 300),
      path,
      image: parseMedia(project.coverImage)?.url,
      year: project.year,
      genre: getCategoryTitle(project.category),
      keywords: (project.technologies ?? []).map(({ technology }) => technology),
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Work", path: "/works" },
      { name: project.title, path },
    ]),
  ];

  const coverImage =
    typeof project.coverImage === "object" ? project.coverImage : null;
  const category =
    typeof project.category === "object" && project.category
      ? project.category.title
      : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={jsonLd} />
      <article className="mx-auto max-w-7xl px-5 pb-24 pt-36 lg:px-10">
        <Link
          href="/works"
          className="mb-10 inline-flex text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          ← Back to work
        </Link>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            {category && (
              <div className="mb-4">
                <span className="rounded-none bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
                  {category}
                </span>
              </div>
            )}
            <h1 className="mb-4 font-display text-5xl font-bold tracking-tight">
              {project.title}
            </h1>
            {project.year && (
              <p className="mb-2 font-mono text-sm text-muted-foreground">
                {project.year}
              </p>
            )}
            <RichText
              data={project.description}
              className="mb-8 text-lg leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
            />
            {project.challenge && (
              <section className="mb-5 rounded-none border border-border bg-card p-6">
                <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
                  Challenge
                </h2>
                <RichText
                  data={project.challenge}
                  className="text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
                />
              </section>
            )}
            {project.result && (
              <section className="rounded-none border border-border bg-card p-6">
                <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
                  Result
                </h2>
                <RichText
                  data={project.result}
                  className="text-sm leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-4 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
                />
              </section>
            )}
          </div>

          <div>
            {coverImage?.url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverImage.url}
                alt={coverImage.alt ?? project.title}
                className="h-80 w-full rounded-none object-cover"
              />
            )}
            {(project.technologies ?? []).length > 0 && (
              <section className="mt-8">
                <h2 className="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Technologies
                </h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies?.map(({ id, technology }) => (
                    <span
                      key={id ?? technology}
                      className="rounded-none border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
}
