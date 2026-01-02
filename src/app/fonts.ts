import { Inter, JetBrains_Mono } from "next/font/google";
// import localFont from 'next/font/local' // Uncomment if using local Geist fonts

// Primary font for UI elements - Inter with Geist Sans fallback
export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["Geist Sans", "system-ui", "sans-serif"],
});

// Monospace font for code elements - JetBrains Mono with Geist Mono fallback
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  fallback: ["Geist Mono", "Monaco", "Consolas", "monospace"],
});

// Optional: Geist fonts as local fonts (if available)
// Uncomment these if you have Geist fonts locally installed
/*
export const geistSans = localFont({
  src: [
    {
      path: './fonts/GeistVF.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-geist-sans',
  display: 'swap',
})

export const geistMono = localFont({
  src: [
    {
      path: './fonts/GeistMonoVF.woff2',
      weight: '100 900',
      style: 'normal',
    },
  ],
  variable: '--font-geist-mono',
  display: 'swap',
})
*/

// Font class names for easy usage
export const fontClasses = {
  sans: inter.variable,
  mono: jetbrainsMono.variable,
};
