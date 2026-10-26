import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Footer } from "@/components/layouts/home";
import {
  getLegalPolicy,
  isLegalPolicySlug,
  legalPolicies,
} from "@/lib/legal-policy";

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <article className="mx-auto max-w-4xl px-5 pb-24 pt-36">
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
        {policy.content ? (
          <RichText
            data={policy.content}
            className="text-base leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:font-bold [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
          />
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
