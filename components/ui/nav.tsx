"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavProps {
  dark: boolean;
  toggleDark: () => void;
  currentPage: string;
  setPage: (p: string) => void;
}

const services = [
  { name: "Web Applications", desc: "React, Next.js, TypeScript", icon: "⬡" },
  {
    name: "Mobile Apps",
    desc: "React Native, Flutter, Swift, Kotlin",
    icon: "◫",
  },
  {
    name: "UI/UX Design",
    desc: "Figma, design systems, prototypes",
    icon: "◈",
  },
  { name: "MVP Sprints", desc: "6-week proof-of-concept builds", icon: "⟳" },
  { name: "Cloud & DevOps", desc: "AWS, GCP, Docker, Kubernetes", icon: "◉" },
  { name: "AI & Automation", desc: "LLM integrations, AI products", icon: "◎" },
];

export default function Nav({
  dark,
  toggleDark,
  currentPage,
  setPage,
}: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const bg = scrolled ? "bg-background/95 backdrop-blur-md" : "bg-transparent";
  const text = "text-foreground";
  const muted = "text-muted-foreground";

  const navLinks = [
    { label: "Work", page: "work" },
    { label: "About", page: "about" },
    { label: "Blog", page: "blog" },
    { label: "Contact", page: "contact" },
  ];

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 bg-background ${scrolled ? "border-border/70" : "border-transparent"}`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-10">
        <Button
          variant="ghost"
          onClick={() => setPage("home")}
          className={`h-auto gap-2 px-0 hover:bg-transparent text-foreground`}
        >
          <span className="flex size-8 items-center justify-center rounded-md bg-primary">
            <span className="font-mono text-sm font-bold leading-none text-primary-foreground">
              P∘C
            </span>
          </span>
          <span className="font-display text-lg font-bold">POC</span>
        </Button>

        <nav className="hidden items-center gap-1 md:flex">
          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <Button
              variant="ghost"
              aria-expanded={megaOpen}
              aria-haspopup="true"
              onFocus={() => setMegaOpen(true)}
              onClick={() => setMegaOpen(true)}
              className={`gap-1.5 text-muted-foreground hover:text-foreground`}
            >
              Services
              <ChevronDown
                aria-hidden="true"
                className={`size-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`}
              />
            </Button>
            <AnimatePresence>
              {megaOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.98 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="absolute left-1/2 top-full mt-2 w-[min(480px,calc(100vw-2rem))] -translate-x-1/2 rounded-lg border border-border bg-popover p-5 text-popover-foreground shadow-xl"
                >
                  <p
                    className={`mb-3 text-xs font-mono uppercase text-muted-foreground`}
                  >
                    What we build
                  </p>
                  <div className="grid grid-cols-2 gap-1">
                    {services.map((service) => (
                      <Button
                        key={service.name}
                        variant="ghost"
                        onClick={() => {
                          setPage("services");
                          setMegaOpen(false);
                        }}
                        className="h-auto min-h-16 justify-start whitespace-normal rounded-md px-3 py-2 text-left hover:bg-muted"
                      >
                        <span className="text-lg text-primary">
                          {service.icon}
                        </span>
                        <span className="min-w-0">
                          <span
                            className={`block text-sm font-semibold text-foreground`}
                          >
                            {service.name}
                          </span>
                          <span
                            className={`mt-0.5 block text-xs text-muted-foreground`}
                          >
                            {service.desc}
                          </span>
                        </span>
                      </Button>
                    ))}
                  </div>
                  <div className="mt-3 border-t border-border pt-3">
                    <Button
                      variant="link"
                      size="sm"
                      onClick={() => {
                        setPage("services");
                        setMegaOpen(false);
                      }}
                      className="h-auto px-1"
                    >
                      View all services <ArrowUpRight className="size-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navLinks.map(({ page, label }) => (
            <Link
              href={page}
              key={page}
              aria-current={currentPage === page ? "page" : undefined}
              className={`relative ${currentPage === page ? text : muted} hover:text-foreground`}
            >
              {label}
              {currentPage === page && (
                <motion.span
                  layoutId="nav-active-indicator"
                  className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                />
              )}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          <Button
            onClick={() => setPage("contact")}
            className="hidden rounded-full md:flex"
          >
            Start a project <ArrowUpRight className="size-4" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((open) => !open)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className={`md:hidden text-foreground`}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
            className="overflow-hidden border-t border-border bg-background text-foreground md:hidden"
            aria-label="Mobile navigation"
          >
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.045, delayChildren: 0.06 },
                },
              }}
              className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-5"
            >
              <Button
                variant="ghost"
                onClick={() => {
                  setPage("services");
                  setMobileOpen(false);
                }}
                className={`h-auto justify-start px-3 py-3 text-base text-foreground`}
              >
                Services
              </Button>
              {navLinks.map((link) => (
                <motion.div
                  key={link.page}
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    show: { opacity: 1, x: 0 },
                  }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setPage(link.page);
                      setMobileOpen(false);
                    }}
                    className={`h-auto w-full justify-start px-3 py-3 text-base text-foreground`}
                  >
                    {link.label}
                  </Button>
                </motion.div>
              ))}
              <Button
                onClick={() => {
                  setPage("contact");
                  setMobileOpen(false);
                }}
                className="mt-2 justify-between rounded-full"
              >
                Start a project <ArrowUpRight className="size-4" />
              </Button>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
