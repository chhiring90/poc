// const process = [
//   {
//     step: "01",
//     name: "Discover",
//     desc: "We dig into your problem, users and constraints.",
//   },
//   {
//     step: "02",
//     name: "Prototype",
//     desc: "We build the POC — the riskiest part, fast.",
//   },
//   {
//     step: "03",
//     name: "Build",
//     desc: "Engineering at pace on a stable foundation.",
//   },
//   {
//     step: "04",
//     name: "Launch",
//     desc: "Ship with confidence, not crossed fingers.",
//   },
//   {
//     step: "05",
//     name: "Scale",
//     desc: "Grow the product as the audience grows.",
//   },
// ];

export function Process({
  process,
}: {
  process: { step: string; title: string; description: string }[];
}) {
  return (
    <section className="bg-muted/40 py-28">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-10">
        <span
          className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
        >
          // how we work
        </span>
        <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-14">
          From idea to live product
        </h2>

        <div className="relative">
          {/* Connector line */}
          <div className="absolute left-8 right-8 top-8 hidden h-px bg-border lg:block" />
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {process.map((p, i) => (
              <div key={p.step} className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full border-2 border-primary flex items-center justify-center relative z-10 bg-inherit">
                    <span className="font-mono text-[10px] font-bold text-primary">
                      {p.step}
                    </span>
                  </div>
                  {i < process.length - 1 && (
                    <div className="flex-1 h-px bg-primary/20 lg:hidden" />
                  )}
                </div>
                <h3
                  className={`font-display text-lg font-bold text-foreground mb-2`}
                >
                  {p.title}
                </h3>
                <p className={`text-sm text-muted-foreground leading-relaxed`}>
                  {p.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
