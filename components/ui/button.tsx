import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Slot } from "radix-ui";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-medium transition-[background-color,border-color,box-shadow,color,transform] duration-150 focus-visible:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-[length:var(--border-width-default)] border-foreground bg-primary text-primary-foreground shadow-[var(--shadow-control)] hover:bg-primary/90 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        secondary:
          "border-[length:var(--border-width-default)] border-foreground bg-secondary text-secondary-foreground shadow-[var(--shadow-control)] hover:bg-secondary/80 active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        outline:
          "border-[length:var(--border-width-default)] border-border bg-background shadow-[var(--shadow-control)] hover:bg-accent hover:text-accent-foreground active:translate-x-[3px] active:translate-y-[3px] active:shadow-none",
        ghost:
          "border-[length:var(--border-width-default)] border-transparent hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-none px-3",
        lg: "h-10 rounded-none px-6",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

function Button({
  asChild = false,
  className,
  variant,
  size,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
