"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { useWaveGradient } from "@/hooks/use-wave-gradient";
import { GradientWave } from "./gradient-wave";

export function HeroWaveGradient() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useWaveGradient(canvasRef);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className="relative z-1 mx-auto mt-14 max-w-6xl overflow-hidden"
    >
      <canvas ref={canvasRef} className="h-70 w-full sm:h-90 lg:h-110" />
      <GradientWave className="absolute inset-0 h-full w-full" />
    </motion.div>
  );
}
