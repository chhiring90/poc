import Link from "next/link";

const projects = [
  {
    client: "Loopkart",
    desc: "Real-time inventory SaaS for D2C brands",
    tags: ["Web App", "SaaS"],
    year: "2024",
    color: "#3D5AFE",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=500&fit=crop&auto=format",
  },
  {
    client: "Nimbus Health",
    desc: "Cross-platform patient monitoring app",
    tags: ["Mobile", "Healthcare"],
    year: "2024",
    color: "#7B5CFF",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=500&fit=crop&auto=format",
  },
  {
    client: "Carto AI",
    desc: "AI-powered logistics route optimisation",
    tags: ["AI", "Web App"],
    year: "2023",
    color: "#C8FF2E",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=500&fit=crop&auto=format",
  },
  {
    client: "Strata Finance",
    desc: "Embedded finance dashboard for SMEs",
    tags: ["Fintech", "Dashboard"],
    year: "2023",
    color: "#38BDF8",
    img: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&h=500&fit=crop&auto=format",
  },
];

export function FeaturedWork() {
  return (
    <section className="bg-muted/40 py-28">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-10">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span
              className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3 block`}
            >
              // selected work
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight">
              Featured projects
            </h2>
          </div>
          <Link
            href="/work"
            className="hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            View all work →
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {projects.map(({ client, img, desc, year, color, tags }) => (
            <Link
              key={client}
              href="/work"
              className={`group relative rounded-2xl overflow-hidden border bg-card border-border hover:border-primary/30 transition-all hover:-translate-y-1 hover:shadow-2xl text-left`}
            >
              <div className="relative h-56 bg-neutral-900 overflow-hidden">
                <img
                  src={img}
                  alt={client}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                {/* Hover bubble */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex size-16 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    View
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 flex gap-2">
                  {tags.map((t: string) => (
                    <span
                      key={t}
                      className="px-2 py-1 rounded-full bg-black/50 backdrop-blur-sm text-xs font-mono text-white border border-white/10"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-5 flex items-start justify-between">
                <div>
                  <p className={`text-xs font-mono text-muted-foreground mb-1`}>
                    {year}
                  </p>
                  <h3
                    className={`font-display text-xl font-bold text-foreground mb-1`}
                  >
                    {client}
                  </h3>
                  <p className={`text-sm text-muted-foreground`}>{desc}</p>
                </div>
                <div
                  className="w-8 h-8 rounded-full border flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ borderColor: color, color: color }}
                >
                  →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
