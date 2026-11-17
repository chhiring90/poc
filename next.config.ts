import type { NextConfig } from "next";
import { withPayload } from "@payloadcms/next/withPayload";

/** Hostname of the public R2 bucket that serves Payload media. */
function mediaHostname(): string | null {
  try {
    const raw = process.env.R2_PUBLIC_URL?.trim().replace(/^['"]|['"]$/g, "");
    return raw ? new URL(raw).hostname : null;
  } catch {
    return null;
  }
}

const mediaHost = mediaHostname();

const nextConfig: NextConfig = {
  // Enables "use cache" / cacheTag. CMS reads are cached in lib/cms/cache.ts
  // and revalidated by Payload hooks (lib/cms/revalidate-hooks.ts).
  cacheComponents: true,
  // A stray lockfile in the home directory makes Turbopack guess the wrong root.
  turbopack: { root: __dirname },
  images: {
    remotePatterns: [
      ...(mediaHost
        ? [{ protocol: "https" as const, hostname: mediaHost }]
        : []),
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default withPayload(nextConfig);
