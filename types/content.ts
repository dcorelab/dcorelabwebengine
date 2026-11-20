export type Service = { id: string; name: string; description: string; kind: "BUILD" | "SCALE"; features: string[]; published: boolean };
export type Project = { id: string; name: string; summary: string; published: boolean };
export type Post = { id: string; title: string; excerpt: string; published: boolean };
export type FAQ = { id: string; question: string; answer: string; published: boolean };
export type Testimonial = { id: string; quote: string; personName: string; personRole: string; approved: boolean };
export type ModelLicense = "CC0" | "CC-BY" | "CC-BY-SA" | "Commercial-Purchased" | "Own-Work";
export type Model3D = {
  id: string; title: string; slug: string; author: string; authorUrl: string; sourceName: string;
  sourceUrl: string; license: ModelLicense; licenseUrl: string; attributionText: string;
  modificationsMade: string; fileUrl: string; posterUrl: string; fileSizeKB: number;
  usedOn: string[]; approved: boolean; published: boolean;
};
export type Settings = {
  siteName: string; tagline: string; description: string; founderName: string; address: string;
  phone: string; email: string; businessHours: string;
};
