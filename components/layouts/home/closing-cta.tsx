import Link from "next/link";

export function ClosingCTA() {
  return (
    <section className="bg-primary py-32">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-10 text-center">
        <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-primary-foreground/70">
          // let's build
        </span>
        <h2 className="mb-6 font-display text-5xl font-bold tracking-tight text-primary-foreground md:text-6xl lg:text-7xl">
          Got an idea?
          <br />
          Let's prove it.
        </h2>
        <p className="mx-auto mb-10 max-w-md text-lg text-primary-foreground/75">
          We'll scope your project in a free 30-minute call. No pitch decks, no
          BS.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 rounded-full bg-foreground px-8 py-4 text-base font-bold text-background transition-opacity hover:opacity-90"
        >
          Start a project →
        </Link>
      </div>
    </section>
  );
}
