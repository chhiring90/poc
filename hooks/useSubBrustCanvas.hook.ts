import { useEffect, useRef, useCallback } from "react";
import { parseHsl, hslToRgb, lerpHsl } from "@/lib/helper/color.helper";
import { HslTuple, TimeKey } from "@/lib/type/cta.type";
import { TIME_THEMES } from "@/lib/const/cta.const";

const WAVE_COUNT = 25;

export function useSunburstCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement>,
  cardRef: React.RefObject<HTMLElement | null>,
  themeKey: TimeKey,
  prevThemeKey: React.RefObject<TimeKey>,
) {
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef(performance.now());

  const bgProgressRef = useRef(1);
  const currentBgRef = useRef<HslTuple[] | null>(null);
  const targetBgRef = useRef<HslTuple[] | null>(null);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    const card = cardRef.current;

    if (!canvas || !card) return;

    const dpr = window.devicePixelRatio || 1;

    const W = card.offsetWidth;
    const H = card.offsetHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;

    const ctx = canvas.getContext("2d");

    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    }
  }, [canvasRef, cardRef]);

  useEffect(() => {
    const prev = prevThemeKey.current;

    if (prev !== themeKey) {
      currentBgRef.current = TIME_THEMES[prev].bg.map(parseHsl) as HslTuple[];

      targetBgRef.current = TIME_THEMES[themeKey].bg.map(
        parseHsl,
      ) as HslTuple[];

      bgProgressRef.current = 0;

      prevThemeKey.current = themeKey;
    }
  }, [themeKey, prevThemeKey]);

  useEffect(() => {
    resize();

    window.addEventListener("resize", resize);

    const draw = (ts: number) => {
      const canvas = canvasRef.current;
      const card = cardRef.current;

      if (!canvas || !card) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const W = card.offsetWidth;
      const H = card.offsetHeight;

      const elapsed = (ts - startTimeRef.current) / 1000;

      const t = TIME_THEMES[themeKey];

      ctx.clearRect(0, 0, W, H);

      // -----------------------------
      // Background transition
      // -----------------------------

      let bgStops: HslTuple[];

      if (
        currentBgRef.current &&
        targetBgRef.current &&
        bgProgressRef.current < 1
      ) {
        bgProgressRef.current = Math.min(1, bgProgressRef.current + 0.012);

        bgStops = currentBgRef.current.map((c, i) =>
          lerpHsl(c, targetBgRef.current![i], bgProgressRef.current),
        );

        if (bgProgressRef.current >= 1) {
          currentBgRef.current = targetBgRef.current;
        }
      } else {
        bgStops = t.bg.map(parseHsl) as HslTuple[];
      }

      const bg = ctx.createRadialGradient(
        W * 0.5,
        H * 1.2,
        0,
        W * 0.5,
        H * 1.2,
        W * 1.2,
      );

      bgStops.forEach((stop, i) => {
        const [r, g, b] = hslToRgb(stop[0], stop[1], stop[2]);

        bg.addColorStop(i / (bgStops.length - 1), `rgb(${r},${g},${b})`);
      });

      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // -----------------------------
      // Soft ocean glow
      // -----------------------------

      const glow = ctx.createRadialGradient(
        W * 0.5,
        H * 0.75,
        0,
        W * 0.5,
        H * 0.75,
        W * 0.8,
      );

      glow.addColorStop(0, "rgba(255,255,255,0.08)");
      glow.addColorStop(1, "rgba(255,255,255,0)");

      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      ctx.save();

      ctx.globalCompositeOperation = "screen";

      // -----------------------------
      // Ocean layers
      // -----------------------------

      for (let layer = 0; layer < WAVE_COUNT; layer++) {
        const frac = layer / WAVE_COUNT;

        const colorPos = frac * (bgStops.length - 1);

        const lower = Math.floor(colorPos);
        const upper = Math.min(lower + 1, bgStops.length - 1);

        const blend = colorPos - lower;

        const [h1, s1, l1] = bgStops[lower];
        const [h2, s2, l2] = bgStops[upper];

        const hue = h1 + (h2 - h1) * blend;
        const saturation = Math.min(s1 + (s2 - s1) * blend + 8, 100);
        const lightness = Math.min(l1 + (l2 - l1) * blend + 6, 95);

        // const baseY = H * 0.55 + frac * H * 0.3;
        // const baseY = H * 0.52 + frac * H * 0.28;
        const baseY = H * 0.52 + frac * H * 0.28 - Math.pow(frac, 2) * H * 0.06;

        const amplitude = 16 + frac * 42 + Math.sin(elapsed * 0.35 + layer) * 4;

        const wavelength = W * (0.35 + frac * 0.25);

        const speed = 0.35 + frac * 0.2;

        // const alpha = 0.04 + frac * 0.05;
        const alpha = 0.04 + frac * 0.05;

        ctx.beginPath();
        ctx.moveTo(0, H);

        for (let x = 0; x <= W; x += 3) {
          const y =
            baseY +
            Math.sin((x / wavelength) * Math.PI * 2 + elapsed * speed) *
              amplitude +
            Math.sin(x / (wavelength * 0.45) + elapsed * speed * 1.6) *
              amplitude *
              0.3;

          ctx.lineTo(x, y);
        }

        ctx.lineTo(W, H);
        ctx.closePath();

        ctx.fillStyle = `hsla(
          ${hue},
          ${saturation}%,
          ${lightness}%,
          ${alpha}
        )`;

        ctx.fill();

        // highlight crest
        ctx.beginPath();

        for (let x = 0; x <= W; x += 4) {
          const y =
            baseY +
            Math.sin((x / wavelength) * Math.PI * 2 + elapsed * speed) *
              amplitude +
            Math.sin(x / (wavelength * 0.45) + elapsed * speed * 1.6) *
              amplitude *
              0.3;

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = `hsla(
          ${hue},
          ${saturation}%,
          ${lightness}%,
          ${alpha * 2}
        )`;

        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [themeKey, resize, canvasRef, cardRef]);
}
