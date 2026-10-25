import Link from "next/link";
import { getRichTextPlainText } from "@/lib/helper/get-rich-text-plain-text.helper";

type WorkCategory = {
  title?: string | null;
};

type WorkImage = {
  url?: string | null;
  alt?: string | null;
};

type WorkTechnology = {
  id?: string | null;
  technology: string;
};

type WorkProject = {
  id: number | string;
  title: string;
  slug: string;
  year?: number | null;
  category?: WorkCategory | number | string | null;
  description: unknown;
  technologies?: WorkTechnology[] | null;
  coverImage?: WorkImage | number | string | null;
};

type FeaturedWorkData = {
  subtitle?: string | null;
  title?: string | null;
  projects?: (WorkProject | number | string)[] | null;
};

type FeaturedWorkProps = {
  featuredWork?: FeaturedWorkData | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isWorkProject(value: unknown): value is WorkProject {
  return (
    isRecord(value) &&
    (typeof value.id === "string" || typeof value.id === "number") &&
    typeof value.title === "string" &&
    typeof value.slug === "string" &&
    isRecord(value.description)
  );
}

export function FeaturedWork({ featuredWork }: FeaturedWorkProps) {
  const projects = (featuredWork?.projects ?? []).filter(isWorkProject);

  if (!featuredWork || projects.length === 0) return null;

  return (
    <section className="bg-muted/40 py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            {featuredWork.subtitle && (
              <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {featuredWork.subtitle}
              </span>
            )}
            {featuredWork.title && (
              <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                {featuredWork.title}
              </h2>
            )}
          </div>
          <Link
            href="/works"
            className="hidden items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary md:flex"
          >
            View all work →
          </Link>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: WorkProject }) {
  const image =
    typeof project.coverImage === "object" && project.coverImage !== null
      ? project.coverImage
      : null;
  const category =
    typeof project.category === "object" && project.category
      ? project.category.title
      : null;
  const description = getRichTextPlainText(project.description);

  return (
    <Link
      href={`/works/${project.slug}`}
      className="group overflow-hidden rounded-none border border-border bg-card text-left transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl"
    >
      <div className="relative h-56 overflow-hidden bg-neutral-900">
        {image?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.url}
            alt={image.alt ?? project.title}
            className="h-full w-full object-cover opacity-80 transition-all duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
        {category && (
          <div className="absolute bottom-4 left-4">
            <span className="rounded-none border border-white/10 bg-black/50 px-2 py-1 font-mono text-xs text-white backdrop-blur-sm">
              {category}
            </span>
          </div>
        )}
      </div>
      <div className="flex items-start justify-between gap-4 p-5">
        <div>
          {project.year && (
            <p className="mb-1 font-mono text-xs text-muted-foreground">
              {project.year}
            </p>
          )}
          <h3 className="mb-1 font-display text-xl font-bold text-foreground">
            {project.title}
          </h3>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
          {(project.technologies ?? []).length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {project.technologies?.map(({ id, technology }) => (
                <li
                  key={id ?? technology}
                  className="rounded-none border border-border px-2 py-1 font-mono text-xs text-muted-foreground"
                >
                  {technology}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </Link>
  );
}
