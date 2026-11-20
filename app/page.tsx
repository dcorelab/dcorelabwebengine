import { ArrowRight, Building2 } from "lucide-react";
import { getServices, getSettings } from "@/lib/content";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default async function HomePage() {
  const [settings, services] = await Promise.all([getSettings(), getServices()]);

  return (
    <>
      <Header />
      <main>
        <section id="home" className="relative isolate flex min-h-[760px] items-center overflow-hidden px-6 pt-20">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_75%_35%,rgba(124,58,237,.28),transparent_32%),radial-gradient(circle_at_15%_75%,rgba(217,70,239,.12),transparent_28%),linear-gradient(135deg,#07040f,#0d0820)]" />
          <div className="absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:48px_48px]" />
          <div className="mx-auto w-full max-w-7xl">
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.22em] text-lilac">Founder-led agency · Bankura, West Bengal</p>
            <h1 className="max-w-5xl text-5xl font-bold leading-[0.98] tracking-tight text-white sm:text-7xl lg:text-[88px]">
              Architecting systems.<br /><span className="bg-gradient-to-r from-lilac via-violet to-orchid bg-clip-text text-transparent">Engineering growth.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-8 text-text-dark sm:text-xl">Backend and SaaS engineering paired with data-driven marketing—built for teams that need systems to perform and scale.</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="#contact" className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-royal to-orchid px-6 py-4 font-semibold text-white shadow-glow transition hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-lilac focus:ring-offset-4 focus:ring-offset-ink">Start a project <ArrowRight className="h-4 w-4" /></a>
              <a href="#services" className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-4 font-semibold text-white transition hover:border-lilac/60 hover:bg-white/5">Explore services</a>
            </div>
          </div>
        </section>

        <section id="services" className="bg-mist px-6 py-24 text-text-light">
          <div className="mx-auto max-w-7xl">
            <p class="font-mono text-xs uppercase tracking-[0.22em] text-royal">Capabilities</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold sm:text-6xl">Two disciplines. One growth engine.</h2>
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {services.filter((service) => service.published).map((service) => (
                <article key={service.id} className="rounded-4xl border border-plum/10 bg-white p-7 shadow-[0_20px_70px_rgba(26,16,51,.08)] transition hover:-translate-y-1 hover:border-violet/30 sm:p-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-plum text-lilac"><Building2 className="h-5 w-5" /></div>
                  <p className="mt-8 font-mono text-xs tracking-[0.2em] text-royal">{service.kind}</p>
                  <h3 className="mt-3 text-3xl font-bold">{service.name}</h3>
                  <p className="mt-4 leading-7 text-plum/75">{service.description}</p>
                  <ul className="mt-6 grid gap-2 text-sm sm:grid-cols-2">
                    {service.features.map((feature) => <li key={feature} className="rounded-xl bg-mist px-4 py-3">{feature}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="bg-ink px-6 py-24">
          <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_.8fr]">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-lilac">About Dcore Lab</p>
              <h2 class="mt-4 text-4xl font-bold text-white sm:text-6xl">Founder-led. System-minded.</h2>
            </div>
            <div className="rounded-4xl border border-white/10 bg-white/[0.035] p-8 backdrop-blur-xl">
              <p className="text-lg leading-8 text-text-dark">Dcore Lab is founded and led by {settings.founderName}. We combine engineering depth with data-informed growth strategy for real-world digital products.</p>
              <dl className="mt-8 grid gap-5 text-sm">
                <div><dt className="font-mono text-xs uppercase text-muted">Address</dt><dd className="mt-1 text-white">{settings.address}</dd></div>
                <div><dt className="font-mono text-xs uppercase text-muted">Business hours</dt><dd className="mt-1 text-white">{settings.businessHours}</dd></div>
              </dl>
            </div>
          </div>
        </section>

        <section id="contact" className="bg-mist px-6 py-24 text-text-light">
          <div className="mx-auto max-w-7xl rounded-4xl bg-plum px-7 py-12 text-white sm:px-12 sm:py-16">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-lilac">Start a conversation</p>
            <h2 className="mt-4 max-w-3xl text-4xl font-bold sm:text-6xl">Have a system or growth challenge?</h2>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="rounded-full bg-white px-6 py-4 font-semibold text-plum" href={`tel:${settings.phone.replace(/[^+\d]/g, "")}`}>Call {settings.phone}</a>
              <a className="rounded-full border border-white/20 px-6 py-4 font-semibold text-white" href={`mailto:${settings.email}`}>Email Dcore Lab</a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
