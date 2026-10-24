import { getPayload } from "payload";
import config from "@payload-config";
import { Nav } from "@/components/ui/nav";

export async function Header() {
  const payload = await getPayload({ config });
  const header = await payload.findGlobal({ slug: "header", depth: 2 });

  return <Nav data={header} />;
}
