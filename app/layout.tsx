import type { Metadata } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { Toaster } from "@/components/toast";

const fontVars = {
  "--font-inter": "'Inter Variable', system-ui, sans-serif",
  "--font-space": "'Space Grotesk Variable', system-ui, sans-serif",
  "--font-mono": "'JetBrains Mono Variable', monospace",
} as React.CSSProperties;

export const metadata: Metadata = {
  title: "NovaBank — Banking that moves at your speed",
  description:
    "A simulated neobank: instant transfers, smart analytics, virtual cards, and Pro tools for power users.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={fontVars}>
      <body className="noise min-h-screen">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
