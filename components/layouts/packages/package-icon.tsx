import { Package, icons } from "lucide-react";

export function PackageIcon({
  name,
  className = "size-5",
}: {
  name?: string | null;
  className?: string;
}) {
  const Icon = name && name in icons ? icons[name as keyof typeof icons] : Package;
  return <Icon aria-hidden="true" className={className} />;
}
