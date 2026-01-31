import { Metadata } from "next";

import { LandingHeader } from "@/components/landing/LandingHeader";
import { HeroSection } from "@/components/landing/HeroSection";
import { DashboardPreview } from "@/components/landing/DashboardPreview";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { InteractiveTabs } from "@/components/landing/InteractiveTabs";
import { ActionSection } from "@/components/landing/ActionSection";

import { LandingFooter } from "@/components/landing/LandingFooter";
import { BackgroundEffects } from "@/components/landing/BackgroundEffects";

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
    <div
      className={`bg-background text-foreground antialiased overflow-x-hidden selection:bg-primary selection:text-primary-foreground`}
    >
      <div className="relative flex h-auto min-h-screen w-full flex-col">
        <BackgroundEffects />

        {/* Navbar fora do container principal - estilo TickTick */}
        <LandingHeader />

        <div className="layout-container flex h-full grow flex-col relative z-10 pt-16">
          <div
            id="main-content"
            className="flex flex-1 justify-center py-20 lg:py-32 px-6 md:px-12"
          >
            <div className="layout-content-container flex flex-col max-w-[1000px] flex-1 items-center gap-24 md:gap-32">
              <HeroSection />
              <DashboardPreview />
              <ProblemSection />
              <FeaturesSection />
              <InteractiveTabs />
              <ActionSection />
            </div>
          </div>

          <LandingFooter />
        </div>
      </div>
    </div>
  );
}
