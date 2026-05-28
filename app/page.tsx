import { Hero, HeroTitle, HeroCta } from "@/components/layouts/hero";
import { Header } from "@/components/layouts/header";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero align="left" imageSrc="/hero-bg.webp" className="pt-32">
        <span className="rounded-full border border-border/80 bg-background/80 px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm">
          Creative web solutions
        </span>
        <HeroTitle
          size="custom"
          className="filter-[url(#goo)]"
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
    </div>
  );
}
