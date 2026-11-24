/**
 * Creates or updates the six service packages, matched by slug.
 * Run: pnpm payload run scripts/seed-packages.ts
 */
import config from "@payload-config";
import { getPayload } from "payload";
import { seedPackages } from "./packages.seed";

getPayload({ config })
  .then(seedPackages)
  .then(() => process.exit(0))
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  });
