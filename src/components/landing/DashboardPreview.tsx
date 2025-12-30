import Image from 'next/image';

export const DashboardPreview = () => {
  return (
    <div className="@container w-full py-20">
      <div className="flex flex-col items-center justify-center gap-8 text-center">
        <h2 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
            style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(99, 102, 241, 0.4)'
            }}>
          Your new command center.
        </h2>
        <p className="text-indigo-200/70 text-lg font-light tracking-wide font-mono max-w-2xl">
          No distractions. Just focus. A truly immersive productivity experience.
        </p>
        
        {/* Holographic Dashboard Preview */}
        <div className="w-full max-w-4xl px-4 md:px-0 mt-8"
             style={{
               transformStyle: 'preserve-3d',
               perspective: '1000px'
             }}>
          <div className="relative w-full rounded-2xl overflow-hidden aspect-[16/9] border border-[rgba(255,255,255,0.1)]"
               style={{
                 transform: 'rotateX(15deg) rotateY(-5deg) translateZ(50px)',
                 boxShadow: `
                   0 0 60px rgba(6, 182, 212, 0.5),
                   0 0 100px rgba(99, 102, 241, 0.3),
                   inset 0 0 20px rgba(6, 182, 212, 0.2)
                 `,
                 backgroundImage: 'radial-gradient(ellipse at center, rgba(6, 182, 212, 0.1) 0%, transparent 70%)'
               }}>
            <Image
              alt="Polaris Dashboard Screenshot"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAEVbpFogLLvAppLqcsD5BbCZsOhrCT0QKPq7yVMx_eBqYJnXk06lE2sD_-eK-yhb8BH2p2PUzFq7gOwXVexETEran8iBO0nQuAtfO0ENR3Z3FX0ZDqLEb9GsR3OqaiBKkZaPga27H-FoIac0pNAgaFdezdrfngKeewXZYFvD2xa0Ng_8ajG7Fw6ikDIhOeUq4JFlfGEf9MoGFOl-diuACypZbbAASW8P3i0oKtD6IsymW1J55emN7ZNUWoTRbT8AgPDJgdUtQRtBJ"
              width={1200}
              height={675}
            />
            
            {/* Holographic Effects */}
            <div className="absolute inset-0 pointer-events-none"
                 style={{
                   background: `
                     radial-gradient(circle at 25% 25%, rgba(6, 182, 212, 0.1) 0%, transparent 50%),
                     radial-gradient(circle at 75% 75%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)
                   `
                 }} />
          </div>
        </div>
      </div>
    </div>
  );
};