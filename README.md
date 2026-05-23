# KartichkaQR

<img src="static/logo.jpg" alt="KartichkaQR Logo" width="200" />

A Bulgarian greeting card platform for creating personalized cards with QR codes and voice messages. Users follow a 4-step wizard to design a card, record a voice greeting, and share it via a unique link — with an option to order a physical printed copy.

## Features

- **Card creation wizard** — title, description, sender/receiver info, and a unique shareable slug
- **Template designer** — choose from categorized templates with font, color, and background customization
- **Voice recording** — record a personal audio message (Safari-compatible)
- **QR code** — auto-generated and embedded on the card, linking back to the shared card URL
- **Interactive card preview** — carousel showing front, sides, and back
- **Sharing** — native share API with copy-link fallback
- **Physical order** — request a printed card, which notifies the admin via email
- **Dark mode**

## Tech Stack

- **Frontend**: Svelte 5, SvelteKit 2, TypeScript, TailwindCSS 4
- **Database**: PostgreSQL via Prisma ORM
- **Storage**: Vercel Blob (audio files)
- **Email**: Resend
- **Deployment**: Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

| Variable                     | Description                            |
| ---------------------------- | -------------------------------------- |
| `DATABASE_URL`               | PostgreSQL connection string           |
| `BLOB_PROD_READ_WRITE_TOKEN` | Vercel Blob token (production)         |
| `BLOB_DEV_READ_WRITE_TOKEN`  | Vercel Blob token (development)        |
| `RESEND_API_KEY`             | Resend API key for transactional email |
| `APP_EMAIL`                  | Sender address for outgoing emails     |
| `ADMIN_EMAIL`                | Receives physical order notifications  |
| `ADMIN_DASHBOARD_KEY`        | Password for the admin dashboard       |
| `APP_NAME`                   | App name used in emails/branding       |
| `APP_ENV`                    | `development` or `production`          |

### 3. Set up the database

```bash
npx prisma migrate deploy
```

### 4. Start the dev server

```bash
npm run dev
```

## Storage Layout

Vercel Blob organizes files by folder:

| Path                                | Contents                                                                                                                                                                                                                      |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `records/{cardUuid}.{ext}`          | Audio recordings — named after `cardUuid` (the internal UUID stored on the `Card` row). To recover a recording when the blob URL is lost, look up the card's `cardUuid` in the database and fetch `records/{cardUuid}.{ext}`. |
| `templates/{category}/{name}.{ext}` | Template background images                                                                                                                                                                                                    |

## Building

```bash
npm run build
npm run preview
```

The app is deployed on Vercel using the `@sveltejs/adapter-vercel` adapter.

## Project Structure

```
src/
  routes/
    (app)/
      card/create/   # 4-step card creation wizard
      card/[slug]/   # Shared card view
      about/         # About page
  lib/
    components/
      stepper/       # Wizard step components
    server/          # DB, email, and storage utilities
prisma/              # Schema and migrations
```
