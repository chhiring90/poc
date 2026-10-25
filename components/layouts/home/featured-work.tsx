import Link from "next/link";

type WorkProject = {
  id: number | string;
  title: string;
  slug: string;
  client: string;
  year?: number | null;
  category?: string | number | { title?: string | null } | null;
  description: string;
  tags?: { id?: string | null; tag: string }[] | null;
  coverImage?: string | number | { url?: string | null; alt?: string | null } | null;
};

type FeaturedWorkProps = {
  subtitle?: string | null;
  title?: string | null;
  projects?: (WorkProject | number | string)[] | null;
};

export function FeaturedWork({
  subtitle,
  title,
  projects,
}: FeaturedWorkProps) {
  const populatedProjects = (projects ?? []).filter(
    (project): project is WorkProject =>
      typeof project === "object" && project !== null,
  );

  if (populatedProjects.length === 0) return null;

  return (
    <section className="bg-muted/40 py-28">
      <div className="max-w-7xl mx-auto px-5 lg:px-10">
        <div className="mb-12 flex items-end justify-between">
          <div>
            {subtitle && (
              <span className="mb-3 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="font-display text-4xl font-bold tracking-tight md:text-5xl">
                {title}
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
          {populatedProjects.map((project) => {
            const image =
              typeof project.coverImage === "object" &&
              project.coverImage !== null
                ? project.coverImage
                : null;
            const category =
              typeof project.category === "object" && project.category
                ? project.category.title
                : null;

            return (
              <Link
                key={project.id}
                href={`/works/${project.slug}`}
                className="group overflow-hidden rounded-2xl border border-border bg-card text-left transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    {category && (
                      <span className="rounded-full border border-white/10 bg-black/50 px-2 py-1 font-mono text-xs text-white backdrop-blur-sm">
                        {category}
                      </span>
                    )}
                    {(project.tags ?? []).map(({ id, tag }) => (
                      <span
                        key={id ?? tag}
                        className="rounded-full border border-white/10 bg-black/50 px-2 py-1 font-mono text-xs text-white backdrop-blur-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-start justify-between p-5">
                  <div>
                    {project.year && (
                      <p className="mb-1 font-mono text-xs text-muted-foreground">
                        {project.year}
                      </p>
                    )}
                    <h3 className="mb-1 font-display text-xl font-bold text-foreground">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="flex size-8 items-center justify-center rounded-full border border-border text-xs opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
