import { getFaqs, getModels3D, getPosts, getProjects, getServices, getSettings, getTestimonials } from "@/lib/content";
import { HomeExperience } from "@/components/sections/home-experience";
export default async function HomePage() {
  const [settings, services, faqs, projects, posts, testimonials] = await Promise.all([getSettings(), getServices(), getFaqs(), getProjects(), getPosts(), getTestimonials()]);
  void getModels3D;
  return <HomeExperience settings={settings} services={services} faqs={faqs} projects={projects} posts={posts} testimonials={testimonials}/>;
}
