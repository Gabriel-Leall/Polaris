import { TimerIcon, ArchiveIcon, LoopIcon } from "@radix-ui/react-icons";

export const FeaturesSection = () => {
  const features = [
    {
      icon: TimerIcon,
      title: "Zen Mode",
      description: "Block out the noise. Deep work sessions built-in.",
      color: "#06B6D4", // neon-cyan
      hoverBorder: "group-hover:border-[#06B6D4]/50",
    },
    {
      icon: ArchiveIcon,
      title: "Brain Dump",
      description: "Capture thoughts instantly. Markdown supported.",
      color: "#6366F1", // neon-purple
      hoverBorder: "group-hover:border-[#6366F1]/50",
    },
    {
      icon: LoopIcon,
      title: "Habit Loops",
      description: "Track consistency. Visual streaks.",
      color: "#6366F1", // primary
      hoverBorder: "group-hover:border-[#6366F1]/50",
    },
  ];

  return (
    <div className="@container w-full py-20">
      <div className="flex flex-col items-center justify-center gap-12 text-center">
        <h2
          className="text-white text-4xl md:text-5xl font-black leading-tight tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70"
          style={{
            textShadow:
              "0 0 20px rgba(255, 255, 255, 0.5), 0 0 30px rgba(99, 102, 241, 0.4)",
          }}
        >
          Unleash Your Potential
        </h2>
        <p className="text-indigo-200/70 text-lg font-light tracking-wide font-mono max-w-2xl">
          Key features engineered to elevate your productivity to interstellar
          levels.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="bg-[rgba(26,25,48,0.3)] backdrop-blur-[8px] border border-[rgba(255,255,255,0.1)] p-8 rounded-xl flex flex-col items-center gap-4 text-center group relative overflow-hidden transition-all duration-300"
            >
              {/* Hover Background Gradient */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background:
                    index === 0
                      ? "linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)"
                      : index === 1
                      ? "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)"
                      : "linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)",
                }}
              />

              {/* Animated Border */}
              <div
                className={`absolute inset-0 border border-[rgba(255,255,255,0.1)] ${feature.hoverBorder} transition-colors duration-300 rounded-xl`}
              />

              {/* Icon */}
              <div className="relative size-16 rounded-full bg-[#1a1930]/70 flex items-center justify-center border border-[rgba(255,255,255,0.1)] group-hover:scale-110 transition-transform duration-300">
                <feature.icon
                  className="h-8 w-8 group-hover:text-white transition-colors"
                  style={{ color: feature.color }}
                />
              </div>

              <h3 className="text-white text-xl font-bold mt-4">
                {feature.title}
              </h3>
              <p className="text-indigo-300/80 font-mono text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
