"use client";
import { useState } from "react";
import { useSiteControls } from "@/hooks/use-site-controls";

const filters = ["All", "Web", "Mobile", "SaaS", "E-commerce", "AI"];

const projects = [
  {
    client: "Loopkart",
    category: "SaaS",
    tags: ["Web", "SaaS"],
    year: "2024",
    desc: "Real-time inventory SaaS for D2C brands with live analytics and automated restocking.",
    challenge: "Manual inventory updates causing 15% stockout rate.",
    result: "94% reduction in stockouts, 3.2× revenue growth.",
    tech: ["React", "Node.js", "PostgreSQL", "Redis"],
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&auto=format",
    color: "#3D5AFE",
  },
  {
    client: "Nimbus Health",
    category: "Mobile",
    tags: ["Mobile", "Web"],
    year: "2024",
    desc: "Cross-platform patient monitoring app with real-time vitals and nurse alerts.",
    challenge: "Legacy hospital system causing delayed response times.",
    result: "40% faster nurse response time, 200+ beds deployed.",
    tech: ["React Native", "TypeScript", "AWS", "PostgreSQL"],
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop&auto=format",
    color: "#7B5CFF",
  },
  {
    client: "Carto AI",
    category: "AI",
    tags: ["AI", "Web"],
    year: "2023",
    desc: "AI-powered logistics route optimisation saving 28% on fuel costs.",
    challenge: "Manual routing causing inefficient delivery schedules.",
    result: "28% fuel savings, 12% faster deliveries.",
    tech: ["Next.js", "Python", "OpenAI", "GCP"],
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop&auto=format",
    color: "#C8FF2E",
  },
  {
    client: "Strata Finance",
    category: "Web",
    tags: ["Web", "SaaS"],
    year: "2023",
    desc: "Embedded finance dashboard for SMEs with automated reconciliation.",
    challenge: "No real-time financial visibility for business owners.",
    result: "60% time saved on month-end close, 1,200 SME customers.",
    tech: ["Next.js", "TypeScript", "Supabase", "Stripe"],
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop&auto=format",
    color: "#38BDF8",
  },
  {
    client: "Folksy Market",
    category: "E-commerce",
    tags: ["E-commerce", "Mobile"],
    year: "2023",
    desc: "Artisan marketplace with live auction and seller verification.",
    challenge: "Fraud and low seller trust on the existing platform.",
    result: "2× seller signups, £1.2M GMV in first 6 months.",
    tech: ["React", "Node.js", "Flutter", "Stripe"],
    img: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&h=500&fit=crop&auto=format",
    color: "#F59E0B",
  },
  {
    client: "Pulsar IoT",
    category: "Web",
    tags: ["Web", "SaaS"],
    year: "2022",
    desc: "Industrial IoT dashboard for factory floor monitoring and predictive maintenance.",
    challenge: "Machine failures costing £50K per incident.",
    result: "80% reduction in unplanned downtime.",
    tech: ["React", "Node.js", "AWS IoT", "PostgreSQL"],
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=500&fit=crop&auto=format",
    color: "#22C55E",
  },
];

export default function Work() {
  const { setPage } = useSiteControls();
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState<(typeof projects)[0] | null>(null);

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => p.tags.includes(active));

  const bg = "bg-background";
  const text = "text-foreground";
  const muted = "text-muted-foreground";
  const card = "bg-card border-border";

  if (selected) {
    return (
      <div className={`bg-background text-foreground min-h-screen pt-20`}>
        <div className="max-w-[1280px] mx-auto px-5 lg:px-10 py-20">
          <button
            onClick={() => setSelected(null)}
            className={`flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12`}
          >
            ← Back to work
          </button>

          {/* Case study */}
          <div className="grid lg:grid-cols-2 gap-16 mb-16">
            <div>
              <div className="flex gap-2 mb-4">
                {selected.tags.map((t) => (
                  <span
                    key={t}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary font-mono text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h1 className="font-display text-5xl font-bold tracking-tight mb-4">
                {selected.client}
              </h1>
              <p
                className={`text-lg text-muted-foreground leading-relaxed mb-8`}
              >
                {selected.desc}
              </p>

              <div className="space-y-6">
                <div className={`p-6 rounded-2xl border bg-card border-border`}>
                  <p className="font-mono text-xs text-primary uppercase tracking-widest mb-2">
                    Challenge
                  </p>
                  <p
                    className={`text-muted-foreground text-sm leading-relaxed`}
                  >
                    {selected.challenge}
                  </p>
                </div>
                <div className={`p-6 rounded-2xl border bg-card border-border`}>
                  <p className="mb-2 font-mono text-xs uppercase tracking-widest text-green-600 dark:text-green-400">
                    Result
                  </p>
                  <p
                    className={`text-muted-foreground text-sm leading-relaxed`}
                  >
                    {selected.result}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <img
                src={selected.img}
                alt={selected.client}
                className="w-full h-80 object-cover rounded-2xl"
              />
              <div className="mt-6">
                <p
                  className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3`}
                >
                  Tech used
                </p>
                <div className="flex flex-wrap gap-2">
                  {selected.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border px-3 py-1.5 font-mono text-xs text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-border pt-12">
            <p className={`font-display text-2xl font-bold text-foreground`}>
              Ready to be our next case study?
            </p>
            <button
              onClick={() => setPage("contact")}
              className="rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Start a project →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-background text-foreground min-h-screen`}>
      {/* Hero */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-10 pt-36 pb-16">
        <span
          className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
        >
          // our work
        </span>
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Products that
          <br />
          <span className="text-primary">proved themselves</span>.
        </h1>
        <p className={`text-lg text-muted-foreground max-w-xl`}>
          120+ products shipped for startups, scale-ups and enterprises. Here
          are some we're most proud of.
        </p>
      </section>

      {/* Filter */}
      <div className="max-w-[1280px] mx-auto px-5 lg:px-10 pb-10">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`rounded-full px-4 py-2 font-mono text-sm transition-all ${active === f ? "bg-primary font-bold text-primary-foreground" : "border border-border text-muted-foreground hover:border-primary/50"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1280px] mx-auto px-5 lg:px-10 pb-28">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p) => (
            <button
              key={p.client}
              onClick={() => setSelected(p)}
              className={`group text-left rounded-2xl overflow-hidden border bg-card border-border hover:border-primary/20 transition-all hover:-translate-y-1`}
            >
              <div className="relative h-52 overflow-hidden">
                <img
                  src={p.img}
                  alt={p.client}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-foreground font-bold text-xs">
                    View
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="font-mono text-xs text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                  <span className="ml-auto font-mono text-xs text-muted-foreground">
                    {p.year}
                  </span>
                </div>
                <h3
                  className={`font-display text-xl font-bold text-foreground mb-1`}
                >
                  {p.client}
                </h3>
                <p className={`text-sm text-muted-foreground leading-relaxed`}>
                  {p.desc}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <section className="bg-primary py-24">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-10 text-center">
          <h2 className="mb-4 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
            Your project, next.
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/70">
            Join 100+ companies that shipped with POC.
          </p>
          <button
            onClick={() => setPage("contact")}
            className="rounded-full bg-foreground px-8 py-4 text-base font-bold text-background transition-opacity hover:opacity-90"
          >
            Start a project →
          </button>
        </div>
      </section>
    </div>
  );
}
