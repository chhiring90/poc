---
name: frontend-page
description: Build or modify a public Next.js page or section in app/(frontend) that renders Payload CMS data, following this project's layout, styling, and data-fetching conventions. Use when the user asks to add a page, a detail/slug page, or move/restyle a section on an existing page.
---

# Frontend page (Next.js + Payload)

**Read first:** this project runs a newer Next.js version with breaking changes (see `AGENTS.md`). Before you use any Next API you aren't sure about, check the docs in `node_modules/next/dist/docs/01-app/`.

## Conventions

- Public routes live in `app/(frontend)/<route>/page.tsx`, and detail pages in `app/(frontend)/<route>/[slug]/page.tsx`.
- Pages are async server components. The usual pattern is:
  ```tsx
  import { connection } from "next/server";
  import { notFound } from "next/navigation";
  import { getPayload } from "payload";
  import config from "@payload-config";
  import { Footer } from "@/components/layouts/home";

  export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    await connection();                       // render dynamically, so CMS edits show immediately
    const { slug } = await params;            // params is a Promise
    const payload = await getPayload({ config });
    const doc = await getThingBySlug(payload, slug);
    if (!doc) notFound();
    ...
  }
  ```
- Fetch data with helpers in `lib/helper/` that run the result through a type guard. Don't cast raw `payload.find` results inline in new code.
- Run independent queries in parallel with `Promise.all`.
- Render rich text with `RichText` from `@payloadcms/richtext-lexical/react`. For long content with headings, use `RichTextWithTableOfContents` from `components/layouts/rich-text/`.
- For icons stored as strings, look them up with `icons[name as keyof typeof icons]` from `lucide-react`, and check `name in icons` first.

## Layout and styling

- Page shell: `<div className="min-h-screen bg-background text-foreground">`, then `<main className="mx-auto max-w-7xl px-5 pb-24 pt-36 lg:px-10">`, then `<Footer />`.
- Main content with a sidebar: `grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)] lg:gap-16`.
- Typography:
  - Headings: `font-display font-bold tracking-tight`.
  - Eyebrows and labels: `font-mono text-xs uppercase tracking-widest text-primary`.
  - Body text: `text-muted-foreground leading-relaxed`.
- Cards use the brutalist style: `rounded-none border-2 border-border shadow-[var(--shadow-card)] ring-0`.
- Use the shadcn UI primitives in `components/ui/` (Card, Badge, Button, Accordion, Tabs, and so on) and Tailwind theme tokens. Don't hardcode colours.
- Interactive parts go in small `"use client"` components. Keep the page itself a server component.

## Finish

- Add any new public route to `app/sitemap.ts`.
- Run the `check` skill. If the user wants to see the result, use the `run` skill (`pnpm dev`).
