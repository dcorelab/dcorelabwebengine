# Secure admin foundation

This application uses Express and EJS (not Next.js), so it does not support Next.js ISR or `revalidatePath`/`revalidateTag`. Public routes should read MongoDB-backed content at request time; cache invalidation can be added if a public caching layer is introduced.

## Required environment
- `MONGO_URI`: MongoDB Atlas connection string
- `ADMIN_JWT_SECRET`: random secret of at least 32 characters
- `ANALYTICS_SALT`: long random salt used to hash visitor IPs (raw IPs are not stored)
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: set only while creating the first owner
- `FROM_MAIL`, `GMAIL_APP_PASSWORD`: optional email notification; inquiries are saved first
- `NODE_ENV=production` enables secure cookies

Create a strong initial password (12+ characters, upper/lowercase, number and symbol), then run `npm run seed:admin`. The command refuses to create an owner when one already exists. Remove `ADMIN_PASSWORD` from the environment after seeding. Never commit secrets.

## Current admin routes
- `/admin/login`, `/admin` dashboard, `/admin/inquiries`, `/admin/projects`, `/admin/testimonials`, `/admin/services`, `/admin/settings`, `/admin/account`, `/admin/audit-log`
- `/api/admin/*` is authenticated; owner/editor permissions are enforced in the route handlers.
- `/api/track` stores only a salted SHA-256 visitor hash, skips bots, Do Not Track and admin paths.
- `/api/contact` persists inquiries before attempting notification email.

Admin sessions expire after 8 hours, use an httpOnly SameSite=Strict cookie, and are invalidated on logout/password change by rotating a database session version. Login attempts are limited to five per IP per 15-minute window. Do not expose this service publicly until environment values are configured and the security and deployment checklist is verified.
