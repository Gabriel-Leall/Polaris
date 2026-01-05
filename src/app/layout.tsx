import type { Metadata } from "next";
import { inter, jetbrainsMono } from "./fonts";
import { GlobalErrorBoundary } from "@/components/ui/global-error-boundary";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Polaris - Job Application Tracker",
  description: "AI-powered job application tracking dashboard with focus mode",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased">
        <GlobalErrorBoundary>
          {children}
          <Toaster />
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
