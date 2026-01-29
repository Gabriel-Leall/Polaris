"use client";

import Link from "next/link";

export const HeroSection = () => {
  return (
    <div className="@container w-full text-center">
      <div className="flex flex-col items-center justify-center gap-6 md:gap-8">
        {/* Main Headline */}
        <div className="flex flex-col gap-6 max-w-4xl relative z-10 mx-auto">
          <h1
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-tight tracking-[-0.03em] bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70"
            style={{
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            }}
          >
            Tudo o que você precisa, <br />
            <span className="text-primary">em um só lugar.</span>
          </h1>
          <h2 className="text-muted-foreground text-lg md:text-2xl font-normal max-w-2xl mx-auto leading-relaxed">
            Elimine a alternância entre abas. O Polaris reúne suas notas,
            tarefas e foco em uma interface única e imersiva.
          </h2>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 mt-4">
          <Link
            href="/signup"
            className="group relative flex min-w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-8 bg-primary hover:bg-primary-hover text-primary-foreground transition-all duration-300 shadow-glow hover:scale-105"
          >
            <span className="font-bold tracking-wide text-base">
              Começar Grátis
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
};
