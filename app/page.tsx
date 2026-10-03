import { Hero, HeroTitle, HeroCta } from "@/components/ui/hero";
import { WhyUs } from "@/components/layouts/why-us";
import { Header } from "@/components/layouts/header";
import { About } from "@/components/layouts/about";
import { HowWeWork } from "@/components/layouts/how-we-work";
import { OurWork } from "@/components/layouts/our-work";
import { Cta } from "@/components/layouts/cta";
import { Footer } from "@/components/layouts/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero align="center" className="rounded-b-3xl overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <svg
            aria-hidden="true"
            className="absolute -left-10 top-12 h-40 w-40 opacity-60 blur-3xl"
            viewBox="0 0 200 200"
          >
            <defs>
              <radialGradient id="bubbleA" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="55%" stopColor="#ffffff" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
              </radialGradient>
              <filter
                id="bubbleBlurA"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur stdDeviation="18" />
              </filter>
            </defs>
            <ellipse
              cx="100"
              cy="100"
              rx="72"
              ry="72"
              fill="url(#bubbleA)"
              filter="url(#bubbleBlurA)"
            />
          </svg>
          <svg
            aria-hidden="true"
            className="absolute right-0 top-24 h-52 w-52 opacity-40 blur-3xl"
            viewBox="0 0 240 240"
          >
            <defs>
              <radialGradient id="bubbleB" cx="50%" cy="50%" r="55%">
                <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.8" />
                <stop offset="55%" stopColor="#818cf8" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#818cf8" stopOpacity="0" />
              </radialGradient>
              <filter
                id="bubbleBlurB"
                x="-30%"
                y="-30%"
                width="160%"
                height="160%"
              >
                <feGaussianBlur stdDeviation="16" />
              </filter>
            </defs>
            <ellipse
              cx="120"
              cy="120"
              rx="84"
              ry="84"
              fill="url(#bubbleB)"
              filter="url(#bubbleBlurB)"
            />
          </svg>
        </div>
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
        {/* <HeroCta /> */}
      </Hero>
      <About />
      <HowWeWork />
      <OurWork />
      <WhyUs />
      <Cta />
      <Footer />
    </div>
  );
}
