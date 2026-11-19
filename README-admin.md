# Secure admin foundation

This application uses Express and EJS rather than Next.js; Next.js ISR APIs (`revalidatePath` / `revalidateTag`) do not apply. Public pages should read MongoDB-backed content at request time, or be migrated to Next.js before relying on ISR.

## Required environment
- `MONGO_URI`: MongoDB Atlas connection string
- `ADMIN_JWT_SECRET`: random secret of at least 32 characters
- `ANALYTICS_SALT`: long random salt used to hash visitor IPs (raw IPs are not stored)
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: set only while creating the first owner
- `FROM_MAIL`, `GMAIL_APP_PASSWORD`: optional email notification; inquiries are saved first
- `NODE_ENV=production` enables secure cookies

Create a strong initial password (12+ characters, upper/lowercase, number and symbol), then run `npm run seed:admin`. The command refuses to create an owner when one already exists. Remove `ADMIN_PASSWORD` from the environment after seeding. Never commit secrets.

Admin sessions expire after 8 hours, use an httpOnly SameSite=Strict cookie, and are invalidated on logout/password change by rotating a database session version. Admin endpoints are protected by authentication and role checks. `/api/track` stores only a salted SHA-256 visitor hash, skips bots, Do Not Track and admin paths. `/api/contact` persists inquiries before attempting notification email.

This is a starter integration, not the complete requested feature set: Cloudinary uploads, TOTP, chat-log controls, full CRUD editing UX, zod schemas, and Vercel serverless validation still need implementation and testing. Do not deploy publicly until those security and deployment checks are complete.
