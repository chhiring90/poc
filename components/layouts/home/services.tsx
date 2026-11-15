import Link from "next/link";
import { ArrowUpRight, icons } from "lucide-react";
import type { HomeExpertiseItem } from "@/lib/type/service.type";
import { SectionHeading } from "./section-heading";

export function Services({
  expertise,
}: {
  expertise: HomeExpertiseItem[];
}) {
  if (expertise.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-10 lg:py-32">
      <SectionHeading
        label="// expertise"
        title="Design and technology that help your business move forward with confidence"
        description="We design and build websites, apps and platforms for businesses that want to grow without the guesswork. Start with a clear plan, and we take it from there."
      />

      <ul className="grid gap-[2px] border-2 border-border bg-border shadow-[var(--shadow-card)] md:grid-cols-2">
        {expertise.map(({ icon, title, description, url }, index) => {
          const Icon = icon in icons ? icons[icon as keyof typeof icons] : null;
          const isOddLast =
            expertise.length % 2 === 1 && index === expertise.length - 1;

          return (
            <li
              key={title}
              className={`bg-card ${isOddLast ? "md:col-span-2" : ""}`}
            >
              <Link
                href={`/services${url}`}
                className="group grid h-full grid-cols-[3rem_minmax(0,1fr)_auto] items-start gap-5 p-6 transition-colors hover:bg-muted focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring md:p-8"
              >
                <span className="flex size-12 items-center justify-center border-2 border-border bg-background text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  {Icon && <Icon aria-hidden="true" className="size-6" />}
                </span>
                <span>
                  <span className="block font-display text-2xl font-bold leading-snug text-foreground">
                    {title}
                  </span>
                  {description && (
                    <span className="mt-1.5 block leading-relaxed text-muted-foreground">
                      {description}
                    </span>
                  )}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-6 text-muted-foreground transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
