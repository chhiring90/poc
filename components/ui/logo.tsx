import { cn } from "@/lib/utils";

type LogoProps = {
  compact?: boolean;
  className?: string;
};

export function Logo({ compact = false, className }: LogoProps) {
  return (
    <div className="grid aspect-square w-[clamp(45px,25vw,15px)] flex-none place-items-center rounded-full bg-primary">
      <div
        className={cn(
          "flex items-center font-normal bg-primary",
          compact
            ? "gap-[2px] text-[12px] tracking-[-0.08em]"
            : "gap-4 text-[clamp(50px,6.5vw,100px)]",
          className,
        )}
        aria-label="Proof Of Concept"
      >
        <span
          className={cn(
            "font-normal text-brand font-mono",
            compact ? "text-[14px]" : "",
          )}
        >
          [
        </span>

        <i className="not-italic font-bold tracking-[-0.08em]">POC</i>

        <span
          className={cn(
            "font-normal text-brand font-mono",
            compact ? "text-[14px]" : "",
          )}
        >
          ]
        </span>
      </div>
    </div>
  );
}
