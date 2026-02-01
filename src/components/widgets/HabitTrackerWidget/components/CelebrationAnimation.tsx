"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  rotation: number;
  rotationSpeed: number;
}

interface CelebrationAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
  duration?: number;
}

const COLORS = [
  "#FF6B6B", // Red
  "#4ECDC4", // Teal
  "#FFE66D", // Yellow
  "#95E1D3", // Mint
  "#F38181", // Coral
  "#AA96DA", // Purple
  "#A8E6CF", // Light green
  "#DDA0DD", // Plum
  "#87CEEB", // Sky blue
  "#FFB347", // Orange
];

const PARTICLE_COUNT = 60;

export function CelebrationAnimation({
  isActive,
  onComplete,
  duration = 3000,
}: CelebrationAnimationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showGlow, setShowGlow] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const generateParticles = useCallback(() => {
    const newParticles: Particle[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + Math.random() * 0.5;
      const velocity = 8 + Math.random() * 12;

      newParticles.push({
        id: i,
        x: centerX,
        y: centerY,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        size: 6 + Math.random() * 10,
        velocity: {
          x: Math.cos(angle) * velocity,
          y: Math.sin(angle) * velocity - 5,
        },
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20,
      });
    }

    return newParticles;
  }, []);

  useEffect(() => {
    if (isActive) {
      setParticles(generateParticles());
      setShowGlow(true);

      const timer = setTimeout(() => {
        setParticles([]);
        setShowGlow(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isActive, duration, generateParticles, onComplete]);

  if (!mounted || !isActive) return null;

  const content = (
    <AnimatePresence>
      {showGlow && (
        <>
          {/* Screen flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.3, 0] }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-primary/30 pointer-events-none z-[100]"
          />

          {/* Center burst */}
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 3, 5], opacity: [1, 0.5, 0] }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-radial from-primary/80 via-primary/40 to-transparent pointer-events-none z-[100]"
          />

          {/* Confetti particles */}
          {particles.map((particle) => (
            <motion.div
              key={particle.id}
              initial={{
                x: particle.x,
                y: particle.y,
                scale: 0,
                rotate: particle.rotation,
              }}
              animate={{
                x: particle.x + particle.velocity.x * 30,
                y: particle.y + particle.velocity.y * 30 + 200,
                scale: [0, 1, 1, 0.5, 0],
                rotate: particle.rotation + particle.rotationSpeed * 30,
                opacity: [0, 1, 1, 0.8, 0],
              }}
              transition={{
                duration: duration / 1000,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              style={{
                position: "fixed",
                width: particle.size,
                height: particle.size,
                backgroundColor: particle.color,
                borderRadius: Math.random() > 0.5 ? "50%" : "2px",
                pointerEvents: "none",
                zIndex: 101,
              }}
            />
          ))}

          {/* Celebration text */}
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: [0, 1.2, 1], opacity: [0, 1, 1, 0], y: [20, 0, -30] }}
            transition={{ duration: 2, times: [0, 0.3, 0.7, 1] }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-[102]"
          >
            <div className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-pink-500 drop-shadow-lg">
              🎉 Parabéns! 🎉
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2, times: [0, 0.4, 0.7, 1] }}
              className="text-center text-lg md:text-xl text-foreground/80 mt-2 font-medium"
            >
              Todos os hábitos completados!
            </motion.p>
          </motion.div>

          {/* Sparkle effects */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`sparkle-${i}`}
              initial={{
                x: window.innerWidth / 2,
                y: window.innerHeight / 2,
                scale: 0,
                opacity: 1,
              }}
              animate={{
                x:
                  window.innerWidth / 2 +
                  Math.cos((Math.PI * 2 * i) / 12) * (150 + Math.random() * 100),
                y:
                  window.innerHeight / 2 +
                  Math.sin((Math.PI * 2 * i) / 12) * (150 + Math.random() * 100),
                scale: [0, 1, 0],
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.05,
                ease: "easeOut",
              }}
              className="fixed w-2 h-2 pointer-events-none z-[102]"
              style={{
                background: `radial-gradient(circle, ${COLORS[i % COLORS.length]} 0%, transparent 70%)`,
                boxShadow: `0 0 10px ${COLORS[i % COLORS.length]}`,
              }}
            />
          ))}
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(content, document.body);
}

export default CelebrationAnimation;
