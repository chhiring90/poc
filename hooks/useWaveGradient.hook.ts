"use client";

import { useEffect } from "react";

type Blob = {
  baseX: number; // 0–1, position as fraction of width
  baseY: number; // 0–1
  radius: number; // fraction of max(width, height) — these are big, ~0.7-1
  color: string; // hex
  speed: number; // orbit speed — keep slow
  driftX: number; // orbit radius as fraction of width
  driftY: number; // orbit radius as fraction of height
  phase: number; // start offset so blobs don't sync up
};

// Exactly three large, soft blobs — this is the whole look. Big radius +
// heavy blur + slow drift is what gives the smooth "macOS wallpaper" wave
// blend in the reference, not lots of small shapes.
const BLOBS: Blob[] = [
  {
    baseX: 0.2,
    baseY: 0.25,
    radius: 0.85,
    color: "#7b6bff", // light periwinkle highlight
    speed: 0.01,
    driftX: 0.08,
    driftY: 0.06,
    phase: 0,
  },
  {
    baseX: 0.78,
    baseY: 0.4,
    radius: 0.8,
    color: "#3a4fd8", // mid blue
    speed: 0.013,
    driftX: 0.07,
    driftY: 0.08,
    phase: 2.4,
  },
  {
    baseX: 0.45,
    baseY: 0.85,
    radius: 0.75,
    color: "#241a6b", // deep indigo, keeps the bottom dark
    speed: 0.009,
    driftX: 0.06,
    driftY: 0.05,
    phase: 4.6,
  },
];

const MOTION_SPEED = 1; // scale all blob drift speeds together

function hexToRgb(hex: string) {
  const v = hex.replace("#", "");
  const bigint = parseInt(v, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}

function drawBlob(
  ctx: CanvasRenderingContext2D,
  blob: Blob,
  t: number,
  width: number,
  height: number,
) {
  const maxDim = Math.max(width, height);
  const speed = blob.speed * MOTION_SPEED;
  const cx =
    (blob.baseX + Math.sin(t * speed + blob.phase) * blob.driftX) * width;
  const cy =
    (blob.baseY + Math.cos(t * speed * 0.85 + blob.phase) * blob.driftY) *
    height;
  const radius = blob.radius * maxDim;

  const { r, g, b } = hexToRgb(blob.color);
  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.95)`);
  gradient.addColorStop(0.5, `rgba(${r}, ${g}, ${b}, 0.55)`);
  gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

/**
 * Renders three large, slowly drifting soft blobs that blend into a dark
 * navy background — the smooth "liquid wallpaper" look. Heavy blur +
 * large radius + slow movement, not lots of small shapes, is what sells
 * the effect.
 */
export function useWaveGradient(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  options?: { backgroundColor?: string },
) {
  const backgroundColor = options?.backgroundColor ?? "#050414";

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    const start = performance.now();
    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    const render = () => {
      const t = (performance.now() - start) / 1000;

      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      ctx.globalCompositeOperation = "lighten";
      ctx.filter = "blur(70px)";
      for (const blob of BLOBS) {
        drawBlob(ctx, blob, t, width, height);
      }
      ctx.filter = "none";
      ctx.globalCompositeOperation = "source-over";

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
    };
  }, [canvasRef, backgroundColor]);
}
