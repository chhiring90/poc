import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "../ui/button";

const heroVariants = cva("group/hero relative w-full overflow-hidden bg-card", {
  variants: {
    size: {
      default: "min-h-[90.5vh]",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

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

function HeroCta({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("flex flex-wrap items-center gap-4", className)}
      {...props}
    >
      <Button size="lg">Get Started</Button>
      <Button variant="outline" size="lg">
        Learn More
      </Button>
    </div>
  );
}

export { Hero, HeroImage, HeroContent, HeroDescription, HeroCta };
export { HeroTitle, HeroHighlight } from "@/components/ui/hero-title";
