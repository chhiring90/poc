import Link from "next/link";
import { notFound } from "next/navigation";
import config from "@payload-config";
import { getPayload } from "payload";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Footer } from "@/components/layouts/home";
import { isWorkDocument } from "@/lib/helper/is-work-document.helper";

export default async function WorkCaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "works",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  });
  const candidate: unknown = docs[0];

  if (!isWorkDocument(candidate)) notFound();
  const project = candidate;

  const coverImage =
    typeof project.coverImage === "object" ? project.coverImage : null;
  const category =
    typeof project.category === "object" && project.category
      ? project.category.title
      : null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-5 pb-24 pt-36 lg:px-10">
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
                <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
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
              <section className="mb-5 rounded-2xl border border-border bg-card p-6">
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
              <section className="rounded-2xl border border-border bg-card p-6">
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
                className="h-80 w-full rounded-2xl object-cover"
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
                      className="rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground"
                    >
                      {technology}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
