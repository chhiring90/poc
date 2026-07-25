import { ChevronDown } from "lucide-react";
import Link from "next/link";

const NAV_LINKS = [
  { name: "About us", link: "/about" },
  { name: "Services", link: "/services" },
  { name: "Portfolio", link: "/portfolio" },
  { name: "Blog", link: "/blog" },
];

function Header() {
  return (
    <header className="relative z-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 lg:px-12">
        <span className="text-sm font-bold tracking-[0.18em]">IDEA LAB</span>
        <ul className="hidden items-center gap-10 text-sm font-medium md:flex">
          {NAV_LINKS.map(({ name, link }) => (
            <li
              key={link}
              className={`flex items-center gap-1 ${
                link === "/about" ? "font-semibold" : "text-[#1C1B19]/70"
              }`}
            >
              <Link href={link}>{name}</Link>
              {link === "/portfolio" ? (
                <ChevronDown className="h-2.5 w-2.5" />
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export { Header };
