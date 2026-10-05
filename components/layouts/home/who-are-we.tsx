import { StatCounter } from "@/components/ui/counter";

export function WhoAreWe() {
  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-10 py-28">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div>
          <span
            className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
          >
            // about us
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight tracking-tight mb-6">
            We're the team you call when the idea needs to{" "}
            <span className="text-primary">actually ship</span>.
          </h2>
          <p className={`text-lg text-muted-foreground leading-relaxed mb-6`}>
            POC was founded with one belief: great software starts with a
            working prototype, not a 200-slide deck. We design and build web and
            mobile products that founders, CTOs and product teams are proud to
            put in front of real users.
          </p>
          <p className={`text-lg text-muted-foreground leading-relaxed`}>
            From a quick proof-of-concept sprint to a full-scale product, we
            move fast without cutting corners.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <StatCounter end={120} suffix="+" label="Products shipped" />
          <StatCounter end={6} suffix="wk" label="Average MVP" />
          <StatCounter end={98} suffix="%" label="Client retention" />
        </div>
      </div>
    </section>
  );
}
