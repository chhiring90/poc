"use client";
import { useState, useEffect, useRef } from "react";
import { useSiteControls } from "@/hooks/use-site-controls";
import { StatCounter } from "@/components/ui/counter";
import { Hero } from "@/components/layouts/hero";
import { StackCarousel } from "@/components/layouts/stack-carousel";
import { WhoAreWe } from "@/components/layouts/who-are-we";
import { FeaturedWork } from "@/components/layouts/featured-work";
import { TechStack } from "@/components/layouts/tech-stack";
import { Services } from "@/components/layouts/services";

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

const process = [
  {
    step: "01",
    name: "Discover",
    desc: "We dig into your problem, users and constraints.",
  },
  {
    step: "02",
    name: "Prototype",
    desc: "We build the POC — the riskiest part, fast.",
  },
  {
    step: "03",
    name: "Build",
    desc: "Engineering at pace on a stable foundation.",
  },
  {
    step: "04",
    name: "Launch",
    desc: "Ship with confidence, not crossed fingers.",
  },
  {
    step: "05",
    name: "Scale",
    desc: "Grow the product as the audience grows.",
  },
];

export default function Home() {
  const { setPage } = useSiteControls();
  const bg = "bg-background";
  const text = "text-foreground";
  const muted = "text-muted-foreground";
  const card = "bg-card border-border";
  const cardHover = "hover:border-primary/30";

  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      <Hero />
      <StackCarousel />
      <WhoAreWe />
      <FeaturedWork />

      <Services />

      {/* ── PROCESS ── */}
      <section className="bg-muted/40 py-28">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-10">
          <span
            className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
          >
            // how we work
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-14">
            From idea to live product
          </h2>

          <div className="relative">
            {/* Connector line */}
            <div className="absolute left-8 right-8 top-8 hidden h-px bg-border lg:block" />
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
              {process.map((p, i) => (
                <div key={p.step} className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center relative z-10 bg-inherit">
                      <span className="font-mono text-[10px] font-bold text-primary">
                        {p.step}
                      </span>
                    </div>
                    {i < process.length - 1 && (
                      <div className="flex-1 h-px bg-primary/20 lg:hidden" />
                    )}
                  </div>
                  <h3
                    className={`font-display text-lg font-bold text-foreground mb-2`}
                  >
                    {p.name}
                  </h3>
                  <p
                    className={`text-sm text-muted-foreground leading-relaxed`}
                  >
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <TechStack />

      {/* ── TESTIMONIAL ── */}
      <section className="bg-card py-28">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="text-primary font-mono text-4xl mb-8">"</div>
            <blockquote className="mb-10 font-display text-2xl font-medium leading-tight text-foreground md:text-3xl">
              POC took our vague idea and turned it into a product our users
              actually loved — in six weeks. The proof-of-concept sprint removed
              every board-level objection we had.
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&auto=format"
                alt="Marcus Chen"
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
              />
              <div className="text-left">
                <p className="text-sm font-semibold text-foreground">
                  Marcus Chen
                </p>
                <p className="font-mono text-sm text-muted-foreground">
                  CTO, Carto AI
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BLOG ── */}
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
          <button
            onClick={() => setPage("blog")}
            className={`hidden md:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors`}
          >
            All articles →
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <button
              key={post.title}
              onClick={() => setPage("blog")}
              className={`group text-left rounded-2xl overflow-hidden border bg-card border-border $hover:border-primary/30 transition-all hover:-translate-y-1`}
            >
              <div className="h-48 overflow-hidden">
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
                  <span className={`text-xs text-muted-foreground font-mono`}>
                    {post.readTime}
                  </span>
                </div>
                <h3
                  className={`font-display text-base font-bold text-foreground mb-2 leading-snug`}
                >
                  {post.title}
                </h3>
                <p
                  className={`text-sm text-muted-foreground leading-relaxed mb-4`}
                >
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-xs font-bold text-secondary">
                      {post.author[0]}
                    </div>
                    <span className={`text-xs text-muted-foreground`}>
                      {post.author}
                    </span>
                  </div>
                  <span className={`text-xs text-muted-foreground font-mono`}>
                    {post.date}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ── AI SECTION ── */}
      <section className="bg-muted/40 py-20">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-10 text-center">
          <span
            className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
          >
            // third-party validation
          </span>
          <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
            See what AI says about us
          </h2>
          <p className={`text-muted-foreground text-lg mb-10 max-w-lg mx-auto`}>
            Don't just take our word for it. Ask the robots.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: "Ask ChatGPT", color: "#10A37F" },
              { label: "Ask Claude", color: "#C8733E" },
              { label: "Ask Gemini", color: "#4285F4" },
              { label: "Ask Grok", color: "#F6F5F0" },
            ].map((ai) => (
              <button
                key={ai.label}
                className={`px-5 py-2.5 rounded-full font-semibold text-sm border transition-all hover:scale-105`}
                style={{ borderColor: ai.color + "40", color: ai.color }}
              >
                {ai.label} →
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="bg-primary py-32">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-10 text-center">
          <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-primary-foreground/70">
            // let's build
          </span>
          <h2 className="mb-6 font-display text-5xl font-bold tracking-tight text-primary-foreground md:text-6xl lg:text-7xl">
            Got an idea?
            <br />
            Let's prove it.
          </h2>
          <p className="mx-auto mb-10 max-w-md text-lg text-primary-foreground/75">
            We'll scope your project in a free 30-minute call. No pitch decks,
            no BS.
          </p>
          <button
            onClick={() => setPage("contact")}
            className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-bold text-background transition-opacity hover:opacity-90"
          >
            Start a project →
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-[1280px] mx-auto px-5 lg:px-10 py-20">
          <div className="grid md:grid-cols-4 gap-10 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="font-mono text-sm font-bold text-primary-foreground">
                    P∘C
                  </span>
                </div>
                <span
                  className={`font-display font-bold text-lg text-foreground`}
                >
                  POC
                </span>
              </div>
              <p
                className={`text-sm text-muted-foreground leading-relaxed mb-6`}
              >
                Proof of Concept.
                <br />
                We turn ideas into proven products, fast.
              </p>
              <div className="flex gap-3">
                {["in", "gh", "tw", "be", "ig"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="flex size-8 items-center justify-center rounded-lg border border-border font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Learn",
                links: [
                  { l: "Services", p: "services" },
                  { l: "Process", p: "home" },
                  { l: "Blog", p: "blog" },
                  { l: "Case studies", p: "work" },
                ],
              },
              {
                title: "Explore",
                links: [
                  { l: "Our work", p: "work" },
                  { l: "About us", p: "about" },
                  { l: "Careers", p: "about" },
                  { l: "404 test", p: "404" },
                ],
              },
              {
                title: "Get in touch",
                links: [
                  { l: "Start a project", p: "contact" },
                  { l: "hello@poc.dev", p: "contact" },
                  { l: "+44 20 1234 5678", p: "contact" },
                  { l: "London, UK", p: "contact" },
                ],
              },
            ].map((col) => (
              <div key={col.title}>
                <p
                  className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4`}
                >
                  {col.title}
                </p>
                <div className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <button
                      key={link.l}
                      onClick={() => setPage(link.p)}
                      className={`text-left text-sm transition-colors text-muted-foreground hover:text-primary`}
                    >
                      {link.l}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
            <p className={`text-xs text-muted-foreground font-mono`}>
              © 2026 POC Ltd. All rights reserved. Made with too much coffee and
              TypeScript.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="text-xs font-mono text-primary hover:text-white transition-colors flex items-center gap-1"
            >
              ↑ back to top (you survived the scroll)
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
