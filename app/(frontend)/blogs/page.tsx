import type { Metadata } from "next";
import { buildGlobalPageMetadata } from "@/lib/seo/global-page-metadata";
import { Suspense } from "react";
import type { Where } from "payload";
import { findCached, findGlobalCached } from "@/lib/cms/cache";
import { Footer } from "@/components/layouts/home";
import { ClosingBand } from "@/components/layouts/shared/page-blocks";
import { BlogListing } from "@/components/layouts/blog/blog-listing";
import { renderAsteriskText } from "@/lib/helper/render-asterisk-text.helper";
import { toBlogPost } from "@/lib/helper/to-blog-post.helper";

type BlogSearchParams = Promise<{
  page?: string | string[];
  category?: string | string[];
}>;

type BlogPageProps = { searchParams: BlogSearchParams };

// Three full rows of three.
const POSTS_PER_PAGE = 9;

export function generateMetadata(): Promise<Metadata> {
  return buildGlobalPageMetadata({
    global: "blogPage",
    path: "/blogs",
    titleFields: ["heading"],
    descriptionFields: ["description", "subheading"],
    fallbackTitle: "Blog",
    fallbackDescription:
      "Practical articles on building websites, apps and digital products, from the POC Tech team.",
  });
}

/**
 * Post list for the current ?page / ?category. Query params are only known at
 * request time, so this streams inside <Suspense>; the queries themselves are
 * cached per argument set.
 */
async function BlogPosts({
  searchParams,
  selectedPosts,
}: {
  searchParams: BlogSearchParams;
  selectedPosts: unknown[];
}) {
  const query = await searchParams;
  const requestedPage = Array.isArray(query.page) ? query.page[0] : query.page;
  const requestedCategory = Array.isArray(query.category)
    ? query.category[0]
    : query.category;
  const parsedPage = Number.parseInt(requestedPage ?? "1", 10);
  const page = Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const categoryResult = await findCached({
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
  let featuredResult = await findCached({
    collection: "posts",
    depth: 1,
    limit: 1,
    sort: "-publishedAt",
    where:
      featuredPostID !== undefined
        ? { id: { equals: featuredPostID } }
        : undefined,
  });
  if (featuredResult.docs.length === 0 && featuredPostID !== undefined) {
    featuredResult = await findCached({
      collection: "posts",
      depth: 1,
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
  // The featured post always shows above the filters, so never repeat it in the list.
  if (featuredDocumentID !== undefined) {
    conditions.push({ id: { not_equals: featuredDocumentID } });
  }
  if (activeCategory) {
    conditions.push({ categories: { in: [activeCategory.id] } });
  }
  const result = await findCached({
    collection: "posts",
    depth: 1,
    limit: POSTS_PER_PAGE,
    page,
    sort: "-publishedAt",
    ...(conditions.length > 0 ? { where: { and: conditions } } : {}),
  });
  const posts = result.docs.map(toBlogPost).filter((post) => post !== null);

  return (
    <BlogListing
      posts={posts}
      featuredPost={featuredPost}
      categories={categories}
      activeCategory={activeCategory?.slug ?? ""}
      currentPage={result.page ?? page}
      totalPages={result.totalPages}
    />
  );
}

export default async function Blog({ searchParams }: BlogPageProps) {
  const blogPage = await findGlobalCached("blogPage", 1);
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
      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-16 pt-36 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-end lg:gap-16 lg:px-10 lg:pb-20">
        <div>
          <p className="mb-5 font-mono text-sm font-medium text-primary">
            {`// ${subheading.toLowerCase()}`}
          </p>
          <h1 className="text-balance whitespace-pre-line font-display text-5xl font-bold leading-[1.02] tracking-tight md:text-6xl xl:text-7xl">
            {renderAsteriskText(heading)}
          </h1>
        </div>
        {description && (
          <p className="max-w-[44ch] text-lg leading-relaxed text-muted-foreground lg:pb-2">
            {description}
          </p>
        )}
      </section>

      <Suspense
        fallback={
          <div
            aria-busy="true"
            className="mx-auto min-h-[60vh] max-w-7xl px-5 lg:px-10"
          />
        }
      >
        <BlogPosts
          searchParams={searchParams}
          selectedPosts={blogPage.posts ?? []}
        />
      </Suspense>

      {cta?.title && (
        <ClosingBand
          eyebrow={cta.subtitle}
          heading={cta.title}
          description={cta.description}
          cta={{
            label: cta.button && cta.buttonUrl ? cta.button : "",
            url: cta.buttonUrl ?? "",
          }}
        />
      )}
      <Footer />
    </div>
  );
}
