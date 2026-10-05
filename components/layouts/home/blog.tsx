import Link from "next/link";

const blogPosts = [
  {
    title: "Why your MVP should embarrass you (a little)",
    author: "Priya Nair",
    readTime: "5 min read",
    date: "Sep 12, 2026",
    excerpt:
      "The best MVPs are the ones that ship something real. Here is how we think about minimum viable vs. minimum viable enough.",
    img: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=600&h=400&fit=crop&auto=format",
    tag: "Product",
  },
  {
    title: "React Native vs Flutter in 2026",
    author: "James Okafor",
    readTime: "8 min read",
    date: "Aug 28, 2026",
    excerpt:
      "The ecosystem has evolved. We break down which framework wins for cross-platform mobile today.",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop&auto=format",
    tag: "Engineering",
  },
  {
    title: "How we integrated GPT-4o into a logistics app",
    author: "Sofia Reyes",
    readTime: "6 min read",
    date: "Aug 5, 2026",
    excerpt:
      "Step-by-step: building a route-optimisation feature with an LLM backend and a real-time streaming UI.",
    img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=600&h=400&fit=crop&auto=format",
    tag: "AI",
  },
];

export function Blog() {
  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-10 py-28">
      <div className="flex items-end justify-between mb-12">
        <div>
          <span
            className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3 block`}
          >
            // insights
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
            From the lab
          </h2>
        </div>
        <Link
          href="/blog"
          className={`hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors`}
        >
          All articles →
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {blogPosts.map(
          ({ title, img, tag, readTime, excerpt, author, date }) => (
            <Link
              key={title}
              href={`/blog`}
              className={`group text-left rounded-2xl overflow-hidden border bg-card border-border $hover:border-primary/30 transition-all hover:-translate-y-1`}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={img}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-xs">
                    {tag}
                  </span>
                  <span className={`text-xs text-muted-foreground font-mono`}>
                    {readTime}
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
                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-bold text-secondary">
                      {author[0]}
                    </div>
                    <span className={`text-xs text-muted-foreground`}>
                      {author}
                    </span>
                  </div>
                  <span className={`text-xs text-muted-foreground font-mono`}>
                    {date}
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
