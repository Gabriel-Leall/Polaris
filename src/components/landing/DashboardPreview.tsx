"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const DashboardPreview = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position relativo ao container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Efeito 3D mais pronunciado: começa inclinado (20deg) e termina reto (0deg)
  // Invertido: parte de baixo inclinada
  const rotateX = useTransform(scrollYProgress, [0, 0.5], [-20, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  return (
    <div className="@container w-full py-24" ref={containerRef}>
      <div className="flex flex-col items-center justify-center">
        {/* Dashboard Screenshot - 3D Entry Effect */}
        <div
          className="w-full max-w-7xl px-4 md:px-0"
          style={{ perspective: "2500px" }}
        >
          <motion.div
            style={{
              rotateX,
              scale,
              y,
              transformOrigin: "center top",
            }}
            className="relative w-full rounded-2xl overflow-hidden aspect-[16/9] border border-white/10 bg-[#0A0A16]/50 shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
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
