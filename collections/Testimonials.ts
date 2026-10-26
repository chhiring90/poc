import type { CollectionConfig } from "payload";

export const Testimonial: CollectionConfig = {
  slug: "testimonials",
  access: { read: () => true },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "role", type: "text" },
    { name: "company", type: "text" },
    { name: "testimonial", type: "textarea", required: true },
    { name: "photo", type: "upload", relationTo: "media" },
  ],
};
