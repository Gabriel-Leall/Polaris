"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const DashboardPreview = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll position relativo ao container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 80%", "end center"],
  });

  // Efeito 3D pronunciado: começa visível e inclinado, termina reto
  const rotateX = useTransform(scrollYProgress, [0, 1], [25, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0.6, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);

  return (
    <div className="@container w-full" ref={containerRef}>
      <div className="flex flex-col items-center justify-center">
        {/* Dashboard Screenshot - 3D Entry Effect */}
        <motion.div
          style={{
            rotateX,
            scale,
            opacity,
            y,
            perspective: "2500px",
            transformStyle: "preserve-3d",
            transformOrigin: "center center",
          }}
          className="relative w-full max-w-7xl px-4 md:px-0 rounded-2xl overflow-hidden aspect-[16/9] border border-white/10 bg-[#0A0A16]/50 shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
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
  );
};
