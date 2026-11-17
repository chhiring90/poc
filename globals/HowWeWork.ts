import type { GlobalConfig } from "payload";
import { iconField, seoTab } from "@/collections/fields";
import { HOW_WE_WORK_DEFAULTS as D } from "@/lib/const/how-we-work.const";

const RowLabel = "/components/admin/RowLabel/titleRowLabel#TitleRowLabel";

export const HowWeWorkPage: GlobalConfig = {
  slug: "howWeWorkPage",
  label: "How We Work Page",
  access: { read: () => true },
  admin: {
    description:
      "Content for /how-we-work. Until this is saved once, the site shows the default copy below.",
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
                { name: "eyebrow", type: "text", defaultValue: D.hero.eyebrow },
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
                  type: "textarea",
                  defaultValue: D.hero.description,
                },
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description:
                      "Wide photo shown under the hero, and the page's share image. Landscape, at least 2400 × 1000 px. Leave empty to hide.",
                  },
                },
              ],
            },
            {
              name: "cta",
              label: "Call to action",
              type: "group",
              admin: {
                description: "Used in the hero and again at the end of the page.",
              },
              fields: [
                {
                  type: "row",
                  fields: [
                    {
                      name: "label",
                      type: "text",
                      required: true,
                      defaultValue: D.cta.label,
                    },
                    {
                      name: "url",
                      type: "text",
                      required: true,
                      defaultValue: D.cta.url,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Steps",
          description:
            "The steps themselves live in the Process Steps collection and are shared with the home page.",
          fields: [
            {
              name: "process",
              label: false,
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", defaultValue: D.process.eyebrow },
                { name: "heading", type: "text", defaultValue: D.process.heading },
              ],
            },
          ],
        },
        {
          label: "What to expect",
          fields: [
            {
              name: "commitments",
              label: false,
              type: "group",
              fields: [
                {
                  name: "eyebrow",
                  type: "text",
                  defaultValue: D.commitments.eyebrow,
                },
                {
                  name: "heading",
                  type: "text",
                  defaultValue: D.commitments.heading,
                },
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description:
                      "Optional photo beside the cards. Portrait, about 1200 × 1500 px.",
                  },
                },
                {
                  name: "items",
                  type: "array",
                  admin: { components: { RowLabel } },
                  defaultValue: D.commitments.items,
                  fields: [
                    iconField("icon"),
                    { name: "title", type: "text", required: true },
                    { name: "description", type: "textarea" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Sizes",
          description:
            "Not shown on the site yet. The section is turned off until packages are decided.",
          fields: [
            {
              name: "sizes",
              label: false,
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", defaultValue: D.sizes.eyebrow },
                { name: "heading", type: "text", defaultValue: D.sizes.heading },
                {
                  name: "options",
                  label: "Project sizes",
                  type: "array",
                  admin: {
                    description: "Smallest first. The size scale follows this order.",
                    components: { RowLabel },
                  },
                  defaultValue: D.sizes.options,
                  fields: [
                    { name: "name", type: "text", required: true },
                    { name: "description", type: "textarea" },
                    {
                      name: "package",
                      label: "Recommended package",
                      type: "relationship",
                      relationTo: "packages",
                      admin: {
                        description:
                          "Optional. The package to recommend or link to for this size.",
                      },
                    },
                  ],
                },
                {
                  name: "extrasHeading",
                  type: "text",
                  defaultValue: D.sizes.extrasHeading,
                },
                {
                  name: "extras",
                  label: "Add-ons",
                  type: "array",
                  admin: { components: { RowLabel } },
                  defaultValue: D.sizes.extras,
                  fields: [
                    { name: "title", type: "text", required: true },
                    { name: "description", type: "text" },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Tools",
          description:
            "Not shown on the site yet. The section is turned off until the tech stack is decided.",
          fields: [
            {
              name: "tools",
              label: false,
              type: "group",
              fields: [
                { name: "eyebrow", type: "text", defaultValue: D.tools.eyebrow },
                { name: "heading", type: "text", defaultValue: D.tools.heading },
                {
                  name: "groups",
                  type: "array",
                  admin: { components: { RowLabel } },
                  defaultValue: D.tools.groups,
                  fields: [
                    {
                      name: "label",
                      type: "text",
                      required: true,
                      admin: { description: "What these tools are good for." },
                    },
                    {
                      name: "tools",
                      type: "array",
                      admin: { components: { RowLabel } },
                      fields: [{ name: "name", type: "text", required: true }],
                    },
                  ],
                },
                { name: "note", type: "text", defaultValue: D.tools.note },
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
              ],
            },
          ],
        },
        seoTab(),
      ],
    },
  ],
};
