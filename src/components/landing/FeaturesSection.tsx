"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { useRef, useEffect, useState } from "react";
import { Check } from "lucide-react";

// --- Components ---

const FeatureVideo = ({
  src,
  className,
}: {
  src: string;
  className?: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Intersection Observer para lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            // Delay pequeno para suavizar o carregamento
            setTimeout(() => setShouldLoad(true), 100);
          } else {
            setIsInView(false);
          }
        });
      },
      {
        threshold: 0.1, // Começa a carregar quando 10% está visível
        rootMargin: "50px", // Pre-load 50px antes
      },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Controla playback baseado na visibilidade
  useEffect(() => {
    if (videoRef.current && shouldLoad) {
      if (isInView) {
        videoRef.current.play().catch(() => {
          // Silenciar erros de autoplay
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isInView, shouldLoad]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative group rounded-3xl overflow-hidden shadow-lg border border-border bg-card",
        className,
      )}
    >
      {/* Glow behind - animated */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-700" />

      {/* Glass reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />

      {/* Skeleton loader */}
      {!shouldLoad && (
        <div className="w-full aspect-video bg-muted/20 animate-pulse relative z-10" />
      )}

      {/* Video carrega apenas quando necessário */}
      {shouldLoad && (
        <video
          ref={videoRef}
          src={src}
          className="w-full h-auto relative z-10 block"
          muted
          loop
          playsInline
          preload="metadata"
          width="100%"
          height="100%"
        />
      )}

      {/* Inner border/shine */}
      <div className="absolute inset-0 ring-1 ring-white/10 rounded-3xl z-20 pointer-events-none" />
    </div>
  );
};

const FeatureSectionRow = ({
  title,
  description,
  videoSrc,
  reverse = false,
}: {
  title: string;
  description: string | React.ReactNode;
  videoSrc: string;
  reverse?: boolean;
}) => {
  // Staggered variants for text
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-12 md:gap-24 py-24 md:py-32 w-full",
        reverse ? "md:flex-row-reverse" : "md:flex-row",
      )}
    >
      {/* Text Side */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="flex-1 space-y-6 text-center md:text-left"
      >
        {/* Widget Title - Sutil */}
        <motion.h4
          variants={itemVariants}
          className="text-sm md:text-base font-medium text-muted-foreground/60 tracking-wide uppercase"
        >
          {title}
        </motion.h4>

        {/* Description - Em Destaque mas legível */}
        <motion.div
          variants={itemVariants}
          className="text-lg md:text-xl font-normal text-foreground/80 leading-relaxed max-w-xl mx-auto md:mx-0"
        >
          {description}
        </motion.div>

        {/* Active System Tag */}
        <motion.div
          variants={itemVariants}
          className="flex justify-center md:justify-start"
        >
          <div className="flex items-center gap-3 text-muted-foreground/60 text-xs font-mono tracking-[0.2em] uppercase group cursor-default">
            <div className="h-[1px] w-8 bg-border/50 group-hover:w-12 transition-all duration-300" />
            <span className="group-hover:text-primary transition-colors">
              ACTIVE SYSTEM
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Visual Side */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex-1 flex items-center justify-center w-full"
      >
        <FeatureVideo src={videoSrc} className="w-full max-w-4xl" />
      </motion.div>
    </div>
  );
};

export const FeaturesSection = () => {
  return (
    <div className="w-full py-20 pb-40 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-6 text-center mb-10 md:mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2
            className="text-foreground text-4xl md:text-7xl font-black leading-tight tracking-tighter"
            style={{
              textShadow: "0 0 30px rgba(99, 102, 241, 0.3)",
            }}
          >
            Engineered for <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Maximum Efficiency
            </span>
          </h2>
          <p className="text-muted-foreground text-base md:text-xl font-light tracking-wide max-w-2xl mt-8 mx-auto font-mono">
            One platform. Zero distractions. Absolute focus.
          </p>
        </motion.div>
      </div>

      {/* Horizontal Sections */}
      <div className="flex flex-col w-full max-w-7xl mx-auto px-6 relative z-10">
        <FeatureSectionRow
          title="Pomodoro Timer"
          description={
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Sessões personalizáveis de 25 minutos</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Pausas estratégicas automáticas</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Técnica comprovada para máximo foco</span>
              </li>
            </ul>
          }
          videoSrc="/videos/Pomodoro Timer.mp4"
        />

        <FeatureSectionRow
          title="Brain Dump"
          description={
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Capture ideias em segundos</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Formatação Markdown avançada</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Busca instantânea e organização automática</span>
              </li>
            </ul>
          }
          videoSrc="/videos/Brain Dump.mp4"
          reverse
        />

        <FeatureSectionRow
          title="Habit Tracker"
          description={
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Visualização diária de progresso</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Sistema de streaks motivacional</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span>Construa consistência a longo prazo</span>
              </li>
            </ul>
          }
          videoSrc="/videos/Habit Tracker.mp4"
        />
      </div>
    </div>
  );
};

export default FeaturesSection;
