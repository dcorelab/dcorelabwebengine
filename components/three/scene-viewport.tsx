"use client";
import type { ReactNode } from "react";
import { View } from "@/components/three/scene-canvas";
export function SceneViewport({ children, className = "" }: { children: ReactNode; className?: string }) { return <View className={`pointer-events-none absolute inset-0 ${className}`}>{children}</View>; }
