"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowUp, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { HslTuple, TimeKey, Theme } from "@/lib/type/cta.type";
import { TIME_THEMES } from "@/lib/const/cta.const";
import { useSunburstCanvas } from "@/hooks/useSubBrustCanvas.hook";

// ─── Theme definitions ────────────────────────────────────────────────────────

// ─── Colour helpers ───────────────────────────────────────────────────────────

// ─── Animated sunburst canvas ─────────────────────────────────────────────────

// ─── Sub-components ───────────────────────────────────────────────────────────

function TimeDropdown({
  selected,
  onChange,
}: {
  selected: TimeKey;
  onChange: (key: TimeKey) => void;
}) {
  const [open, setOpen] = useState(false);
  const theme = TIME_THEMES[selected];

  return (
    <div className="absolute top-4 right-4 z-20">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium backdrop-blur-md transition-colors duration-700"
        style={{
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
          color: theme.textColor,
        }}
      >
        <Sun size={13} />
        {theme.label}
      </button>

      {open && (
        <div
          className="absolute top-10 right-0 rounded-xl overflow-hidden backdrop-blur-xl shadow-xl"
          style={{
            background: "rgba(255,255,255,0.18)",
            border: "1px solid rgba(255,255,255,0.3)",
            minWidth: "136px",
          }}
        >
          {(Object.keys(TIME_THEMES) as TimeKey[]).map((key) => (
            <button
              key={key}
              onClick={() => {
                onChange(key);
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-xs transition-colors duration-150 flex items-center gap-2"
              style={{
                color: theme.textColor,
                background:
                  selected === key ? "rgba(255,255,255,0.22)" : "transparent",
                fontWeight: selected === key ? 500 : 400,
              }}
            >
              {TIME_THEMES[key].label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CtaHeadingLine({
  text,
  progress,
  textColor,
  textGhost,
}: {
  text: string;
  progress: MotionValue<number>;
  textColor: string;
  textGhost: string;
}) {
  const backgroundImage = useTransform(
    progress,
    (p) => `linear-gradient(to right, ${textColor} ${p}%, ${textGhost} ${p}%)`,
  );

  return (
    <motion.h2
      className="text-5xl sm:text-6xl lg:text-8xl font-bold font-mono leading-tight"
      style={{
        backgroundImage,
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        color: "transparent",
      }}
    >
      {text}
    </motion.h2>
  );
}

function CtaButton({
  theme,
  opacity,
  y,
  filter,
}: {
  theme: Theme;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  filter: MotionValue<string>;
}) {
  return (
    <motion.div className="mb-8" style={{ opacity, y, filter }}>
      <Button
        size="lg"
        className="group"
        style={{
          background: theme.btnBg,
          color: theme.btnText,
          border: "none",
        }}
      >
        Let's Talk
        <ArrowUp className="ml-1 inline-block transform transition-transform duration-200 group-hover:rotate-45 size-4" />
      </Button>
    </motion.div>
  );
}

function CtaSupportText({
  theme,
  opacity,
  y,
}: {
  theme: Theme;
  opacity: MotionValue<number>;
  y: MotionValue<number>;
}) {
  return (
    <motion.p
      className="max-w-2xl mx-auto text-sm sm:text-base lg:text-lg px-4 transition-colors duration-700"
      style={{ opacity, y, color: theme.subtextColor }}
    >
      Contact us today to discuss your project and see how we can help bring
      your ideas to life.
    </motion.p>
  );
}

// ─── Main CTA ─────────────────────────────────────────────────────────────────

function Cta() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [themeKey, setThemeKey] = useState<TimeKey>("sunrise");
  const prevThemeKey = useRef<TimeKey>("sunrise");
  const theme = TIME_THEMES[themeKey];

  useSunburstCanvas(
    canvasRef,
    sectionRef as React.RefObject<HTMLElement>,
    themeKey,
    prevThemeKey,
  );

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const line1Progress = useTransform(scrollYProgress, [0, 0.55], [0, 100]);
  const line2Progress = useTransform(scrollYProgress, [0.45, 1], [0, 100]);

  const buttonOpacity = useTransform(scrollYProgress, [0.85, 1], [0, 1]);
  const buttonY = useTransform(scrollYProgress, [0.85, 1], [24, 0]);
  const buttonBlur = useTransform(
    scrollYProgress,
    [0.85, 1],
    ["blur(6px)", "blur(0px)"],
  );

  const subtextOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const subtextY = useTransform(scrollYProgress, [0.9, 1], [16, 0]);

  const lines = [
    { text: "Have a project", progress: line1Progress },
    { text: "in mind?", progress: line2Progress },
  ];

  return (
    <section ref={sectionRef} className="py-32 px-4">
      <div className="relative px-6 sm:px-16 lg:px-36 py-16 sm:py-24 lg:py-36 rounded-2xl flex items-center flex-col max-w-6xl mx-auto text-center overflow-hidden">
        {/* Animated canvas — background + rays */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full rounded-2xl pointer-events-none z-0"
        />

        {/* Frosted glass overlay */}
        <div className="absolute inset-0 bg-white/[0.06] rounded-2xl pointer-events-none z-[1]" />

        {/* Time-of-day picker */}
        <TimeDropdown selected={themeKey} onChange={setThemeKey} />

        <div className="relative z-10 flex flex-col items-center w-full">
          <div className="mb-6 flex flex-col items-center w-full">
            {lines.map(({ text, progress }) => (
              <CtaHeadingLine
                key={text}
                text={text}
                progress={progress}
                textColor={theme.textColor}
                textGhost={theme.textGhost}
              />
            ))}
          </div>

          <CtaButton
            theme={theme}
            opacity={buttonOpacity}
            y={buttonY}
            filter={buttonBlur}
          />

          <CtaSupportText theme={theme} opacity={subtextOpacity} y={subtextY} />
        </div>
      </div>
    </section>
  );
}

export { Cta };
