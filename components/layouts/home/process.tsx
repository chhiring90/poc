"use client";

import { motion, useReducedMotion } from "motion/react";

const brickPlacements = [
  "lg:col-span-5",
  "lg:col-span-6",
  "lg:col-span-4",
  "lg:col-span-7",
  "lg:col-span-5",
];

const brickHeights = [
  "lg:min-h-72",
  "lg:min-h-60",
  "lg:min-h-56",
  "lg:min-h-72",
  "lg:min-h-60",
];

const brickStudCounts = [3, 4, 4, 6, 6];

const brickSurfaces = [
  "bg-card",
  "bg-primary/[0.07]",
  "bg-secondary",
  "bg-card",
  "bg-primary/[0.07]",
];

export function Process({
  process,
}: {
  process: { step: string | number; title: string; description: string }[];
}) {
  const shouldReduceMotion = useReducedMotion();

  if (process.length === 0) return null;

  return (
    <section id="process" className="bg-muted/40 py-28">
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {"// how we work"}
        </span>
        <h2 className="mb-14 font-display text-4xl font-bold tracking-tight md:text-5xl">
          From idea to live product
        </h2>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-12 lg:gap-1">
          {process.map((item, index) => (
            <motion.article
              key={item.step}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : {
                      y: -6,
                      scale: 1.015,
                      transition: {
                        type: "spring",
                        stiffness: 360,
                        damping: 24,
                      },
                    }
              }
              transition={{
                type: "spring",
                stiffness: 280,
                damping: 22,
                delay: shouldReduceMotion ? 0 : Math.min(index * 0.06, 0.3),
              }}
              className={`group relative flex min-h-60 flex-col border border-border shadow-[0_5px_0_var(--border)] transition-[box-shadow,border-color] duration-300 hover:border-primary/50 hover:shadow-[0_8px_0_var(--primary)] sm:min-h-64 ${
                brickPlacements[index] ?? "lg:col-span-4"
              } ${
                brickHeights[index % brickHeights.length]
              } ${brickSurfaces[index % brickSurfaces.length]}`}
            >
              <div className="flex h-11 items-center justify-between border-b border-border/70 px-5">
                <div aria-hidden="true" className="flex flex-wrap gap-2">
                  {Array.from({
                    length: brickStudCounts[index] ?? 3,
                  }).map((_, stud) => (
                    <span
                      key={stud}
                      className="h-3 w-3 rounded-full border border-primary/35 bg-primary/15 shadow-[inset_0_1px_2px_var(--background)] transition-colors group-hover:bg-primary/35"
                    />
                  ))}
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  Module {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="relative flex flex-1 flex-col justify-end overflow-hidden p-6 sm:p-8">
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-10 right-3 font-display text-[10rem] font-bold leading-none text-primary/[0.045] transition-colors duration-300 group-hover:text-primary/[0.1]"
                >
                  {String(item.step).padStart(2, "0")}
                </span>
                <div className="relative z-10">
                  <span className="mb-3 block font-mono text-xs font-bold tracking-widest text-primary">
                    {String(item.step).padStart(2, "0")}{" "}
                    <span className="text-muted-foreground">/</span>{" "}
                    {String(process.length).padStart(2, "0")}
                  </span>
                  <h3 className="mb-3 font-display text-2xl font-bold text-foreground sm:text-3xl">
                    {item.title}
                  </h3>
                  <p className="max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item.description}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
