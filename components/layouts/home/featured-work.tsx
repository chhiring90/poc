import Image from "next/image";
import Link from "next/link";
import { getRichTextPlainText } from "@/lib/helper/get-rich-text-plain-text.helper";
import { isRecord } from "@/lib/helper/is-record.helper";
import { SectionHeading, SectionLink } from "./section-heading";

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
    <section className="border-y-2 border-border bg-muted">
      <div className="mx-auto max-w-7xl px-5 py-24 lg:px-10 lg:py-32">
        <SectionHeading
          label={featuredWork.subtitle}
          title={featuredWork.title}
          action={<SectionLink href="/works">View all work</SectionLink>}
        />

        <div className="grid gap-8 md:grid-cols-2">
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
  const technologies = project.technologies ?? [];

  return (
    <Link
      href={`/works/${project.slug}`}
      className="group flex flex-col border-2 border-border bg-card shadow-[var(--shadow-card)] transition-[transform,box-shadow] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--color-shadow)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-border bg-secondary">
        {image?.url && (
          <Image
            src={image.url}
            alt={image.alt ?? project.title}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        )}
        {category && (
          <span className="absolute left-4 top-4 border-2 border-border bg-background px-2 py-0.5 font-mono text-xs font-medium text-foreground">
            {category}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-2xl font-bold text-foreground">
            {project.title}
          </h3>
          {project.year && (
            <span className="font-mono text-sm text-muted-foreground">
              {project.year}
            </span>
          )}
        </div>
        {description && (
          <p className="mt-2 line-clamp-3 leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
        {technologies.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-2 pt-5">
            {technologies.map(({ id, technology }) => (
              <li
                key={id ?? technology}
                className="border border-border bg-muted px-2 py-0.5 font-mono text-xs text-muted-foreground"
              >
                {technology}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
