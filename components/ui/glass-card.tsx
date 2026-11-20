"use client";
import type { HTMLAttributes } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
type Props = HTMLAttributes<HTMLDivElement> & { tilt?: boolean };
export function GlassCard({ tilt = false, className, children, ...props }: Props) { return <motion.div whileHover={tilt ? { rotateX: -2, rotateY: 3, y: -3 } : undefined} transition={{ type: "spring", stiffness: 240, damping: 22 }} style={tilt ? { transformStyle: "preserve-3d" } : undefined} className={cn("glass-card p-6", className)} {...props}>{children}</motion.div>; }
