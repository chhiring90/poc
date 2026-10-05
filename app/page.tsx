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
} from "@/components/layouts/home";

export default function Home() {
  return (
    <div className="bg-background text-foreground transition-colors duration-300">
      <Hero />
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
