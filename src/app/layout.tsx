import type { Metadata } from "next";
import { inter, jetbrainsMono, geistSans, geistMono } from "./fonts";
import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { TooltipProvider } from "@/components/animate-ui/primitives/radix/tooltip";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Axis - Focus Dashboard",
  description: "AI-powered productivity dashboard with focus mode",
  icons: {
    icon: [
      { url: "/favicon/Axis-logo.ico", type: "image/x-icon" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/favicon/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [{ rel: "manifest", url: "/favicon/site.webmanifest" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <SmoothScrollProvider>
          <ThemeProvider>
            <TooltipProvider>
              <GlobalErrorBoundary>
                {children}
                <Toaster />
              </GlobalErrorBoundary>
            </TooltipProvider>
          </ThemeProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
