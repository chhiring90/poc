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
  TechStack,
  Testimonial,
  WhoAreWe,
  HeroSkeleton,
} from "@/components/layouts/home";
import { getPayload } from "payload";
import config from "@payload-config";
import { Suspense } from "react";
import { connection } from "next/server";

export default async function Home() {
  await connection();
  const payload = await getPayload({ config });
  const home = await payload.findGlobal({ slug: "home", depth: 2 });
  const techStack = home.techstack ?? [];
  const [whoAreWe] = home.whoAreWe ?? [];
  const expertise = home.expertise ?? [];
  const process = home.process ?? [];
  const insights = home.insights ?? [];
  const testimonials = home.reviews ?? [];
  const featuredWork = home.featuredWork;

  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      <Suspense fallback={<HeroSkeleton />}>
        <Hero {...home.hero} />
      </Suspense>
      <StackCarousel techStack={techStack} />
      {whoAreWe && <WhoAreWe {...whoAreWe} />}
      {featuredWork && <FeaturedWork featuredWork={featuredWork} />}
      {expertise && <Services expertise={expertise} />}
      <Process process={process} />
      {/* <TechStack techStack={techStack} /> */}
      <Testimonial testimonials={testimonials} />
      <Insights {...insights} />
      <AISection />
      <ClosingCTA />
      <Footer />
    </div>
  );
}
