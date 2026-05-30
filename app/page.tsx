import { Hero, HeroTitle, HeroCta } from "@/components/ui/hero";
import { Header } from "@/components/layouts/header";
import { About } from "@/components/layouts/about";
import { Project } from "@/components/layouts/project";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero align="left" imageSrc="/hero-bg.webp" className="pt-32">
        <span className="rounded-xl bg-secondary-foreground/80 backdrop-blur-3xl text-white px-4 py-2 text-sm font-medium font-mono">
          Creative web solutions
        </span>
        <HeroTitle
          size="custom"
          className="filter-[url(#goo)] mt-2 mb-6"
          highlightClassName="bg-[#111] px-4 py-1 text-white"
          lines={["Build your text", "next idea double", "with us."]}
        >
          <svg
            width="0"
            height="0"
            aria-hidden="true"
            className="absolute"
            style={{ position: "absolute" }}
          >
            <defs>
              <filter id="goo" colorInterpolationFilters="sRGB">
                <feGaussianBlur
                  in="SourceGraphic"
                  stdDeviation="6"
                  result="blur"
                />
                <feColorMatrix
                  in="blur"
                  mode="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                  result="goo"
                />
                <feComposite in="SourceGraphic" in2="goo" operator="atop" />
              </filter>
            </defs>
          </svg>
        </HeroTitle>
        <HeroCta />
      </Hero>
      <About />
      <Project />
    </div>
  );
}
