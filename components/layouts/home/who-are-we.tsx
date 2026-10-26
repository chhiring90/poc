import { StatCounter } from "@/components/ui/counter";

type Stat = {
  id: number;
  label: string;
  value: number;
  suffix?: string;
};

type WhoAreWeProps = {
  subTitle: string;
  title: string;
  description: string;
  stats?: Stat[];
};

export function WhoAreWe({
  subTitle,
  title,
  description,
  stats = [],
}: WhoAreWeProps) {
  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-10 py-28">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block">
            {subTitle}
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
            {title}
          </h2>
          <p className={`text-lg text-muted-foreground leading-relaxed mb-6`}>
            {description}
          </p>
          <p className={`text-lg text-muted-foreground leading-relaxed`}>
            From a quick proof-of-concept sprint to a full-scale product, we
            move fast without cutting corners.
          </p>
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
