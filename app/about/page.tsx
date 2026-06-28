"use client";

import { HeroWaveGradient } from "@/components/layouts/hero-wave-gradient";
import { motion } from "motion/react";

const VALUES = [
  {
    name: "Creativity",
    img: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Innovation",
    img: "https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Curiosity",
    img: "https://images.unsplash.com/photo-1748575232390-c5281ab02b09?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Excellence",
    img: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=600&auto=format&fit=crop",
  },
  {
    name: "Integrity",
    img: "https://images.unsplash.com/photo-1764875471705-ad8aa64102a6?q=80&w=1287&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function About() {
  return (
    <main className="bg-[#F4F1EA] text-[#1C1B19]">
      <section className="relative overflow-hidden px-6 pt-6 lg:px-12">
        {/* decorative concentric rings */}
        <div className="pointer-events-none absolute -left-32 -top-16 h-[420px] w-[420px] opacity-60">
          {[420, 320, 220].map((size) => (
            <span
              key={size}
              className="absolute rounded-full border border-[#1C1B19]/10"
              style={{
                width: size,
                height: size,
                left: (420 - size) / 2,
                top: (420 - size) / 2,
              }}
            />
          ))}
        </div>

        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="relative z-[1] mx-auto max-w-6xl text-center font-[900] uppercase leading-[0.95] tracking-tight text-[clamp(2.4rem,7vw,5.2rem)]"
        >
          <span className="inline-flex flex-wrap items-center justify-center gap-3 align-middle">
            Who we
            <span
              aria-hidden
              className="inline-block h-[0.62em] w-[1.5em] rounded-full bg-gradient-to-br from-[#E0A53C] via-[#3E5C82] to-[#1C1B19]/80"
            />
            are and
          </span>
          <br />
          <span className="inline-flex flex-wrap items-center justify-center gap-3 align-middle">
            what{" "}
            <span
              className="[-webkit-text-stroke:1.5px_#1C1B19] text-transparent"
              style={{ WebkitTextStroke: "1.5px #1C1B19" }}
            >
              we stand
            </span>{" "}
            f
            <motion.span
              initial={{ y: -6, opacity: 0 }}
              animate={{ y: [0, 6, 0], opacity: 1 }}
              transition={{
                opacity: { duration: 0.4, delay: 0.6 },
                y: {
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                },
              }}
              className="inline-flex h-[0.85em] w-[0.85em] items-center justify-center rounded-full bg-[#3E5C82] align-middle"
            >
              <svg width="40%" height="40%" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 4V20M12 20L6 14M12 20L18 14"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.span>
            r
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-[1] mx-auto mt-14 max-w-6xl overflow-hidden rounded-[28px]"
        >
          <img
            src="https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=1600&auto=format&fit=crop"
            alt="Abstract iridescent liquid texture"
            className="h-[280px] w-full object-cover sm:h-[360px] lg:h-[440px]"
          />
        </motion.div>
        <HeroWaveGradient />
      </section>

      <section className="relative mt-16 bg-[#B5532E] px-6 pb-28 pt-24 text-white lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative inline-flex items-center text-[clamp(2.2rem,5vw,3.5rem)] font-extrabold"
          >
            <span
              aria-hidden
              className="absolute -left-4 -top-6 h-16 w-28 -rotate-6 rounded-[40%] bg-[#D9B23C]"
            />
            <span className="relative">Our Values</span>
            <span className="relative ml-2 inline-block h-2.5 w-2.5 rounded-full bg-[#D9B23C]" />
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 text-[15px] leading-relaxed text-white/85"
          >
            At Idea Lab, we believe that our values are what set us apart from
            other creative agencies. Here are the values that guide us in
            everything we do:
          </motion.p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
          {VALUES.map((value, i) => (
            <motion.div
              key={value.name}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.4 }}
              variants={fadeUp}
              whileHover={{ y: -6, rotate: i % 2 === 0 ? -1.5 : 1.5 }}
              className={`relative aspect-[3/4] overflow-hidden rounded-2xl shadow-lg ${
                i % 2 === 1 ? "rotate-[2deg]" : "-rotate-[2deg]"
              } last:col-span-2 last:mx-auto last:w-1/2 sm:last:col-span-1 sm:last:w-full`}
            >
              <img
                src={value.img}
                alt={value.name}
                className="absolute inset-0 h-full w-full object-cover grayscale"
              />
              <div className="absolute inset-0 bg-black/15" />
              <span
                className={`absolute font-semibold tracking-tight text-white drop-shadow-md ${
                  i % 2 === 1 ? "-rotate-2" : "rotate-2"
                } left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-base sm:text-lg`}
              >
                {value.name}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MISSION */}
      <section className="relative overflow-hidden bg-[#F4F1EA] px-6 py-28 lg:px-12">
        <div className="pointer-events-none absolute -left-28 -top-10 h-[320px] w-[320px] opacity-50">
          {[320, 230, 140].map((size) => (
            <span
              key={size}
              className="absolute rounded-full border border-[#1C1B19]/10"
              style={{
                width: size,
                height: size,
                left: (320 - size) / 2,
                top: (320 - size) / 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-[1] mx-auto grid max-w-6xl gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          {/* left: label + big icon mark */}
          <div className="flex flex-col items-start">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#3E5C82]">
              01 — Purpose
            </span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-4 inline-flex items-center text-[clamp(2.4rem,5.5vw,3.8rem)] font-extrabold leading-[0.95]"
            >
              <span
                aria-hidden
                className="absolute -left-4 -top-6 h-16 w-28 -rotate-6 rounded-[40%] bg-[#3E5C82]"
              />
              <span className="relative">
                Our
                <br />
                Mission
              </span>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-8 h-px w-24 origin-left bg-[#1C1B19]/20"
            />

            <span className="mt-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#3E5C82] shadow-md shadow-[#3E5C82]/20">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L14.5 9H21.5L16 13.5L18 21L12 16.5L6 21L8 13.5L2.5 9H9.5L12 2Z"
                  fill="white"
                />
              </svg>
            </span>
          </div>

          {/* right: statement + supporting points */}
          <div className="text-left">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(1.4rem,2.4vw,2rem)] font-medium leading-snug text-[#1C1B19]"
            >
              To help brands turn bold ideas into work that moves people —
              pairing sharp strategy with craft that never cuts corners.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 max-w-md text-[15px] leading-relaxed text-[#1C1B19]/65"
            >
              We exist to make our clients' boldest ideas real, repeatable, and
              worth talking about — every brief, every time.
            </motion.p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: "Strategy first",
                  body: "Every project starts with the why, not the deliverable.",
                },
                {
                  title: "Craft, not shortcuts",
                  body: "We sweat the details our clients never see.",
                },
              ].map((point, i) => (
                <motion.div
                  key={point.title}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.4 }}
                  variants={fadeUp}
                  className="border-l-2 border-[#3E5C82]/30 pl-4"
                >
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-[#1C1B19]">
                    {point.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#1C1B19]/60">
                    {point.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="relative overflow-hidden bg-[#B5532E] px-6 py-28 text-white lg:px-12">
        <div className="pointer-events-none absolute -right-28 bottom-0 h-[320px] w-[320px] opacity-30">
          {[320, 230, 140].map((size) => (
            <span
              key={size}
              className="absolute rounded-full border border-white/20"
              style={{
                width: size,
                height: size,
                left: (320 - size) / 2,
                top: (320 - size) / 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-[1] mx-auto grid max-w-6xl gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          {/* left: statement + supporting points */}
          <div className="order-2 text-left lg:order-1">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="text-[clamp(1.4rem,2.4vw,2rem)] font-medium leading-snug text-white"
            >
              A world where every studio treats creativity as a discipline, not
              a department — and great design is the default, not the exception.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 max-w-md text-[15px] leading-relaxed text-white/75"
            >
              We're building toward a future where ambitious ideas always have a
              place to land, and where the work itself does the convincing.
            </motion.p>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {[
                {
                  title: "Built to last",
                  body: "We design for the next five years, not the next sprint.",
                },
                {
                  title: "Standards over trends",
                  body: "We chase what works, not what's loud this quarter.",
                },
              ].map((point, i) => (
                <motion.div
                  key={point.title}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, amount: 0.4 }}
                  variants={fadeUp}
                  className="border-l-2 border-white/30 pl-4"
                >
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
                    {point.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    {point.body}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* right: label + big icon mark */}
          <div className="order-1 flex flex-col items-start lg:order-2 lg:items-end lg:text-right">
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D9B23C]">
              02 — Direction
            </span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative mt-4 inline-flex items-center text-[clamp(2.4rem,5.5vw,3.8rem)] font-extrabold leading-[0.95]"
            >
              <span
                aria-hidden
                className="absolute -right-4 -top-6 h-16 w-28 rotate-6 rounded-[40%] bg-[#D9B23C] lg:-left-4 lg:right-auto"
              />
              <span className="relative">
                Our
                <br />
                Vision
              </span>
            </motion.h2>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mt-8 h-px w-24 origin-left bg-white/25 lg:origin-right"
            />

            <span className="mt-8 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#D9B23C] shadow-md shadow-black/10">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M2 12C4.5 6 8 3.5 12 3.5C16 3.5 19.5 6 22 12C19.5 18 16 20.5 12 20.5C8 20.5 4.5 18 2 12Z"
                  fill="#1C1B19"
                  fillOpacity="0.85"
                />
              </svg>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}
