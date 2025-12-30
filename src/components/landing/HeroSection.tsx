'use client';

import Link from 'next/link';

export const HeroSection = () => {
  return (
    <div className="@container w-full">
      <div className="flex flex-col items-center justify-center gap-12 text-center">
        {/* Orbital Animation */}
        <div className="relative flex items-center justify-center size-64 md:size-80 lg:size-96">
          {/* Pulsing Background Orbs */}
          <div 
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#6366F1]/20 to-[#06B6D4]/20 blur-3xl opacity-30 animate-pulse"
            style={{ animationDelay: '0s', animationDuration: '3s' }}
          />
          <div 
            className="absolute inset-4 rounded-full bg-gradient-to-tr from-[#6366F1]/15 to-[#06B6D4]/15 blur-2xl opacity-25 animate-pulse"
            style={{ animationDelay: '0.5s', animationDuration: '3s' }}
          />
          <div 
            className="absolute inset-8 rounded-full bg-gradient-to-tr from-[#6366F1]/10 to-[#06B6D4]/10 blur-xl opacity-20 animate-pulse"
            style={{ animationDelay: '1s', animationDuration: '3s' }}
          />
          
          {/* Outer Ring - Cyan */}
          <svg 
            className="absolute inset-0 w-full h-full animate-spin text-[#06B6D4] drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]" 
            fill="none" 
            viewBox="0 0 100 100"
            style={{ animationDuration: '8s' }}
          >
            <path 
              d="M50 5 A45 45 0 0 1 95 50" 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeWidth="0.5"
            />
            <path 
              d="M50 95 A45 45 0 0 1 5 50" 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeOpacity="0.5" 
              strokeWidth="0.5"
            />
            <circle cx="95" cy="50" fill="white" r="1.5" />
          </svg>
          
          {/* Inner Ring - Purple */}
          <svg 
            className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] text-[#6366F1] drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
            fill="none" 
            viewBox="0 0 100 100"
            style={{ 
              animation: 'spin 10s linear infinite reverse'
            }}
          >
            <path 
              d="M50 5 A45 45 0 0 0 5 50" 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeWidth="0.8"
            />
            <path 
              d="M50 95 A45 45 0 0 0 95 50" 
              stroke="currentColor" 
              strokeLinecap="round" 
              strokeOpacity="0.5" 
              strokeWidth="0.4"
            />
            <circle cx="5" cy="50" fill="white" r="1.5" />
          </svg>
          
          {/* Center Core */}
          <div className="relative size-16 md:size-20 bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,0.6)] animate-pulse flex items-center justify-center z-10">
            <div className="size-full bg-white blur-sm rounded-full absolute opacity-50" />
          </div>
        </div>
        
        {/* Hero Text */}
        <div className="flex flex-col gap-4 max-w-2xl relative z-10">
          <h1 className="text-white text-5xl md:text-7xl font-black leading-none tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
              style={{
                textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(99, 102, 241, 0.4)'
              }}>
            Enter Your Flow State
          </h1>
          <h2 className="text-indigo-200/70 text-base md:text-lg font-light tracking-wide font-mono">
            Aligning productivity vectors. System ready.
          </h2>
        </div>
        
        {/* CTA Button */}
        <Link 
          href="/signup"
          className="group relative flex min-w-[160px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-14 px-8 bg-[#6366F1] hover:bg-blue-600 text-white transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_30px_rgba(99,102,241,0.6)] hover:scale-105"
        >
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full group-hover:translate-x-0 ease">
            <span className="material-symbols-outlined">rocket_launch</span>
          </span>
          <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease font-bold tracking-wider uppercase text-sm">
            Initiate System
          </span>
          <span className="relative invisible font-bold tracking-wider uppercase text-sm">
            Initiate System
          </span>
        </Link>
        
        {/* Status Indicator */}
        <div className="bg-[rgba(26,25,48,0.3)] backdrop-blur-[8px] border border-[rgba(255,255,255,0.1)] flex items-center justify-center p-3 rounded-xl min-w-[280px] shadow-lg">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
            <p className="text-white/80 text-sm font-mono">
              System Status: Online | 2k+ Users Active
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};