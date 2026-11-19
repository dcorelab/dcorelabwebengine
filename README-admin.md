# Dcore Lab website and admin starter

Express/EJS + MongoDB website. Public content is fetched from MongoDB at request time (not Next.js ISR). The public homepage presents services, published projects, approved testimonials and SiteSettings. `/api/contact` persists inquiries before attempting notification email. `/api/track` stores a salted SHA-256 visitor hash, never a raw IP, and respects DNT / bot / admin exclusions.

## Configure secrets safely
Set environment variables in your hosting provider, not in source control:
- `MONGO_URI`
- `ADMIN_JWT_SECRET` (at least 32 random characters)
- `ANALYTICS_SALT` (random salt)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` only for first-owner seeding
- Optional `FROM_MAIL`, `GMAIL_APP_PASSWORD`, `ADMIN_EMAIL` for inquiry notifications
- `NODE_ENV=production`

The repository previously contained a committed `.env` with credential material. Treat every value in that file as compromised: revoke/rotate database, mail, Cloudinary and token credentials, purge the secret from Git history, and verify Vercel settings contain only rotated values before deploying.

## First owner
Set `ADMIN_EMAIL` and a strong 12+ character `ADMIN_PASSWORD` (upper/lowercase, digit, symbol) locally, then run `npm run seed:admin`. The seed refuses to create a second owner and hashes the password with bcrypt cost 12. Remove the seed password from the environment after use.

## Deploy
Vercel uses `vercel.json` to route requests to the Express handler. Add the secrets above in Vercel Project Settings. Run the seed command from a trusted local environment connected to Atlas, then deploy. Check `/`, `/admin/login`, `/api/contact`, and authenticated admin routes after deployment.

## Current implemented surface
Admin login with rate limiting, session version invalidation, owner/editor authorization, dashboard, inquiries, projects, testimonials, services, settings, account password change, audit log and optional chat-log review/deletion. Public design is a responsive 3D-inspired agency landing page wired to database content.

This is not a claim that every requested enhancement is complete: TOTP setup, signed Cloudinary uploads, schema-level Zod validation, full project edit/reorder UX, and automated production/build tests still need implementation. Do not treat this starter as a completed security review.
