# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

KartichkaQR is a Bulgarian greeting-card app built with SvelteKit 2, Svelte 5 runes, TailwindCSS 4, Prisma on PostgreSQL, Vercel Blob and Resend, and it deploys to Vercel. Signed-in users describe a card idea, get an AI-generated design (or pick a template), style the text, record a voice message, and share a `/card/[slug]` link through a QR code. They can also order a physical printed copy. User-facing text, including error and validation messages, is in Bulgarian.

## Commands

```bash
npm run dev        # dev server
npm run build      # production build (adapter-vercel, nodejs20.x)
npm run check      # svelte-kit sync + svelte-check
npm run lint       # eslint + prettier --check
npm run format     # prettier --write
npx prisma migrate dev --name <name>   # create a migration after editing prisma/schema.prisma
npx prisma generate                    # regenerate the client into src/lib/db
```

- There is no test suite.
- `npm install` runs `postinstall`, which runs `prisma generate && prisma migrate deploy && prisma db seed` against whatever `DATABASE_URL` points at. The seed deletes fonts and categories that no template references. Use `--ignore-scripts` if you don't want that.
- `svelte-check` reports a lot of existing errors in the generated `src/lib/db/*` files. Filter its output to the files you changed.
- A Husky pre-commit hook runs `lint-staged`, which runs prettier on the staged files. Prettier uses 4-space indentation.

## Architecture

**Prisma client location.** `schema.prisma` generates the client into `src/lib/db`. That folder is gitignored and built by `prisma generate`. Import `PrismaClient`, `Prisma` and model types from `$lib/db`, not from `@prisma/client`. `vite.config.ts` adds special handling for it: CommonJS transform, `ssr.external` and `optimizeDeps.exclude`. The shared client is in `src/lib/server/prisma.ts` (`pg` adapter). Most queries go through `src/lib/server/database.ts`. `src/lib/prisma.ts` is an older, unused client.

**Shared database.** `prisma.config.ts` marks several tables as external (`users`, `jobs`, `sessions`, `_dashboard_migrations`, …). They belong to a separate admin dashboard that uses the same Postgres database. Never model, migrate or drop them.

**Home page.** `/` has a hero with a showcase carousel (`ShowcaseCarousel.svelte`, Embla with hand-rolled autoplay; slides are the newest templates from `load`), then the wizard in `#create`. Picking a slide calls `selectTemplate` from `src/lib/controller/Template.ts` and jumps to the Design step. Scroll-in animations use the `reveal` action (`src/lib/actions/reveal.ts`). The hidden starting state lives in `app.css` under `html.js`, where the `js` class comes from an inline script in `app.html`, and it respects `prefers-reduced-motion`.

**Card wizard.** `/` hosts the 5-step wizard (`src/lib/components/Stepper.svelte`, step ids and data flow documented in `src/lib/config/steps.ts`): Prompt → Design (AI image or template) → Text & style → Record → Review. `/card/create` just redirects to `/`. Client state lives in module-level `$state` objects in `src/lib/state.svelte.ts`:

- `ai`: prompt, category choice, enhance flag, generation result
- `cs`: card, including the AI image (`backgroundUrl`, mutually exclusive with `templateId`) and per-card typography
- `ss`: stepper
- `rs`: recorder
- `ts`: template/front preview
- `pcs`: physical copy

`src/lib/controller/Stepper.ts` moves between steps, validating each one through `src/lib/utils/validation.ts` (zod schemas in `src/lib/schemas`). Leaving the Prompt step kicks off generation via `src/lib/controller/AiImage.ts`, which skips identical repeat requests. Submission posts to the `create` action in `src/routes/(app)/+page.server.ts`. It requires a signed-in user and re-validates the style server-side. It then:

1. For AI cards: copies the fal.ai image into Blob at `generated/{cardUuid}.{ext}` (only `*.fal.media` URLs are accepted) and checks `categoryId` against the DB
2. Uploads the audio to `records/{cardUuid}.{ext}`
3. Creates the `Card` row linked to the user
4. Emails `ADMIN_EMAIL` if a physical copy was requested

**AI image pipeline.** `POST /api/ai-image` (auth required) → `src/lib/server/ai.ts`. At most one `claude-haiku-4-5` call, and only when needed: to pick a category when the user chose "auto", and/or to rewrite the prompt when "Enhance my prompt" is on. That toggle is off by default and saved in localStorage. The category comes back through structured outputs as an enum of `categories.name`, then gets re-checked server-side with one corrective retry (422 otherwise). The image is rendered by FLUX.1 [schnell] on fal.ai. That endpoint has no `negative_prompt` input, so `NEGATIVE_PROMPT` (no text or lettering) is appended to the prompt itself.

**Card styling.** Title and description font, size and color, plus title position (`titlePos`, where the editor offers top/center/bottom) and rotation (`titleRotation`, whole degrees from -180 to 180, applied as `transform: rotate()`), are stored per card (columns on `cards`). Null means "fall back to the template", which is how older cards render. Fonts must be keys from `CARD_FONTS` in `src/lib/config/card.ts` that match the `--font-family-*` variables in `app.css`. Sizes are px relative to a 340px-wide card and rendered in `cqw`.

**Auth.** better-auth with email/password (`src/lib/server/auth.ts`, tables `auth_user`/`auth_session`/`auth_account`/`auth_verification`). `src/hooks.server.ts` fills `locals.user`/`locals.session`. The pages are `/login`, `/register`, `/logout` (POST), and `/account`, a read-only list of the user's cards. Sessions last 30 days and slide: `updateAge` refreshes them daily while in use. Cookies are HttpOnly and SameSite=Lax, and Secure everywhere except `npm run dev`. It needs `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL`.

**UI.** shadcn-svelte (bits-ui, "vega" style) components live in `src/lib/components/ui`. Import `cn` from `$lib/utils/cn`, which is the path set in `components.json`. Add new components with `npx shadcn-svelte@latest add <name>`. Toasts use `svelte-sonner` and dark mode uses `mode-watcher` (storage key `theme`).

**Private blob storage.** The Vercel Blob store is private, so the browser can't load blob URLs directly. Pass them through `toAssetProxyUrl` / `rewriteAssetFields` in `src/lib/server/blobUrl.ts`. These rewrite the URL to `/api/asset?u=...`, and that route streams the blob using the token. `src/lib/config/app.ts` picks the dev or prod blob token for uploads based on `APP_ENV`. Reads and deletes use `blobTokenForUrl`, which matches the store id in the blob URL, because local dev and the preview share the dev database. Template backgrounds are stored under `templates/{category}/{name}.{ext}`. A template's `background` / `backgroundBack` value is either a blob URL or a hex color.

**Admin API.** The `/api/vercel/blob/*` routes are called by the external dashboard. They are protected by `validateAdminAuth` in `src/lib/server/adminAuth.ts`, which accepts `Authorization: Bearer <ADMIN_DASHBOARD_KEY>` or an `X-Admin-Key` header.

**Env vars.** Most secrets are read through `src/lib/server/secrets.ts` (`$env/dynamic/private`). Some files import `$env/static/private` directly instead (`DATABASE_URL`, `APP_ENV`). `.env.example` lists every variable.
