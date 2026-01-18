"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { AuthVisuals } from "./AuthVisuals";
import { cn } from "@/lib/utils";

interface AuthContainerProps {
  children: React.ReactNode;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  const pathname = usePathname();
  const isSignup = pathname === "/signup";

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#050506] relative overflow-hidden transition-colors duration-300">
      <div className="absolute inset-0 grain-overlay z-0" />
      
      <div className="relative w-full max-w-6xl bg-[#0B0B0D] rounded-[32px] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row min-h-[640px] border border-white/[0.03] z-10">
        
        {/* Forms Layer */}
        <div className="flex w-full min-h-inherit relative">
          {/* Sign In Side (Left) */}
          <div className={cn(
            "w-full md:w-1/2 transition-opacity duration-500",
            isSignup ? "md:opacity-0 md:pointer-events-none" : "opacity-100"
          )}>
            {!isSignup && children}
          </div>

          {/* Sign Up Side (Right) */}
          <div className={cn(
            "w-full md:w-1/2 transition-opacity duration-500",
            !isSignup ? "md:opacity-0 md:pointer-events-none" : "opacity-100"
          )}>
            {isSignup && children}
          </div>
        </div>

        {/* Sliding Visual Panel */}
        <motion.div 
          initial={false}
          animate={{ 
            x: isSignup ? "0%" : "100%",
          }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.7 
          }}
          className="hidden md:block absolute top-0 bottom-0 w-1/2 z-50 overflow-hidden"
        >
          <AuthVisuals 
            alignment={isSignup ? "left" : "right"} 
            className="w-full h-full" 
          />
        </motion.div>

        {/* Decorative dots */}
        <div 
          className={cn(
            "absolute top-6 flex space-x-2 z-50 transition-all duration-700",
            isSignup ? "right-6" : "left-6"
          )}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]" />
          <div className="w-2.5 h-2.5 rounded-full bg-white/[0.1]" />
        </div>
      </div>
    </div>
  );
};
