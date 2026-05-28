import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Image from "next/image";

const heroVariants = cva(
  "group/hero relative w-full overflow-hidden rounded-3xl border bg-card",
  {
    variants: {
      size: {
        default: "min-h-[90.5vh]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const contentVariants = cva(
  "relative z-10 flex h-full min-h-[90.5vh] w-full flex-col justify-center gap-6 px-6 py-10 sm:px-8 lg:px-12 lg:py-14",
  {
    variants: {
      align: {
        left: "items-start text-left",
        center: "items-center text-center",
        right: "items-end text-right",
      },
    },
    defaultVariants: {
      align: "left",
    },
  },
);

type HeroProps = ComponentPropsWithoutRef<"section"> &
  VariantProps<typeof heroVariants> & {
    align?: "left" | "center" | "right";
    imageSrc?: string;
    imageAlt?: string;
    overlayClassName?: string;
    children?: ReactNode;
  };

function Hero({
  className,
  size = "default",
  align = "left",
  imageSrc = "/hero-bg.webp",
  imageAlt = "Hero background",
  overlayClassName,
  children,
  ...props
}: HeroProps) {
  return (
    <section className={cn(heroVariants({ size }), className)} {...props}>
      <HeroImage src={imageSrc} alt={imageAlt} />
      <div
        className={cn(
          "absolute inset-0 bg-background/10 backdrop-blur-[2px]",
          overlayClassName,
        )}
      />
      <HeroContent align={align}>{children}</HeroContent>
    </section>
  );
}

function HeroImage({
  className,
  alt = "Hero background",
  ...props
}: ComponentPropsWithoutRef<typeof Image>) {
  return (
    <Image
      fill
      priority
      alt={alt}
      className={cn("object-cover", className)}
      {...props}
    />
  );
}

function HeroContent({
  className,
  align = "left",
  ...props
}: ComponentPropsWithoutRef<"div"> & { align?: "left" | "center" | "right" }) {
  return (
    <div className={cn(contentVariants({ align }), className)} {...props} />
  );
}

const heroTitleVariants = cva(
  "max-w-2xl font-bold tracking-tight text-foreground",
  {
    variants: {
      size: {
        default: "text-3xl sm:text-4xl lg:text-5xl",
        sm: "text-2xl sm:text-3xl lg:text-4xl",
        lg: "text-4xl sm:text-5xl lg:text-6xl",
        xxl: "text-5xl sm:text-6xl lg:text-8xl",
        custom: "text-5xl sm:text-6xl lg:text-7xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

function HeroTitle({
  className,
  size = "default",
  ...props
}: ComponentPropsWithoutRef<"h1"> & VariantProps<typeof heroTitleVariants>) {
  return (
    <h1 className={cn(heroTitleVariants({ size }), className)} {...props} />
  );
}

function HeroDescription({
  className,
  ...props
}: ComponentPropsWithoutRef<"p">) {
  return (
    <p
      className={cn("max-w-xl text-lg text-muted-foreground", className)}
      {...props}
    />
  );
}

export { Hero, HeroImage, HeroContent, HeroTitle, HeroDescription };
