export function ServiceWhy({ text }: { text?: string | null }) {
  if (!text) return null;

  return (
    <section className="border-b-2 border-border bg-muted">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.2fr)] lg:gap-16 lg:px-10">
        <h2 className="font-display text-3xl font-bold">Why you need it</h2>
        <p className="max-w-[58ch] text-xl leading-relaxed text-foreground md:text-2xl md:leading-relaxed">
          {text}
        </p>
      </div>
    </section>
  );
}
