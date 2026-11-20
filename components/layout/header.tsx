import Link from "next/link";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="#home" className="font-heading text-lg font-bold text-white" aria-label="Dcore Lab home">
          DCORE <span className="text-lilac">LAB</span>
        </Link>
        <nav className="hidden items-center gap-7 text-sm text-text-dark md:flex" aria-label="Primary navigation">
          <Link className="transition hover:text-white" href="#services">Services</Link>
          <Link className="transition hover:text-white" href="#about">About</Link>
          <Link className="rounded-full border border-white/15 px-5 py-2.5 text-white transition hover:border-lilac/60 hover:bg-white/5" href="#contact">Start a project</Link>
        </nav>
      </div>
    </header>
  );
}
