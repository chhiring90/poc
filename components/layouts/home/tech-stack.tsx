import { iTechStack } from "@/components/layouts/home/stack-carousel";

export function TechStack({ techStack }: { techStack: iTechStack[] }) {
  return (
    <section className="max-w-[1280px] mx-auto px-5 lg:px-10 py-28">
      <span
        className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
      >
        // tech stack
      </span>
      <h2 className="font-display text-4xl font-bold tracking-tight mb-10">
        Tools we trust
      </h2>
      <div className="flex flex-wrap gap-3">
        {techStack.map((t) => (
          <span
            key={t.id}
            className="cursor-default rounded-none border border-border px-4 py-2 font-mono text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {t.name}
          </span>
        ))}
      </div>
    </section>
  );
}
