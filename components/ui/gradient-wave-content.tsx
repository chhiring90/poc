export type GradientWaveContentProps = {
  /** Small mono label, top-left. Use "\n" for a line break. */
  eyebrow?: string;
  /** Status pill text, top-right. Pass an empty string to hide the pill. */
  badge?: string;
  /** Headline, first line (white). */
  headline?: string;
  /** Headline, second line (accent color). */
  headlineAccent?: string;
  /** Coordinates / meta text, bottom-right. Use "\n" for a line break. */
  meta?: string;
  /** Accent color used for the second headline line and the status dot. */
  accentColor?: string;
};

export function GradientWaveContent({
  eyebrow = "INTERFACE\nPOC-26.04",
  badge = "PROTOTYPE",
  headline = "Proof of",
  headlineAccent = "Concept.",
  meta = "40.7128° N\n74.0060° W",
  accentColor = "#ff7a2f",
}: GradientWaveContentProps) {
  return (
    <>
      {/* Bottom scrim so the headline stays legible on bright areas */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#2b1233]/70 via-[#2b1233]/20 to-transparent"
      />

      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 sm:p-10 lg:p-14">
        {/* Top row */}
        <div className="flex items-start justify-between gap-4">
          <p className="whitespace-pre-line font-mono text-[10px] uppercase leading-relaxed tracking-[0.3em] text-white/70 sm:text-xs lg:text-sm">
            {eyebrow}
          </p>

          {badge && (
            <div className="flex shrink-0 items-center gap-2.5 rounded-full border border-white/25 bg-black/20 px-4 py-2 backdrop-blur-md">
              <span
                className="h-2 w-2 animate-pulse rounded-full"
                style={{
                  backgroundColor: accentColor,
                  boxShadow: `0 0 10px ${accentColor}`,
                }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white sm:text-xs">
                {badge}
              </span>
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-3xl font-medium leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-5xl">
            {headline}
            <br />
            <span style={{ color: accentColor }}>{headlineAccent}</span>
          </h2>

          <p className="hidden whitespace-pre-line text-right font-mono text-xs leading-relaxed tracking-wider text-white/55 sm:block lg:text-sm">
            {meta}
          </p>
        </div>
      </div>
    </>
  );
}
