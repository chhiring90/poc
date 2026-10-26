import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { RichTextWithTableOfContents } from "@/components/layouts/rich-text/rich-text-with-table-of-contents";
import { Footer } from "@/components/layouts/home";
import { getLegalPolicies, getLegalPolicy } from "@/lib/legal-policy";

type LegalPolicyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: LegalPolicyPageProps): Promise<Metadata> {
  await connection();
  const { slug } = await params;
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
  const [policy, policies] = await Promise.all([
    getLegalPolicy(slug),
    getLegalPolicies(),
  ]);
  if (!policy) notFound();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <article className="mx-auto max-w-7xl px-5 pb-24 pt-36 lg:px-10">
        <nav
          aria-label="Legal policies"
          className="mb-10 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground"
        >
          {policies.map((item) => (
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
        {policy.content ? (
          <RichTextWithTableOfContents content={policy.content} />
        ) : (
          <p className="text-muted-foreground">
            This policy is being prepared. Please check back soon.
          </p>
        )}
      </article>
      <Footer />
    </div>
  );
}
