import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { findCached, findSlugsCached } from "@/lib/cms/cache";
import { Footer } from "@/components/layouts/home";
import { RichTextWithTableOfContents } from "@/components/layouts/rich-text/rich-text-with-table-of-contents";
import { JsonLd } from "@/components/seo/json-ld";
import { ShareButtons } from "@/components/layouts/blog/share-buttons";
import { getRichTextPlainText } from "@/lib/helper/get-rich-text-plain-text.helper";
import { isBlogDocument } from "@/lib/helper/is-blog-document.helper";
import { isRecord } from "@/lib/helper/is-record.helper";
import { buildPageMetadata } from "@/lib/seo/build-metadata";
import { blogPostingJsonLd, breadcrumbJsonLd } from "@/lib/seo/json-ld";
import { parseMedia, parseSeo, truncate } from "@/lib/seo/parse";
import { absoluteUrl } from "@/lib/seo/site-url";

type BlogPageProps = { params: Promise<{ slug: string }> };

/** Raw post document, shared by generateMetadata and the page (cached across requests). */
async function getPostBySlug(slug: string) {
  const { docs } = await findCached({
    collection: "posts",
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  });
  const doc: unknown = docs[0];
  return isRecord(doc) ? doc : null;
}

/**
 * Prerender every known slug at build time. Cache Components needs at least
 * one entry, so an empty CMS falls back to a placeholder that 404s; slugs
 * added later are rendered on first visit and then cached.
 */
export async function generateStaticParams() {
  const slugs = await findSlugsCached("posts");
  return (slugs.length > 0 ? slugs : ["__placeholder__"]).map((slug) => ({
    slug,
  }));
}

function mediaSize(
  media: object,
  key: "width" | "height",
  fallback: number,
): number {
  const value: unknown = (media as Record<string, unknown>)[key];
  return typeof value === "number" && value > 0 ? value : fallback;
}

function getPostSeoData(raw: Record<string, unknown>) {
  if (!isBlogDocument(raw)) return null;
  const author = isRecord(raw.author) ? raw.author : null;
  const authorName = [author?.firstName, author?.lastName]
    .filter((name): name is string => typeof name === "string" && !!name)
    .join(" ");
  const categories = (raw.categories ?? []).flatMap((category) =>
    isRecord(category) && typeof category.title === "string"
      ? [category.title]
      : [],
  );
  const description =
    raw.excerpt || truncate(getRichTextPlainText(raw.content), 300);

  return {
    post: raw,
    authorName,
    categories,
    description,
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : null,
    isDraft: raw._status === "draft",
  };
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const raw = await getPostBySlug(slug);
  const data = raw ? getPostSeoData(raw) : null;
  if (!data) return {};

  return buildPageMetadata({
    path: `/blogs/${slug}`,
    seo: data.post.seo,
    title: data.post.title,
    description: data.description,
    image: data.post.coverImage,
    noIndex: data.isDraft,
    article: {
      publishedTime: data.post.publishedAt,
      modifiedTime: data.updatedAt,
      authors: data.authorName ? [data.authorName] : undefined,
      section: data.categories[0],
      tags: data.categories,
    },
  });
}

export default async function BlogArticle({ params }: BlogPageProps) {
  const { slug } = await params;
  const raw = await getPostBySlug(slug);
  const seoData = raw ? getPostSeoData(raw) : null;

  if (!seoData) notFound();
  const post = seoData.post;
  const path = `/blogs/${slug}`;
  const shareUrl = absoluteUrl(path);
  const jsonLd = [
    blogPostingJsonLd({
      title: post.title,
      description: parseSeo(post.seo).description ?? seoData.description,
      path,
      image: parseMedia(post.coverImage)?.url,
      publishedTime: post.publishedAt,
      modifiedTime: seoData.updatedAt,
      authorName: seoData.authorName,
      section: seoData.categories[0],
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blogs" },
      { name: post.title, path },
    ]),
  ];
  const author =
    typeof post.author === "object" && post.author !== null
      ? post.author
      : null;
  const coverImage =
    typeof post.coverImage === "object" && post.coverImage !== null
      ? post.coverImage
      : null;
  const categories = (post.categories ?? []).filter(
    (category): category is { id?: string | number; title: string } =>
      typeof category === "object" && category !== null,
  );
  const authorName = [author?.firstName, author?.lastName]
    .filter((name): name is string => Boolean(name))
    .join(" ");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <JsonLd data={jsonLd} />
      <article className="mx-auto max-w-7xl px-5 pb-24 pt-36 lg:px-10">
        <Link
          href="/blogs"
          className="mb-10 inline-flex text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          ← Back to blog
        </Link>

        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {categories.map((category, index) => (
              <span
                key={category.id ?? `${category.title}-${index}`}
                className="rounded-none bg-primary/10 px-3 py-1 font-mono text-xs text-primary"
              >
                {category.title}
              </span>
            ))}
          </div>
          <ShareButtons url={shareUrl} title={post.title} className="ml-auto" />
        </div>
        <h1 className="mb-5 font-display text-4xl font-bold tracking-tight md:text-6xl">
          {post.title}
        </h1>
        <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-sm text-muted-foreground">
          {authorName && <span>{authorName}</span>}
          {post.publishedAt && (
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("en-GB", {
                month: "long",
                day: "numeric",
                year: "numeric",
                timeZone: "UTC",
              })}
            </time>
          )}
        </div>
        {coverImage?.url && (
          <Image
            src={coverImage.url}
            alt={coverImage.alt ?? post.title}
            width={mediaSize(coverImage, "width", 1600)}
            height={mediaSize(coverImage, "height", 900)}
            sizes="(min-width: 1280px) 1200px, 100vw"
            preload
            className="mb-10 h-auto max-h-128 w-full rounded-none object-cover"
          />
        )}
        {post.content && (
          <RichTextWithTableOfContents
            content={post.content}
            className="text-base leading-relaxed text-muted-foreground [&_a]:text-primary [&_a]:underline [&_h2]:mb-4 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-3xl [&_h2]:font-bold [&_h3]:mb-3 [&_h3]:mt-8 [&_h3]:font-display [&_h3]:text-2xl [&_h3]:font-bold [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:mb-5 [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6"
          />
        )}
        <ShareButtons
          url={shareUrl}
          title={post.title}
          label="Share this article"
          className="mt-14 border-t-2 border-border pt-8"
        />
      </article>
      <Footer />
    </div>
  );
}
