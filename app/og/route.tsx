import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";
import { getSiteSettings } from "@/lib/seo/get-site-settings";

// Brand colours from app/(frontend)/globals.css (light theme).
const PAPER = "#f4ebdd";
const CARD = "#fff9ef";
const INK = "#2c241c";
const MUTED = "#61564b";
const BRICK = "#9f3f32";
const SHADOW = "#695139";

/** Fallback share image for pages without one: /og?title=Page%20title */
export async function GET(request: NextRequest) {
  const settings = await getSiteSettings();
  const rawTitle = request.nextUrl.searchParams.get("title") ?? "";
  const title =
    (rawTitle.trim() || settings.siteName).slice(0, 110) +
    (rawTitle.length > 110 ? "…" : "");
  const fontSize = title.length > 60 ? 64 : title.length > 30 ? 80 : 96;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          padding: 56,
          background: PAPER,
          backgroundImage: `linear-gradient(to right, rgba(64,53,44,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(64,53,44,0.08) 1px, transparent 1px)`,
          backgroundSize: "56px 56px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "52px 60px",
            background: CARD,
            border: `4px solid ${INK}`,
            boxShadow: `14px 14px 0 ${SHADOW}`,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 26,
              color: BRICK,
              fontWeight: 700,
            }}
          >
            <div style={{ width: 22, height: 22, background: BRICK }} />
            {settings.siteName}
          </div>
          <div
            style={{
              display: "flex",
              fontSize,
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: INK,
              maxWidth: 960,
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: `3px solid ${INK}`,
              paddingTop: 22,
              fontSize: 24,
              color: MUTED,
            }}
          >
            <span>{new URL(request.url).host}</span>
            <div style={{ display: "flex", width: 120, height: 14, background: BRICK }} />
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" },
    },
  );
}
