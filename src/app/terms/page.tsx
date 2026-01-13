import { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';

export const metadata: Metadata = {
  title: 'Terms of Use - Polaris',
  description: 'Terms and conditions for using Polaris.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#050510] text-foreground font-sans selection:bg-primary selection:text-white">
      <header className="container mx-auto px-6 py-8 flex justify-between items-center border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={24} />
          <span className="font-bold tracking-tight text-white">POLARIS</span>
        </Link>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-white tracking-tight">Terms of Use</h1>
        
        <div className="prose prose-invert max-w-none space-y-8 text-white/70 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Polaris ("the Service"), you agree to be bound by these Terms of Use and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">2. Use License</h2>
            <p>
              Polaris grants you a personal, non-exclusive, non-transferable license to use the Service for personal or professional productivity purposes. You may not:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Modify or copy the materials from the Service.</li>
              <li>Attempt to decompile or reverse engineer any software contained in Polaris.</li>
              <li>Use the Service for any unlawful purpose.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">3. Third-Party Services</h2>
            <p>
              Polaris integrates with third-party services like Notion and Google Gemini. Your use of these integrations is also subject to their respective terms of service. We are not responsible for the availability or conduct of these third-party platforms.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">4. Disclaimer</h2>
            <p>
              The materials on Polaris are provided on an 'as is' basis. Polaris makes no warranties, expressed or implied, and hereby disclaims all other warranties including, without limitation, implied warranties of merchantability or fitness for a particular purpose.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">5. Limitations of Liability</h2>
            <p>
              In no event shall Polaris or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">6. Termination</h2>
            <p>
              We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
            </p>
          </section>

          <section className="pt-8 border-t border-white/10">
            <p className="text-sm italic">Last updated: January 13, 2026</p>
          </section>
        </div>

        <div className="mt-16">
          <Link href="/" className="text-primary hover:underline flex items-center gap-2">
            ← Back to Home
          </Link>
        </div>
      </main>
    </div>
  );
}
