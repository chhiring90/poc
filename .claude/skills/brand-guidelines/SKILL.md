---
name: brand-guidelines
description: Applies this site's (POC Tech) brand — warm paper palette, brick-red primary, Space Grotesk / Inter / JetBrains Mono type, square corners, hard offset shadows — as defined in app/(frontend)/globals.css. Use when building or restyling UI, components, pages, charts, or any artifact (slides, docs, images) that should match the site's look-and-feel.
---

# POC Tech brand guidelines

The source of truth is `app/(frontend)/globals.css`. If a value here disagrees with that file, the file wins, so update this skill to match.

**Style in one line:** warm, editorial and a little brutalist. The site uses paper and ink tones, a brick-red accent, bold geometric headings, monospace labels, 2px borders, square corners, and hard offset shadows with no blur.

## Colours

Write code with the semantic tokens, never raw hex. Use `bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `bg-primary`, `text-primary`, `border-border`, `bg-accent`, `bg-secondary`, `text-destructive`, and `bg-chart-1` through `bg-chart-5`. Every token switches automatically in `.dark`.

The hex values below are for artifacts outside the codebase, such as slides, PDFs and images.

| Role                      | Token                | Light     | Dark      |
| ------------------------- | -------------------- | --------- | --------- |
| Page background ("paper") | `background`         | `#f4ebdd` | `#241d17` |
| Card / popover surface    | `card`               | `#fff9ef` | `#30271f` |
| Raised / muted surface    | `muted`              | `#f9f1e2` | `#3a3027` |
| Text ("ink")              | `foreground`         | `#2c241c` | `#f4ebdd` |
| Muted text                | `muted-foreground`   | `#61564b` | `#c6b8a7` |
| Borders and inputs        | `border`             | `#40352c` | `#927d64` |
| Offset shadow colour      | `--color-shadow`     | `#695139` | `#100c09` |
| **Primary (brick red)**   | `primary`            | `#9f3f32` | `#e48061` |
| Text on primary           | `primary-foreground` | `#fff9ef` | `#241d17` |
| Secondary (sand)          | `secondary`          | `#e4d2b0` | `#584736` |
| Accent / "proof" (amber)  | `accent`             | `#e5ad4e` | `#f0bc58` |
| Focus ring                | `ring`               | `#9f3f32` | `#e48061` |
| Danger                    | `destructive`        | `#9f3028` | `#f19a86` |
| Success                   | `success`            | `#356a4a` | `#72a77e` |
| Warning                   | `warning`            | `#e5ad4e` | `#f0bc58` |
| Info                      | `info`               | `#315c7a` | `#78a9c3` |

Each status colour has a matching `-foreground` token for text on top of it. In light mode those are cream (`#fff9ef`), except warning, which uses ink (`#2c241c`). In dark mode they are dark brown (`#241d17`).

**How to use them**

- Brick red marks interactive and important elements: primary buttons, links, eyebrow labels, icons, prices, and focus rings. Use it sparingly.
- Amber (`accent` / `proof`) highlights proof points, stats and badges. Don't put long text on it.
- Sand (`secondary`) is for quiet chips and tags, such as technology badges.
- Charts use a fixed series order: `chart-1` primary, `chart-2` amber, `chart-3` info blue, `chart-4` success green, `chart-5` muted.
- Text on paper or cream is always ink or muted ink. Never use pure black (`#000`) or pure white (`#fff`).

## Typography

The fonts load through `next/font` in `app/(frontend)/layout.tsx`.

| Use                            | Font                        | Tailwind                                | Fallback for artifacts  |
| ------------------------------ | --------------------------- | --------------------------------------- | ----------------------- |
| Headings and display           | **Space Grotesk**, bold 700 | `font-display font-bold tracking-tight` | Arial / Helvetica       |
| Body and UI                    | **Inter**, 400 or 500       | `font-sans` (default)                   | Arial                   |
| Labels, eyebrows, code, prices | **JetBrains Mono**          | `font-mono`                             | Courier New / monospace |

- Headings `h1` to `h6` are already styled in the base layer: Space Grotesk, bold, letter-spacing `-0.035em`, line-height `1.12`.
- Body text is 1rem with line-height `1.6`.
- **Eyebrows and labels** use `font-mono text-xs uppercase tracking-widest text-primary`. Add a `// ` prefix for a code-comment flavour, for example `// Our services`.
- Type scale: `text-xs` 0.75rem, `sm` 0.875rem, `base` 1rem, `lg` 1.125rem, `xl` 1.25rem, `2xl` 1.5rem. `3xl` is `clamp(1.875rem, ~2.75rem)` and `4xl` is `clamp(2.25rem, ~4.5rem)`; both are fluid.
- Page titles typically use `font-display text-4xl md:text-6xl font-bold tracking-tight`. Section headings use `text-3xl`.

## Shape, borders and shadows

These rules give the site its brutalist character.

- **Corners are near-square.** Radius tokens are 2–4px (`--radius` is 2px), and cards and panels use `rounded-none`. Don't use pill shapes or large rounded corners.
- **Borders are heavy.** The default is 2px (`border-2 border-border`), with 1px for hairlines and 3px for strong emphasis.
- **Shadows are hard offsets with no blur**, using the shadow colour:
  - Controls (buttons, inputs): `3px 3px 0`, as `shadow-sm` / `var(--shadow-control)`.
  - Cards and panels: `6px 6px 0`, as `shadow-xl` / `shadow-[var(--shadow-card)]`.
  - Don't use soft, blurred or coloured glow shadows.
- The standard card style is `rounded-none border-2 border-border shadow-[var(--shadow-card)] ring-0`, with section headers separated by `border-b-2 border-border`.

## Layout and spacing

- Spacing scale (rem): 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 6. These are Tailwind `1, 2, 3, 4, 6, 8, 12, 16, 24`.
- The content width is 72rem (`max-w-content`) and the wide width is 80rem (`max-w-wide`). Most pages use `max-w-7xl mx-auto px-5 lg:px-10`.
- The page gutter is `clamp(1rem, 4vw, 2.5rem)`.
- Pages leave generous top space below the fixed header (`pt-36`), and sections are separated with `pb-20` to `pb-28`.

## Motion

- Keep motion subtle and slow. An example is the hero `.hero-grid-glow` sweep, which runs on a 14s linear loop at 0.32 opacity.
- Always respect `prefers-reduced-motion` by disabling the animation and showing a static state.
- Accordions and similar components use `tw-animate-css`. Don't add bouncy or springy easing.

## Artifacts outside the codebase (slides, docs, images)

- Background `#f4ebdd` (or card `#fff9ef`), text `#2c241c`, accent `#9f3f32`. Use amber `#e5ad4e` for one highlight per view at most.
- Headings in Space Grotesk Bold, body in Inter, small uppercase mono labels in JetBrains Mono, with the fallbacks listed above.
- Shapes get a 2px `#40352c` outline, square corners, and a solid `#695139` drop shadow offset 6px right and 6px down.
- For a dark variant, use the dark column of the colour table.

## Don'ts

- Don't hardcode hex values in components. Add or change tokens in `globals.css` instead.
- Don't use gradients on surfaces, glassmorphism, soft or blurred shadows, rounded pills, or pure black and white.
- Don't introduce new fonts or colours that aren't in `globals.css`.
