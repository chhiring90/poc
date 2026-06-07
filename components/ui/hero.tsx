import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { Button } from "./button";
import { HeroMedia } from "./hero-media";

const heroVariants = cva(
  "group/hero relative w-full overflow-hidden bg-card rounded-b-[2rem]",
  {
    variants: {
      size: {
        default: "min-h-[80.5vh]",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const contentVariants = cva(
  "relative z-10 mx-auto flex h-full min-h-[80.5vh] w-full max-w-7xl flex-col justify-center p-6 sm:p-8 lg:px-12 lg:py-14",
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
  imageSrc = "/hero.mp4",
  imageAlt = "Hero background video",
  overlayClassName,
  children,
  ...props
}: HeroProps) {
  return (
    <section className={cn(heroVariants({ size }), className)} {...props}>
      <HeroMedia src={imageSrc} aria-label={imageAlt} poster="/hero-bg.webp" />
      <div
        className={cn(
          "absolute inset-0 bg-black/20 backdrop-blur-xs",
          overlayClassName,
        )}
      />
      <HeroContent align={align}>{children}</HeroContent>
    </section>
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
      <Button size="lg" className="group bg-primary text-primary-foreground">
        Get Started
        <ArrowUp className="ml-1 inline-block transform transition-transform duration-200 group-hover:rotate-45 size-4" />
      </Button>

      <Button variant="ghost" size="lg" className="group text-white">
        Learn More
        <ArrowUp className="ml-1 inline-block transform transition-transform duration-200 group-hover:rotate-45 size-4" />
      </Button>
    </div>
  );
}

export { Hero, HeroContent, HeroDescription, HeroCta };
export { HeroTitle, HeroHighlight } from "@/components/ui/hero-title";
