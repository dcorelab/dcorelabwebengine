"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
const SceneRootCanvas = dynamic(() => import("@/components/three/scene-canvas").then((module) => module.SceneCanvas), { ssr: false, loading: () => null });
export function SceneRoot() { const [ready, setReady] = useState(false); const [enabled, setEnabled] = useState(true); useEffect(() => { setReady(true); const read = () => setEnabled(localStorage.getItem("dcore-disable-3d") !== "true"); read(); window.addEventListener("dcore-3d-toggle", read); return () => window.removeEventListener("dcore-3d-toggle", read); }, []); if (!ready || !enabled) return <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_76%_28%,rgba(124,58,237,.18),transparent_38%),linear-gradient(135deg,#07040F,#0D0820)]" />; return <SceneRootCanvas />; }
