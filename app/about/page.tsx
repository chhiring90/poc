"use client";

import { GradientWave } from "@/components/ui/gradient-wave";
import { motion } from "motion/react";
import { Header } from "@/components/layouts/header";
import { Footer } from "@/components/layouts/footer";
import { Values } from "./values";
import { Missions } from "./missions";
import { Visions } from "./visions";

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
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <section className="relative flex align-center flex-col justify-center overflow-hidden px-6 py-28 lg:px-12">
        <motion.h1
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="relative z-1 mx-auto max-w-6xl text-center font-bold uppercase leading-[0.95] tracking-tight text-[clamp(2.4rem,7vw,5.2rem)]"
        >
          <span className="inline-flex flex-wrap items-center justify-center gap-3 align-middle">
            Who we
            <span
              aria-hidden
              className="inline-block h-[0.62em] w-[1.5em] rounded-full bg-linear-to-br from-orange-500 to-purple-500 align-middle"
            />
            are and
          </span>
          <br />
          <span className="inline-flex flex-wrap items-center justify-center gap-3 align-middle">
            what
            <span
              className="[-webkit-text-stroke:1.5px_#1C1B19] text-transparent"
              style={{ WebkitTextStroke: "1.5px #1C1B19" }}
            >
              we stand
            </span>
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
              className="inline-flex h-[0.85em] w-[0.85em] items-center justify-center rounded-full bg-primary align-middle"
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

        <GradientWave
          speed={1}
          className="w-full mx-auto mt-18 max-w-6xl aspect-[21/9] shadow-2xl"
        />
      </section>

      <Values />
      <Missions />
      <Visions />

      <Footer />
    </div>
  );
}
