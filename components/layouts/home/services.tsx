import Link from "next/link";
import { icons } from "lucide-react";

export function Services({
  expertise,
}: {
  expertise: {
    title: string;
    description: string;
    icon: string;
    url: string;
  }[];
}) {
  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-10 py-28">
      <span
        className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
      >
        {"// expertise"}
      </span>
      <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-4">
        Our expertise
      </h2>
      <p className={`text-lg text-muted-foreground mb-14 max-w-xl`}>
        Everything you need to go from napkin sketch to a product your users
        love.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {expertise.map(({ icon, title, description, url }) => {
          const Icon = icons[icon as keyof typeof icons];

          return (
            <Link
              key={title}
              href={url}
              className={`group text-left p-6 rounded-2xl border bg-card border-border $hover:border-primary/30 transition-all hover:-translate-y-1`}
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
