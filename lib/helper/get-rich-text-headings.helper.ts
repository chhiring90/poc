import { isRecord } from "@/lib/helper/is-record.helper";

export type RichTextHeading = {
  id: string;
  level: number;
  text: string;
};

export function getRichTextHeadings(content: unknown) {
  const headingIds = new WeakMap<object, string>();
  if (!isRecord(content) || !isRecord(content.root)) {
    return { headings: [], headingIds };
  }

  const headings: RichTextHeading[] = [];
  const usedIds = new Set<string>();

  function getNodeText(node: unknown): string {
    if (!isRecord(node)) return "";
    if (typeof node.text === "string") return node.text;
    if (!Array.isArray(node.children)) return "";

    return node.children.map(getNodeText).join("");
  }

  function visit(node: unknown) {
    if (!isRecord(node)) return;

    if (
      node.type === "heading" &&
      typeof node.tag === "string" &&
      /^h[2-6]$/.test(node.tag)
    ) {
      const text = getNodeText(node).trim();
      if (text) {
        const baseId =
          text
            .normalize("NFKD")
            .toLowerCase()
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "") || `section-${headings.length + 1}`;
        let id = baseId;
        let suffix = 2;
        while (usedIds.has(id)) {
          id = `${baseId}-${suffix}`;
          suffix += 1;
        }
        usedIds.add(id);
        headings.push({
          id,
          level: Number(node.tag.slice(1)),
          text,
        });
        headingIds.set(node, id);
      }
    }

    if (Array.isArray(node.children)) {
      node.children.forEach(visit);
    }
  }

  visit(content.root);
  return { headings, headingIds };
}
