import {
  sql,
  type MigrateDownArgs,
  type MigrateUpArgs,
} from "@payloadcms/db-postgres";

// Packages grow from name/description/price/features into the full package
// sheet: slug, order, icon, prerequisite, tagline, scope, timing, options,
// terms and grouped deliverables. Additive only; existing rows get a slug
// built from their name so the NOT NULL + unique constraints hold.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "slug" varchar;
    ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "order" numeric DEFAULT 0;
    ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "icon" varchar;
    ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "requires_id" integer;
    ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "tagline" varchar;
    ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "included" varchar;
    ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "not_included" varchar;
    ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "price_depends_on" varchar;
    ALTER TABLE "packages" ADD COLUMN IF NOT EXISTS "timing" varchar;
  `);

  await db.execute(sql`
    UPDATE "packages"
    SET "slug" = trim(both '-' from regexp_replace(lower("name"), '[^a-z0-9]+', '-', 'g')) || '-' || "id"
    WHERE "slug" IS NULL;
    ALTER TABLE "packages" ALTER COLUMN "slug" SET NOT NULL;
    CREATE UNIQUE INDEX IF NOT EXISTS "packages_slug_idx" ON "packages" USING btree ("slug");
    CREATE INDEX IF NOT EXISTS "packages_requires_idx" ON "packages" USING btree ("requires_id");
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "packages" ADD CONSTRAINT "packages_requires_id_packages_id_fk"
        FOREIGN KEY ("requires_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "packages_options" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "packages_options_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar NOT NULL,
      "detail" varchar
    );
    CREATE TABLE IF NOT EXISTS "packages_terms" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar NOT NULL,
      "value" varchar NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "packages_deliverable_groups" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "heading" varchar,
      "intro" varchar
    );
    CREATE TABLE IF NOT EXISTS "packages_deliverable_groups_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL
    );
  `);

  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "packages_options" ADD CONSTRAINT "packages_options_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "packages_options_items" ADD CONSTRAINT "packages_options_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."packages_options"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "packages_terms" ADD CONSTRAINT "packages_terms_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "packages_deliverable_groups" ADD CONSTRAINT "packages_deliverable_groups_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
    DO $$ BEGIN
      ALTER TABLE "packages_deliverable_groups_items" ADD CONSTRAINT "packages_deliverable_groups_items_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."packages_deliverable_groups"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "packages_options_order_idx" ON "packages_options" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "packages_options_parent_id_idx" ON "packages_options" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "packages_options_items_order_idx" ON "packages_options_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "packages_options_items_parent_id_idx" ON "packages_options_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "packages_terms_order_idx" ON "packages_terms" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "packages_terms_parent_id_idx" ON "packages_terms" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "packages_deliverable_groups_order_idx" ON "packages_deliverable_groups" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "packages_deliverable_groups_parent_id_idx" ON "packages_deliverable_groups" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "packages_deliverable_groups_items_order_idx" ON "packages_deliverable_groups_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "packages_deliverable_groups_items_parent_id_idx" ON "packages_deliverable_groups_items" USING btree ("_parent_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "packages_deliverable_groups_items" CASCADE;
    DROP TABLE IF EXISTS "packages_deliverable_groups" CASCADE;
    DROP TABLE IF EXISTS "packages_terms" CASCADE;
    DROP TABLE IF EXISTS "packages_options_items" CASCADE;
    DROP TABLE IF EXISTS "packages_options" CASCADE;
    ALTER TABLE "packages" DROP CONSTRAINT IF EXISTS "packages_requires_id_packages_id_fk";
    DROP INDEX IF EXISTS "packages_requires_idx";
    DROP INDEX IF EXISTS "packages_slug_idx";
    ALTER TABLE "packages" DROP COLUMN IF EXISTS "slug";
    ALTER TABLE "packages" DROP COLUMN IF EXISTS "order";
    ALTER TABLE "packages" DROP COLUMN IF EXISTS "icon";
    ALTER TABLE "packages" DROP COLUMN IF EXISTS "requires_id";
    ALTER TABLE "packages" DROP COLUMN IF EXISTS "tagline";
    ALTER TABLE "packages" DROP COLUMN IF EXISTS "included";
    ALTER TABLE "packages" DROP COLUMN IF EXISTS "not_included";
    ALTER TABLE "packages" DROP COLUMN IF EXISTS "price_depends_on";
    ALTER TABLE "packages" DROP COLUMN IF EXISTS "timing";
  `);
}
