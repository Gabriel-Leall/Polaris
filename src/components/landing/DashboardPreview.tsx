"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const DashboardPreview = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position
  const { scrollY } = useScroll();

  // Map scroll (0 to 1000px) to rotation (12deg to 0deg) and scale (1.1 to 1)
  const rotateX = useTransform(scrollY, [0, 800], [12, 0]);
  const scale = useTransform(scrollY, [0, 800], [1.1, 1]);
  const opacity = useTransform(scrollY, [0, 300], [0, 1]);

  return (
    <div className="@container w-full py-24" ref={containerRef}>
      <div className="flex flex-col items-center justify-center gap-6 text-center">
        <motion.div
          style={{ opacity }}
          className="flex flex-col gap-4 items-center"
        >
          <h2 className="text-white text-3xl md:text-5xl font-bold leading-tight tracking-tight">
            Tudo o que você precisa, <br />
            <span className="text-primary">em um só lugar.</span>
          </h2>
          <p className="text-white/60 text-lg md:text-xl font-normal max-w-2xl leading-relaxed">
            Elimine a alternância entre abas. O Polaris reúne suas notas,
            tarefas e foco em uma interface única e imersiva.
          </p>
        </motion.div>

        {/* Dashboard Screenshot - 3D Entry Effect */}
        <div
          className="w-full max-w-[1100px] px-4 md:px-0 mt-12"
          style={{ perspective: "2000px" }}
        >
          <motion.div
            style={{
              rotateX,
              scale,
              transformOrigin: "center top",
            }}
            className="relative w-full rounded-2xl overflow-hidden aspect-[16/9] border border-white/10 bg-[#0A0A16]/50 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <Image
              alt="Polaris Dashboard"
              src="/dashboard-hero.png"
              fill
              className="object-cover"
              priority
            />
            {/* Subtle Overlay Glow */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
