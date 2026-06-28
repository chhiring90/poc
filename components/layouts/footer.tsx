import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 bg-[#07111F] text-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-24 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
              POC Tech LTD.
            </p>
            <h2 className="max-w-md text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Design-led digital experiences for ambitious teams.
            </h2>
            <p className="max-w-md text-white/70">
              We build fast, elegant products with clarity, craftsmanship, and a
              strong focus on measurable outcomes.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
              Explore
            </h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li>
                <a className="transition hover:text-primary" href="about">
                  About
                </a>
              </li>
              <li>
                <a
                  className="transition hover:text-primary"
                  href="#how-we-work"
                >
                  How we work
                </a>
              </li>
              <li>
                <a className="transition hover:text-primary" href="#why-us">
                  Why us
                </a>
              </li>
              <li>
                <a className="transition hover:text-primary" href="#contact">
                  Contact
                </a>
              </li>
              <li>
                <a
                  className="transition hover:text-primary flex items-center gap-1"
                  href="/privacy-policy"
                >
                  Privacy Policy <ArrowUpRight className="size-3" />
                </a>
              </li>
              <li>
                <a
                  className="transition hover:text-primary flex items-center gap-1"
                  href="/terms-of-service"
                >
                  Terms of Service <ArrowUpRight className="size-3" />
                </a>
              </li>
            </ul>
          </div>

          <div className="">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
              Contact
            </h3>
            <ul className="space-y-3 text-sm text-white/80">
              <li className="flex items-center gap-3">
                <Mail className="size-4 text-primary" />
                <a
                  className="hover:text-primary"
                  href="mailto:hello@cygnus.dev"
                >
                  hello@cygnus.dev
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-4 text-primary" />
                <a className="hover:text-primary" href="tel:+15551234567">
                  +1 (555) 123-4567
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 text-primary" />
                <span>London, UK</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/60 lg:flex-row lg:items-center lg:justify-between">
          <p>© {year} POC Tech LTD. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export { Footer };
