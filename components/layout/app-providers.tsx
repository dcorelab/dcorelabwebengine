"use client";
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { MotionConfig } from "framer-motion";
export function AppProviders({ children }: { children: React.ReactNode }) { const container = useRef<HTMLDivElement>(null); useEffect(() => { const media = window.matchMedia("(prefers-reduced-motion: reduce)"); if (media.matches) return; const lenis = new Lenis({ autoRaf: true, smoothWheel: true }); return () => lenis.destroy(); }, []); return <MotionConfig reducedMotion="user"><div ref={container}>{children}</div></MotionConfig>; }
