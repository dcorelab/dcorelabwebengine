"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
type Item = { id: string; title: string; content: string };
export function Accordion({ items }: { items: Item[] }) { const [open, setOpen] = useState<string | null>(null); return <div className="divide-y divide-white/10">{items.map((item) => { const expanded = open === item.id; return <div key={item.id}><h3><button aria-expanded={expanded} aria-controls={`panel-${item.id}`} onClick={() => setOpen(expanded ? null : item.id)} className="flex w-full items-center justify-between py-4 text-left font-semibold">{item.title}<ChevronDown className={`h-4 w-4 transition-transform ${expanded ? "rotate-180" : ""}`} /></button></h3><AnimatePresence initial={false}>{expanded && <motion.div id={`panel-${item.id}`} role="region" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="pb-4 leading-7 text-muted">{item.content}</p></motion.div>}</AnimatePresence></div>; })}</div>; }
