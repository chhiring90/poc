import Link from "next/link";
import { connection } from "next/server";
import config from "@payload-config";
import { getPayload } from "payload";
import type { Where } from "payload";
import { Footer } from "@/components/layouts/home";
import { BlogListing } from "@/components/layouts/blog/blog-listing";
import { renderAsteriskText } from "@/lib/helper/render-asterisk-text.helper";
import { toBlogPost } from "@/lib/helper/to-blog-post.helper";

type BlogPageProps = {
  searchParams: Promise<{
    page?: string | string[];
    category?: string | string[];
  }>;
};

const POSTS_PER_PAGE = 7;

export default async function Blog({ searchParams }: BlogPageProps) {
  await connection();
  const query = await searchParams;
  const requestedPage = Array.isArray(query.page) ? query.page[0] : query.page;
  const requestedCategory = Array.isArray(query.category)
    ? query.category[0]
    : query.category;
  const parsedPage = Number.parseInt(requestedPage ?? "1", 10);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const payload = await getPayload({ config });
  const blogPage = await payload.findGlobal({
    slug: "blogPage",
    depth: 1,
  });

  const categoryResult = await payload.find({
    collection: "categories",
    depth: 0,
    limit: 100,
    sort: "title",
  });
  const categories = categoryResult.docs.map(({ id, title, slug }) => ({
    id,
    title,
    slug,
  }));
  const activeCategory = categories.find(
    (category) => category.slug === requestedCategory,
  );

  const selectedPosts: unknown[] = blogPage.posts ?? [];
  const selectedPostIDs = selectedPosts
    .map((post) => {
      if (typeof post === "string" || typeof post === "number") return post;
      if (typeof post === "object" && post !== null && "id" in post) {
        const id = post.id;
        return typeof id === "string" || typeof id === "number" ? id : null;
      }
      return null;
    })
    .filter((id): id is string | number => id !== null);
  const featuredPostID = selectedPostIDs[0];
  let featuredResult = await payload.find({
    collection: "posts",
    depth: 2,
    limit: 1,
    sort: "-publishedAt",
    where:
      featuredPostID !== undefined
        ? { id: { equals: featuredPostID } }
        : undefined,
  });
  if (featuredResult.docs.length === 0 && featuredPostID !== undefined) {
    featuredResult = await payload.find({
      collection: "posts",
      depth: 2,
      limit: 1,
      sort: "-publishedAt",
    });
  }
  const featuredPost = toBlogPost(featuredResult.docs[0]);
  const featuredDocumentID = featuredResult.docs[0]?.id;

  const conditions: Where[] = [];
  if (selectedPostIDs.length > 0) {
    conditions.push({ id: { in: selectedPostIDs } });
  }
  if (featuredDocumentID !== undefined) {
    conditions.push({ id: { not_equals: featuredDocumentID } });
  }
  if (activeCategory) {
    conditions.push({ categories: { in: [activeCategory.id] } });
  }
  const result = await payload.find({
    collection: "posts",
    depth: 2,
    limit: POSTS_PER_PAGE,
    page,
    sort: "-publishedAt",
    ...(conditions.length > 0 ? { where: { and: conditions } } : {}),
  });
  const posts = result.docs.map(toBlogPost).filter((post) => post !== null);
  const heading =
    typeof blogPage.heading === "string" && blogPage.heading
      ? blogPage.heading
      : "Thoughts from *the build*.";
  const subheading =
    typeof blogPage.subheading === "string" && blogPage.subheading
      ? blogPage.subheading
      : "The lab blog";
  const description =
    typeof blogPage.description === "string" ? blogPage.description : "";
  const cta = blogPage.cta;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-5 pb-16 pt-36 lg:px-10">
        <div className="max-w-xl">
          <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {`// ${subheading}`}
          </span>
          <h1 className="mb-6 whitespace-pre-line font-display text-5xl font-bold tracking-tight md:text-6xl">
            {renderAsteriskText(heading)}
          </h1>
          {description && (
            <p className="max-w-xl text-lg text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </section>

      <BlogListing
        posts={posts}
        featuredPost={featuredPost}
        categories={categories}
        activeCategory={activeCategory?.slug ?? ""}
        currentPage={result.page ?? page}
        totalPages={result.totalPages}
      />

      {cta?.title && (
        <section className="bg-primary py-24">
          <div className="mx-auto max-w-7xl px-5 text-center lg:px-10">
            {cta.subtitle && (
              <p className="mb-3 font-mono text-xs uppercase tracking-widest text-primary-foreground/70">
                {cta.subtitle}
              </p>
            )}
            <h2 className="mb-4 font-display text-4xl font-bold text-primary-foreground md:text-5xl">
              {cta.title}
            </h2>
            {cta.description && (
              <p className="mx-auto mb-8 max-w-xl text-lg text-primary-foreground/70">
                {cta.description}
              </p>
            )}
            {cta.button && cta.buttonUrl && (
              <Link
                href={cta.buttonUrl}
                className="inline-flex rounded-none bg-foreground px-8 py-4 text-base font-bold text-background transition-opacity hover:opacity-90"
              >
                {cta.button}
              </Link>
            )}
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}
