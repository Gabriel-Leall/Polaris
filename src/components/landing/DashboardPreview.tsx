import { motion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { useState, useRef } from "react";

export const DashboardPreview = () => {
  const [rotate, setRotate] = useState({ x: 15, y: -5 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.5], [100, 0]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xPerc = x / rect.width - 0.5;
    const yPerc = y / rect.height - 0.5;

    setRotate({
      x: 10 + yPerc * -20,
      y: -5 + xPerc * 20,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 15, y: -5 });
  };

  return (
    <div className="@container w-full py-20">
      <div
        className="flex flex-col items-center justify-center gap-8 text-center"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
            style={{
              textShadow:
                "0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(99, 102, 241, 0.4)",
            }}
          >
            Seu novo centro de comando.
          </h2>
          <p className="text-indigo-200/70 text-lg font-light tracking-wide font-mono max-w-2xl mt-4">
            Sem distrações. Apenas foco. Uma experiência de produtividade
            imersiva.
          </p>
        </motion.div>

        {/* Holographic Dashboard Preview */}
        <motion.div
          ref={containerRef}
          style={{
            perspective: "2000px",
            scale,
            opacity,
            y,
          }}
          className="w-full max-w-5xl px-4 md:px-0 mt-8 cursor-crosshair group"
        >
          <div
            className="relative w-full rounded-3xl overflow-hidden aspect-[16/9] border border-white/10 transition-transform duration-500 ease-out"
            style={{
              transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg) translateZ(50px)`,
              boxShadow: `
                   0 0 80px rgba(99, 102, 241, 0.3),
                   0 0 120px rgba(6, 182, 212, 0.2),
                   inset 0 0 40px rgba(255, 255, 255, 0.05)
                 `,
            }}
          >
            <Image
              alt="Polaris Dashboard Screenshot"
              className="w-full h-full object-cover scale-105 group-hover:scale-100 transition-transform duration-1000 ease-out"
              src="/dashboard-preview.png"
              width={1920}
              height={1080}
              priority
            />
            {/* Overlay Gradient for depth */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-cyan-500/10 pointer-events-none"></div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

