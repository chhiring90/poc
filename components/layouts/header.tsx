const NAV_LINKS = ["About us", "Services", "Portfolio", "Blog"];
function Header() {
  return (
    <header className="relative z-10">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-8 lg:px-12">
        <span className="text-sm font-bold tracking-[0.18em]">IDEA LAB</span>
        <ul className="hidden items-center gap-10 text-sm font-medium md:flex">
          {NAV_LINKS.map((link) => (
            <li
              key={link}
              className={`flex items-center gap-1 ${
                link === "About us" ? "font-semibold" : "text-[#1C1B19]/70"
              }`}
            >
              {link}
              {link === "Portfolio" && (
                <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
                  <path
                    d="M1 1L5 5L9 1"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export { Header };
