"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Testimonial = {
  id: number | string;
  name: string;
  role?: string | null;
  company?: string | null;
  testimonial: string;
  photo?: string | number | { url?: string | null; alt?: string | null } | null;
};

type TestimonialProps = {
  testimonials: Testimonial[];
};

export function Testimonial({ testimonials }: TestimonialProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (testimonials.length < 2 || shouldReduceMotion) return;

    const intervalId = window.setInterval(() => {
      setDirection(1);
      setActiveIndex((index) => (index + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [activeIndex, shouldReduceMotion, testimonials.length]);

  if (testimonials.length === 0) return null;

  const goToAdjacent = (step: -1 | 1) => {
    setDirection(step);
    setActiveIndex(
      (index) => (index + step + testimonials.length) % testimonials.length,
    );
  };

  const activeTestimonial = testimonials[activeIndex];
  const { photo } = activeTestimonial;
  const photoUrl =
    typeof photo === "object" && photo !== null ? photo.url : undefined;
  const photoAlt =
    typeof photo === "object" && photo !== null
      ? photo.alt
      : activeTestimonial.name;

  return (
    <section
      aria-label="Testimonials"
      aria-roledescription="carousel"
      className="overflow-hidden border-y-2 border-border bg-card"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-24 lg:grid-cols-[minmax(0,1fr)_minmax(0,3fr)] lg:gap-16 lg:px-10 lg:py-32">
        <div className="flex items-start justify-between gap-6 lg:flex-col lg:justify-between">
          <span
            aria-hidden="true"
            className="flex size-16 items-center justify-center border-2 border-border bg-primary pt-4 font-display text-6xl font-bold leading-none text-primary-foreground shadow-[var(--shadow-control)]"
          >
            &ldquo;
          </span>
          {testimonials.length > 1 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => goToAdjacent(-1)}
                aria-label="Previous testimonial"
                className="flex size-11 items-center justify-center border-2 border-border bg-background shadow-[var(--shadow-control)] transition-[background-color,transform,box-shadow] hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                <ArrowLeft aria-hidden="true" className="size-5" />
              </button>
              <span className="min-w-12 text-center font-mono text-sm tabular-nums text-muted-foreground">
                {activeIndex + 1}/{testimonials.length}
              </span>
              <button
                type="button"
                onClick={() => goToAdjacent(1)}
                aria-label="Next testimonial"
                className="flex size-11 items-center justify-center border-2 border-border bg-background shadow-[var(--shadow-control)] transition-[background-color,transform,box-shadow] hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:translate-x-[3px] active:translate-y-[3px] active:shadow-none"
              >
                <ArrowRight aria-hidden="true" className="size-5" />
              </button>
            </div>
          )}
        </div>
        <div>
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={activeTestimonial.id}
              custom={direction}
              variants={{
                enter: (step: number) => ({
                  x: step > 0 ? 80 : -80,
                  opacity: 0,
                }),
                center: { x: 0, opacity: 1 },
                exit: (step: number) => ({
                  x: step > 0 ? -80 : 80,
                  opacity: 0,
                }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 300, damping: 30 }
              }
              drag={testimonials.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              dragMomentum={false}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60 || info.velocity.x < -500) {
                  goToAdjacent(1);
                } else if (info.offset.x > 60 || info.velocity.x > 500) {
                  goToAdjacent(-1);
                }
              }}
              className={
                testimonials.length > 1
                  ? "cursor-grab touch-pan-y active:cursor-grabbing"
                  : undefined
              }
              role="group"
              aria-roledescription="slide"
              aria-label={`${activeIndex + 1} of ${testimonials.length}`}
            >
              <blockquote className="mb-10 max-w-[34ch] text-balance font-display text-3xl font-bold leading-[1.15] tracking-tight text-foreground md:text-5xl">
                {activeTestimonial.testimonial}
              </blockquote>
              <div className="flex items-center gap-4 border-t-2 border-border pt-6">
                {photoUrl && (
                  <Image
                    src={photoUrl}
                    alt={photoAlt ?? activeTestimonial.name}
                    width={48}
                    height={48}
                    className="size-12 border-2 border-border object-cover"
                  />
                )}
                <div className="text-left">
                  <p className="font-semibold text-foreground">
                    {activeTestimonial.name}
                  </p>
                  <p className="font-mono text-sm text-muted-foreground">
                    {[activeTestimonial.role, activeTestimonial.company]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
