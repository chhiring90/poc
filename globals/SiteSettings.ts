import type { GlobalConfig } from "payload";

export const SiteSettings: GlobalConfig = {
  slug: "siteSettings",
  label: "SEO & Site Settings",
  access: { read: () => true },
  admin: {
    description:
      "Site-wide defaults for search engines and social sharing. Individual pages can override these in their SEO tab.",
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Defaults",
          fields: [
            {
              name: "siteName",
              type: "text",
              required: true,
              defaultValue: "POC Tech",
              admin: {
                description:
                  'Added after every page title, e.g. "Services | POC Tech".',
              },
            },
            {
              name: "defaultTitle",
              label: "Home page title",
              type: "text",
              admin: {
                description:
                  "Full browser title for the home page. Falls back to the site name.",
              },
            },
            {
              name: "defaultDescription",
              label: "Default description",
              type: "textarea",
              maxLength: 320,
              admin: {
                description:
                  "Used for any page that has no description of its own. 140–160 characters.",
              },
            },
            {
              name: "defaultImage",
              label: "Default share image",
              type: "upload",
              relationTo: "media",
              admin: {
                description:
                  "1200×630. Used when a page has no image. If empty, a branded image is generated from the page title.",
              },
            },
            {
              name: "locale",
              type: "text",
              defaultValue: "en_GB",
              admin: { description: "Open Graph locale, e.g. en_GB or en_US." },
            },
            {
              name: "twitterHandle",
              label: "X / Twitter handle",
              type: "text",
              admin: { description: "Including the @, e.g. @poctech." },
            },
          ],
        },
        {
          label: "Organization",
          description:
            "Used for structured data (schema.org) so search engines understand who runs the site. Only fill in what is true and public.",
          fields: [
            {
              name: "organization",
              type: "group",
              fields: [
                {
                  name: "name",
                  type: "text",
                  admin: { description: "Falls back to the site name." },
                },
                { name: "legalName", type: "text" },
                { name: "logo", type: "upload", relationTo: "media" },
                { name: "email", type: "email" },
                { name: "telephone", type: "text" },
                {
                  name: "address",
                  type: "group",
                  fields: [
                    { name: "streetAddress", type: "text" },
                    { name: "locality", label: "City", type: "text" },
                    { name: "region", type: "text" },
                    { name: "postalCode", type: "text" },
                    {
                      name: "country",
                      type: "text",
                      admin: { description: "Two-letter code, e.g. GB." },
                    },
                  ],
                },
                {
                  name: "areaServed",
                  type: "text",
                  admin: {
                    description:
                      'Where you work, e.g. "United Kingdom". Used on service pages.',
                  },
                },
                {
                  name: "sameAs",
                  label: "Profile links",
                  type: "array",
                  admin: {
                    description:
                      "Full URLs of official profiles (LinkedIn, GitHub, Clutch…). Falls back to the footer social links.",
                  },
                  fields: [{ name: "url", type: "text", required: true }],
                },
              ],
            },
          ],
        },
        {
          label: "Indexing",
          fields: [
            {
              name: "allowIndexing",
              label: "Allow search engines to index this site",
              type: "checkbox",
              defaultValue: true,
              admin: {
                description:
                  "Untick on staging. Preview deployments (VERCEL_ENV other than production) are never indexed.",
              },
            },
            {
              name: "verification",
              type: "group",
              admin: {
                description: "Site ownership codes from webmaster tools.",
              },
              fields: [
                {
                  name: "google",
                  label: "Google Search Console",
                  type: "text",
                },
                { name: "bing", label: "Bing Webmaster Tools", type: "text" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
