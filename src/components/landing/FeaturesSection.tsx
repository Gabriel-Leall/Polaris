"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";
import { useRef, useEffect } from "react";

// --- Components ---

const FeatureVideo = ({
  src,
  className,
}: {
  src: string;
  className?: string;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
    }
  }, []);

  return (
    <div
      className={cn(
        "relative group rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#0A0A16]",
        className,
      )}
    >
      {/* Glow behind - animated */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Glass reflection effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20" />

      <video
        ref={videoRef}
        src={src}
        className="w-full h-auto relative z-10 block"
        muted
        loop
        playsInline
        autoPlay
        width="100%"
        height="100%"
      />

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
  index,
}: {
  title: string;
  description: string;
  videoSrc: string;
  reverse?: boolean;
  index: number;
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
        <motion.div variants={itemVariants} className="space-y-2">
          <span className="text-[10px] font-mono text-indigo-400 tracking-[0.4em] uppercase font-black">
            Protocol 0{index + 1}
          </span>
          <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
            {title}
          </h3>
        </motion.div>

        <motion.p
          variants={itemVariants}
          className="text-indigo-200/60 text-lg md:text-xl font-light leading-relaxed max-w-xl mx-auto md:mx-0"
        >
          {description}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="pt-4 flex justify-center md:justify-start"
        >
          <div className="flex items-center gap-3 text-white/40 text-sm font-mono group cursor-default">
            <div className="h-[1px] w-8 bg-white/20 group-hover:w-12 transition-all duration-300" />
            <span className="group-hover:text-indigo-400 transition-colors">
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
        className="flex-1 flex items-center justify-center w-full px-4 md:px-0"
      >
        <FeatureVideo src={videoSrc} className="max-w-[500px] w-full" />
      </motion.div>
    </div>
  );
};

export const FeaturesSection = () => {
  return (
    <div className="w-full py-20 pb-40 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-purple-900/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-blue-900/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col items-center justify-center gap-6 text-center mb-10 md:mb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <h2
            className="text-white text-4xl md:text-7xl font-black leading-tight tracking-tighter"
            style={{
              textShadow: "0 0 30px rgba(99, 102, 241, 0.3)",
            }}
          >
            Engineered for <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              Maximum Efficiency
            </span>
          </h2>
          <p className="text-indigo-200/50 text-base md:text-xl font-light tracking-wide max-w-2xl mt-8 mx-auto font-mono">
            One platform. Zero distractions. Absolute focus.
          </p>
        </motion.div>
      </div>

      {/* Horizontal Sections */}
      <div className="flex flex-col w-full max-w-7xl mx-auto px-6 relative z-10">
        <FeatureSectionRow
          index={0}
          title="Zen Mode"
          description="Silence the noise. Integrated focus sessions with custom soundscapes. Built to protect your flow state and cognitive energy."
          videoSrc="/videos/zen-timer.mp4"
        />

        <FeatureSectionRow
          index={1}
          title="Brain Dump"
          description="From brain dump to organized archive. Support for markdown and fast cognitive offloading. Your second brain, formatted for speed."
          videoSrc="/videos/brain-dump.mp4"
          reverse
        />

        <FeatureSectionRow
          index={2}
          title="Habit Loop"
          description="Consistency is visual. Track your streaks and build a second-nature productivity loop. Experience growth as a visual journey."
          videoSrc="/videos/habit-loop.mp4"
        />
      </div>
    </div>
  );
};

export default FeaturesSection;
