import type { Service } from "@/types/content";

export const services: Service[] = [
  {
    id: "build",
    name: "BUILD",
    description: "Backend and SaaS engineering for dependable digital products.",
    kind: "BUILD",
    features: ["Real-time APIs", "WebRTC", "WebSockets", "Web and mobile apps", "AI chatbots", "Cloud"],
    published: true,
  },
  {
    id: "scale",
    name: "SCALE",
    description: "Data-driven marketing systems built for measurable growth.",
    kind: "SCALE",
    features: ["Meta and Google Ads", "Server-side tracking", "Conversions API", "GA4 / GTM", "SEO"],
    published: true,
  },
];
