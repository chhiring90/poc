"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { useWaveGradient } from "@/hooks/useWaveGradient.hook";

export function HeroWaveGradient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useWaveGradient(canvasRef);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-[1] mx-auto mt-14 max-w-6xl overflow-hidden rounded-[28px] border border-white/10"
    >
      <canvas
        ref={canvasRef}
        className="h-[280px] w-full sm:h-[360px] lg:h-[440px]"
      />
    </motion.div>
  );
}
