import React, { useEffect } from "react";
import { m, LazyMotion, domAnimation, AnimatePresence } from "framer-motion";
import * as Icons from "lucide-react";

interface LevelUpOverlayProps {
  show: boolean;
  level: number;
  onComplete: () => void;
}

export function LevelUpOverlay({
  show,
  level,
  onComplete,
}: LevelUpOverlayProps) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onComplete();
      }, 4000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [show, onComplete]);

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {show && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            {/* Backdrop vignette */}
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Central Glow */}
            <m.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 2, 4] }}
              transition={{ duration: 2, ease: "easeOut" }}
              className="absolute w-96 h-96 bg-indigo-500/30 blur-[100px] rounded-full mix-blend-screen"
            />

            {/* Particles */}
            {[...Array(30)].map((_, i) => (
              <m.div
                key={`particle-${String(i)}`}
                className="absolute w-2 h-2 bg-indigo-300 rounded-full shadow-[0_0_15px_rgba(129,140,248,1)]"
                initial={{ x: 0, y: 0, scale: 0.95, opacity: 0 }}
                animate={{
                  x: (Math.random() - 0.5) * 800,
                  y: (Math.random() - 0.5) * 800,
                  scale: [0.95, Math.random() * 2 + 1, 0.95],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 1.5 + Math.random(), ease: "easeOut" }}
              />
            ))}

            {/* Rays */}
            {[...Array(12)].map((_, i) => (
              <m.div
                key={`ray-${String(i)}`}
                className="absolute w-1 h-64 bg-gradient-to-t from-transparent via-indigo-400/50 to-transparent origin-bottom"
                style={{ rotate: `${i * 30}deg`, bottom: "50%" }}
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: [0, 1.5, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
            ))}

            {/* Main Content */}
            <m.div
              initial={{ opacity: 0, y: 50, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 1.2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative z-10 flex flex-col items-center"
            >
              <m.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-12 border border-indigo-500/30 rounded-full border-dashed"
              />
              <m.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-16 border border-indigo-400/20 rounded-full border-dotted"
              />

              <div className="relative w-32 h-32 rounded-full bg-[#0a0a0a] border-4 border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.5)] flex items-center justify-center mb-6">
                <Icons.Zap
                  size={48}
                  className="text-indigo-400 fill-indigo-400/20"
                />
              </div>

              <h2 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-indigo-200 drop-shadow-[0_0_20px_rgba(99,102,241,0.8)] tracking-tighter mb-2">
                LEVEL UP!
              </h2>

              <div className="bg-indigo-500/20 border border-indigo-500/50 px-6 py-2 rounded-full backdrop-blur-md">
                <span className="text-indigo-200 font-mono text-xl">
                  Você alcançou o nível{" "}
                  <span className="text-white font-bold">{level}</span>
                </span>
              </div>
            </m.div>
          </div>
        )}
      </AnimatePresence>
    </LazyMotion>
  );
}
