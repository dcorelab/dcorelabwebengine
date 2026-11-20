import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono } from "next/font/google";
import { AppProviders } from "@/components/layout/app-providers";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { BlobCursor } from "@/components/layout/blob-cursor";
import { PageTransition } from "@/components/layout/page-transition";
import { SceneRoot } from "@/components/three/SceneRoot";
import "./globals.css";
const heading = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-heading", display: "swap" });
const body = DM_Sans({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });
export const metadata: Metadata = { title: { default: "Dcore Lab — Architecting Systems. Engineering Growth.", template: "%s | Dcore Lab" }, description: "Founder-led engineering and data-driven marketing from Dcore Lab.", robots: { index: true, follow: true } };
export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#07040F" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body className={`${heading.variable} ${body.variable} ${mono.variable}`}><a className="skip-link" href="#main-content">Skip to content</a><AppProviders><SceneRoot /><ScrollProgress /><Navbar /><PageTransition>{children}</PageTransition><Footer /><BlobCursor /></AppProviders></body></html>; }
