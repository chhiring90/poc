import { cn } from "@/lib/utils";

type LogoProps = {
  /** Smaller wordmark, for tight spaces such as the footer. */
  compact?: boolean;
  className?: string;
};

/** Text wordmark "[POC]", used when no logo image is uploaded in the CMS. */
export function Logo({ compact = false, className }: LogoProps) {
  return (
    <span
      role="img"
      aria-label="Proof Of Concept"
      className={cn(
        "inline-flex items-center font-display font-bold leading-none tracking-tight text-foreground",
        compact ? "gap-0.5 text-2xl" : "gap-1 text-[1.75rem] lg:text-[2rem]",
        className,
      )}
    >
      <span aria-hidden="true" className="font-mono font-normal text-primary">
        [
      </span>
      <span aria-hidden="true">POC</span>
      <span aria-hidden="true" className="font-mono font-normal text-primary">
        ]
      </span>
    </span>
  );
}
