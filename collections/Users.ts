import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "firstName", "lastName"],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "firstName", type: "text" },
    { name: "lastName", type: "text" },
  ],
};
