"use client";

import { useSiteControls } from "@/hooks/use-site-controls";

const services = [
  {
    icon: "⬡",
    name: "Web Applications",
    desc: "We build fast, scalable web apps on React, Next.js and TypeScript — from internal tools to public-facing platforms.",
    tech: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    deliverables: [
      "Architecture & tech spec",
      "Design system",
      "Production app",
      "Documentation",
    ],
  },
  {
    icon: "◫",
    name: "Mobile Apps",
    desc: "Native iOS/Android or cross-platform with React Native or Flutter. One codebase, two stores, zero compromise.",
    tech: ["React Native", "Flutter", "Swift", "Kotlin"],
    deliverables: [
      "App architecture",
      "UI/UX design",
      "App Store submission",
      "Push notifications",
    ],
  },
  {
    icon: "◈",
    name: "UI/UX Design",
    desc: "From user research to a Figma-handoff-ready design system. We design things that work before we build them.",
    tech: ["Figma", "Storybook", "Design Tokens", "Prototyping"],
    deliverables: [
      "User research",
      "Wireframes",
      "UI system",
      "Interactive prototype",
    ],
  },
  {
    icon: "⟳",
    name: "MVP & POC Sprints",
    desc: "Six weeks. A real working product. Enough to validate the idea, win investment, or prove it to the board.",
    tech: ["Rapid prototyping", "Lean build", "User testing", "Analytics"],
    deliverables: [
      "Clickable prototype",
      "Working MVP",
      "User feedback report",
      "Roadmap",
    ],
  },
  {
    icon: "◉",
    name: "Cloud & DevOps",
    desc: "AWS and GCP infrastructure, containerised with Docker, orchestrated with Kubernetes. Built for 3am incidents.",
    tech: ["AWS", "GCP", "Docker", "Kubernetes", "Terraform"],
    deliverables: [
      "Infrastructure diagram",
      "CI/CD pipeline",
      "Monitoring setup",
      "Cost optimisation",
    ],
  },
  {
    icon: "◎",
    name: "AI & Automation",
    desc: "LLM integrations, AI-powered product features, and workflow automation that actually saves time.",
    tech: ["OpenAI", "LangChain", "Python", "n8n", "RAG"],
    deliverables: [
      "AI feature spec",
      "Integration build",
      "Evaluation framework",
      "Cost modelling",
    ],
  },
];

const faqs = [
  {
    q: "How long does a typical project take?",
    a: "Our MVP sprints run 6 weeks. A full-scale web or mobile app typically takes 3–5 months. We'll give you a scoped estimate in our discovery call.",
  },
  {
    q: "Do you work with early-stage startups?",
    a: "Absolutely. Our MVP sprint is designed for founders who need to validate fast. We've taken many companies from idea to funded product.",
  },
  {
    q: "What does the POC sprint include?",
    a: "Discovery workshop, architecture, design, a working prototype with at least one core user flow, and a roadmap for the full build.",
  },
  {
    q: "Can you work with our existing team?",
    a: "Yes. We can embed alongside your engineers, take over a struggling build, or run the entire project — whatever works best.",
  },
  {
    q: "Who owns the code?",
    a: "You do. We transfer full IP at project close. No vendor lock-in, no licence fees.",
  },
];

export default function Services() {
  const { setPage } = useSiteControls();
  const bg = "bg-background";
  const text = "text-foreground";
  const muted = "text-muted-foreground";
  const card = "bg-card border-border";

  return (
    <div className={`bg-background text-foreground min-h-screen`}>
      {/* Hero */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-10 pt-36 pb-20">
        <span
          className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
        >
          // services
        </span>
        <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Everything you need,
          <br />
          <span className="text-primary">nothing you don't</span>.
        </h1>
        <p
          className={`text-lg text-muted-foreground max-w-2xl leading-relaxed`}
        >
          From a quick proof of concept to a full product launch — we design,
          build and ship software that does what it's supposed to.
        </p>
      </section>

      {/* Service cards */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-10 pb-28">
        <div className="space-y-5">
          {services.map((s, i) => (
            <div
              key={s.name}
              className={`group p-8 rounded-2xl border bg-card border-border hover:border-primary/20 transition-all`}
            >
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl text-primary">{s.icon}</span>
                    <span
                      className={`font-mono text-xs uppercase tracking-widest text-muted-foreground`}
                    >
                      0{i + 1}
                    </span>
                  </div>
                  <h3
                    className={`font-display text-2xl font-bold text-foreground mb-3`}
                  >
                    {s.name}
                  </h3>
                  <p className={`text-muted-foreground leading-relaxed`}>
                    {s.desc}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {s.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p
                    className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-3`}
                  >
                    Deliverables
                  </p>
                  <ul className="space-y-2">
                    {s.deliverables.map((d) => (
                      <li key={d} className="flex items-center gap-2 text-sm">
                        <span className="w-1 h-1 rounded-full bg-primary" />
                        <span className={muted}>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-muted/40 py-28">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-10">
          <span
            className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
          >
            // faq
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight mb-12">
            Questions we actually get
          </h2>
          <div className="max-w-2xl space-y-4">
            {faqs.map((f) => (
              <details
                key={f.q}
                className={`group border bg-card border-border rounded-xl overflow-hidden`}
              >
                <summary
                  className={`flex items-center justify-between p-5 cursor-pointer list-none text-foreground font-medium`}
                >
                  {f.q}
                  <span className="text-primary text-lg group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p
                  className={`px-5 pb-5 text-sm text-muted-foreground leading-relaxed`}
                >
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-24">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-10 text-center">
          <h2 className="mb-4 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
            Ready to build?
          </h2>
          <p className="mb-8 text-lg text-primary-foreground/70">
            Let's scope your project in a free 30-minute call.
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
