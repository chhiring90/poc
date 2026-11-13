import Link from "next/link";
import { icons } from "lucide-react";
import type { HomeExpertiseItem } from "@/lib/type/service.type";

export function Services({
  expertise,
}: {
  expertise: HomeExpertiseItem[];
}) {
  return (
    <section className="max-w-7xl mx-auto px-5 lg:px-10 py-28">
      <span
        className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
      >
        {"// expertise"}
      </span>
      <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Design and technology that help your business move forward with
        confidence
      </h2>
      <p className={`text-lg text-muted-foreground mb-14 max-w-xl`}>
        We design and build websites, apps and platforms for businesses that
        want to grow without the guesswork. Start with a clear plan, and we take
        it from there.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {expertise.map(({ icon, title, description, url }) => {
          const Icon = icons[icon as keyof typeof icons];

          return (
            <Link
              key={title}
              href={`/services${url}`}
              className={`group text-left p-6 rounded-none border bg-card border-border $hover:border-primary/30 transition-all hover:-translate-y-1`}
            >
              <div className="mb-4 text-primary">
                {Icon && <Icon aria-hidden="true" size={32} />}
              </div>
              <h3
                className={`font-display text-lg font-bold text-foreground mb-2`}
              >
                {title}
              </h3>
              <p className={`text-sm text-muted-foreground leading-relaxed`}>
                {description}
              </p>
              <div
                className={`mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity`}
              >
                Learn more →
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
