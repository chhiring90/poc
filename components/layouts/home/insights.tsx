import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SectionHeading, SectionLink } from "./section-heading";

type InsightPost = {
  title: string;
  slug: string;
  excerpt: string;
  categories: { title: string }[];
  coverImage: { url: string; alt: string };
  author: { firstName: string; lastName: string };
  publishedAt: string;
};

export async function Insights({
  heading,
  subheading,
  posts = [],
  ctaLabel,
  ctaHref,
}: {
  heading: string;
  subheading: string;
  posts: InsightPost[];
  ctaLabel: string;
  ctaHref: string;
}) {
  if (posts.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-10 lg:py-32">
      <SectionHeading
        label={subheading}
        title={heading}
        action={
          ctaHref && ctaLabel ? (
            <SectionLink href={ctaHref}>{ctaLabel}</SectionLink>
          ) : undefined
        }
      />

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <PostCard
            key={post.slug}
            post={post}
            featured={index === 0 && posts.length !== 3}
          />
        ))}
      </div>
    </section>
  );
}

function PostCard({
  post: { title, slug, excerpt, categories, coverImage, author, publishedAt },
  featured,
}: {
  post: InsightPost;
  featured: boolean;
}) {
  const categoryLabels =
    categories?.length > 0
      ? categories.map((category) => category.title)
      : ["Uncategorized"];

  return (
    <Link
      href={`/blogs/${slug ?? ""}`}
      className={cn(
        "group flex flex-col border-2 border-border bg-card shadow-[var(--shadow-card)] transition-[transform,box-shadow] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_var(--color-shadow)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring",
        featured && "lg:col-span-2 lg:grid lg:grid-cols-2",
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden border-b-2 border-border bg-secondary",
          featured && "lg:aspect-auto lg:min-h-80 lg:border-b-0 lg:border-r-2",
        )}
      >
        {coverImage?.url && (
          <Image
            src={coverImage.url}
            alt={coverImage.alt ?? ""}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none"
          />
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {categoryLabels.map((label) => (
            <span
              key={label}
              className="bg-secondary px-2 py-0.5 font-mono text-xs font-medium text-secondary-foreground"
            >
              {label}
            </span>
          ))}
          <span className="font-mono text-xs text-muted-foreground">
            5min read
          </span>
        </div>
        <h3
          className={cn(
            "font-display font-bold leading-snug text-foreground transition-colors group-hover:text-primary",
            featured ? "text-2xl" : "text-xl",
          )}
        >
          {title}
        </h3>
        {excerpt && (
          <p className="mt-3 line-clamp-3 leading-relaxed text-muted-foreground">
            {excerpt}
          </p>
        )}
        <div className="mt-auto flex items-center justify-between gap-4 border-t border-border/40 pt-5 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center border-2 border-border bg-primary text-xs font-bold text-primary-foreground">
              {author?.firstName?.[0] ?? ""}
            </span>
            {author?.firstName} {author?.lastName}
          </span>
          {publishedAt && (
            <time dateTime={publishedAt} className="font-mono text-xs">
              {new Date(publishedAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </time>
          )}
        </div>
      </div>
    </Link>
  );
}
