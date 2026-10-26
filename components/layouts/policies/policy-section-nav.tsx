"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";

type PolicyHeading = {
  id: string;
  level: number;
  text: string;
};

type PolicySectionNavProps = {
  headings: PolicyHeading[];
};

export function PolicySectionNav({ headings }: PolicySectionNavProps) {
  const [activeId, setActiveId] = useState(headings[0]?.id);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const elements = headings
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);
    if (elements.length === 0) return;

    let animationFrame = 0;
    const updateActiveHeading = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        const lastHeading = elements.at(-1);
        const isAtPageBottom =
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 2;

        if (isAtPageBottom && lastHeading) {
          setActiveId(lastHeading.id);
          return;
        }

        const currentHeading = [...elements]
          .reverse()
          .find((element) => element.getBoundingClientRect().top <= 144);
        setActiveId(currentHeading?.id ?? elements[0]?.id);
      });
    };

    updateActiveHeading();
    window.addEventListener("scroll", updateActiveHeading, { passive: true });
    window.addEventListener("resize", updateActiveHeading);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", updateActiveHeading);
      window.removeEventListener("resize", updateActiveHeading);
    };
  }, [headings]);

  return (
    <nav
      aria-label="On this page"
      className="rounded-none border border-border bg-card p-5"
    >
      <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
        On this page
      </h2>
      <ol className="flex flex-col gap-1">
        {headings.map((heading) => {
          const isActive = heading.id === activeId;

          return (
            <li
              key={heading.id}
              className={heading.level > 2 ? "pl-3" : undefined}
            >
              <Link
                href={`#${heading.id}`}
                aria-current={isActive ? "location" : undefined}
                onClick={(event) => {
                  event.preventDefault();
                  const target = document.getElementById(heading.id);
                  target?.scrollIntoView({
                    behavior: shouldReduceMotion ? "auto" : "smooth",
                    block: "start",
                  });
                  window.history.replaceState(null, "", `#${heading.id}`);
                }}
                className={`relative block rounded px-2 py-1.5 text-sm transition-colors ${
                  isActive
                    ? "font-medium text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-policy-heading"
                    className="absolute inset-0 rounded bg-primary/10"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 32,
                    }}
                  />
                )}
                <span className="relative">{heading.text}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
