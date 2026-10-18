import {
  AISection,
  Blog,
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

export default async function Home() {
  const payload = await getPayload({ config });
  const home = await payload.findGlobal({ slug: "home", depth: 2 });

  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      <Suspense fallback={<HeroSkeleton />}>
        <Hero {...home.hero} />
      </Suspense>
      <StackCarousel />
      <WhoAreWe />
      <FeaturedWork />
      <Services />
      <Process />
      <TechStack />
      <Testimonial />
      <Blog />
      <AISection />
      <ClosingCTA />
      <Footer />
    </div>
  );
}
