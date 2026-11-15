---
name: payload-collection
description: Add or change a Payload CMS collection, global, or field in this codebase (collections/, globals/), including wiring it into payload.config.ts and keeping the matching lib/type and lib/helper type guards in sync. Use when the user asks to add a collection, global, field, relationship, or to remove a field from the admin UI.
---

# Payload collection / global / field

This project uses Payload CMS 3 on Postgres (`@payloadcms/db-postgres`), and the admin UI is mounted inside Next.js at `app/(payload)`. No `payload-types.ts` is committed. The frontend validates data with hand-written types in `lib/type/` and runtime type guards in `lib/helper/`.

## Steps

1. **Config file**
   - Collections go in `collections/<PascalName>.ts` and export `const <PascalName>: CollectionConfig`.
   - Globals go in `globals/<Name>.ts` and export `const <Name>Page: GlobalConfig`. Use a camelCase slug such as `servicesPage`.
   - Follow the existing shape:
     ```ts
     import type { CollectionConfig } from "payload";

     export const Things: CollectionConfig = {
       slug: "things",                       // kebab-case, plural
       admin: { useAsTitle: "name", defaultColumns: ["name", "order", "updatedAt"] },
       access: { read: () => true },         // public read; writes need auth
       fields: [
         { name: "name", type: "text", required: true },
         { name: "slug", type: "text", required: true, admin: { position: "sidebar" } },
         { name: "order", type: "number", defaultValue: 0, admin: { position: "sidebar" } },
       ],
     };
     ```
   - Relationships use `type: "relationship", relationTo: "<slug>"`, and metadata fields go in the sidebar with `admin: { position: "sidebar" }`.
   - Put reusable fields in `collections/fields/`, for example `iconField("icon")`, and rich-text blocks in `collections/blocks/`.
   - For rich text, copy the `lexicalEditor({ features })` setup from `collections/Services.ts`, which adds table, code, Chart, and FlowDiagram blocks.

2. **Register it.** Export the config from `collections/index.ts` or `globals/index.ts`, then add it to the `collections` or `globals` array in `payload.config.ts`.

3. **Frontend type and guard.** If the frontend reads this data:
   - Add or update the type in `lib/type/<name>.type.ts`. A relationship field is typed as `Doc | number | string | null`, because it's an id at depth 0 and an object when populated.
   - Add or update `lib/helper/is-<name>-document.helper.ts`, using `isRecord` and `isRichText`. Optional fields accept `undefined | null | <type>`.
   - Put fetch helpers in `lib/helper/get-<name>...helper.ts`. They take `payload: Payload`, call `payload.find(...)`, and filter the results through the guard. See `get-service-by-slug.helper.ts` and `get-faqs-by-group.helper.ts`.
   - Put slug and route constants in `lib/const/<name>.const.ts`.

4. **Removing a field.** Delete it from the config, the type, the guard, and every place it's rendered. Then grep for the field name to confirm nothing still uses it.

5. **Admin components.** If you add a custom admin component, such as a RowLabel in `components/admin/`, run `pnpm generate:importmap`.

6. **Database.** Any change to the schema needs the `payload-migration` skill, which covers dev push and production migrations.

7. Finish by running the `check` skill.
