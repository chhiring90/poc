import { HslTuple, TimeKey, Theme } from "@/lib/type/cta.type";

export function parseHsl(str: string): HslTuple {
  const m = str.match(/hsl\(([^,]+),([^,]+)%,([^)]+)%\)/);
  return m
    ? [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])]
    : [0, 0, 50];
}

export function hslToRgb(
  h: number,
  s: number,
  l: number,
): [number, number, number] {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0,
    g = 0,
    b = 0;
  if (h < 60) {
    r = c;
    g = x;
  } else if (h < 120) {
    r = x;
    g = c;
  } else if (h < 180) {
    g = c;
    b = x;
  } else if (h < 240) {
    g = x;
    b = c;
  } else if (h < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

export function lerpHsl(a: HslTuple, b: HslTuple, t: number): HslTuple {
  let h1 = a[0],
    h2 = b[0];
  const diff = h2 - h1;
  if (diff > 180) h1 += 360;
  else if (diff < -180) h2 += 360;
  return [
    (h1 + (h2 - h1) * t + 360) % 360,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}
