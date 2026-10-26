import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import {
  RichText,
  type JSXConvertersFunction,
} from "@payloadcms/richtext-lexical/react";
import { PolicySectionNav } from "@/components/layouts/policies/policy-section-nav";
import { Footer } from "@/components/layouts/home";
import { isRecord } from "@/lib/helper/is-record.helper";
import {
  getLegalPolicy,
  isLegalPolicySlug,
  legalPolicies,
} from "@/lib/legal-policy";

type PolicyHeading = {
  id: string;
  level: number;
  text: string;
};

function getNodeText(node: unknown): string {
  if (!isRecord(node)) return "";
  if (typeof node.text === "string") return node.text;
  if (!Array.isArray(node.children)) return "";

  return node.children.map(getNodeText).join("");
}

function getPolicyHeadings(content: unknown) {
  const headingIds = new WeakMap<object, string>();
  if (!isRecord(content) || !isRecord(content.root)) {
    return { headings: [], headingIds };
  }

  const headings: PolicyHeading[] = [];
  const usedIds = new Set<string>();

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

type LegalPolicyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: LegalPolicyPageProps): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  if (!isLegalPolicySlug(slug)) notFound();

  const policy = await getLegalPolicy(slug);
  if (!policy) notFound();

  return {
    title: policy.title,
    description: policy.summary || `${policy.title} for POC Tech.`,
  };
}

export default async function LegalPolicyPage({
  params,
}: LegalPolicyPageProps) {
  await connection();
  const { slug } = await params;
  if (!isLegalPolicySlug(slug)) notFound();

  const policy = await getLegalPolicy(slug);
  if (!policy) notFound();
  const { headings, headingIds } = getPolicyHeadings(policy.content);
  const richTextConverters: JSXConvertersFunction = ({
    defaultConverters,
  }) => ({
    ...defaultConverters,
    heading: ({ node, nodesToJSX }) => {
      const Tag = node.tag;

      return (
        <Tag id={headingIds.get(node)} className="scroll-mt-28">
          {nodesToJSX({ nodes: node.children })}
        </Tag>
      );
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <article className="mx-auto max-w-7xl px-5 pb-24 pt-36 lg:px-10">
        <nav
          aria-label="Legal policies"
          className="mb-10 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"
        >
          {legalPolicies.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              aria-current={item.slug === slug ? "page" : undefined}
              className="transition-colors hover:text-primary aria-[current=page]:font-semibold aria-[current=page]:text-primary"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <h1 className="mb-5 font-display text-4xl font-bold tracking-tight md:text-6xl">
          {policy.title}
        </h1>
        {policy.summary && (
          <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
            {policy.summary}
          </p>
        )}
        {policy.lastUpdated && (
          <p className="mb-8 font-mono text-sm text-muted-foreground">
            Last updated{" "}
            <time dateTime={policy.lastUpdated}>
              {new Date(policy.lastUpdated).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              })}
            </time>
          </p>
        )}
        <div
          className={
            headings.length > 0
              ? "flex flex-col gap-10 lg:flex-row-reverse lg:items-start lg:gap-16"
              : ""
          }
        >
          {headings.length > 0 && (
            <aside className="w-full shrink-0 lg:sticky lg:top-28 lg:w-64">
              <PolicySectionNav headings={headings} />
            </aside>
          )}
          <div className="min-w-0 max-w-4xl flex-1">
            {policy.content ? (
              <RichText
                data={policy.content}
                converters={richTextConverters}
                className="text-base leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:font-bold [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
              />
            ) : (
              <p className="text-muted-foreground">
                This policy is being prepared. Please check back soon.
              </p>
            )}
          </div>
        </div>
      </article>
      <Footer />
    </div>
  );
}
