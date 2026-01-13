import { Metadata } from 'next';
import Link from 'next/link';
import { Logo } from '@/components/ui/logo';

export const metadata: Metadata = {
  title: 'Privacy Policy - Polaris',
  description: 'How we handle your data at Polaris.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#050510] text-foreground font-sans selection:bg-primary selection:text-white">
      <header className="container mx-auto px-6 py-8 flex justify-between items-center border-b border-white/5">
        <Link href="/" className="flex items-center gap-2">
          <Logo size={24} />
          <span className="font-bold tracking-tight text-white">POLARIS</span>
        </Link>
      </header>

      <main className="container mx-auto px-6 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold mb-8 text-white tracking-tight">Privacy Policy</h1>
        
        <div className="prose prose-invert max-w-none space-y-8 text-white/70 leading-relaxed">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">1. Introduction</h2>
            <p>
              Polaris (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the Polaris productivity platform. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">2. Data We Collect</h2>
            <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you (&quot;Personal Data&quot;).</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Account Information:</strong> When you sign up, we collect your email address and full name.</li>
              <li><strong>Integration Credentials:</strong> To enable Notion synchronization, we store the OAuth access tokens provided by Notion after your authorization. These tokens are stored securely and encrypted.</li>
              <li><strong>Content:</strong> We store the notes you create in the &quot;Brain Dump&quot; widget to sync them across your devices and with Notion.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">3. Use of Data</h2>
            <p>Polaris uses the collected data for various purposes:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>To provide and maintain our Service.</li>
              <li>To allow you to synchronize your content with third-party integrations like Notion.</li>
              <li>To provide customer support.</li>
              <li>To monitor the usage of our Service.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">4. Data Security</h2>
            <p>
              The security of your data is important to us. We use Supabase as our backend provider, which implements industry-standard security measures. Your Notion tokens and Personal Data are protected by Row Level Security (RLS) policies, ensuring that only you can access your own data.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">5. Notion Integration</h2>
            <p>
              When you connect your Notion account, Polaris gains access to specific workspaces or pages you select. We only use this permission to create new pages and synchronize your Brain Dump notes. We do not read your other Notion data unless it is necessary for the specific synchronization functionality.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-white">6. Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
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
