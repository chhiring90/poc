import { seoField } from "@/collections/fields/seo";
import type { GlobalConfig } from "payload";

export const ServicesPage: GlobalConfig = {
  slug: "servicesPage",
  label: "Services Page",
  access: { read: () => true },
  fields: [
    { name: "heading", type: "text" },
    { name: "subheading", type: "text" },
    { name: "description", type: "textarea" },
    {
      name: "services",
      type: "relationship",
      relationTo: "services",
      hasMany: true,
      admin: {
        description:
          "Choose and order the services shown on the services page.",
      },
    },
    seoField(),
  ],
};
