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
  "inline-flex w-16 items-center justify-center border-l-2 border-border text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring lg:w-18";
const navLinkClass =
  "relative inline-flex items-center px-4 text-[0.9375rem] font-medium transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring xl:px-5";
const logoImageClass =
  "h-10 w-auto max-w-44 object-contain object-left lg:h-12 lg:max-w-56";

function logoSize(logo: UploadedLogo) {
  return {
    width: typeof logo.width === "number" && logo.width > 0 ? logo.width : 600,
    height:
      typeof logo.height === "number" && logo.height > 0 ? logo.height : 150,
  };
}

/** Brick-red bar under the active top-level item. */
function ActiveIndicator() {
  return (
    <motion.span
      layoutId="nav-active-indicator"
      className="absolute inset-x-4 -bottom-[2px] h-[3px] bg-primary xl:inset-x-5"
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
    />
  );
}

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

  // Escape closes an open mega menu.
  useEffect(() => {
    if (!openId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openId]);

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
      <div className="flex h-16 items-stretch lg:h-18">
        {/* Brand cell: full height and ruled off, to balance the CTA cell on the right. */}
        <Link
          href="/"
          aria-label="POC Tech home"
          className="inline-flex shrink-0 items-center border-r-2 border-border px-5 text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring lg:px-8 xl:min-w-60 xl:px-10"
        >
          {lightThemeLogo && darkThemeLogo ? (
            <>
              <Image
                src={lightThemeLogo.url}
                alt={lightThemeLogo.alt || "POC Tech"}
                {...logoSize(lightThemeLogo)}
                unoptimized
                className={`${logoImageClass} dark:hidden`}
              />
              <Image
                src={darkThemeLogo.url}
                alt={darkThemeLogo.alt || "POC Tech"}
                {...logoSize(darkThemeLogo)}
                unoptimized
                className={`${logoImageClass} hidden dark:block`}
              />
            </>
          ) : (
            <Logo />
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
            const active = item.link ? isActive(item.link) : false;

            if (hasMegaMenu && columns.length > 0) {
              const open = openId === key;
              const featured =
                typeof featuredPost === "object" && featuredPost?.slug
                  ? featuredPost
                  : null;
              const panelId = `mega-${key}`;

              return (
                // `static`, so the panel is positioned against the header and spans its full width.
                <div
                  key={key}
                  className="static flex"
                  onMouseEnter={() => setOpenId(key)}
                  onMouseLeave={() => setOpenId(null)}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenId(open ? null : key)}
                    className={`${navLinkClass} gap-1.5 ${open || active ? "text-foreground" : "text-muted-foreground"}`}
                  >
                    {item.label}
                    <ChevronDown
                      aria-hidden="true"
                      className={`size-3.5 transition-transform ${open ? "rotate-180" : ""}`}
                    />
                    {active && <ActiveIndicator />}
                  </button>

                  <AnimatePresence>
                    {open && (
                      <motion.div
                        id={panelId}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        // Sits over the header's bottom rule, so there is no gap to lose hover in.
                        className="absolute inset-x-0 top-full border-y-2 border-border bg-popover text-popover-foreground shadow-[0_6px_0_var(--color-shadow)]"
                      >
                        <div
                          className={`mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:px-10 ${
                            featured
                              ? "grid-cols-[minmax(0,13rem)_minmax(0,1fr)_minmax(0,17rem)]"
                              : "grid-cols-[minmax(0,13rem)_minmax(0,1fr)]"
                          }`}
                        >
                          <div className="border-r-2 border-border pr-8">
                            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary">
                              {`// ${item.label.toLowerCase()}`}
                            </p>
                            <p className="font-display text-3xl font-bold leading-tight tracking-tight">
                              {item.label}
                            </p>
                            {item.link && (
                              <Link
                                href={item.link}
                                className="mt-6 inline-flex items-center gap-1.5 border-b-2 border-primary pb-0.5 text-sm font-semibold capitalize transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
                              >
                                View all {item.label}
                                <ArrowUpRight
                                  aria-hidden="true"
                                  className="size-4"
                                />
                              </Link>
                            )}
                          </div>

                          <div
                            className="grid gap-8"
                            style={{
                              gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))`,
                            }}
                          >
                            {columns.map((col) => (
                              <div key={col.id ?? col.heading}>
                                {col.heading && (
                                  <p className="mb-3 border-b-2 border-border pb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                                    {col.heading}
                                  </p>
                                )}
                                <ul
                                  className={`grid gap-1 ${columns.length === 1 ? "sm:grid-cols-2" : ""}`}
                                >
                                  {(col.links ?? []).map((l) => (
                                    <li key={l.id ?? l.url}>
                                      <Link
                                        href={l.url}
                                        className="group/link flex items-start gap-3 px-2 py-2.5 transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
                                      >
                                        {l.iconElement && (
                                          <span className="flex size-10 shrink-0 items-center justify-center border-2 border-border bg-background text-primary transition-colors group-hover/link:bg-primary group-hover/link:text-primary-foreground [&_svg]:size-4">
                                            {l.iconElement}
                                          </span>
                                        )}
                                        <span className="min-w-0 pt-0.5">
                                          <span className="block text-sm font-semibold text-foreground">
                                            {l.label}
                                          </span>
                                          {l.description && (
                                            <span className="mt-0.5 block text-xs leading-relaxed text-muted-foreground">
                                              {l.description}
                                            </span>
                                          )}
                                        </span>
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            ))}
                          </div>

                          {featured && (
                            <Link
                              href={`/blogs/${featured.slug}`}
                              className="group/featured flex flex-col justify-between border-2 border-border bg-card p-6 shadow-[var(--shadow-control)] transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                            >
                              <span className="font-mono text-xs uppercase tracking-widest text-primary">
                                Featured
                              </span>
                              <span className="mt-6 font-display text-xl font-bold leading-snug">
                                {featured.title}
                              </span>
                              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                                Read the article
                                <ArrowUpRight
                                  aria-hidden="true"
                                  className="size-4 transition-transform group-hover/featured:-translate-y-0.5 group-hover/featured:translate-x-0.5"
                                />
                              </span>
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={key}
                href={link}
                aria-current={active ? "page" : undefined}
                onMouseEnter={() => setOpenId(null)}
                className={`${navLinkClass} ${active ? "text-foreground" : "text-muted-foreground"}`}
              >
                {item.label}
                {active && <ActiveIndicator />}
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
            className="hidden items-center gap-2.5 border-l-2 border-border bg-foreground px-6 text-sm font-semibold text-background transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-ring sm:inline-flex lg:px-8"
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
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t-2 border-border bg-background text-foreground md:hidden"
            aria-label="Mobile navigation"
          >
            <motion.ul
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: {
                  transition: { staggerChildren: 0.045, delayChildren: 0.06 },
                },
              }}
              className="px-5 py-4"
            >
              {navItems.map((item) => {
                const active = item.link ? isActive(item.link) : false;
                return (
                  <motion.li
                    key={item.id ?? item.link ?? item.label}
                    variants={{
                      hidden: { opacity: 0, x: -8 },
                      show: { opacity: 1, x: 0 },
                    }}
                    className="border-b-2 border-border py-2 last:border-b-0"
                  >
                    <Link
                      href={item.link ?? "#"}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center justify-between py-2.5 font-display text-2xl font-bold tracking-tight ${active ? "text-primary" : "text-foreground"}`}
                    >
                      {item.label}
                      <ArrowUpRight
                        aria-hidden="true"
                        className="size-5 text-muted-foreground"
                      />
                    </Link>

                    {item.hasMegaMenu &&
                      (item.columns ?? []).map((col) => (
                        <div key={col.id ?? col.heading} className="pb-2">
                          {col.heading && (
                            <p className="mb-1 mt-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                              {col.heading}
                            </p>
                          )}
                          {(col.links ?? []).map((l) => (
                            <Link
                              key={l.id ?? l.url}
                              href={l.url}
                              className="flex items-center gap-3 py-2 text-sm font-medium text-foreground"
                            >
                              {l.iconElement && (
                                <span className="flex size-8 shrink-0 items-center justify-center border-2 border-border text-primary [&_svg]:size-4">
                                  {l.iconElement}
                                </span>
                              )}
                              {l.label}
                            </Link>
                          ))}
                        </div>
                      ))}
                  </motion.li>
                );
              })}
            </motion.ul>

            <div className="border-t-2 border-border p-5 sm:hidden">
              <Button asChild className="h-12 w-full justify-between">
                <Link href={cta.href}>
                  {cta.label} <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
