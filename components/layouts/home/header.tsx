import { findGlobalCached } from "@/lib/cms/cache";
import { icons } from "lucide-react";
import { Nav, type HeaderData } from "@/components/ui/nav";

/** Turns each mega-menu link's icon name into a rendered Lucide icon. */
function withIcons(header: HeaderData): HeaderData {
  if (!header?.navItems) return header;

  return {
    ...header,
    navItems: header.navItems.map((item) => ({
      ...item,
      columns: item.columns?.map((column) => ({
        ...column,
        links: column.links?.map((link) => {
          const Icon =
            link.icon && link.icon in icons
              ? icons[link.icon as keyof typeof icons]
              : null;
          return Icon
            ? { ...link, iconElement: <Icon aria-hidden="true" /> }
            : link;
        }),
      })),
    })),
  };
}

export async function Header() {
  const header = await findGlobalCached("header", 2);

  return <Nav data={withIcons(header as HeaderData)} />;
}
