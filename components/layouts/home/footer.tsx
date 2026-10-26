import { Logo } from "@/components/ui/logo";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-[1280px] mx-auto px-5 lg:px-10 py-20">
        <div className="grid md:grid-cols-5 gap-10 mb-16">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Logo compact />
            </div>
            <p className={`text-sm text-muted-foreground leading-relaxed mb-6`}>
              Proof of Concept.
              <br />
              We turn ideas into proven products, fast.
            </p>
            <div className="flex gap-3">
              {["in", "gh", "tw", "be", "ig"].map((s) => (
                <a
                  key={s}
                  href="#"
                  className="flex size-8 items-center justify-center rounded-none border border-border font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {[
            {
              title: "Learn",
              links: [
                { l: "Services", p: "services" },
                { l: "Process", p: "home" },
                { l: "Blog", p: "blog" },
                { l: "Case studies", p: "work" },
              ],
            },
            {
              title: "Explore",
              links: [
                { l: "Our work", p: "work" },
                { l: "About us", p: "about" },
                { l: "Careers", p: "about" },
                { l: "404 test", p: "404" },
              ],
            },
            {
              title: "Legal",
              links: [
                {
                  l: "Terms and Conditions",
                  p: "terms-and-condition",
                },
                { l: "Privacy Policy", p: "privacy-policies" },
                { l: "Data Protection", p: "data-protection-statement" },
                { l: "Safe AI", p: "safe-ai" },
                { l: "Modern Slavery", p: "modern-slavery-statement" },
                {
                  l: "Environmental Sustainability",
                  p: "environmental-sustainability",
                },
              ],
            },
            {
              title: "Get in touch",
              links: [
                { l: "Start a project", p: "contact" },
                { l: "hello@poc.dev", p: "contact" },
                { l: "+44 20 1234 5678", p: "contact" },
                { l: "London, UK", p: "contact" },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <p
                className={`font-mono text-xs uppercase tracking-widest text-muted-foreground mb-4`}
              >
                {col.title}
              </p>
              <div className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <Link
                    key={link.l}
                    href={`/${link.p}`}
                    className={`text-left text-sm transition-colors text-muted-foreground hover:text-primary`}
                  >
                    {link.l}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <p className={`text-xs text-muted-foreground font-mono`}>
            © 2026 POC Ltd. All rights reserved. Made with too much coffee and
            TypeScript.
          </p>
          <Link
            href="#"
            className="text-xs font-mono text-primary hover:text-white transition-colors flex items-center gap-1"
          >
            ↑ back to top (you survived the scroll)
          </Link>
        </div>
      </div>
    </footer>
  );
}
