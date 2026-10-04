"use client";

import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";

const routes: Record<string, string> = {
  home: "/",
  work: "/work",
  about: "/about",
  blog: "/blogs",
  contact: "/contact",
  services: "/services",
};

export function useSiteControls() {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  return {
    dark,
    setPage: (page: string) => router.push(routes[page] ?? "/"),
    toggleDark: () => setTheme(dark ? "light" : "dark"),
  };
}
