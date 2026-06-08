import { Carousel } from "@/components/ui/carousel";

function WhyUs() {
  return (
    <section className="py-16 px-4 text-left">
      <div className="w-1/2 mr-auto max-w-4xl mb-12 pl-12">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary mb-4">
          so, Why Work With Us
        </p>
        <div className="space-y-4 ">
          <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Unbeatable code quality at reasonable cost and delivery terms.
          </h1>
        </div>
      </div>
      <Carousel />
    </section>
  );
}

export { WhyUs };
