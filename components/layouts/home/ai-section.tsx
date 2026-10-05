export function AISection() {
  return (
    <section className="bg-muted/40 py-20">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-10 text-center">
        <span
          className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4 block`}
        >
          // third-party validation
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">
          See what AI says about us
        </h2>
        <p className={`text-muted-foreground text-lg mb-10 max-w-lg mx-auto`}>
          Don't just take our word for it. Ask the robots.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { label: "Ask ChatGPT", color: "#10A37F" },
            { label: "Ask Claude", color: "#C8733E" },
            { label: "Ask Gemini", color: "#4285F4" },
            { label: "Ask Grok", color: "#F6F5F0" },
          ].map((ai) => (
            <button
              key={ai.label}
              className={`px-5 py-2.5 rounded-full font-semibold text-sm border transition-all hover:scale-105`}
              style={{ borderColor: ai.color + "40", color: ai.color }}
            >
              {ai.label} →
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
