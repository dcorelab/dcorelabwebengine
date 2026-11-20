import type { FAQ, Model3D, Post, Project, Service, Settings, Testimonial } from "@/types/content";

export async function getServices(): Promise<Service[]> {
  const { services } = await import("@/data/services");
  return services;
}

export async function getProjects(): Promise<Project[]> {
  const { projects } = await import("@/data/projects");
  return projects;
}

export async function getPosts(): Promise<Post[]> {
  const { posts } = await import("@/data/posts");
  return posts;
}

export async function getFaqs(): Promise<FAQ[]> {
  const { faqs } = await import("@/data/faqs");
  return faqs;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const { testimonials } = await import("@/data/testimonials");
  return testimonials;
}

export async function getModels3D(): Promise<Model3D[]> {
  const { models } = await import("@/data/models");
  return models;
}

export async function getSettings(): Promise<Settings> {
  const { settings } = await import("@/data/settings");
  return settings;
}
