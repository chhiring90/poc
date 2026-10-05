"use client";

import { useSiteControls } from "@/hooks/use-site-controls";

const team = [
  {
    name: "Ava Mitchell",
    role: "Founder & CEO",
    bio: "Ex-Monzo. Shipped 30+ products. Believes every idea deserves a fair shot.",
    img: "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "James Okafor",
    role: "CTO",
    bio: "Formerly AWS. Kubernetes wrangler, distributed-systems nerd, very fast typer.",
    img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Priya Nair",
    role: "Head of Design",
    bio: "Spent 6 years at IDEO before going agency. Makes things beautiful and usable.",
    img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Sofia Reyes",
    role: "Lead Engineer",
    bio: "Full-stack with a ML bias. Has a habit of adding AI to things that don't need it.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Tom Nguyen",
    role: "Mobile Lead",
    bio: "React Native and Flutter since day one. If it fits on a screen, he'll build it.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&auto=format",
  },
  {
    name: "Leila Hassan",
    role: "Product Manager",
    bio: "User research, roadmaps, wrangling scope. The most important person in the room.",
    img: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&auto=format",
  },
];

const values = [
  {
    icon: "⟳",
    name: "Ship, then iterate",
    desc: "We believe in getting something real in front of users. A working product beats a perfect slide deck every time.",
  },
  {
    icon: "◈",
    name: "Design that thinks",
    desc: "Good design isn't decoration. It's architecture. We design systems, not screens.",
  },
  {
    icon: "◉",
    name: "Code like it'll outlive you",
    desc: "We write readable, tested, documented code. Future-you (and your team) will thank us.",
  },
  {
    icon: "◎",
    name: "Honest by default",
    desc: "We'll tell you if your idea needs more research. Or if the timeline is unrealistic. Clients don't pay us to agree.",
  },
];

export default function About() {
  const { setPage } = useSiteControls();
  const bg = "bg-background";
  const text = "text-foreground";
  const muted = "text-muted-foreground";
  const card = "bg-card border-border";

  return (
    <div className={`bg-background text-foreground min-h-screen`}>
      {/* Hero */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-10 pt-36 pb-20 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span
            className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
          >
            // about poc
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-6">
            We're the agency
            <br />
            that <span className="text-primary">actually ships</span>.
          </h1>
          <p className={`text-lg text-muted-foreground leading-relaxed mb-6`}>
            POC was built in 2019 on a simple frustration: too many agencies
            promised innovation and delivered PowerPoints. We wanted to be the
            team that shows, not tells.
          </p>
          <p className={`text-lg text-muted-foreground leading-relaxed`}>
            Today we're 20 people across engineering, design and product —
            shipping web and mobile apps for companies at every stage, from
            seed-stage startups to listed enterprises.
          </p>
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&auto=format"
            alt="POC team"
            className="w-full h-80 object-cover rounded-2xl"
          />
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/40 py-24">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-10">
          <span
            className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
          >
            // values
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight mb-12">
            How we think
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v) => (
              <div
                key={v.name}
                className={`p-6 rounded-2xl border bg-card border-border`}
              >
                <span className="text-2xl text-primary mb-4 block">
                  {v.icon}
                </span>
                <h3
                  className={`font-display text-lg font-bold text-foreground mb-2`}
                >
                  {v.name}
                </h3>
                <p className={`text-sm text-muted-foreground leading-relaxed`}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-[1280px] mx-auto px-5 lg:px-10 py-28">
        <span
          className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
        >
          // the team
        </span>
        <h2 className="font-display text-4xl font-bold tracking-tight mb-12">
          The people who build your product
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {team.map((m) => (
            <div
              key={m.name}
              className={`group p-6 rounded-2xl border bg-card border-border hover:border-primary/20 transition-all`}
            >
              <div className="relative mb-4 overflow-hidden rounded-xl">
                <img
                  src={m.img}
                  alt={m.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <h3 className={`font-display text-lg font-bold text-foreground`}>
                {m.name}
              </h3>
              <p className="text-primary font-mono text-xs mb-2">{m.role}</p>
              <p className={`text-sm text-muted-foreground leading-relaxed`}>
                {m.bio}
              </p>
            </div>
          ))}
        </div>

        <div
          className={`mt-12 p-8 rounded-2xl border bg-card border-border flex items-center justify-between`}
        >
          <div>
            <h3
              className={`font-display text-xl font-bold text-foreground mb-1`}
            >
              Want to join us?
            </h3>
            <p className={`text-sm text-muted-foreground`}>
              We're always looking for great engineers, designers and PMs.
            </p>
          </div>
          <button className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-primary/40 hover:text-primary">
            View openings
          </button>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-24">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-10 text-center">
          <h2 className="mb-4 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
            Let's build something together.
          </h2>
          <button
            onClick={() => setPage("contact")}
            className="mt-2 rounded-full bg-foreground px-8 py-4 text-base font-bold text-background transition-opacity hover:opacity-90"
          >
            Start a project →
          </button>
        </div>
      </section>
    </div>
  );
}
