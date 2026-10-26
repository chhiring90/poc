"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

type WorkProject = {
  id: number | string;
  title: string;
  slug: string;
  year?: number | null;
  category?: { title?: string | null } | null;
  description: string;
  coverImage?: { url?: string | null; alt?: string | null } | null;
};

const PAGE_SIZE = 6;

export function WorkGrid({ projects }: { projects: WorkProject[] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          projects
            .map((project) => project.category?.title?.trim())
            .filter((title): title is string => Boolean(title)),
        ),
      ),
    [projects],
  );
  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter(
          (project) => project.category?.title?.trim() === activeCategory,
        );
  const pageCount = Math.ceil(filteredProjects.length / PAGE_SIZE);
  const pageProjects = filteredProjects.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function selectCategory(category: string) {
    setActiveCategory(category);
    setCurrentPage(1);
  }

  return (
    <section
      className="mx-auto max-w-7xl px-5 pb-28 lg:px-10"
      aria-label="Work projects"
    >
      {categories.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2">
          {["All", ...categories].map((category) => (
            <motion.button
              key={category}
              type="button"
              onClick={() => selectCategory(category)}
              aria-pressed={activeCategory === category}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
              className={`relative rounded-none border px-4 py-2 font-mono text-sm transition-colors ${
                activeCategory === category
                  ? "border-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}
            >
              {activeCategory === category && (
                <motion.span
                  layoutId={
                    shouldReduceMotion ? undefined : "work-filter-active"
                  }
                  className="absolute inset-0 rounded-none bg-primary"
                  transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                />
              )}
              <span className="relative z-10">{category}</span>
            </motion.button>
          ))}
        </div>
      )}

      {pageProjects.length > 0 ? (
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`${activeCategory}-${currentPage}`}
            className="grid gap-5 md:grid-cols-2 lg:grid-cols-3"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
          >
            {pageProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout={!shouldReduceMotion}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.25,
                  delay: shouldReduceMotion ? 0 : index * 0.045,
                }}
              >
                <WorkCard project={project} />
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      ) : (
        <p className="rounded-none border border-border bg-card px-6 py-12 text-center text-muted-foreground">
          No projects are currently available.
        </p>
      )}

      {pageCount > 1 && (
        <nav
          className="mt-10 flex items-center justify-center gap-3"
          aria-label="Work project pages"
        >
          <button
            type="button"
            onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="rounded-none border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>
          <span
            className="font-mono text-sm text-muted-foreground"
            aria-live="polite"
          >
            Page {currentPage} of {pageCount}
          </span>
          <button
            type="button"
            onClick={() =>
              setCurrentPage((page) => Math.min(pageCount, page + 1))
            }
            disabled={currentPage === pageCount}
            className="rounded-none border border-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </nav>
      )}
    </section>
  );
}

function WorkCard({ project }: { project: WorkProject }) {
  const image = project.coverImage;

  return (
    <Link
      href={`/works/${project.slug}`}
      className="group block h-full overflow-hidden rounded-none border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/20"
    >
      <div className="relative h-52 overflow-hidden bg-muted">
        {image?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image.url}
            alt={image.alt ?? project.title}
            className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
          />
        ) : (
          <div className="h-full w-full bg-linear-to-br from-primary/20 to-muted" />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/50 to-transparent" />
        {project.category?.title && (
          <span className="absolute bottom-4 left-4 rounded-none bg-black/50 px-3 py-1 font-mono text-xs text-white backdrop-blur-sm">
            {project.category.title}
          </span>
        )}
      </div>
      <div className="p-5">
        {project.year && (
          <p className="mb-2 font-mono text-xs text-muted-foreground">
            {project.year}
          </p>
        )}
        <h2 className="mb-2 font-display text-xl font-bold text-foreground">
          {project.title}
        </h2>
        {project.description && (
          <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>
        )}
      </div>
    </Link>
  );
}
