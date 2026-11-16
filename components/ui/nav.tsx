"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ChevronDown, Menu, Moon, Sun, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";

type NavLinkItem = {
  id?: string | null;
  label: string;
  url: string;
  description?: string | null;
  /** Lucide icon name chosen in the CMS. */
  icon?: string | null;
  /** The rendered icon, resolved on the server so the icon library stays out of the client bundle. */
  iconElement?: ReactNode;
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

type LogoAsset =
  | {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      alt?: string | null;
    }
  | string
  | number
  | null;

type UploadedLogo = {
  url: string;
  width?: number | null;
  height?: number | null;
  alt?: string | null;
};

function isUploadedLogo(value: LogoAsset | undefined): value is UploadedLogo {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.url === "string" &&
    value.url.length > 0
  );
}

export type HeaderData = {
  branding?: {
    lightLogo?: LogoAsset;
    darkLogo?: LogoAsset;
  } | null;
  navItems?: NavItem[] | null;
} | null;

type NavProps = {
  data: HeaderData;
  cta?: { label: string; href: string };
};

/** Each control in the bar is a full-height cell divided by a 2px rule. */
const cellClass =
  "inline-flex w-16 items-center justify-center border-l-2 border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring";
const navLinkClass =
  "relative inline-flex items-center px-5 text-sm font-medium transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring";

export function Nav({
  data,
  cta = { label: "Start a project", href: "/contact" },
}: NavProps) {
  const navItems = data?.navItems ?? [];
  const branding = data?.branding;
  const { resolvedTheme, setTheme } = useTheme();
  const pathname = usePathname();
  const dark = resolvedTheme === "dark";
  const toggleDark = () => setTheme(dark ? "light" : "dark");
  const lightLogo = isUploadedLogo(branding?.lightLogo)
    ? branding.lightLogo
    : null;
  const darkLogo = isUploadedLogo(branding?.darkLogo)
    ? branding.darkLogo
    : null;
  const lightThemeLogo = lightLogo ?? darkLogo;
  const darkThemeLogo = darkLogo ?? lightLogo;

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

  // Close any open menu when the route changes (reset during render, not in an effect).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setOpenId(null);
    setMobileOpen(false);
  }

  return (
    <motion.header
      initial={{ y: -18, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 border-b-2 border-border bg-background transition-shadow duration-300 ${
        scrolled ? "shadow-[0_4px_0_var(--color-shadow)]" : ""
      }`}
    >
      <div className="flex h-16 items-stretch">
        <Link
          href="/"
          aria-label="POC Tech home"
          className="inline-flex items-center px-5 text-foreground focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring lg:px-10"
        >
          {lightThemeLogo && darkThemeLogo ? (
            <>
              <Image
                src={lightThemeLogo.url}
                alt={lightThemeLogo.alt || "POC Tech"}
                width={
                  typeof lightThemeLogo.width === "number" &&
                  lightThemeLogo.width > 0
                    ? lightThemeLogo.width
                    : 600
                }
                height={
                  typeof lightThemeLogo.height === "number" &&
                  lightThemeLogo.height > 0
                    ? lightThemeLogo.height
                    : 150
                }
                unoptimized
                className="h-9 w-auto max-w-40 object-contain dark:hidden"
              />
              <Image
                src={darkThemeLogo.url}
                alt={darkThemeLogo.alt || "POC Tech"}
                width={
                  typeof darkThemeLogo.width === "number" &&
                  darkThemeLogo.width > 0
                    ? darkThemeLogo.width
                    : 600
                }
                height={
                  typeof darkThemeLogo.height === "number" &&
                  darkThemeLogo.height > 0
                    ? darkThemeLogo.height
                    : 150
                }
                unoptimized
                className="hidden h-9 w-auto max-w-40 object-contain dark:block"
              />
            </>
          ) : (
            <Logo compact />
          )}
        </Link>

        <nav
          aria-label="Main"
          className="hidden flex-1 items-stretch justify-center md:flex"
        >
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
                  className="relative flex"
                  onMouseEnter={() => setOpenId(key)}
                  onMouseLeave={() => setOpenId(null)}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-haspopup="true"
                    onFocus={() => setOpenId(key)}
                    onClick={() => setOpenId(key)}
                    className={`${navLinkClass} gap-1.5 ${open ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {item.label}
                    <ChevronDown
                      aria-hidden="true"
                      className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                  </button>

                  <AnimatePresence>
                    {open && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute left-1/2 top-full mt-[2px] w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-none border-[length:var(--border-width-default)] border-border bg-popover p-5 text-popover-foreground shadow-[var(--shadow-card)]"
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
                                    asChild
                                    variant="ghost"
                                    className="group/link h-auto min-h-16 items-start justify-start gap-3 whitespace-normal rounded-none px-3 py-3 text-left hover:bg-muted"
                                  >
                                    <Link href={l.url}>
                                      {l.iconElement && (
                                        <span className="flex size-9 shrink-0 items-center justify-center border-2 border-border bg-background text-primary transition-colors group-hover/link:bg-primary group-hover/link:text-primary-foreground [&_svg]:size-4">
                                          {l.iconElement}
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
                            asChild
                            variant="link"
                            size="sm"
                            className="h-auto px-1 capitalize"
                          >
                            <Link href={link}>
                              View all {item.label}
                              <ArrowUpRight className="size-4" />
                            </Link>
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
              <Link
                key={key}
                href={link}
                aria-current={active ? "page" : undefined}
                className={`${navLinkClass} ${active ? "text-foreground" : "text-muted-foreground"}`}
              >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active-indicator"
                      className="absolute inset-x-5 -bottom-[2px] h-[3px] rounded-none bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 420,
                        damping: 32,
                      }}
                    />
                  )}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-stretch md:ml-0">
          <button
            type="button"
            onClick={toggleDark}
            aria-label="Toggle dark mode"
            className={cellClass}
          >
            <Sun className="hidden size-4 dark:block" />
            <Moon className="size-4 dark:hidden" />
          </button>

          <Link
            href={cta.href}
            className="hidden items-center gap-3 border-l-2 border-border bg-foreground px-7 font-medium text-background transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring sm:inline-flex lg:px-10"
          >
            {cta.label}
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            className={`${cellClass} md:hidden`}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </button>
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
            className="overflow-hidden border-t-2 border-border bg-background text-foreground md:hidden"
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
              className="flex flex-col gap-1 px-5 py-5"
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
                    asChild
                    variant="ghost"
                    className="h-auto w-full justify-start rounded-none px-3 py-3 text-base text-foreground"
                  >
                    <Link href={item.link ?? "#"}>{item.label}</Link>
                  </Button>

                  {item.hasMegaMenu &&
                    (item.columns ?? [])
                      .flatMap((c) => c.links ?? [])
                      .map((l) => (
                        <Button
                          key={l.id ?? l.url}
                          asChild
                          variant="ghost"
                          className="h-auto w-full justify-start py-2 pl-8 pr-3 text-sm text-muted-foreground"
                        >
                          <Link href={l.url}>
                            {l.iconElement && (
                              <span className="text-primary [&_svg]:size-4">
                                {l.iconElement}
                              </span>
                            )}
                            {l.label}
                          </Link>
                        </Button>
                      ))}
                </motion.div>
              ))}

              <Button asChild className="mt-2 h-12 justify-between rounded-none sm:hidden">
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
