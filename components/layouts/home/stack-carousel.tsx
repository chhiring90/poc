"use client";

import { motion, useReducedMotion } from "motion/react";

const techStack = [
  "React",
  "Next.js",
  "TypeScript",
  "Node.js",
  "React Native",
  "Flutter",
  "Swift",
  "Kotlin",
  "Python",
  "AWS",
  "GCP",
  "PostgreSQL",
  "Docker",
  "Kubernetes",
  "OpenAI",
  "LangChain",
  "Redis",
  "GraphQL",
  "Prisma",
  "Supabase",
];

export function StackCarousel() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      aria-label="Technology stack"
      className="overflow-hidden border-y border-border py-5"
    >
      <ul className="sr-only">
        {techStack.map((tech) => (
          <li key={tech}>{tech}</li>
        ))}
      </ul>
      <motion.div
        aria-hidden="true"
        className="flex w-max whitespace-nowrap"
        animate={shouldReduceMotion ? { x: 0 } : { x: ["0%", "-50%"] }}
        transition={
          shouldReduceMotion
            ? undefined
            : { duration: 32, ease: "linear", repeat: Infinity }
        }
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {techStack.map((tech) => (
              <span key={tech} className="mx-6 inline-flex items-center gap-3">
                <span className="font-mono text-sm font-medium text-muted-foreground">
                  {tech}
                </span>
                <span className="text-lg text-primary">◆</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
