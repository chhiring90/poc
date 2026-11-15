"use client";

import { motion, useReducedMotion } from "motion/react";

export type iTechStack = {
  id: number;
  name: string;
  logo?: string;
};

export function StackCarousel({ techStack }: { techStack: iTechStack[] }) {
  const shouldReduceMotion = useReducedMotion();

  if (techStack.length === 0) return null;

  return (
    <section
      aria-label="Technology stack"
      className="overflow-hidden border-b-2 border-border bg-card py-4"
    >
      <ul className="sr-only">
        {techStack.map((tech: iTechStack) => (
          <li key={tech.id}>{tech.name}</li>
        ))}
      </ul>
      <motion.div
        aria-hidden="true"
        className="flex w-max whitespace-nowrap"
        animate={shouldReduceMotion ? { x: 0 } : { x: ["0%", "-50%"] }}
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 40, ease: "linear", repeat: Infinity }
        }
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {techStack.map((tech: iTechStack) => (
              <span
                key={tech.id}
                className="inline-flex items-center gap-8 px-4"
              >
                <span className="font-mono text-sm font-medium text-foreground">
                  {tech.name}
                </span>
                <span className="size-1.5 bg-primary" />
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
