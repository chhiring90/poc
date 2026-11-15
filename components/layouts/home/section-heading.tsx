import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Shared header for home sections: CMS label, heading, optional action, ruled underneath. */
export function SectionHeading({
  label,
  title,
  description,
  action,
  className,
  tone = "default",
}: {
  label?: string | null;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  tone?: "default" | "inverse";
}) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-b-2 pb-8",
        tone === "inverse" ? "border-primary-foreground/30" : "border-border",
        className,
      )}
    >
      <div className="max-w-3xl">
        {label && (
          <p
            className={cn(
              "mb-4 font-mono text-sm font-medium",
              tone === "inverse" ? "text-primary-foreground/75" : "text-primary",
            )}
          >
            {label}
          </p>
        )}
        <h2 className="text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
          {title}
        </h2>
        {description && (
          <div
            className={cn(
              "mt-5 max-w-[56ch] text-lg leading-relaxed",
              tone === "inverse"
                ? "text-primary-foreground/80"
                : "text-muted-foreground",
            )}
          >
            {description}
          </div>
        )}
      </div>
      {action}
    </div>
  );
}

export function SectionLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 border-b-2 border-primary pb-1 text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
    >
      {children}
    </Link>
  );
}
