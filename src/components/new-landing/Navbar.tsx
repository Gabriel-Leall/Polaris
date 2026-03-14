"use client";

import { Target, Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-md transition-colors duration-300"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between max-w-7xl">
        <Link href="/" className="flex items-center gap-2">
          <Target className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl tracking-tight text-foreground">
            Axis
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <Link
            href="#features"
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Features
          </Link>
          <Link
            href="#integrations"
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Integrations
          </Link>
          <Link
            href="#analytics"
            className="hover:text-primary transition-colors cursor-pointer"
          >
            Analytics
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-full hover:bg-secondary transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>
          )}
          <Link
            href="/login"
            className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-primary text-primary-foreground px-4 py-2 rounded-full hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Get Started
          </Link>
        </div>
      </div>
    </motion.header>
  );
}