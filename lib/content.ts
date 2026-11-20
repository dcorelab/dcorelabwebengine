import type { FAQ, Model3D, Post, Project, Service, Settings, Testimonial } from "@/types/content";

export async function getServices(): Promise<Service[]> { return (await import("@/data/services")).services; }
export async function getProjects(): Promise<Project[]> { return (await import("@/data/projects")).projects; }
export async function getPosts(): Promise<Post[]> { return (await import("@/data/posts")).posts; }
export async function getFaqs(): Promise<FAQ[]> { return (await import("@/data/faqs")).faqs; }
export async function getTestimonials(): Promise<Testimonial[]> { return (await import("@/data/testimonials")).testimonials; }
export async function getModels3D(): Promise<Model3D[]> { return (await import("@/data/models3d")).models3d; }
export async function getSettings(): Promise<Settings> { return (await import("@/data/settings")).settings; }
