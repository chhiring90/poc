import sharp from "sharp";
import { s3Storage } from "@payloadcms/storage-s3";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { buildConfig } from "payload";
import {
  Media,
  Posts,
  Categories,
  Users,
  Testimonial,
  Team,
  Work,
  WorkCategories,
  Services,
  FAQs,
  FAQGroups,
  Packages,
} from "./collections";
import {
  Home,
  Header,
  About,
  BlogPage,
  ContactPage,
  WorkPage,
  ServicesPage,
  LegalPolicies,
  Footer,
  SiteSettings,
} from "./globals";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Trims stray whitespace/quotes from a pasted connection string and fails with
// a readable (password-free) message if it still isn't a valid postgres URL.
function databaseUrl(): string {
  const raw = requiredEnv("DATABASE_URL");
  const value = raw
    .trim()
    .replace(/^['"]|['"]$/g, "")
    .trim();
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(
      `DATABASE_URL is not a valid URL (length ${raw.length}, starts with "${raw.slice(0, 12)}…"). ` +
        `Expected postgresql://user:password@host:port/db`,
    );
  }
  if (!/^postgres(ql)?:$/.test(url.protocol) || !url.hostname) {
    throw new Error(
      `DATABASE_URL looks wrong: protocol="${url.protocol}" host="${url.hostname}"`,
    );
  }
  console.info(
    `[db] connecting to ${url.hostname}:${url.port || 5432} as ${decodeURIComponent(url.username)}`,
  );
  return value;
}

const r2PublicUrl = requiredEnv("R2_PUBLIC_URL").replace(/\/+$/, "");

export default buildConfig({
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor(),

  // Define and configure your collections in this array
  collections: [
    Media,
    Posts,
    Categories,
    Users,
    Testimonial,
    Team,
    Work,
    WorkCategories,
    Services,
    FAQs,
    FAQGroups,
    Packages,
  ],
  globals: [
    Header,
    Home,
    About,
    BlogPage,
    ContactPage,
    WorkPage,
    ServicesPage,
    LegalPolicies,
    Footer,
    SiteSettings,
  ],

  // Your Payload secret - should be a complex and secure string, unguessable
  secret: requiredEnv("PAYLOAD_SECRET"),
  // Whichever Database Adapter you're using should go here
  // Mongoose is shown as an example, but you can also use Postgres
  db: postgresAdapter({
    pool: {
      connectionString: databaseUrl(),
      max: 3,
      idleTimeoutMillis: 10_000,
    },
  }),
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  sharp,
  plugins: [
    s3Storage({
      collections: {
        media: {
          generateFileURL: ({ filename, prefix }) =>
            `${r2PublicUrl}/${prefix ? `${prefix}/` : ""}${filename}`,
        },
      },
      bucket: requiredEnv("R2_BUCKET"),
      config: {
        credentials: {
          accessKeyId: requiredEnv("R2_ACCESS_KEY_ID"),
          secretAccessKey: requiredEnv("R2_SECRET_ACCESS_KEY"),
        },
        region: "auto",
        endpoint: `https://${requiredEnv("R2_ACCOUNT_ID")}.r2.cloudflarestorage.com`,
        forcePathStyle: true,
      },
    }),
  ],
});
