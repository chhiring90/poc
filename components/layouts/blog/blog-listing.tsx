import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { BlogPostCardData } from "@/lib/helper/to-blog-post.helper";
import { cn } from "@/lib/utils";

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

/** Square card with the brand's hard shadow; pressed in slightly on hover. */
const cardClass =
  "group flex h-full flex-col border-2 border-border bg-card shadow-[var(--shadow-card)] transition-[transform,box-shadow] duration-150 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[3px_3px_0_var(--color-shadow)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring motion-reduce:transition-none motion-reduce:hover:translate-x-0 motion-reduce:hover:translate-y-0";

export function BlogListing({
  posts,
  featuredPost,
  categories,
  activeCategory,
  currentPage,
  totalPages,
}: BlogListingProps) {
  return (
    <>
      {featuredPost && <FeaturedPost post={featuredPost} />}

      <section
        id="posts"
        className="mx-auto max-w-7xl scroll-mt-28 px-5 pb-28 lg:px-10"
        aria-label="Blog posts"
      >
        {categories.length > 0 && (
          <nav
            aria-label="Filter by topic"
            className="mb-10 flex flex-wrap items-center gap-x-6 gap-y-4 border-y-2 border-border py-5"
          >
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Topics
            </span>
            <ul className="flex flex-wrap gap-2">
              {[{ title: "All", slug: "" }, ...categories].map((category) => {
                const active = activeCategory === category.slug;
                return (
                  <li key={category.slug || "all"}>
                    <Link
                      href={getBlogPageHref(1, category.slug)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "inline-flex h-9 items-center border-2 px-4 font-mono text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                        active
                          ? "border-border bg-primary text-primary-foreground shadow-[var(--shadow-control)]"
                          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      {category.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {posts.length > 0 ? (
          <ul className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="border-2 border-dashed border-border bg-card px-6 py-16 text-center">
            <p className="font-display text-2xl font-bold">
              Nothing here yet.
            </p>
            <p className="mt-2 text-muted-foreground">
              There are no posts in this topic.{" "}
              <Link
                href="/blogs"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                See all posts
              </Link>
            </p>
          </div>
        )}

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            category={activeCategory}
          />
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
  return query ? `/blogs?${query}#posts` : "/blogs#posts";
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function CoverImage({
  post,
  sizes,
  preload,
}: {
  post: BlogPostCardData;
  sizes: string;
  preload?: boolean;
}) {
  if (!post.coverImage) {
    // No cover: a quiet grid pattern in the brand colours instead of an empty box.
    return (
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-muted [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:28px_28px] opacity-60"
      />
    );
  }
  return (
    <Image
      src={post.coverImage.url}
      alt={post.coverImage.alt}
      fill
      sizes={sizes}
      preload={preload}
      className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
    />
  );
}

function FeaturedPost({ post }: { post: BlogPostCardData }) {
  return (
    <section
      aria-label="Featured post"
      className="mx-auto max-w-7xl px-5 pb-12 lg:px-10 lg:pb-14"
    >
      <Link href={`/blogs/${post.slug}`} className={cardClass}>
        <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="relative aspect-[16/9] overflow-hidden border-b-2 border-border md:aspect-auto md:min-h-64 md:border-b-0 md:border-r-2">
            <CoverImage
              post={post}
              sizes="(min-width: 1280px) 580px, (min-width: 768px) 48vw, 100vw"
              preload
            />
            <span className="absolute left-4 top-4 border-2 border-border bg-accent px-3 py-1 font-mono text-xs font-bold uppercase tracking-widest text-accent-foreground">
              Featured
            </span>
          </div>
          <div className="flex flex-col p-6 sm:p-8">
            <PostMeta post={post} />
            <h2 className="mt-3 text-balance font-display text-2xl font-bold leading-tight tracking-tight lg:text-3xl">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="mt-3 line-clamp-3 leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>
            )}
            <div className="mt-auto pt-6">
              <PostByline post={post} />
              <span className="mt-5 inline-flex items-center gap-1.5 border-b-2 border-primary pb-0.5 text-sm font-semibold">
                Read the article
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}

function PostCard({ post }: { post: BlogPostCardData }) {
  return (
    <Link href={`/blogs/${post.slug}`} className={cardClass}>
      <div className="relative aspect-[16/10] overflow-hidden border-b-2 border-border">
        <CoverImage
          post={post}
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <PostMeta post={post} />
        <h2 className="mt-3 text-balance font-display text-xl font-bold leading-snug tracking-tight group-hover:text-primary">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}
        <div className="mt-auto pt-6">
          <div className="border-t-2 border-border pt-4">
            <PostByline post={post} />
          </div>
        </div>
      </div>
    </Link>
  );
}

function PostMeta({ post }: { post: BlogPostCardData }) {
  return (
    <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs uppercase tracking-widest">
      {post.categories[0] && (
        <span className="text-primary">{post.categories[0]}</span>
      )}
      {post.categories[0] && (
        <span aria-hidden="true" className="text-border">
          /
        </span>
      )}
      <span className="text-muted-foreground">{post.readTime} min read</span>
    </p>
  );
}

function PostByline({ post }: { post: BlogPostCardData }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center border-2 border-border bg-secondary font-mono text-xs font-bold text-secondary-foreground"
        >
          {post.author[0]?.toUpperCase() ?? "P"}
        </span>
        <span className="truncate text-sm font-medium">
          {post.author || "POC team"}
        </span>
      </div>
      {post.publishedAt && (
        <time
          className="shrink-0 font-mono text-xs text-muted-foreground"
          dateTime={post.publishedAt}
        >
          {formatDate(post.publishedAt)}
        </time>
      )}
    </div>
  );
}

/** Numbered pages; long ranges collapse to 1 … 4 5 6 … 12. */
function Pagination({
  currentPage,
  totalPages,
  category,
}: {
  currentPage: number;
  totalPages: number;
  category: string;
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (page) =>
      page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1,
  );
  const stepClass =
    "inline-flex h-10 items-center gap-2 border-2 border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";
  const disabledClass = "pointer-events-none opacity-40";

  return (
    <nav
      aria-label="Blog post pages"
      className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t-2 border-border pt-8"
    >
      <Link
        href={getBlogPageHref(Math.max(1, currentPage - 1), category)}
        aria-disabled={currentPage === 1}
        tabIndex={currentPage === 1 ? -1 : undefined}
        className={cn(stepClass, currentPage === 1 && disabledClass)}
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        Previous
      </Link>

      <ol className="flex items-center gap-2">
        {pages.map((page, index) => {
          const gap = index > 0 && page - pages[index - 1] > 1;
          const current = page === currentPage;
          return (
            <li key={page} className="flex items-center gap-2">
              {gap && (
                <span aria-hidden="true" className="font-mono text-muted-foreground">
                  …
                </span>
              )}
              <Link
                href={getBlogPageHref(page, category)}
                aria-current={current ? "page" : undefined}
                aria-label={`Page ${page}`}
                className={cn(
                  "inline-flex size-10 items-center justify-center border-2 border-border font-mono text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                  current
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-control)]"
                    : "bg-background hover:bg-muted",
                )}
              >
                {page}
              </Link>
            </li>
          );
        })}
      </ol>

      <Link
        href={getBlogPageHref(Math.min(totalPages, currentPage + 1), category)}
        aria-disabled={currentPage === totalPages}
        tabIndex={currentPage === totalPages ? -1 : undefined}
        className={cn(stepClass, currentPage === totalPages && disabledClass)}
      >
        Next
        <ArrowRight aria-hidden="true" className="size-4" />
      </Link>
    </nav>
  );
}
