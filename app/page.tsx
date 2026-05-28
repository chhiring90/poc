import { Button } from "@/components/ui/button";
import { Nav } from "@/components/layouts/nav";
import { Hero, HeroDescription, HeroTitle } from "@/components/layouts/hero";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex items-center justify-between gap-4 px-4 py-4">
        <Button>Click me</Button>
        <ThemeToggle />
      </div>
      <Nav />
      <Hero align="left" imageSrc="/hero-bg.webp" className="mt-6">
        <span className="rounded-full border border-border/80 bg-background/80 px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm">
          Creative web solutions
        </span>
        <HeroTitle size="custom">Build your next idea with us.</HeroTitle>
        <HeroDescription>
          We help startups and small businesses launch polished, high-performing
          web experiences tailored to their goals.
        </HeroDescription>
      </Hero>
    </div>
  );
}
