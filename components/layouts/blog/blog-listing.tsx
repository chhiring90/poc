"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";
import type { BlogPostCardData } from "@/lib/helper/to-blog-post.helper";

type BlogCategory = {
  title: string;
  slug: string;
};

type BlogListingProps = {
  posts: BlogPostCardData[];
  featuredPost: BlogPostCardData | null;
  categories: BlogCategory[];
  activeCategory: string;
  currentPage: number;
  totalPages: number;
};

export function BlogListing({
  posts,
  featuredPost,
  categories,
  activeCategory,
  currentPage,
  totalPages,
}: BlogListingProps) {
  const router = useRouter();
  const shouldReduceMotion = useReducedMotion();

  return (
    <>
      {featuredPost && <FeaturedPost post={featuredPost} />}

      <section
        className="mx-auto max-w-7xl px-5 pb-28 lg:px-10"
        aria-label="Blog posts"
      >
        {categories.length > 0 && (
          <div className="mb-10 flex flex-wrap gap-2">
            {[{ title: "All", slug: "" }, ...categories].map((category) => (
              <motion.button
                key={category.slug || "all"}
                type="button"
                onClick={() =>
                  router.push(getBlogPageHref(1, category.slug), {
                    scroll: false,
                  })
                }
                aria-pressed={activeCategory === category.slug}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
                className={`relative rounded-none border px-4 py-2 font-mono text-sm ${
                  activeCategory === category.slug
                    ? "border-primary text-primary-foreground"
                    : "border-border text-muted-foreground hover:border-primary/50"
                }`}
              >
                {activeCategory === category.slug && (
                  <motion.span
                    layoutId={
                      shouldReduceMotion ? undefined : "blog-filter-active"
                    }
                    className="absolute inset-0 rounded-none bg-primary"
                    transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
                  />
                )}
                <span className="relative z-10">{category.title}</span>
              </motion.button>
            ))}
          </div>
        )}

        {posts.length > 0 ? (
          <motion.div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <motion.div
                key={post.id}
                layout={!shouldReduceMotion}
                transition={{ duration: shouldReduceMotion ? 0 : 0.2 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="rounded-none border border-border bg-card px-6 py-12 text-center text-muted-foreground">
            No posts are available in this category.
          </p>
        )}

        {totalPages > 1 && (
          <nav
            className="mt-10 flex items-center justify-center gap-3"
            aria-label="Blog post pages"
          >
            <Link
              href={getBlogPageHref(
                Math.max(1, currentPage - 1),
                activeCategory,
              )}
              scroll={false}
              aria-disabled={currentPage === 1}
              tabIndex={currentPage === 1 ? -1 : undefined}
              className={`rounded-none border border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary/50 ${
                currentPage === 1 ? "pointer-events-none opacity-40" : ""
              }`}
            >
              Previous
            </Link>
            <span
              className="font-mono text-sm text-muted-foreground"
              aria-live="polite"
            >
              Page {currentPage} of {totalPages}
            </span>
            <Link
              href={getBlogPageHref(
                Math.min(totalPages, currentPage + 1),
                activeCategory,
              )}
              scroll={false}
              aria-disabled={currentPage === totalPages}
              tabIndex={currentPage === totalPages ? -1 : undefined}
              className={`rounded-none border border-border px-4 py-2 text-sm text-muted-foreground hover:border-primary/50 ${
                currentPage === totalPages
                  ? "pointer-events-none opacity-40"
                  : ""
              }`}
            >
              Next
            </Link>
          </nav>
        )}
      </section>
    </>
  );
}

function getBlogPageHref(page: number, category: string): string {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (category) params.set("category", category);
  const query = params.toString();
  return query ? `/blogs?${query}` : "/blogs";
}

function FeaturedPost({ post }: { post: BlogPostCardData }) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-16 lg:px-10">
      <Link
        href={`/blogs/${post.slug}`}
        className="group block overflow-hidden rounded-none border border-border bg-card transition-transform hover:-translate-y-1"
      >
        <div className="grid lg:grid-cols-2">
          <div className="h-72 overflow-hidden bg-muted lg:h-auto">
            {post.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.coverImage.url}
                alt={post.coverImage.alt}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="h-full min-h-72 bg-linear-to-br from-primary/20 to-muted" />
            )}
          </div>
          <div className="flex flex-col justify-center p-8 md:p-12">
            <PostMeta post={post} />
            <h2 className="mb-4 font-display text-2xl font-bold leading-tight text-foreground md:text-3xl">
              {post.title}
            </h2>
            <p className="mb-6 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
            <PostByline post={post} />
          </div>
        </div>
      </Link>
    </section>
  );
}

function PostCard({ post }: { post: BlogPostCardData }) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group block h-full overflow-hidden rounded-none border border-border bg-card transition-all hover:-translate-y-1 hover:border-primary/30"
    >
      <div className="h-44 overflow-hidden bg-muted">
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage.url}
            alt={post.coverImage.alt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full bg-linear-to-br from-primary/20 to-muted" />
        )}
      </div>
      <div className="p-5">
        <PostMeta post={post} />
        <h2 className="mb-2 font-display text-base font-bold leading-snug text-foreground">
          {post.title}
        </h2>
        <p className="mb-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <PostByline post={post} />
      </div>
    </Link>
  );
}

function PostMeta({ post }: { post: BlogPostCardData }) {
  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      {post.categories[0] && (
        <span className="rounded-none bg-primary/10 px-2 py-0.5 font-mono text-xs text-primary">
          {post.categories[0]}
        </span>
      )}
      <span className="font-mono text-xs text-muted-foreground">
        {post.readTime} min read
      </span>
    </div>
  );
}

function PostByline({ post }: { post: BlogPostCardData }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-none bg-primary/10 text-xs font-bold text-primary">
          {post.author[0]?.toUpperCase() ?? "P"}
        </span>
        <span className="truncate text-xs text-muted-foreground">
          {post.author}
        </span>
      </div>
      {post.publishedAt && (
        <time
          className="shrink-0 font-mono text-xs text-muted-foreground"
          dateTime={post.publishedAt}
        >
          {new Date(post.publishedAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            timeZone: "UTC",
          })}
        </time>
      )}
    </div>
  );
}
