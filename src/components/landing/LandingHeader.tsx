'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export const LandingHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className={`w-full flex justify-center sticky top-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'backdrop-blur-md bg-[#050510]/80 border-b border-[rgba(255,255,255,0.1)]' 
        : 'bg-transparent'
    }`}>
      <div className="w-full max-w-[1280px] px-6 py-4">
        <header className="flex items-center justify-between whitespace-nowrap">
          {/* Logo - Esquerda */}
          <div className="flex items-center gap-3">
            <div className="size-8 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-[#06B6D4]/50 animate-spin-slow"></div>
              <div className="absolute inset-1 rounded-full border border-[#6366F1]/50 animate-spin-reverse-slow"></div>
              <div className="size-2 bg-white rounded-full shadow-[0_0_10px_white]"></div>
            </div>
            <h1 className="text-white text-xl font-bold tracking-wide">
              POLARIS
            </h1>
          </div>
          
          {/* Navigation - Centro */}
          <nav className="hidden md:flex items-center gap-8">
            <a className="text-gray-300 hover:text-white text-sm font-medium transition-colors" href="#features">
              Features
            </a>
            <a className="text-gray-300 hover:text-white text-sm font-medium transition-colors" href="#workflow">
              Workflow
            </a>
            <a className="text-gray-300 hover:text-white text-sm font-medium transition-colors" href="#about">
              About
            </a>
          </nav>
          
          {/* Actions - Direita */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login"
              className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/signup"
              className="bg-[#6366F1] hover:bg-[#5855eb] text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </header>
      </div>
    </div>
  );
};