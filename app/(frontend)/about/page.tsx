import type { Metadata } from "next";
import {
  AboutFacts,
  AboutHero,
  AboutStory,
  AboutTeam,
  AboutValues,
} from "@/components/layouts/about/about-sections";
import { Footer } from "@/components/layouts/home";
import { ClosingBand } from "@/components/layouts/shared/page-blocks";
import { findGlobalCached } from "@/lib/cms/cache";
import { getAboutPageData } from "@/lib/helper/get-about-page-data.helper";
import { buildGlobalPageMetadata } from "@/lib/seo/global-page-metadata";

export function generateMetadata(): Promise<Metadata> {
  return buildGlobalPageMetadata({
    global: "about",
    path: "/about",
    descriptionFields: ["hero.description"],
    fallbackTitle: "About us",
    imageField: "hero.image",
  });
}

export default async function About() {
  // Depth 2 populates team members and their photos.
  const data = getAboutPageData(await findGlobalCached("about", 2));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AboutHero hero={data.hero} />
      <AboutFacts facts={data.facts} />
      <AboutStory story={data.story} />
      <AboutValues values={data.values} />
      <AboutTeam team={data.team} />
      <ClosingBand
        heading={data.closing.heading}
        description={data.closing.description}
        cta={data.closing.cta}
      />
      <Footer />
    </div>
  );
}
