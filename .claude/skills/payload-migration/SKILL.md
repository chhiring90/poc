---
name: payload-migration
description: Handle Postgres schema changes caused by Payload collection/field edits — dev schema push vs. creating a migration in migrations/, including data-preserving migrations. Use after adding, renaming, removing, or changing the type of a Payload field, or when the user asks for a migration.
---

# Payload Postgres migrations

The database is Postgres, set up through `postgresAdapter` in `payload.config.ts`, and migrations live in `migrations/`.

## Choose the path

- **Local dev only.** Payload pushes schema changes automatically when you run `pnpm dev`. If a column would be dropped or renamed, it asks in the terminal first. Tell the user what it will ask and which answer to give.
- **Anything that gets deployed, or that changes existing data.** Create a migration:
  ```bash
  pnpm migrate:create <snake_case_description>   # generates migrations/<timestamp>_<name>.ts
  pnpm migrate                                   # applies pending migrations
  ```
  Don't run `pnpm migrate` against a database without the user's confirmation. `DATABASE_URL` may point at a shared database.

## Data-preserving changes

Payload's generated diff drops the old column and creates a new one, so a rename or type change loses data. In that case, write the migration by hand. `migrations/20261113_124800_service_description_rich_text.ts` is the reference: it converts a textarea into Lexical rich-text JSON.

```ts
import { sql, type MigrateUpArgs, type MigrateDownArgs } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "things" ADD COLUMN IF NOT EXISTS "new_col" jsonb`);
  await db.execute(sql`UPDATE "things" SET "new_col" = ... WHERE "new_col" IS NULL`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "things" DROP COLUMN IF EXISTS "new_col"`);
}
```

## Naming

- Payload converts field names to snake_case for columns: `descriptionRichText` becomes `description_rich_text`.
- A relationship field `faqGroup` becomes the column `faq_group_id`.
- `hasMany` relationships live in `<collection>_rels`.
- Keep the old field hidden while it's being phased out: `admin: { hidden: true }, access: { read: () => false }`. See `description` in `collections/Services.ts`.
- Make every statement idempotent with `IF EXISTS` or `IF NOT EXISTS`.
