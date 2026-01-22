"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AuthVisualsProps {
  alignment?: "left" | "right";
  className?: string;
}

export function AuthVisuals({
  alignment = "right",
  className,
}: AuthVisualsProps) {
  return (
    <div
      className={cn(
        "hidden md:block w-1/2 bg-main relative overflow-hidden",
        alignment === "left" ? "order-first" : "order-last",
        className,
      )}
    >
      <div className="absolute inset-0 nebula-glow" />

      {/* Meteor Streaks */}
      <div
        className="meteor-streak top-20 left-10"
        style={{ animationDelay: "0s" }}
      />
      <div
        className="meteor-streak top-[60%] left-[40%]"
        style={{ animationDelay: "5s" }}
      />
      <div
        className="meteor-streak top-[20%] left-[80%]"
        style={{ animationDelay: "8s" }}
      />

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* North Star Aura */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-primary/10 rounded-full north-star-aura" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[150px] bg-primary/5 rounded-full blur-3xl" />

        {/* Core Star */}
        <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-primary/20 via-white/90 to-primary-glow/40 shadow-[0_0_80px_rgba(99,102,241,0.3)] z-20">
          <div className="absolute inset-0 rounded-full bg-primary mix-blend-overlay opacity-30" />
          <div className="absolute inset-0 rounded-full shadow-inner blur-[2px]" />
        </div>

        {/* Orbital Path 1 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] orbital-path">
          <div className="orbit-container absolute inset-0">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-primary/60 shadow-[0_0_15px_rgba(165,180,252,0.4)] motion-blur-sphere" />
            <div className="absolute top-1/2 -right-1 w-1 h-1 rounded-full bg-muted/80" />
          </div>
        </div>

        {/* Orbital Path 2 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] orbital-path">
          <div className="orbit-container-fast absolute inset-0">
            <div className="absolute top-[20%] right-[10%] w-2 h-2 rounded-full bg-primary/40 motion-blur-sphere shadow-[0_0_10px_rgba(99,102,241,0.2)]" />
            <div className="absolute bottom-[20%] left-[10%] w-0.5 h-0.5 rounded-full bg-white/60" />
          </div>
        </div>

        {/* Static Stars */}
        <div className="absolute inset-0 animate-[spin_100s_linear_infinite] opacity-30">
          <div className="absolute top-10 left-40 w-0.5 h-0.5 bg-white rounded-full" />
          <div className="absolute bottom-20 right-10 w-1 h-1 bg-primary/30 rounded-full blur-[0.5px]" />
          <div className="absolute top-60 left-0 w-0.5 h-0.5 bg-white rounded-full" />
        </div>
      </div>

      <div className="absolute bottom-12 left-0 right-0 text-center">
        <span className="text-white font-light text-xs tracking-[0.4em] uppercase opacity-40">
          Navigate your universe
        </span>
      </div>
    </div>
  );
}
