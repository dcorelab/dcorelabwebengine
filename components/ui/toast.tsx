"use client";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
export function Toast({ message, onClose }: { message: string; onClose: () => void }) { useEffect(() => { if (!message) return; const timer = window.setTimeout(onClose, 3500); return () => window.clearTimeout(timer); }, [message, onClose]); return <AnimatePresence>{message && <motion.div role="status" aria-live="polite" initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 16, opacity: 0 }} className="fixed bottom-5 right-5 z-[90] rounded-xl border border-white/15 bg-plum px-5 py-3 text-sm text-white shadow-xl">{message}</motion.div>}</AnimatePresence>; }
