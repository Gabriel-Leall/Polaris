import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Backgrounds (semantic tokens)
        'main': '#09090B',
        'card': '#121214',
        'sidebar': '#0C0C0E',
        'input': '#18181B',
        
        // Accents
        'primary': '#6366F1',
        'primary-glow': '#818CF8',
        'secondary': '#A1A1AA',
        
        // Semantic Status
        'status-interview': '#6366F1',
        'status-applied': '#3B82F6',
        'status-rejected': '#EF4444',
        'status-pending': '#EAB308',
        
        // Text colors (semantic tokens)
        'muted': '#A1A1AA',
        'code': '#71717A',
        
        // Border
        'glass': 'rgba(255, 255, 255, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'Geist Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Geist Mono', 'monospace'],
      },
      borderRadius: {
        '3xl': '24px',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.5)',
      },
      backgroundImage: {
        'gradient-active': 'linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.05), transparent)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config