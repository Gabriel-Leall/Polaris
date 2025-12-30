import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LandingHeader } from '@/components/landing/LandingHeader';
import { HeroSection } from '@/components/landing/HeroSection';
import { DashboardPreview } from '@/components/landing/DashboardPreview';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { WorkflowSection } from '@/components/landing/WorkflowSection';
import { AboutSection } from '@/components/landing/AboutSection';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { BackgroundEffects } from '@/components/landing/BackgroundEffects';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '900'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Polaris - Focus Orbit',
  description: 'Enter your flow state with Polaris - Your AI-powered productivity command center',
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function LandingPage() {
  return (
    <div className={`bg-[#050510] text-white ${inter.className} antialiased overflow-x-hidden selection:bg-[#6366F1] selection:text-white`}>
      <div className="relative flex h-auto min-h-screen w-full flex-col">
        <BackgroundEffects />
        
        <div className="layout-container flex h-full grow flex-col relative z-10">
          <LandingHeader />
          
          <div className="flex flex-1 justify-center py-10 lg:py-20 px-4 md:px-10">
            <div className="layout-content-container flex flex-col max-w-[1000px] flex-1 items-center gap-16">
              <HeroSection />
              <DashboardPreview />
              <div id="features">
                <FeaturesSection />
              </div>
              <div id="workflow">
                <WorkflowSection />
              </div>
              <div id="about">
                <AboutSection />
              </div>
            </div>
          </div>
          
          <LandingFooter />
        </div>
      </div>
    </div>
  );
}