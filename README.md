# Dcore Lab website

The public website is built with Next.js App Router, TypeScript, and Tailwind CSS.

## Run locally

```sh
npm install
npm run dev
```

Open <http://localhost:3000>. To verify a production build, run:

```sh
npm run build
npm run start
```

## Deploy on Vercel

Import this repository and keep the project root at the repository root. Let Vercel detect **Next.js** and use its default build and output settings. Do not route requests through `server.js` as a custom Vercel build: the public homepage is served by the Next.js App Router (`app/page.tsx`).

Set any required environment variables in Vercel Project Settings, not in committed files. Never commit `.env` files, dependencies, or build output.

## Project layout

- `app/` — Next.js routes, layout, and global styles
- `components/` — shared UI, layout, and 3D components
- `public/` — static assets
- `lib/` and `data/` — content and site data
