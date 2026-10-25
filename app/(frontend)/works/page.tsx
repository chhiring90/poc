import Link from "next/link";
import { connection } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";
import { Footer } from "@/components/layouts/home";
import { WorkGrid } from "@/components/layouts/work/work-grid";
import { isRecord } from "@/lib/helper/is-record.helper";
import { getRichTextPlainText } from "@/lib/helper/get-rich-text-plain-text.helper";
import { renderAsteriskText } from "@/lib/helper/render-asterisk-text.helper";

type WorkProject = {
  id: string | number;
  title: string;
  slug: string;
  year?: number | null;
  category?: { title?: string | null } | null;
  description: string;
  coverImage?: { url?: string | null; alt?: string | null } | null;
};

export default async function Work() {
  await connection();
  const payload = await getPayload({ config });
  const workPage = await payload.findGlobal({
    slug: "workPage",
    depth: 2,
  });
  const selectedWork: unknown[] = workPage.work ?? [];
  const projects = selectedWork
    .map(toWorkProject)
    .filter((project): project is WorkProject => project !== null);
  const workCta = workPage.workCta;
  const heading: string = workPage.heading;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-36 lg:px-10">
        <div className="max-w-1/2">
          {workPage.subheading && (
            <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
              {`// ${workPage.subheading}`}
            </span>
          )}
          <h1 className="mb-6 font-display text-5xl font-bold tracking-tight md:text-6xl">
            {renderAsteriskText(heading)}
          </h1>
          {workPage.description && (
            <p className="max-w-xl text-lg text-muted-foreground">
              {workPage.description}
            </p>
          )}
        </div>
      </section>

      <WorkGrid projects={projects} />

      {workCta?.title && (
        <section className="bg-primary py-24">
          <div className="mx-auto max-w-7xl px-5 text-center lg:px-10">
            <h2 className="mb-4 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
              {workCta.title}
            </h2>
            {workCta.description && (
              <p className="mb-8 text-lg text-primary-foreground/70">
                {workCta.description}
              </p>
            )}
            {workCta.button && workCta.buttonUrl && (
              <Link
                href={workCta.buttonUrl}
                className="inline-flex rounded-full bg-foreground px-8 py-4 text-base font-bold text-background transition-opacity hover:opacity-90"
              >
                {workCta.button}
              </Link>
            )}
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}

function toWorkProject(value: unknown): WorkProject | null {
  if (
    !isRecord(value) ||
    (typeof value.id !== "string" && typeof value.id !== "number") ||
    typeof value.title !== "string" ||
    typeof value.slug !== "string"
  ) {
    return null;
  }
  const category =
    isRecord(value.category) &&
    (value.category.title === null ||
      value.category.title === undefined ||
      typeof value.category.title === "string")
      ? { title: value.category.title }
      : null;
  const coverImage =
    isRecord(value.coverImage) &&
    (value.coverImage.url === null ||
      value.coverImage.url === undefined ||
      typeof value.coverImage.url === "string") &&
    (value.coverImage.alt === null ||
      value.coverImage.alt === undefined ||
      typeof value.coverImage.alt === "string")
      ? { url: value.coverImage.url, alt: value.coverImage.alt }
      : null;
  return {
    id: value.id,
    title: value.title,
    slug: value.slug,
    year:
      typeof value.year === "number" || value.year === null
        ? value.year
        : undefined,
    category,
    description: getRichTextPlainText(value.description),
    coverImage,
  };
}
