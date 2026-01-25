"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PolarisIcon } from "@/components/ui/PolarisIcon";
import { PolarisName } from "@/components/ui/PolarisName";

export const LandingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Skip to main content - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Navbar estilo TickTick - Fixed com glassmorphism */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-[rgba(11,11,13,0.85)] backdrop-blur-lg border-b border-white/5 shadow-sm"
            : "bg-transparent"
        }`}
        style={
          isScrolled
            ? {
                backdropFilter: "blur(12px) saturate(150%)",
                WebkitBackdropFilter: "blur(12px) saturate(150%)",
              }
            : undefined
        }
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo - Esquerda */}
            <Link
              href="/"
              className="flex items-center gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-main rounded-lg transition-all -ml-2 px-2 py-1"
              style={{ touchAction: "manipulation" }}
            >
              <PolarisIcon size={32} interactive={true} />
              <PolarisName size="sm" animated={true} />
            </Link>

            {/* Navigation - Centro */}
            <div className="hidden md:flex items-center gap-1">
              <a
                className="text-gray-300 hover:text-white hover:bg-white/5 active:bg-white/10 text-sm font-medium transition-all px-4 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                href="#features"
                style={{ touchAction: "manipulation" }}
              >
                Features
              </a>

              <a
                className="text-gray-300 hover:text-white hover:bg-white/5 active:bg-white/10 text-sm font-medium transition-all px-4 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                href="#about"
                style={{ touchAction: "manipulation" }}
              >
                About
              </a>
            </div>

            {/* Actions - Direita */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-gray-300 hover:text-white hover:bg-white/5 active:bg-white/10 text-sm font-medium transition-all px-4 py-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                style={{ touchAction: "manipulation" }}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-primary hover:bg-primary-glow active:scale-[0.98] text-white px-5 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-main"
                style={{ touchAction: "manipulation" }}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
