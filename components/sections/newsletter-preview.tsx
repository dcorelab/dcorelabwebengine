"use client";
import { useState } from "react";
import { useNewsletterStatus } from "@/lib/services/newsletter";
export default function NewsletterPreview() { const [email, setEmail] = useState(""); const [status, setStatus] = useNewsletterStatus(); return <form onSubmit={(event) => { event.preventDefault(); setStatus("Newsletter signup preview only—not connected yet."); }}><label htmlFor="newsletter" className="text-sm">Email address</label><input id="newsletter" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 rounded-full border border-white/20 bg-white/5 px-4 py-3"/><button className="ml-2 rounded-full bg-white px-4 py-3 text-plum">Join</button><p role="status">{status}</p></form>; }
