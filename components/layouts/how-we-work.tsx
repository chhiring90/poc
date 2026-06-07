import Image from "next/image";
import { cn } from "@/lib/utils";

const HOW_WE_WORK_DATA = [
  {
    title: "Discover & Define",
    description:
      "Understand your goals, users, and context to define what success looks like.",
    bg: "/how-we-work-01.jpg",
    step: "A",
  },
  {
    title: "Architect & Design",
    description:
      "Translate complexity into clarity with purposeful design and smart architecture.",
    bg: "/how-we-work-02.jpg",
    step: "B",
  },
  {
    title: "Build & Validate",
    description:
      "Deliver iteratively with transparency, precision, and quality at every step.",
    bg: "/how-we-work-03.jpg",
    step: "C",
  },
  {
    title: "Launch & Support",
    description:
      "Deliver iteratively with transparency, precision, and quality at every step.",
    bg: "/how-we-work-04.jpg",
    step: "D",
  },
];

function HowWeWork() {
  return (
    <section className="px-6 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
        <div className="grid gap-6 md:grid-cols-2 md:auto-rows-[220px]">
          {HOW_WE_WORK_DATA.map((item, i) => (
            <HowWeWorkCard
              key={item.title}
              title={item.title}
              description={item.description}
              bg={item.bg}
              className={cn(
                i === 0 && "md:row-span-2 md:min-h-105",
                i === 1 && "md:mt-4",
                i === 2 && "md:row-span-2 md:min-h-105",
                i === 3 && "md:mt-4",
              )}
              step={item.step}
            />
          ))}
        </div>

        <header className="lg:sticky lg:top-24 space-y-6 text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-primary">
            How We Work
          </p>
          <h2 className="max-w-xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Together we innovate and build better digital experiences.
          </h2>
          <p className="max-w-md text-base text-muted-foreground sm:text-lg">
            A collaborative process shaped around clarity, craft, and momentum.
          </p>
        </header>
      </div>
    </section>
  );
}

function HowWeWorkCard({
  title,
  description,
  bg,
  step,
  className,
}: {
  title: string;
  description: string;
  bg: string;
  step: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-[28px] border border-white/10 bg-card shadow-[0_18px_40px_rgba(15,23,42,0.18)]",
        className,
      )}
    >
      <Image
        src={bg}
        alt={title}
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent group-hover:backdrop-blur-md transition duration-500" />
      <div className="relative z-10 flex h-full flex-col justify-end p-5 text-white sm:p-6">
        <span className="mb-2 inline-flex w-fit rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.25em] text-white/85 backdrop-blur-md">
          Step {step}
        </span>
        <h3 className="max-w-xs text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h3>
        <p className="mt-2 max-w-sm text-sm text-white/85 sm:text-[15px]">
          {description}
        </p>
      </div>
    </article>
  );
}

export { HowWeWork };
