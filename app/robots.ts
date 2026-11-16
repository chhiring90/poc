import type { MetadataRoute } from "next";
import { connection } from "next/server";
import {
  getSiteSettings,
  isIndexingAllowed,
} from "@/lib/seo/get-site-settings";
import { getSiteUrl } from "@/lib/seo/site-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  await connection();
  const settings = await getSiteSettings();

  if (!isIndexingAllowed(settings)) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: `${getSiteUrl()}/sitemap.xml`,
    host: getSiteUrl(),
  };
}
