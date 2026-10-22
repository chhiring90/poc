import Link from "next/link";

export function Insights({
  heading,
  subheading,
  posts = [],
  ctaLabel,
  ctaHref,
  categories,
}: {
  heading: string;
  subheading: string;
  posts: {
    title: string;
    slug: string;
    excerpt: string;
    categories: { title: string }[];
    coverImage: { url: string; alt: string };
    author: { firstName: string; lastName: string };
    publishedAt: string;
  }[];
  categories: { title: string }[];
  ctaLabel: string;
  ctaHref: string;
}) {
  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-10 py-28">
      <div className="flex items-end justify-between mb-12">
        <div>
          <span
            className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3 block`}
          >
            {subheading}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            {heading}
          </h2>
        </div>
        <Link
          href={ctaHref ?? ""}
          className={`hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors`}
        >
          {ctaLabel}
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {posts.map(
          ({ title, slug, excerpt, coverImage, author, publishedAt }) => (
            <Link
              key={slug}
              href={`/blogs/${slug ?? ""}`}
              className={`group text-left rounded-2xl overflow-hidden border bg-card border-border $hover:border-primary/30 transition-all hover:-translate-y-1`}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={coverImage.url}
                  alt={coverImage.alt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-xs">
                    {categories?.[0]?.title || "Uncategorized"}
                  </span>
                  <span className={`text-xs text-muted-foreground font-mono`}>
                    5min read
                  </span>
                </div>
                <h3
                  className={`font-display text-base font-bold text-foreground mb-2 leading-snug`}
                >
                  {title}
                </h3>
                <p
                  className={`text-sm text-muted-foreground leading-relaxed mb-4`}
                >
                  {excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-bold text-white">
                      {author.firstName?.[0] ?? ""}
                    </div>
                    <span className={`text-xs text-muted-foreground`}>
                      {author.firstName} {author.lastName}
                    </span>
                  </div>
                  <span className={`text-xs text-muted-foreground font-mono`}>
                    {publishedAt
                      ? new Date(publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </span>
                </div>
              </div>
            </Link>
          ),
        )}
      </div>
    </section>
  );
}
