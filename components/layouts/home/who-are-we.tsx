import type { CSSProperties } from "react";
import { StatCounter } from "@/components/ui/counter";
import { RichText } from "@payloadcms/richtext-lexical/react";
import type { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";

type Stat = {
  id: number;
  label: string;
  value: number;
  suffix?: string;
};

type WhoAreWeProps = {
  subTitle: string;
  title: string;
  desc: DefaultTypedEditorState;
  stats?: Stat[];
};

export function WhoAreWe({ subTitle, title, desc, stats = [] }: WhoAreWeProps) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-10 lg:py-32">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          {subTitle && (
            <p className="mb-5 font-mono text-sm font-medium text-primary">
              {subTitle}
            </p>
          )}
          <h2 className="max-w-[16ch] text-balance font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
            {title}
          </h2>
        </div>
        <RichText
          data={desc}
          className="self-end text-lg leading-relaxed text-muted-foreground lg:pb-2 [&_p:last-child]:mb-0 [&_p]:mb-4"
        />
      </div>

      {stats.length > 0 && (
        <div
          className="mt-16 grid border-2 border-border bg-card shadow-[var(--shadow-card)] sm:grid-cols-[repeat(var(--stat-count),minmax(0,1fr))]"
          style={{ "--stat-count": stats.length } as CSSProperties}
        >
          {stats.map((stat) => (
            <div
              key={stat.id}
              className="border-border px-7 py-8 not-last:border-b-2 sm:not-last:border-b-0 sm:not-last:border-r-2"
            >
              <StatCounter
                end={stat.value}
                suffix={stat.suffix}
                label={stat.label}
                align="left"
                labelClassName="mt-3 font-mono text-sm text-muted-foreground"
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
