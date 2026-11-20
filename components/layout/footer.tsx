import { getSettings } from "@/lib/content";

export async function Footer() {
  const settings = await getSettings();
  return (
    <footer className="border-t border-white/10 bg-ink px-6 py-10 text-sm text-muted">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <span className="font-semibold text-white">Dcore Lab</span>
        <span>{settings.address}</span>
        <span>© {new Date().getFullYear()} Dcore Lab</span>
      </div>
    </footer>
  );
}
