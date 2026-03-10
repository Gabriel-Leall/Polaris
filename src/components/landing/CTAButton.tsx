"use client";

import { useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CTAButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
}

export function CTAButton({
  href,
  children,
  className,
  variant = "primary",
}: CTAButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [ripples, setRipples] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    },
    [],
  );

  const handleClick = useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();

    setRipples((prev) => [...prev, { id, x, y }]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 600);
  }, []);

  const isPrimary = variant === "primary";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Link
        ref={buttonRef}
        href={href}
        className={cn(
          "group relative flex min-w-[180px] cursor-pointer items-center justify-center overflow-hidden rounded-full transition-all duration-300",
          isPrimary
            ? "h-14 px-8 bg-gradient-to-r from-primary via-primary to-primary-hover text-primary-foreground shadow-[0_0_20px_oklch(var(--primary)/0.3)]"
            : "h-12 px-10 bg-primary/90 text-primary-foreground shadow-lg",
          "hover:shadow-[0_0_40px_oklch(var(--primary)/0.5)]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className,
        )}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        style={{
          backgroundSize: "200% 100%",
          backgroundPosition: isHovered ? "100% 0" : "0% 0",
        }}
      >
        {/* Animated gradient background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: isHovered ? "100%" : "-100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />

        {/* Glow effect that follows cursor */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 80px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.25), transparent)`,
          }}
        />

        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full bg-white/30 pointer-events-none"
            initial={{ width: 0, height: 0, opacity: 0.5 }}
            animate={{ width: 300, height: 300, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              left: ripple.x - 150,
              top: ripple.y - 150,
            }}
          />
        ))}

        {/* Border glow animation */}
        <motion.div
          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100"
          style={{
            background: `conic-gradient(from 0deg, transparent, rgba(99,102,241,0.5), transparent, rgba(168,85,247,0.5), transparent)`,
            padding: "2px",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "xor",
            WebkitMaskComposite: "xor",
          }}
          animate={{
            rotate: isHovered ? 360 : 0,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Content with scale effect */}
        <motion.span
          className={cn(
            "relative z-10 font-bold tracking-wide",
            isPrimary ? "text-base" : "text-sm",
          )}
          animate={{
            scale: isHovered ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.span>

        {/* Shine effect on hover */}
        <motion.div
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
          }}
        />
      </Link>
    </motion.div>
  );
}

export default CTAButton;
