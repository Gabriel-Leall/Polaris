import { Metadata } from "next";

import {
  Navbar,
  Hero,
  Features,
  Integrations,
  Analytics,
  CTA,
  Footer,
} from "@/components/new-landing";

export const metadata: Metadata = {
  title: "Axis — Painel de foco",
  description:
    "Entre no seu estado de fluxo com o Axis, o painel que centraliza foco, tarefas e contexto.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Integrations />
        <Analytics />
        <CTA />
      </main>
      <Footer />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-24 bg-gradient-to-t from-background via-background/85 to-transparent" />
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 h-16 backdrop-blur-[2px]" />
    </div>
  );
}