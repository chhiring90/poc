import type { NextRequest } from "next/server";
import sharp from "sharp";

const WIDTH = 1200;
const HEIGHT = 630;

/** Only resize images from our own media bucket, never arbitrary URLs. */
function allowedSource(raw: string | null): URL | null {
  if (!raw) return null;
  try {
    const src = new URL(raw);
    const mediaBase = process.env.R2_PUBLIC_URL?.trim().replace(/^['"]|['"]$/g, "");
    const mediaHost = mediaBase ? new URL(mediaBase).hostname : null;
    return src.protocol === "https:" && src.hostname === mediaHost ? src : null;
  } catch {
    return null;
  }
}

/**
 * Share image for a CMS upload: /og/image?src=<media url>&title=<fallback title>
 *
 * Crops to 1200×630 and re-encodes as a compressed JPEG. WhatsApp drops images over
 * roughly 300 KB, and some crawlers reject WebP or very large files, so the original
 * upload can't be used directly. If the source can't be loaded, redirects to the branded /og image.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const fallback = new URL("/og", request.url);
  const title = searchParams.get("title");
  if (title) fallback.searchParams.set("title", title);

  const src = allowedSource(searchParams.get("src"));
  if (!src) return Response.redirect(fallback, 307);

  try {
    const upstream = await fetch(src, { signal: AbortSignal.timeout(8000) });
    if (!upstream.ok) throw new Error(`Media responded ${upstream.status}`);

    const jpeg = await sharp(Buffer.from(await upstream.arrayBuffer()))
      .rotate()
      .resize(WIDTH, HEIGHT, { fit: "cover", position: "attention" })
      .flatten({ background: "#f4ebdd" })
      .jpeg({ quality: 78, mozjpeg: true, progressive: true })
      .toBuffer();

    return new Response(new Uint8Array(jpeg), {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": String(jpeg.byteLength),
        "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400",
      },
    });
  } catch {
    return Response.redirect(fallback, 307);
  }
}
