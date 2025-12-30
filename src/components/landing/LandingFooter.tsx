export const LandingFooter = () => {
  return (
    <footer className="flex justify-center w-full py-8 border-t border-[rgba(255,255,255,0.1)] bg-[#050510]">
      <div className="flex flex-col gap-4 text-center">
        <p className="text-[#9392c9] text-xs font-normal leading-normal font-mono">
          Polaris v1.0. System ready.
        </p>
        <div className="flex gap-4 justify-center">
          <a className="text-gray-400 hover:text-white text-sm font-mono transition-colors" href="#">
            Twitter
          </a>
          <a className="text-gray-400 hover:text-white text-sm font-mono transition-colors" href="#">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};