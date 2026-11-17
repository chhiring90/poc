import Image from "next/image";
import { cacheLife, cacheTag } from "next/cache";
import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { isRecord } from "@/lib/helper/is-record.helper";
import { findGlobalCached } from "@/lib/cms/cache";
import { getSiteSettings } from "@/lib/seo/get-site-settings";
import { CMS_CACHE_TAG } from "@/lib/cms/cache-tag";

type FooterLink = {
  id?: string | null;
  label?: string | null;
  url?: string | null;
  openInNewTab?: boolean | null;
};

type FooterColumn = {
  id?: string | null;
  heading?: string | null;
  links?: FooterLink[] | null;
};

const defaultColumns: FooterColumn[] = [
  {
    heading: "Learn",
    links: [
      { label: "Services", url: "/services" },
      { label: "Process", url: "/#process" },
      { label: "Blog", url: "/blogs" },
      { label: "Case studies", url: "/works" },
    ],
  },
  {
    heading: "Explore",
    links: [
      { label: "Our work", url: "/works" },
      { label: "About us", url: "/about" },
      { label: "Careers", url: "/about" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms and Conditions", url: "/terms-and-condition" },
      { label: "Privacy Policy", url: "/privacy-policies" },
      { label: "Data Protection", url: "/data-protection-statement" },
      { label: "Safe AI", url: "/safe-ai" },
      { label: "Modern Slavery", url: "/modern-slavery-statement" },
      {
        label: "Environmental Sustainability",
        url: "/environmental-sustainability",
      },
    ],
  },
  {
    heading: "Get in touch",
    links: [
      { label: "Start a project", url: "/contact" },
      { label: "hello@poc.dev", url: "mailto:hello@poc.dev" },
      { label: "+44 20 1234 5678", url: "tel:+442012345678" },
      { label: "London, UK", url: "/contact" },
    ],
  },
];

function FooterLinkItem({ link }: { link: FooterLink }) {
  if (!link.label || !link.url) return null;

  return (
    <Link
      href={link.url}
      target={link.openInNewTab ? "_blank" : undefined}
      rel={link.openInNewTab ? "noopener noreferrer" : undefined}
      className="text-left text-sm text-muted-foreground transition-colors hover:text-primary"
    >
      {link.label}
    </Link>
  );
}

export async function Footer() {
  "use cache";
  // Whole component is cached (it renders the current year); "days" keeps the
  // year correct, and CMS edits still revalidate it immediately via the tag.
  cacheLife("days");
  cacheTag(CMS_CACHE_TAG);
  const [footer, settings] = await Promise.all([
    findGlobalCached("footer"),
    getSiteSettings(),
  ]);
  const { legalName, companyNumber, registeredIn, address } =
    settings.organization;
  const registeredOffice = [
    address.streetAddress,
    address.locality,
    address.postalCode,
  ]
    .filter(Boolean)
    .join(", ");
  // Company details line, e.g. "Registered in England and Wales. Company number 12345678."
  const companyDetails = [
    registeredIn && companyNumber
      ? `Registered in ${registeredIn}. Company number ${companyNumber}.`
      : companyNumber
        ? `Company number ${companyNumber}.`
        : null,
    companyNumber && registeredOffice
      ? `Registered office: ${registeredOffice}.`
      : null,
  ]
    .filter(Boolean)
    .join(" ");
  const columns =
    footer.columns && footer.columns.length > 0
      ? (footer.columns as FooterColumn[])
      : defaultColumns;
  const socialLinks = (footer.socialLinks ?? []) as FooterLink[];
  const description =
    typeof footer.description === "string" && footer.description
      ? footer.description
      : "We turn ideas into proven products, fast.";
  const logo = isRecord(footer.logo) ? footer.logo : null;
  const logoUrl = typeof logo?.url === "string" ? logo.url : null;
  const logoWidth =
    typeof logo?.width === "number" && logo.width > 0 ? logo.width : 600;
  const logoHeight =
    typeof logo?.height === "number" && logo.height > 0 ? logo.height : 150;

  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-5 lg:px-10 py-20">
        <div className="grid gap-10 mb-16 md:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
          <div className="md:col-span-1">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={typeof logo?.alt === "string" ? logo.alt : "POC"}
                width={logoWidth}
                height={logoHeight}
                unoptimized
                className="mb-4 h-10 w-auto max-w-40 object-contain object-left"
              />
            ) : (
              <div className="mb-4 flex items-center gap-2">
                <Logo compact />
              </div>
            )}
            <p className="mb-6 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
            {socialLinks.length > 0 && (
              <div className="flex gap-3">
                {socialLinks.map(
                  (link, index) =>
                    link.label &&
                    link.url && (
                      <a
                        key={link.id ?? `${link.label}-${index}`}
                        href={link.url}
                        target={link.openInNewTab ? "_blank" : undefined}
                        rel={
                          link.openInNewTab ? "noopener noreferrer" : undefined
                        }
                        aria-label={link.label}
                        className="flex size-8 items-center justify-center rounded-none border border-border font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                      >
                        {link.label}
                      </a>
                    ),
                )}
              </div>
            )}
          </div>

          {columns.map((column, index) => (
            <div key={column.id ?? `${column.heading}-${index}`}>
              {column.heading && (
                <p className="mb-4 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  {column.heading}
                </p>
              )}
              <div className="flex flex-col gap-2">
                {(column.links ?? []).map((link, linkIndex) => (
                  <FooterLinkItem
                    key={link.id ?? `${link.label}-${linkIndex}`}
                    link={link}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 md:flex-row">
          <div className="space-y-1 text-center font-mono text-xs text-muted-foreground md:text-left">
            <p>
              © {new Date().getFullYear()} {legalName ?? "POC Ltd"}. All rights
              reserved.
            </p>
            {companyDetails && <p>{companyDetails}</p>}
          </div>
          <Link
            href="#"
            className="flex items-center gap-1 font-mono text-xs text-primary transition-colors hover:text-white"
          >
            {footer.backToTopLabel || "↑ Back to top"}
          </Link>
        </div>
      </div>
    </footer>
  );
}
