"use client";
import { Footer } from "@/components/layouts/home";
import { useState } from "react";

interface BlogProps {
  dark: boolean;
  setPage: (p: string) => void;
}

const posts = [
  {
    title: "Why your MVP should embarrass you (a little)",
    author: "Priya Nair",
    readTime: "5 min",
    date: "Sep 12, 2026",
    tag: "Product",
    excerpt:
      "The best MVPs are the ones that ship something real. Overthinking minimum viable is how you miss your market window.",
    img: "https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=800&h=500&fit=crop&auto=format",
  },
  {
    title: "React Native vs Flutter in 2026: the honest answer",
    author: "Tom Nguyen",
    readTime: "8 min",
    date: "Aug 28, 2026",
    tag: "Engineering",
    excerpt:
      "The ecosystem has evolved dramatically. Here's a real-world comparison from someone who's shipped both.",
    img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=500&fit=crop&auto=format",
  },
  {
    title: "How we integrated GPT-4o into a logistics app",
    author: "Sofia Reyes",
    readTime: "6 min",
    date: "Aug 5, 2026",
    tag: "AI",
    excerpt:
      "Step-by-step: building a route-optimisation feature with an LLM backend and a real-time streaming UI.",
    img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&h=500&fit=crop&auto=format",
  },
  {
    title: "The six questions we ask before writing a line of code",
    author: "Ava Mitchell",
    readTime: "4 min",
    date: "Jul 18, 2026",
    tag: "Process",
    excerpt:
      "Most projects fail in the discovery phase, not the build. Here's how we avoid that.",
    img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=500&fit=crop&auto=format",
  },
  {
    title: "Building for scale on day one: myth or necessity?",
    author: "James Okafor",
    readTime: "7 min",
    date: "Jun 30, 2026",
    tag: "Engineering",
    excerpt:
      "Premature optimisation is the root of all evil — but you still need to think about scale. Here's the balance.",
    img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=500&fit=crop&auto=format",
  },
  {
    title: "Design tokens: the upgrade your codebase needs",
    author: "Priya Nair",
    readTime: "5 min",
    date: "Jun 10, 2026",
    tag: "Design",
    excerpt:
      "One change broke 47 components. Token-based design could have prevented all of it.",
    img: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=500&fit=crop&auto=format",
  },
];

const tags = ["All", "Engineering", "Product", "AI", "Design", "Process"];

export default function Blog({ dark, setPage }: BlogProps) {
  const [active, setActive] = useState("All");
  const [featured, ...rest] = posts;

  const filtered =
    active === "All" ? rest : rest.filter((p) => p.tag === active);

  return (
    <div className="bg-background text-foreground min-h-screen">
      <section className="max-w-7xl mx-auto px-5 lg:px-10 pt-36 pb-16">
        <span className="font-mono text-xs uppercase tracking-widest text-muted mb-4 block">
          // the lab blog
        </span>
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Thoughts from
          <br />
          <span className="text-primary">the build</span>.
        </h1>
        <p className="text-lg text-muted max-w-xl">
          Engineering decisions, product lessons, design opinions and the
          occasional hot take.
        </p>
      </section>

      {/* Featured */}
      <section className="max-w-7xl mx-auto px-5 lg:px-10 pb-16">
        <div className="group bg-background border-white/5 relative rounded-2xl overflow-hidden border cursor-pointer hover:-translate-y-1 transition-all">
          <div className="grid lg:grid-cols-2">
            <div className="h-72 lg:h-auto overflow-hidden">
              <img
                src={featured.img}
                alt={featured.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs">
                  {featured.tag}
                </span>
                <span className={`font-mono text-xs text-muted`}>
                  {featured.readTime} read
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4 leading-tight">
                {featured.title}
              </h2>
              <p className={`text-sm text-muted leading-relaxed mb-6`}>
                {featured.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                    {featured.author[0]}
                  </div>
                  <div>
                    <p className={`text-xs font-medium text-foreground`}>
                      {featured.author}
                    </p>
                    <p className={`text-xs text-muted font-mono`}>
                      {featured.date}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Read →
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="max-w-7xl mx-auto px-5 lg:px-10 pb-28">
        <div className="flex flex-wrap gap-2 mb-10">
          {tags.map((t) => (
            <button
              key={t}
              onClick={() => setActive(t)}
              className={`px-4 py-2 rounded-full font-mono text-sm transition-all ${active === t ? "bg-primary text-primary-foreground font-bold" : `border ${dark ? "border-white/10 text-[#71717A]" : "border-black/10 text-[#71717A]"}`}`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => (
            <div
              key={post.title}
              className={`group cursor-pointer rounded-2xl overflow-hidden border border-white/5 bg-background  hover:-translate-y-1 transition-all`}
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={post.img}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-xs">
                    {post.tag}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {post.readTime} read
                  </span>
                </div>
                <h3
                  className={`font-display text-base font-bold text-foreground mb-2 leading-snug`}
                >
                  {post.title}
                </h3>
                <p className={`text-sm text-muted leading-relaxed mb-4`}>
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {post.author[0]}
                    </div>
                    <span className={`text-xs text-muted`}>{post.author}</span>
                  </div>
                  <span className={`text-xs text-muted font-mono`}>
                    {post.date}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
