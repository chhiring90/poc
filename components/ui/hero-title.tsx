import { Fragment, type ComponentPropsWithoutRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const heroTitleVariants = cva(
  "font-bold tracking-tight leading-none text-gray-600 js-cross-browser gooey-content",
  {
    variants: {
      size: {
        default:
          "text-2xl sm:text-4xl md:text-5xl xl:text-6xl 2xl:text-7xl 4xl:text-8xl",
        sm: "text-xl sm:text-3xl md:text-4xl xl:text-5xl 2xl:text-6xl 4xl:text-7xl",
        lg: "text-3xl sm:text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl 4xl:text-9xl",
        xxl: "text-5xl sm:text-6xl md:text-7xl xl:text-8xl 2xl:text-9xl 4xl:text-[10rem]",
        custom:
          "text-4xl sm:text-5xl md:text-6xl xl:text-7xl 2xl:text-8xl 4xl:text-9xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

type HeroTitleLine = string | { text: string; className?: string };

type HeroTitleProps = ComponentPropsWithoutRef<"h1"> &
  VariantProps<typeof heroTitleVariants> & {
    lines?: HeroTitleLine[];
    highlightClassName?: string;
  };

function HeroTitle({
  className,
  size = "default",
  lines,
  highlightClassName,
  children,
  ...props
}: HeroTitleProps) {
  if (lines?.length) {
    return (
      <h1 className={cn(heroTitleVariants({ size }), className)} {...props}>
        {children}
        {lines.map((line, index) => {
          const text = typeof line === "string" ? line : line.text;
          const lineClassName =
            typeof line === "string" ? undefined : line.className;

          return (
            <Fragment key={`${text}-${index}`}>
              <HeroHighlight className={cn(highlightClassName, lineClassName)}>
                {text}
              </HeroHighlight>
              {index < lines.length - 1 && <br />}
            </Fragment>
          );
        })}
      </h1>
    );
  }

  return (
    <h1 className={cn(heroTitleVariants({ size }), className)} {...props}>
      {children}
    </h1>
  );
}

function HeroHighlight({
  className,
  ...props
}: ComponentPropsWithoutRef<"span">) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 truncate rounded-md bg-foreground px-2 pt-2 pb-3 text-background js-cross-browser lg:px-4 lg:pt-3 lg:pb-4",
        className,
      )}
      {...props}
    />
  );
}

export { HeroTitle, HeroHighlight, heroTitleVariants };
