"use client";

import { animate, motion, useInView, useReducedMotion } from "motion/react";
import { cva, type VariantProps } from "class-variance-authority";
import { useEffect, useRef, useState, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

const counterVariants = cva("flex flex-col gap-1", {
  variants: {
    align: {
      center: "items-center text-center",
      left: "items-start text-left",
    },
  },
  defaultVariants: {
    align: "center",
  },
});

const valueVariants = cva(
  "font-display font-bold text-primary tabular-nums leading-none",
  {
    variants: {
      size: {
        default: "text-5xl md:text-6xl",
        sm: "text-4xl md:text-5xl",
        lg: "text-6xl md:text-7xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type StatCounterProps = Omit<ComponentProps<typeof motion.div>, "children"> &
  VariantProps<typeof counterVariants> &
  VariantProps<typeof valueVariants> & {
    end: number;
    suffix?: string;
    label: string;
    valueClassName?: string;
    labelClassName?: string;
  };

export function StatCounter({
  end,
  suffix = "",
  label,
  align,
  size,
  className,
  valueClassName,
  labelClassName,
  ...props
}: StatCounterProps) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const shouldReduceMotion = useReducedMotion();
  const displayedCount = shouldReduceMotion && isInView ? end : count;

  useEffect(() => {
    if (!isInView || shouldReduceMotion) return;

    const animation = animate(0, end, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (value) => setCount(Math.floor(value)),
      onComplete: () => setCount(end),
    });

    return () => animation.stop();
  }, [end, isInView, shouldReduceMotion]);

  return (
    <motion.div
      ref={ref}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className={cn(counterVariants({ align }), className)}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(valueVariants({ size }), valueClassName)}
      >
        {displayedCount}
        {suffix}
      </span>
      <span
        className={cn(
          "text-sm font-medium text-muted-foreground",
          labelClassName,
        )}
      >
        {label}
      </span>
      <span className="sr-only">
        {end}
        {suffix} {label}
      </span>
    </motion.div>
  );
}
