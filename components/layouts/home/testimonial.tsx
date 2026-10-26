"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

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
      className="overflow-hidden bg-card py-28"
    >
      <div className="mx-auto max-w-7xl px-5 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
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
              <div className="mb-8 font-mono text-4xl text-primary">
                &ldquo;
              </div>
              <blockquote className="mb-10 font-display text-2xl font-medium leading-tight text-foreground md:text-3xl">
                {activeTestimonial.testimonial}
              </blockquote>
              <div className="flex items-center justify-center gap-4">
                {photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoUrl}
                    alt={photoAlt ?? activeTestimonial.name}
                    className="size-12 rounded-none border-2 border-primary/20 object-cover"
                  />
                )}
                <div className="text-left">
                  <p className="text-sm font-semibold text-foreground">
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
