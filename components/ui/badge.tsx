import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) { return <span className={cn("inline-flex items-center rounded-full border border-violet/30 bg-violet/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[.15em] text-lilac", className)} {...props} />; }
