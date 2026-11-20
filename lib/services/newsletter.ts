"use client";
import { useState } from "react";
export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  await new Promise((resolve) => window.setTimeout(resolve, 600));
  return email.trim() ? { success: true, message: "Thanks for your interest. Newsletter subscriptions are not connected yet, so please contact Dcore Lab directly." } : { success: false, message: "Enter a valid email address." };
}
export function useNewsletterStatus() { return useState<string>(""); }
