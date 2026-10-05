export function Testimonial() {
  return (
    <section className="bg-card py-28">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-primary font-mono text-4xl mb-8">"</div>
          <blockquote className="mb-10 font-display text-2xl font-medium leading-tight text-foreground md:text-3xl">
            POC took our vague idea and turned it into a product our users
            actually loved — in six weeks. The proof-of-concept sprint removed
            every board-level objection we had.
          </blockquote>
          <div className="flex items-center justify-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&auto=format"
              alt="Marcus Chen"
              className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
            />
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">
                Marcus Chen
              </p>
              <p className="font-mono text-sm text-muted-foreground">
                CTO, Carto AI
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
