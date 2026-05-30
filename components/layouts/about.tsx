import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

function About() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-[5fr_7fr]  lg:items-start">
        <div className="space-y-6 text-right">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            About us
          </p>
          <div className="space-y-4 ">
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              We help modern teams build better digital experiences.
            </h1>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-10">
          <p className="max-w-2xl text-lg leading-8 mb-8 text-muted-foreground">
            Our mission is to turn product ideas into polished, high-performance
            experiences. We blend thoughtful design, clean engineering, and
            measurable strategy so your brand feels modern, usable, and
            confidently built for the next stage.
          </p>

          <p className="max-w-2xl text-lg mb-8 leading-8 text-muted-foreground">
            From discovery to delivery, we partner with teams that want clarity,
            speed, and craftsmanship. Our work is built around practical design
            systems, high-performance front-end architecture, and a
            product-first mindset. That means every interaction is intentional,
            every launch is reliable, and every experience feels polished and
            easy for end users.
          </p>

          <Button size="lg" className="group">
            Learn More
            <ArrowUp className="ml-1 inline-block transform transition-transform duration-200 group-hover:rotate-45 size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export { About };
