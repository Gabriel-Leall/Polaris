import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Polaris Design System - CSS Variable Based (supports light/dark)
        main: "hsl(var(--background))",
        card: "hsl(var(--card))",
        sidebar: "hsl(var(--sidebar))",
        input: "hsl(var(--input))",

        // Primary colors - Blue-Cyan palette (no purple)
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        "primary-hover": "hsl(var(--primary-hover))",

        // Secondary colors
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },

        // Status colors
        "status-interview": "hsl(var(--primary))",
        "status-applied": "hsl(var(--accent))",
        "status-rejected": "hsl(var(--destructive))",
        "status-pending": "hsl(var(--warning))",

        // Text colors
        foreground: "hsl(var(--foreground))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        "muted-foreground": "hsl(var(--muted-foreground))",
        code: "hsl(var(--muted-foreground))",

        // Semantic colors
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        success: "hsl(var(--success))",
        warning: "hsl(var(--warning))",

        // Glass and borders
        glass: "hsl(var(--glass))",
        border: "hsl(var(--border))",

        // Background
        background: "hsl(var(--background))",

        // Popover and accent
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        ring: "hsl(var(--ring))",

        // Chart colors
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        sans: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
        mono: ["var(--font-jetbrains-mono)", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        "3xl": "24px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        // Reduced glow for flat design - more subtle
        glow: "0 0 12px hsl(var(--primary) / 0.15)",
        "glow-sm": "0 0 6px hsl(var(--primary) / 0.1)",
        "glow-lg": "0 0 20px hsl(var(--primary) / 0.2)",
        "glow-xl": "0 0 30px hsl(var(--primary) / 0.25)",
        // Card shadows - subtle and clean
        card: "0 1px 3px hsl(var(--foreground) / 0.05)",
        "card-hover": "0 4px 12px hsl(var(--foreground) / 0.08)",
        subtle: "0 1px 2px hsl(var(--foreground) / 0.05)",
        "subtle-hover": "0 2px 4px hsl(var(--foreground) / 0.08)",
      },
      backgroundImage: {
        "gradient-active":
          "linear-gradient(to right, hsl(var(--primary) / 0.15), hsl(var(--accent) / 0.05), transparent)",
        "gradient-glass":
          "linear-gradient(135deg, hsl(var(--foreground) / 0.03), hsl(var(--foreground) / 0.01))",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
        "slide-down": "slideDown 0.3s ease-out",
        "scale-in": "scaleIn 0.2s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
          },
          "100%": {
            opacity: "1",
          },
        },
        slideUp: {
          "0%": {
            transform: "translateY(10px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        slideDown: {
          "0%": {
            transform: "translateY(-10px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
        scaleIn: {
          "0%": {
            transform: "scale(0.95)",
            opacity: "0",
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1",
          },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
};

export default config;
