import {
  sql,
  type MigrateDownArgs,
  type MigrateUpArgs,
} from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "services"
    ADD COLUMN IF NOT EXISTS "description_rich_text" jsonb
  `);

  await db.execute(sql`
    UPDATE "services"
    SET "description_rich_text" = jsonb_build_object(
      'root',
      jsonb_build_object(
        'type', 'root',
        'format', '',
        'indent', 0,
        'version', 1,
        'direction', NULL,
        'children',
        CASE
          WHEN COALESCE("description", '') = '' THEN '[]'::jsonb
          ELSE jsonb_build_array(
            jsonb_build_object(
              'type', 'paragraph',
              'format', '',
              'indent', 0,
              'version', 1,
              'direction', NULL,
              'children', jsonb_build_array(
                jsonb_build_object(
                  'type', 'text',
                  'detail', 0,
                  'format', 0,
                  'mode', 'normal',
                  'style', '',
                  'text', COALESCE("description", ''),
                  'version', 1
                )
              )
            )
          )
        END
      )
    )
    WHERE "description_rich_text" IS NULL
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE "services"
    SET "description" = COALESCE((
      SELECT string_agg(text_value, E'\n' ORDER BY ordinal)
      FROM jsonb_array_elements_text(
        jsonb_path_query_array("description_rich_text", '$.**.text')
      ) WITH ORDINALITY AS text_nodes(text_value, ordinal)
    ), '')
    WHERE "description_rich_text" IS NOT NULL
  `);

  await db.execute(sql`
    ALTER TABLE "services"
    DROP COLUMN IF EXISTS "description_rich_text"
  `);
}
