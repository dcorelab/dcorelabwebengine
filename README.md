# Dcore Lab frontend

The frontend is built with Next.js App Router, TypeScript, Tailwind CSS, and shadcn-compatible UI conventions. Content is exposed by `lib/content.ts` so the backing store can later be replaced without changing components.

## Local development

```sh
npm install
npm run dev
npm run build
```

The 3D views use procedural scenes and require no downloaded model files. Approved GLB model metadata can be added in `data/models3d.ts` later. No API routes or database integration are included in this frontend phase.
