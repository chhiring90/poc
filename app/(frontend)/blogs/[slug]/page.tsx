import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { Footer } from "@/components/layouts/home";
import { isBlogDocument } from "@/lib/helper/is-blog-document.helper";

export default async function BlogArticle({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();
  const { slug } = await params;
  const payload = await getPayload({ config });
  const { docs } = await payload.find({
    collection: "posts",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  });
  const candidate: unknown = docs[0];

  if (!isBlogDocument(candidate)) notFound();
  const post = candidate;
  const author =
    typeof post.author === "object" && post.author !== null ? post.author : null;
  const coverImage =
    typeof post.coverImage === "object" && post.coverImage !== null
      ? post.coverImage
      : null;
  const categories = (post.categories ?? []).filter(
    (
      category,
    ): category is { id?: string | number; title: string } =>
      typeof category === "object" && category !== null,
  );
  const authorName = [author?.firstName, author?.lastName]
    .filter((name): name is string => Boolean(name))
    .join(" ");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <article className="mx-auto max-w-4xl px-5 pb-24 pt-36">
        <Link
          href="/blogs"
          className="mb-10 inline-flex text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          ← Back to blog
        </Link>

        <div className="mb-5 flex flex-wrap gap-2">
          {categories.map((category, index) => (
            <span
              key={category.id ?? `${category.title}-${index}`}
              className="rounded-none bg-primary/10 px-3 py-1 font-mono text-xs text-primary"
            >
              {category.title}
            </span>
          ))}
        </div>
        <h1 className="mb-5 font-display text-4xl font-bold tracking-tight md:text-6xl">
          {post.title}
        </h1>
        <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-sm text-muted-foreground">
          {authorName && <span>{authorName}</span>}
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </time>
          )}
        </div>
        {coverImage?.url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverImage.url}
            alt={coverImage.alt ?? post.title}
            className="mb-10 max-h-[32rem] w-full rounded-none object-cover"
          />
        )}
        {post.excerpt && (
          <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
            {post.excerpt}
          </p>
        )}
        {post.content && (
          <RichText
            data={post.content}
            className="text-base leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:font-bold [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
          />
        )}
      </article>
      <Footer />
    </div>
  );
}
