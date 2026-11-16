import type { Field, GroupField, Tab } from "payload";

const seoSubFields: Field[] = [
  {
    name: "title",
    label: "Meta title",
    type: "text",
    admin: {
      description:
        "Shown in Google and browser tabs. Aim for 50–60 characters; the site name is added automatically. Leave empty to use the page title.",
    },
  },
  {
    name: "description",
    label: "Meta description",
    type: "textarea",
    maxLength: 320,
    admin: {
      description:
        "One plain sentence for search results and link previews. Aim for 140–160 characters. Leave empty to use the page intro.",
    },
  },
  {
    name: "image",
    label: "Share image",
    type: "upload",
    relationTo: "media",
    admin: {
      description:
        "Used when the page is shared on social media or in chat apps. Best size 1200×630. Leave empty to use the page image or a generated one.",
    },
  },
  {
    name: "noIndex",
    label: "Hide from search engines",
    type: "checkbox",
    defaultValue: false,
    admin: {
      description: "Adds noindex and removes the page from the sitemap.",
    },
  },
];

/** Optional SEO overrides. Every value falls back to the page's own content. */
export function seoField(): GroupField {
  return {
    name: "seo",
    label: "SEO",
    type: "group",
    admin: {
      description:
        "Optional. Everything here falls back to the page content when left empty.",
    },
    fields: seoSubFields,
  };
}

/** The same fields as an "SEO" tab, for configs that use tabs. */
export function seoTab(): Tab {
  return { label: "SEO", fields: [seoField()] };
}
