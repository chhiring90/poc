import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { buildGlobalPageMetadata } from "@/lib/seo/global-page-metadata";
import { getSiteSettings } from "@/lib/seo/get-site-settings";
import { getSiteUrl } from "@/lib/seo/site-url";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo/json-ld";
import {
  AISection,
  Insights,
  ClosingCTA,
  FeaturedWork,
  Footer,
  Hero,
  Process,
  Services,
  StackCarousel,
  Testimonial,
  WhoAreWe,
  HeroSkeleton,
} from "@/components/layouts/home";
import { findGlobalCached } from "@/lib/cms/cache";
import { Suspense } from "react";

export function generateMetadata(): Promise<Metadata> {
  return buildGlobalPageMetadata({
    global: "home",
    path: "/",
    descriptionFields: ["hero.description"],
    imageField: "hero.image",
    isHome: true,
  });
}

export default async function Home() {
  const [home, settings] = await Promise.all([
    findGlobalCached("home", 2),
    getSiteSettings(),
  ]);
  const techStack = home.techstack ?? [];
  const [whoAreWe] = home.whoAreWe ?? [];
  const expertise = home.expertise ?? [];
  const process = home.process ?? [];
  const insights = home.insights ?? [];
  const testimonials = home.reviews ?? [];
  const featuredWork = home.featuredWork;

  return (
    <div className="bg-background text-foreground">
      <JsonLd data={[organizationJsonLd(settings), websiteJsonLd(settings)]} />
      <Suspense fallback={<HeroSkeleton />}>
        <Hero {...home.hero} />
      </Suspense>
      <StackCarousel techStack={techStack} />
      {whoAreWe && <WhoAreWe {...whoAreWe} />}
      {featuredWork && <FeaturedWork featuredWork={featuredWork} />}
      <Services expertise={expertise} />
      <Process process={process} />
      <Testimonial testimonials={testimonials} />
      <Insights {...insights} />
      <AISection
        data={home.askAi}
        company={settings.siteName}
        website={getSiteUrl()}
      />
      <ClosingCTA />
      <Footer />
    </div>
  );
}
