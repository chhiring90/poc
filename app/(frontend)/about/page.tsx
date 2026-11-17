import type { Metadata } from "next";
import { buildGlobalPageMetadata } from "@/lib/seo/global-page-metadata";
import Image from "next/image";
import Link from "next/link";
import { findGlobalCached } from "@/lib/cms/cache";
import { icons } from "lucide-react";

import { Footer } from "@/components/layouts/home";

type TeamMember = {
  id?: number | string;
  name: string;
  role?: string | null;
  bio?: string | null;
  profile?: { url?: string | null } | number | string | null;
};

export function generateMetadata(): Promise<Metadata> {
  return buildGlobalPageMetadata({
    global: "about",
    path: "/about",
    titleFields: ["hero.heading"],
    descriptionFields: ["hero.description"],
    fallbackTitle: "About us",
    imageField: "hero.image",
  });
}

export default async function About() {
  const about = await findGlobalCached("about", 2);
  const hero = about.hero;
  const values = about.values ?? [];
  const team = about.team;
  const teamMembers = team?.members ?? [];

  return (
    <div className={`bg-background text-foreground min-h-screen`}>
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-5 lg:px-10 pt-36 pb-20 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <span
            className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
          >
            {"// "}
            {hero.subheading}
          </span>
          <h1 className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-6">
            {/* We're the agency
            <br />
            that <span className="text-primary">actually ships</span>. */}
            {hero.heading}
          </h1>
          <p className={`text-lg text-muted-foreground leading-relaxed mb-6`}>
            POC was built in 2019 on a simple frustration: too many agencies
            promised innovation and delivered PowerPoints. We wanted to be the
            team that shows, not tells.
          </p>
          <p className={`text-lg text-muted-foreground leading-relaxed`}>
            Today we&apos;re 20 people across engineering, design and product —
            shipping web and mobile apps for companies at every stage, from
            seed-stage startups to listed enterprises.
          </p>
        </div>
        <div className="relative h-80 w-full">
          <Image
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=900&fit=crop&auto=format"
            alt="POC team"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            preload
            className="object-cover rounded-none"
          />
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/40 py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-10">
          <span
            className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
          >
            {"// values"}
          </span>
          <h2 className="font-display text-4xl font-bold tracking-tight mb-12">
            How we think
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values["value-lists"]?.map(
              (v: {
                id?: string | null;
                icon: string;
                title: string;
                description: string;
              }) => {
                const Icon = icons[v.icon as keyof typeof icons];

                return (
                  <div
                    key={v.id ?? v.title}
                    className="rounded-none border border-border bg-card p-6"
                  >
                    <span className="mb-4 block text-2xl text-primary">
                      {Icon && <Icon aria-hidden="true" />}
                    </span>
                    <h3 className="mb-2 font-display text-lg font-bold text-foreground">
                      {v.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {v.description}
                    </p>
                  </div>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-7xl mx-auto px-5 lg:px-10 py-28">
        <span
          className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
        >
          {"// "}
          {team?.subheading}
        </span>
        <h2 className="font-display text-4xl font-bold tracking-tight mb-12">
          {team?.heading}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {teamMembers.map((member: TeamMember) => {
            const profile =
              typeof member.profile === "object" ? member.profile : null;

            return (
              <div
                key={member.id ?? member.name}
                className="group rounded-none border border-border bg-card p-6 transition-colors hover:border-primary/20"
              >
                {profile?.url && (
                  <div className="relative mb-4 h-48 overflow-hidden rounded-none">
                    <Image
                      src={profile.url}
                      alt={member.name}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                  </div>
                )}
                <h3 className="font-display text-lg font-bold text-foreground">
                  {member.name}
                </h3>
                {member.role && (
                  <p className="mb-2 font-mono text-xs text-primary">
                    {member.role}
                  </p>
                )}
                {member.bio && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {member.bio}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div
          className={`mt-12 p-8 rounded-none border bg-card border-border flex items-center justify-between`}
        >
          <div>
            <h3
              className={`font-display text-xl font-bold text-foreground mb-1`}
            >
              Want to join us?
            </h3>
            <p className={`text-sm text-muted-foreground`}>
              We&apos;re always looking for great engineers, designers and PMs.
            </p>
          </div>
          <Link
            href="/careers"
            className="capitalize rounded-none border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            View openings
          </Link>
        </div>
      </section>

      <section className="bg-primary py-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-10 text-center">
          <h2 className="mb-12 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
            Let&apos;s build something together.
          </h2>
          <Link
            href="/contact"
            className="mt-2 rounded-none bg-foreground px-8 py-4 text-base font-bold text-background transition-opacity hover:opacity-90"
          >
            Start a project →
          </Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}
