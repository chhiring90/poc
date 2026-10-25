import Link from "next/link";
import { notFound } from "next/navigation";
import config from "@payload-config";
import { getPayload } from "payload";
import { Footer } from "@/components/layouts/home";

type WorkDocument = {
  title: string;
  client: string;
  year?: number | null;
  category?: string | number | { title?: string | null } | null;
  description: string;
  challenge?: string | null;
  result?: string | null;
  tags?: { id?: string | null; tag: string }[] | null;
  technologies?: { id?: string | null; technology: string }[] | null;
  coverImage?: string | number | { url?: string | null; alt?: string | null } | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isTextItems(
  value: unknown,
  field: "tag",
): value is { id?: string | null; tag: string }[];
function isTextItems(
  value: unknown,
  field: "technology",
): value is { id?: string | null; technology: string }[];
function isTextItems(value: unknown, field: "tag" | "technology"): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        isRecord(item) &&
        typeof item[field] === "string" &&
        (item.id === undefined ||
          item.id === null ||
          typeof item.id === "string"),
    )
  );
}

function isWorkDocument(value: unknown): value is WorkDocument {
  if (
    !isRecord(value) ||
    typeof value.title !== "string" ||
    typeof value.client !== "string" ||
    typeof value.description !== "string"
  ) {
    return false;
  }

  const validOptionalText = (field: string) =>
    value[field] === undefined ||
    value[field] === null ||
    typeof value[field] === "string";
  const validCoverImage =
    value.coverImage === undefined ||
    value.coverImage === null ||
    typeof value.coverImage === "string" ||
    typeof value.coverImage === "number" ||
    (isRecord(value.coverImage) &&
      (value.coverImage.url === undefined ||
        value.coverImage.url === null ||
        typeof value.coverImage.url === "string") &&
      (value.coverImage.alt === undefined ||
        value.coverImage.alt === null ||
        typeof value.coverImage.alt === "string"));

  return (
    (value.year === undefined ||
      value.year === null ||
      typeof value.year === "number") &&
    (value.category === undefined ||
      value.category === null ||
      typeof value.category === "string" ||
      typeof value.category === "number" ||
      (isRecord(value.category) &&
        (value.category.title === undefined ||
          value.category.title === null ||
          typeof value.category.title === "string"))) &&
    validOptionalText("challenge") &&
    validOptionalText("result") &&
    validCoverImage &&
    (value.tags === undefined || value.tags === null || isTextItems(value.tags, "tag")) &&
    (value.technologies === undefined ||
      value.technologies === null ||
      isTextItems(value.technologies, "technology"))
  );
}

export default async function WorkCaseStudy({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "work",
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
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-36 lg:px-10">
        <Link
          href="/works"
          className="mb-10 inline-flex text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          ← Back to work
        </Link>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="mb-4 flex flex-wrap gap-2">
              {category && (
                <span className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary">
                  {category}
                </span>
              )}
              {(project.tags ?? []).map(({ id, tag }) => (
                <span
                  key={id ?? tag}
                  className="rounded-full bg-primary/10 px-3 py-1 font-mono text-xs text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="mb-4 font-display text-5xl font-bold tracking-tight">
              {project.title}
            </h1>
            <p className="mb-2 font-mono text-sm text-muted-foreground">
              {project.client}
              {project.year ? ` · ${project.year}` : ""}
            </p>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              {project.description}
            </p>
            {project.challenge && (
              <section className="mb-5 rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
                  Challenge
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {project.challenge}
                </p>
              </section>
            )}
            {project.result && (
              <section className="rounded-2xl border border-border bg-card p-6">
                <h2 className="mb-2 font-mono text-xs uppercase tracking-widest text-primary">
                  Result
                </h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {project.result}
                </p>
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
      </main>
      <Footer />
    </div>
  );
}
