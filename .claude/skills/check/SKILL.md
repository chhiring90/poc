---
name: check
description: Verify changes in this codebase compile and lint cleanly (TypeScript + ESLint, optional production build). Use after editing code, before committing, or when the user asks to check/verify/lint/type-check.
---

# Check

Run these from the repo root:

```bash
npx tsc --noEmit -p .
pnpm lint <changed files or dirs>      # e.g. pnpm lint "app/(frontend)/services" lib/helper
```

- Fix every TypeScript error and every ESLint error you introduced.
- The warnings already in `lib/helper/color.helper.ts` (unused `TimeKey` and `Theme`) were there before. Leave them unless the user asks.
- Run `pnpm build` only when the user asks for it, or when the change touches routing, config (`next.config.ts`, `payload.config.ts`), or server/client component boundaries. The build needs the env vars that `payload.config.ts` requires (`DATABASE_URL`, `PAYLOAD_SECRET`, `R2_*`).
- If you changed admin components, also run `pnpm generate:importmap` and commit the updated `app/(payload)/admin/importMap.js`.

Report the results accurately. If a check couldn't run, for example because env vars are missing, say so. Don't claim it passed.
