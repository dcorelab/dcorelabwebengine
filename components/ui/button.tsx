"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost"; magnetic?: boolean };
export function Button({ className, variant = "primary", magnetic = true, children, ...props }: ButtonProps) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  return <motion.button type="button" onMouseMove={(event) => { if (!magnetic) return; const rect = event.currentTarget.getBoundingClientRect(); setOffset({ x: (event.clientX - rect.left - rect.width / 2) * .08, y: (event.clientY - rect.top - rect.height / 2) * .08 }); }} onMouseLeave={() => setOffset({ x: 0, y: 0 })} animate={{ x: offset.x, y: offset.y }} transition={{ type: "spring", stiffness: 280, damping: 20 }} className={cn("inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50", variant === "primary" && "bg-gradient-brand text-white shadow-glow hover:brightness-110", variant === "outline" && "border border-white/25 text-current hover:border-lilac hover:bg-white/5", variant === "ghost" && "text-current hover:bg-white/10", className)} {...props}>{children}</motion.button>;
}
