import { TIME_THEMES } from "@/lib/const/cta.const";

export type TimeKey = keyof typeof TIME_THEMES;
export type Theme = (typeof TIME_THEMES)[TimeKey];
export type HslTuple = [number, number, number];
