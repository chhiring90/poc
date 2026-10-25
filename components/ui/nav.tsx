"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";

type NavIcon = string | number | { url?: string | null } | null;

type NavLinkItem = {
  id?: string | null;
  label: string;
  url: string;
  description?: string | null;
  icon?: NavIcon;
};

type NavColumn = {
  id?: string | null;
  heading?: string | null;
  links?: NavLinkItem[] | null;
};

type NavItem = {
  id?: string | null;
  label: string;
  link?: string | null;
  hasMegaMenu?: boolean | null;
  featuredPost?:
    | { title?: string | null; slug?: string | null }
    | number
    | string
    | null;
  columns?: NavColumn[] | null;
};

export type HeaderData = { navItems?: NavItem[] | null } | null;

type NavProps = {
  data: HeaderData;
  cta?: { label: string; href: string };
};

export function Nav({
  data,
  cta = { label: "Start a project", href: "/contact" },
}: NavProps) {
  const navItems = data?.navItems ?? [];
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const dark = resolvedTheme === "dark";
  const toggleDark = () => setTheme(dark ? "light" : "dark");

  const [scrolled, setScrolled] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null); // which mega menu is open
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    setOpenId(null);
    setMobileOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-colors duration-300 bg-background ${
        scrolled ? "border-border/70" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-10">
        <Link href="/" className="h-auto gap-2 px-0 text-foreground">
          <Logo compact />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const { hasMegaMenu, featuredPost } = item;
            const link = item.link ?? "#";
            const columns = item.columns ?? [];
            const key = item.id ?? link;

            if (hasMegaMenu && columns.length > 0) {
              const open = openId === key;
              const featured =
                typeof featuredPost === "object" && featuredPost
                  ? featuredPost
                  : null;

              return (
                <div
                  key={key}
                  className="relative"
                  onMouseEnter={() => setOpenId(key)}
                  onMouseLeave={() => setOpenId(null)}
                >
                  <Button
                    variant="ghost"
                    aria-expanded={open}
                    aria-haspopup="true"
                    onFocus={() => setOpenId(key)}
                    onClick={() => setOpenId(key)}
                    className="gap-1.5 text-muted-foreground hover:text-foreground"
                  >
                    {item.label}
                    <ChevronDown
                      aria-hidden="true"
                      className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </Button>

                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute left-1/2 top-full mt-2 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-none border border-border bg-popover p-5 text-popover-foreground shadow-xl"
                      >
                        <div
                          className="grid gap-6"
                          style={{
                            gridTemplateColumns: `repeat(${columns.length}, minmax(220px, 1fr))`,
                          }}
                        >
                          {columns.map((col) => (
                            <div key={col.id ?? col.heading}>
                              {col.heading && (
                                <p className="mb-3 text-xs font-mono uppercase text-muted-foreground">
                                  {col.heading}
                                </p>
                              )}
                              <div className="grid grid-cols-2 gap-1">
                                {(col.links ?? []).map((l) => (
                                  <Button
                                    key={l.id ?? l.url}
                                    variant="ghost"
                                    className="h-auto min-h-16 justify-start whitespace-normal rounded-none px-3 py-2 text-left hover:bg-muted"
                                  >
                                    <Link href={l.url}>
                                      {l.icon && (
                                        <span className="text-lg text-primary">
                                          {typeof l.icon === "string" ? (
                                            l.icon
                                          ) : typeof l.icon === "object" &&
                                            "url" in l.icon &&
                                            l.icon.url ? (
                                            <Image
                                              src={l.icon.url}
                                              alt=""
                                              width={20}
                                              height={20}
                                              className="size-5 object-contain"
                                            />
                                          ) : null}
                                        </span>
                                      )}
                                      <span className="min-w-0">
                                        <span className="block text-sm font-semibold text-foreground">
                                          {l.label}
                                        </span>
                                        {l.description && (
                                          <span className="mt-0.5 block text-xs text-muted-foreground">
                                            {l.description}
                                          </span>
                                        )}
                                      </span>
                                    </Link>
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>

                        {featured?.slug && (
                          <Link
                            href={`/blogs/${featured.slug}`}
                            className="mt-4 block rounded-none border border-border p-3 text-sm hover:bg-muted"
                          >
                            <span className="block text-xs font-mono uppercase text-muted-foreground">
                              Featured
                            </span>
                            <span className="font-semibold">
                              {featured.title}
                            </span>
                          </Link>
                        )}

                        <div className="mt-3 border-t border-border pt-3">
                          <Button
                            variant="link"
                            size="sm"
                            className="h-auto px-1 capitalize"
                          >
                            <Link href={link}>View all {item.label}</Link>
                            <ArrowUpRight className="size-4" />
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            const active = isActive(link);
            return (
              <Button
                key={key}
                variant="ghost"
                className={`relative ${active ? "text-foreground" : "text-muted-foreground"} hover:text-foreground`}
              >
                <Link href={link} aria-current={active ? "page" : undefined}>
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-none bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                    />
                  )}
                </Link>
              </Button>
            );
          })}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
          >
            <Sun className="hidden size-4 dark:block" />
            <Moon className="size-4 dark:hidden" />
          </Button>

          <Button className="hidden rounded-none md:flex">
            <Link href={cta.href}>
              {cta.label} <ArrowUpRight className="size-4" />
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className="md:hidden text-foreground"
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile nav */}
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
              {navItems.map((item) => (
                <motion.div
                  key={item.id ?? item.link ?? item.label}
                  variants={{
                    hidden: { opacity: 0, x: -8 },
                    show: { opacity: 1, x: 0 },
                  }}
                >
                  <Button
                    variant="ghost"
                    className="h-auto w-full justify-start px-3 py-3 text-base text-foreground"
                  >
                    <Link href={item.link ?? "#"}>{item.label}</Link>
                  </Button>

                  {item.hasMegaMenu &&
                    (item.columns ?? [])
                      .flatMap((c) => c.links ?? [])
                      .map((l) => (
                        <Button
                          key={l.id ?? l.url}
                          variant="ghost"
                          className="h-auto w-full justify-start py-2 pl-8 pr-3 text-sm text-muted-foreground"
                        >
                          <Link href={l.url}>{l.label}</Link>
                        </Button>
                      ))}
                </motion.div>
              ))}

              <Button className="mt-2 justify-between rounded-none">
                <Link href={cta.href}>
                  {cta.label} <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </motion.div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
