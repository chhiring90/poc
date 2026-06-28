"use client";
import { useRef, useMemo, useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import {
  Code2,
  Database,
  Boxes,
  ShoppingBag,
  CloudCog,
  Sparkles,
  Webhook,
  Headphones,
  ShieldCheck,
  Palette,
} from "lucide-react";

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

type ScatterItem = { x: number; y: number; r: number; s: number };

function makeScatter(n: number): ScatterItem[] {
  return Array.from({ length: n }, () => ({
    x: rand(-120, 120),
    y: rand(-100, 100),
    r: rand(-20, 20),
    s: rand(0.6, 0.82),
  }));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function AnimatedCard({
  children,
  className,
  style,
  sc,
  enterProgress,
  exitProgress,
}: {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  sc: ScatterItem;
  enterProgress: ReturnType<typeof useSpring>;
  exitProgress: ReturnType<typeof useSpring>;
}) {
  const [s, setS] = useState({
    x: sc.x,
    y: sc.y,
    rotate: sc.r,
  });

  useEffect(() => {
    function update() {
      const enter = Math.max(0, Math.min(1, enterProgress.get()));
      const exit = Math.max(0, Math.min(1, exitProgress.get()));

      const ax = lerp(sc.x, 0, enter);
      const ay = lerp(sc.y, 0, enter);
      const ar = lerp(sc.r, 0, enter);

      setS({
        x: lerp(ax, -sc.x, exit),
        y: lerp(ay, -sc.y, exit),
        rotate: lerp(ar, -sc.r, exit),
      });
    }

    const u1 = enterProgress.on("change", update);
    const u2 = exitProgress.on("change", update);
    return () => {
      u1();
      u2();
    };
  }, [enterProgress, exitProgress, sc]);

  return (
    <motion.div className={className} style={{ ...style, ...s }}>
      {children}
    </motion.div>
  );
}

/**
 * Each service carries its own visual signature — pattern, accent color,
 * and icon — so the grid reads as ten distinct disciplines, not one
 * template repeated ten times.
 */
const SERVICES = [
  {
    title: "MERN Stack Development",
    description:
      "MongoDB, Express, React, and Node — full-stack apps built and shipped end to end.",
    icon: Code2,
    accent: "#5EEAD4", // teal
    pattern: "code",
  },
  {
    title: "PostgreSQL Engineering",
    description:
      "Schema design, query tuning, and replication for data that scales without surprises.",
    icon: Database,
    accent: "#60A5FA", // blue
    pattern: "rows",
  },
  {
    title: "Kubernetes & DevOps",
    description:
      "Containerized deployments, CI/CD pipelines, and auto-scaling clusters.",
    icon: Boxes,
    accent: "#A78BFA", // violet
    pattern: "grid",
  },
  {
    title: "Shopify Development",
    description:
      "Custom themes, headless storefronts, and app integrations for fast-converting stores.",
    icon: ShoppingBag,
    accent: "#34D399", // green
    pattern: "dots",
  },
  {
    title: "Cloud Infrastructure",
    description:
      "AWS, GCP, and Azure architecture — provisioned, secured, and cost-optimized.",
    icon: CloudCog,
    accent: "#38BDF8", // sky
    pattern: "cloud",
  },
  {
    title: "NextGen Websites",
    description:
      "Next.js-powered sites with AI-assisted content, edge rendering, and sub-second loads.",
    icon: Sparkles,
    accent: "#FBBF24", // amber
    pattern: "spark",
  },
  {
    title: "Custom Software & APIs",
    description:
      "Bespoke platforms and integrations built around how your business actually runs.",
    icon: Webhook,
    accent: "#F472B6", // pink
    pattern: "nodes",
  },
  {
    title: "24/7/365 Support",
    description:
      "Always-on monitoring and a team that answers before it becomes a fire.",
    icon: Headphones,
    accent: "#FB923C", // orange
    pattern: "wave",
  },
  {
    title: "99.99% Uptime SLA",
    description:
      "Redundant infrastructure and failover built in, so your platform stays live.",
    icon: ShieldCheck,
    accent: "#4ADE80", // emerald
    pattern: "shield",
  },
  {
    title: "Brand & UI/UX Design",
    description:
      "Interfaces and identity systems designed to be used, not just looked at.",
    icon: Palette,
    accent: "#C084FC", // purple
    pattern: "swatch",
  },
];

/** Decorative background pattern unique to each card, drawn in the card's accent color. */
function CardPattern({ pattern, accent }: { pattern: string; accent: string }) {
  const common = { position: "absolute" as const, inset: 0, opacity: 0.5 };

  switch (pattern) {
    case "code":
      return (
        <svg
          style={common}
          viewBox="0 0 200 160"
          preserveAspectRatio="xMaxYMin slice"
        >
          <text
            x="118"
            y="20"
            fill={accent}
            fontSize="11"
            fontFamily="monospace"
            opacity="0.55"
          >
            {"const app ="}
          </text>
          <text
            x="128"
            y="34"
            fill={accent}
            fontSize="11"
            fontFamily="monospace"
            opacity="0.4"
          >
            {"express()"}
          </text>
          <text
            x="118"
            y="48"
            fill={accent}
            fontSize="11"
            fontFamily="monospace"
            opacity="0.3"
          >
            {"</>"}
          </text>
        </svg>
      );
    case "rows":
      return (
        <svg
          style={common}
          viewBox="0 0 200 160"
          preserveAspectRatio="xMaxYMin slice"
        >
          {[18, 34, 50, 66].map((y, i) => (
            <rect
              key={y}
              x="120"
              y={y}
              width={60 - i * 10}
              height="8"
              rx="2"
              fill={accent}
              opacity={0.45 - i * 0.08}
            />
          ))}
        </svg>
      );
    case "grid":
      return (
        <svg
          style={common}
          viewBox="0 0 200 160"
          preserveAspectRatio="xMaxYMin slice"
        >
          {[0, 1, 2].map((row) =>
            [0, 1, 2].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={120 + col * 22}
                y={10 + row * 22}
                width="16"
                height="16"
                rx="4"
                fill="none"
                stroke={accent}
                strokeWidth="1.5"
                opacity={0.5 - (row + col) * 0.07}
              />
            )),
          )}
        </svg>
      );
    case "dots":
      return (
        <svg
          style={common}
          viewBox="0 0 200 160"
          preserveAspectRatio="xMaxYMin slice"
        >
          {Array.from({ length: 18 }).map((_, i) => (
            <circle
              key={i}
              cx={120 + (i % 6) * 14}
              cy={14 + Math.floor(i / 6) * 14}
              r="2.5"
              fill={accent}
              opacity={0.5 - Math.floor(i / 6) * 0.12}
            />
          ))}
        </svg>
      );
    case "cloud":
      return (
        <svg
          style={common}
          viewBox="0 0 200 160"
          preserveAspectRatio="xMaxYMin slice"
        >
          <ellipse
            cx="150"
            cy="36"
            rx="34"
            ry="16"
            fill={accent}
            opacity="0.18"
          />
          <ellipse
            cx="170"
            cy="28"
            rx="20"
            ry="11"
            fill={accent}
            opacity="0.25"
          />
          <ellipse
            cx="132"
            cy="26"
            rx="18"
            ry="10"
            fill={accent}
            opacity="0.22"
          />
        </svg>
      );
    case "spark":
      return (
        <svg
          style={common}
          viewBox="0 0 200 160"
          preserveAspectRatio="xMaxYMin slice"
        >
          <path
            d="M150 10 L154 22 L166 26 L154 30 L150 42 L146 30 L134 26 L146 22 Z"
            fill={accent}
            opacity="0.5"
          />
          <path
            d="M175 40 L177 46 L183 48 L177 50 L175 56 L173 50 L167 48 L173 46 Z"
            fill={accent}
            opacity="0.4"
          />
        </svg>
      );
    case "nodes":
      return (
        <svg
          style={common}
          viewBox="0 0 200 160"
          preserveAspectRatio="xMaxYMin slice"
        >
          <line
            x1="125"
            y1="20"
            x2="150"
            y2="38"
            stroke={accent}
            strokeWidth="1.5"
            opacity="0.4"
          />
          <line
            x1="150"
            y1="38"
            x2="178"
            y2="22"
            stroke={accent}
            strokeWidth="1.5"
            opacity="0.4"
          />
          <line
            x1="150"
            y1="38"
            x2="160"
            y2="58"
            stroke={accent}
            strokeWidth="1.5"
            opacity="0.4"
          />
          <circle cx="125" cy="20" r="4" fill={accent} opacity="0.6" />
          <circle cx="150" cy="38" r="5" fill={accent} opacity="0.7" />
          <circle cx="178" cy="22" r="4" fill={accent} opacity="0.6" />
          <circle cx="160" cy="58" r="4" fill={accent} opacity="0.5" />
        </svg>
      );
    case "wave":
      return (
        <svg
          style={common}
          viewBox="0 0 200 160"
          preserveAspectRatio="xMaxYMin slice"
        >
          <path
            d="M115 30 Q130 10 145 30 T175 30"
            stroke={accent}
            strokeWidth="2"
            fill="none"
            opacity="0.45"
          />
          <path
            d="M115 44 Q130 24 145 44 T175 44"
            stroke={accent}
            strokeWidth="2"
            fill="none"
            opacity="0.3"
          />
        </svg>
      );
    case "shield":
      return (
        <svg
          style={common}
          viewBox="0 0 200 160"
          preserveAspectRatio="xMaxYMin slice"
        >
          <path
            d="M155 8 L172 14 V30 C172 42 165 50 155 54 C145 50 138 42 138 30 V14 Z"
            fill={accent}
            opacity="0.18"
            stroke={accent}
            strokeWidth="1.5"
          />
          <path
            d="M148 30 L153 35 L163 23"
            stroke={accent}
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
        </svg>
      );
    case "swatch":
      return (
        <svg
          style={common}
          viewBox="0 0 200 160"
          preserveAspectRatio="xMaxYMin slice"
        >
          <circle cx="130" cy="26" r="11" fill={accent} opacity="0.5" />
          <circle cx="152" cy="20" r="9" fill={accent} opacity="0.35" />
          <circle cx="170" cy="34" r="7" fill={accent} opacity="0.25" />
        </svg>
      );
    default:
      return null;
  }
}

export default function BentoGrid() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scatter = useMemo(() => makeScatter(10), []);

  const { scrollYProgress: enterRaw } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const { scrollYProgress: exitRaw } = useScroll({
    target: sectionRef,
    offset: ["center center", "end start"],
  });

  const enterProgress = useSpring(enterRaw, {
    stiffness: 80,
    damping: 22,
    mass: 0.5,
  });
  const exitProgress = useSpring(exitRaw, {
    stiffness: 80,
    damping: 22,
    mass: 0.5,
  });

  const base =
    "rounded-2xl bg-white/10 backdrop-blur-md border border-white/20";

  const C = ({
    idx,
    children,
    className,
    style,
  }: {
    idx: number;
    children?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
  }) => (
    <AnimatedCard
      sc={scatter[idx] ?? scatter[0]}
      enterProgress={enterProgress}
      exitProgress={exitProgress}
      className={className ?? base}
      style={style}
    >
      {children}
    </AnimatedCard>
  );

  return (
    <div
      ref={sectionRef}
      className="flex min-h-160 items-center justify-center"
    >
      <div
        className="grid w-full gap-3"
        style={{
          gridTemplateColumns: "1fr 1fr 1.8fr 1.2fr",
          gridTemplateRows: "160px 280px 180px",
        }}
      >
        {SERVICES.map((service, index) => {
          const isTall = index === 3;
          const isWide = index === 5;
          const Icon = service.icon;

          return (
            <C
              key={service.title}
              idx={index}
              className={`${base} group relative overflow-hidden p-5 transition-colors duration-300 ${
                isTall ? "row-span-2" : ""
              } ${isWide ? "col-span-2" : ""}`}
              style={{
                boxShadow: `inset 0 1px 0 0 rgba(255,255,255,0.08)`,
              }}
            >
              {/* base wash, tinted per-card */}
              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${service.accent}1f, transparent 60%)`,
                }}
              />
              {/* unique decorative pattern */}
              <CardPattern pattern={service.pattern} accent={service.accent} />
              {/* hover glow */}
              <div
                className="absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60"
                style={{ background: service.accent }}
              />

              <div className="relative z-10 flex h-full flex-col justify-between">
                {/* <div
                  className="flex h-10 w-10 items-center justify-center rounded-xl border"
                  style={{
                    backgroundColor: `${service.accent}26`,
                    borderColor: `${service.accent}55`,
                  }}
                >
                  <Icon
                    className="h-5 w-5"
                    style={{ color: service.accent }}
                    strokeWidth={2}
                  /> 
                </div> */}

                <h3 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                  {service.title}
                </h3>
                <p className="mt-1.5 max-w-xs text-sm text-white/70">
                  {service.description}
                </p>
              </div>
            </C>
          );
        })}
      </div>
    </div>
  );
}

/**
 * 1. MERN Stack Development
 * 2. PostgreSQL Engineering
 * 3. Kubernetes & DevOps
 * 4. Shopify Development
 * 5. Cloud Infrastructure
 * 6. NextGen Websites
 * 7. Custom Software & APIs
 * 8. 24/7/365 Support
 * 9. 99.99% Uptime SLA
 * 10. Brand & UI/UX Design
 */

export function OurWork() {
  return (
    <section className="bg-linear-to-b from-primary via-sidebar-primary to-sky-500 px-4 py-16 text-left sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-white/70">
            What We Do
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Full-service digital support for every stage of growth.
          </h2>
        </div>
        <BentoGrid />
      </div>
    </section>
  );
}
