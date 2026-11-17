import { seoTab } from "@/collections/fields/seo";
import type { GlobalConfig } from "payload";
import { iconField } from "@/collections/fields";
import { ABOUT_DEFAULTS as D } from "@/lib/const/about.const";

const RowLabel = "/components/admin/RowLabel/titleRowLabel#TitleRowLabel";

export const About: GlobalConfig = {
  slug: "about",
  label: "About",
  admin: {
    description:
      "Content for /about. Empty fields show the default copy on the site.",
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Hero",
          fields: [
            {
              name: "hero",
              type: "group",
              fields: [
                {
                  name: "subheading",
                  label: "Eyebrow",
                  type: "text",
                  required: true,
                  defaultValue: D.hero.eyebrow,
                },
                {
                  name: "heading",
                  type: "text",
                  required: true,
                  defaultValue: D.hero.heading,
                  admin: {
                    description:
                      "Wrap words in *asterisks* to highlight them in brand red.",
                  },
                },
                {
                  name: "description",
                  label: "Tagline",
                  type: "textarea",
                  required: true,
                  defaultValue: D.hero.description,
                },
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  required: true,
                },
              ],
            },
            {
              name: "facts",
              label: "Proof points",
              type: "array",
              admin: {
                description:
                  "Optional facts shown under the hero, e.g. “15+” / “years building for the web”. Hidden while empty.",
                components: { RowLabel },
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "value",
                      type: "text",
                      required: true,
                      admin: { width: "30%" },
                    },
                    {
                      name: "label",
                      type: "text",
                      admin: { width: "70%" },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Story",
          fields: [
            {
              name: "story",
              label: false,
              type: "group",
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  defaultValue: D.story.eyebrow,
                },
                {
                  name: "chapters",
                  type: "array",
                  admin: {
                    description: "Shown in this order and numbered automatically.",
                    components: { RowLabel },
                  },
                  defaultValue: D.story.chapters,
                  fields: [
                    { name: "title", type: "text", required: true },
                    { name: "body", type: "textarea" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Values",
          fields: [
            {
              name: "values",
              label: false,
              type: "group",
              fields: [
                {
                  name: "subtitle",
                  label: "Eyebrow",
                  type: "text",
                  required: true,
                  defaultValue: D.values.eyebrow,
                },
                {
                  name: "title",
                  label: "Heading",
                  type: "text",
                  required: true,
                  defaultValue: D.values.heading,
                },
                {
                  name: "description",
                  type: "textarea",
                  required: true,
                  defaultValue: D.values.description,
                },
                {
                  name: "value-lists",
                  label: "Values",
                  type: "array",
                  admin: { components: { RowLabel } },
                  defaultValue: D.values.items,
                  fields: [
                    iconField("icon"),
                    { name: "title", type: "text", required: true },
                    { name: "tagline", type: "text" },
                    { name: "description", type: "textarea", required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Team",
          fields: [
            {
              name: "team",
              label: false,
              type: "group",
              fields: [
                {
                  name: "show",
                  label: "Show the team section",
                  type: "checkbox",
                  defaultValue: false,
                  admin: {
                    description:
                      "Off until team names, photos and bios are ready.",
                  },
                },
                {
                  name: "subheading",
                  label: "Eyebrow",
                  type: "text",
                  defaultValue: D.team.eyebrow,
                },
                {
                  name: "heading",
                  type: "text",
                  defaultValue: D.team.heading,
                },
                {
                  name: "members",
                  type: "relationship",
                  relationTo: "team",
                  hasMany: true,
                  admin: { description: "Choose and order the people shown." },
                },
              ],
            },
          ],
        },
        {
          label: "Closing",
          fields: [
            {
              name: "closing",
              label: false,
              type: "group",
              fields: [
                {
                  name: "heading",
                  type: "text",
                  defaultValue: D.closing.heading,
                },
                {
                  name: "description",
                  type: "textarea",
                  defaultValue: D.closing.description,
                },
                {
                  name: "cta",
                  label: "Button",
                  type: "group",
                  fields: [
                    {
                      type: "row",
                      fields: [
                        {
                          name: "label",
                          type: "text",
                          defaultValue: D.closing.cta.label,
                        },
                        {
                          name: "url",
                          type: "text",
                          defaultValue: D.closing.cta.url,
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              // No longer shown on the site; kept so existing content isn't lost.
              name: "career",
              type: "group",
              admin: { hidden: true },
              fields: [
                { name: "title", type: "text" },
                { name: "description", type: "textarea" },
                {
                  name: "cta",
                  type: "group",
                  fields: [
                    { name: "caption", type: "text" },
                    { name: "url", type: "text" },
                  ],
                },
              ],
            },
          ],
        },
        seoTab(),
      ],
    },
  ],
};
