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
  			// Polaris Design System - Deep Midnight Theme
  			main: '#09090B',
  			card: '#121214',
  			sidebar: '#0C0C0E',
  			input: '#18181B',
  			
  			// Primary colors
  			primary: {
  				DEFAULT: '#6366F1',
  				foreground: '#FAFAFA'
  			},
  			'primary-glow': '#818CF8',
  			
  			// Secondary colors
  			secondary: {
  				DEFAULT: '#A1A1AA',
  				foreground: '#FAFAFA'
  			},
  			
  			// Status colors
  			'status-interview': '#6366F1',
  			'status-applied': '#3B82F6',
  			'status-rejected': '#EF4444',
  			'status-pending': '#EAB308',
  			
  			// Text colors
  			foreground: '#FAFAFA',
  			muted: {
  				DEFAULT: '#A1A1AA',
  				foreground: '#71717A'
  			},
  			'muted-foreground': '#71717A',
  			code: '#71717A',
  			
  			// Semantic colors
  			destructive: {
  				DEFAULT: '#EF4444',
  				foreground: '#FAFAFA'
  			},
  			success: '#22C55E',
  			warning: '#EAB308',
  			
  			// Glass and borders
  			glass: 'rgba(255, 255, 255, 0.05)',
  			border: 'rgba(255, 255, 255, 0.1)',
  			
  			// Background
  			background: '#09090B',
  			
  			// Popover and accent (fallback to Polaris colors)
  			popover: {
  				DEFAULT: '#121214',
  				foreground: '#FAFAFA'
  			},
  			accent: {
  				DEFAULT: '#6366F1',
  				foreground: '#FAFAFA'
  			},
  			ring: '#6366F1',
  			
  			// Chart colors (using Polaris palette)
  			chart: {
  				'1': '#6366F1',
  				'2': '#3B82F6',
  				'3': '#22C55E',
  				'4': '#EAB308',
  				'5': '#EF4444'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-inter)',
  				'Inter',
  				'Geist Sans',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'var(--font-jetbrains-mono)',
  				'JetBrains Mono',
  				'Geist Mono',
  				'monospace'
  			]
  		},
  		borderRadius: {
  			'3xl': '24px',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		boxShadow: {
  			glow: '0 0 20px rgba(99, 102, 241, 0.5)',
  			'glow-sm': '0 0 10px rgba(99, 102, 241, 0.3)',
  			'glow-lg': '0 0 30px rgba(99, 102, 241, 0.6)',
  			'glow-xl': '0 0 40px rgba(99, 102, 241, 0.7)',
  			card: '0 2px 8px rgba(0, 0, 0, 0.1)',
  			'card-hover': '0 4px 16px rgba(0, 0, 0, 0.15)',
  			subtle: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
  			'subtle-hover': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)'
  		},
  		backgroundImage: {
  			'gradient-active': 'linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.05), transparent)',
  			'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))',
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		backdropBlur: {
  			xs: '2px'
  		},
  		animation: {
  			'fade-in': 'fadeIn 0.5s ease-in-out',
  			'slide-up': 'slideUp 0.3s ease-out',
  			'slide-down': 'slideDown 0.3s ease-out',
  			'scale-in': 'scaleIn 0.2s ease-out',
  			'glow-pulse': 'glowPulse 2s ease-in-out infinite'
  		},
  		keyframes: {
  			fadeIn: {
  				'0%': {
  					opacity: '0'
  				},
  				'100%': {
  					opacity: '1'
  				}
  			},
  			slideUp: {
  				'0%': {
  					transform: 'translateY(10px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			slideDown: {
  				'0%': {
  					transform: 'translateY(-10px)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'translateY(0)',
  					opacity: '1'
  				}
  			},
  			scaleIn: {
  				'0%': {
  					transform: 'scale(0.95)',
  					opacity: '0'
  				},
  				'100%': {
  					transform: 'scale(1)',
  					opacity: '1'
  				}
  			},
  			glowPulse: {
  				'0%, 100%': {
  					boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
  				},
  				'50%': {
  					boxShadow: '0 0 30px rgba(99, 102, 241, 0.8)'
  				}
  			}
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
