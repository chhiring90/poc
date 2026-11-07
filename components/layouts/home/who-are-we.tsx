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
    <section className="max-w-7xl mx-auto px-5 lg:px-10 py-28">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block">
            {subTitle}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
            {title}
          </h2>
          <RichText
            data={desc}
            className="mb-6 text-lg leading-relaxed text-muted-foreground [&_p]:mb-4 [&_p:last-child]:mb-0"
          />
        </div>
        <div className="grid grid-cols-3 gap-6">
          {stats.map((stat) => (
            <StatCounter
              key={stat.id}
              end={stat.value}
              suffix={stat.suffix}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
