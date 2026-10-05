import Link from "next/link";

const services = [
  {
    icon: "⬡",
    name: "Web Applications",
    desc: "Fast, scalable web apps built on React, Next.js and TypeScript.",
  },
  {
    icon: "◫",
    name: "Mobile Apps",
    desc: "iOS, Android and cross-platform with React Native, Flutter or Swift/Kotlin.",
  },
  {
    icon: "◈",
    name: "UI/UX Design",
    desc: "Systems-first design in Figma, from wireframes to production tokens.",
  },
  {
    icon: "⟳",
    name: "MVP Sprints",
    desc: "Go from idea to a working proof of concept in 6 weeks.",
  },
  {
    icon: "◉",
    name: "Cloud & DevOps",
    desc: "AWS/GCP infrastructure, Docker, Kubernetes and CI/CD pipelines.",
  },
  {
    icon: "◎",
    name: "AI & Automation",
    desc: "LLM integrations, AI-powered features and workflow automation.",
  },
];

export function Services({}) {
  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-10 py-28">
      <span
        className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
      >
        // expertise
      </span>
      <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Our expertise
      </h2>
      <p className={`text-lg text-muted-foreground mb-14 max-w-xl`}>
        Everything you need to go from napkin sketch to a product your users
        love.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map(({ icon, name, desc }) => (
          <Link
            key={name}
            href="/services"
            className={`group text-left p-6 rounded-2xl border bg-card border-border $hover:border-primary/30 transition-all hover:-translate-y-1`}
          >
            <div className="text-3xl mb-4 text-primary">{icon}</div>
            <h3
              className={`font-display text-lg font-bold text-foreground mb-2`}
            >
              {name}
            </h3>
            <p className={`text-sm text-muted-foreground leading-relaxed`}>
              {desc}
            </p>
            <div
              className={`mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity`}
            >
              Learn more →
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
