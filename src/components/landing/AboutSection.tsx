export const AboutSection = () => {
  return (
    <div className="@container w-full py-20" id="about">
      <div className="flex flex-col items-center justify-center gap-12 text-center">
        <h2 className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
            style={{
              textShadow: '0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(99, 102, 241, 0.4)'
            }}>
          About Polaris
        </h2>
        <p className="text-indigo-200/70 text-lg font-light tracking-wide font-mono max-w-2xl">
          Built for developers, by developers. Engineered for deep focus and maximum productivity.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 w-full max-w-5xl items-center">
          {/* Left Content */}
          <div className="text-left space-y-6">
            <h3 className="text-white text-2xl font-bold">Our Mission</h3>
            <p className="text-gray-300 leading-relaxed">
              In a world full of distractions, Polaris serves as your North Star—guiding you toward 
              sustained focus and meaningful productivity. We believe that the best work happens when 
              you can enter a state of deep flow.
            </p>
            
            <h3 className="text-white text-2xl font-bold pt-4">Why Polaris?</h3>
            <ul className="space-y-3">
              <li className="text-gray-300 flex items-start gap-3">
                <span className="text-[#06B6D4] mt-1">→</span>
                <span>Designed specifically for knowledge workers and developers</span>
              </li>
              <li className="text-gray-300 flex items-start gap-3">
                <span className="text-[#06B6D4] mt-1">→</span>
                <span>Minimalist interface that eliminates cognitive overhead</span>
              </li>
              <li className="text-gray-300 flex items-start gap-3">
                <span className="text-[#06B6D4] mt-1">→</span>
                <span>Built with modern web technologies for speed and reliability</span>
              </li>
              <li className="text-gray-300 flex items-start gap-3">
                <span className="text-[#06B6D4] mt-1">→</span>
                <span>Privacy-first approach—your data stays yours</span>
              </li>
            </ul>
          </div>
          
          {/* Right Content - Stats */}
          <div className="bg-[rgba(26,25,48,0.3)] backdrop-blur-[8px] border border-[rgba(255,255,255,0.1)] p-8 rounded-3xl">
            <h3 className="text-white text-xl font-bold mb-6">By the Numbers</h3>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-3xl font-black text-[#06B6D4] mb-1">2,000+</div>
                <div className="text-gray-400 text-sm font-mono">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-[#6366F1] mb-1">50M+</div>
                <div className="text-gray-400 text-sm font-mono">Focus Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-black text-white mb-1">99.9%</div>
                <div className="text-gray-400 text-sm font-mono">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};