import { LayoutDashboard, Target, Monitor } from "lucide-react";

export const WorkflowSection = () => {
  const workflowSteps = [
    {
      icon: LayoutDashboard,
      title: "Plan",
      description: "Chart your course. Organize tasks and set objectives.",
      color: "var(--primary-glow)", 
      hoverBorder: "hover:border-primary-glow/50",
      justify: "md:justify-start",
      align: "md:items-start",
    },
    {
      icon: Target,
      title: "Focus",
      description: "Engage warp drive. Eliminate distractions and deep dive.",
      color: "var(--primary)",
      hoverBorder: "hover:border-primary/50",
      justify: "md:justify-center",
      align: "items-center",
    },
    {
      icon: Monitor,
      title: "Review",
      description:
        "Log your mission. Analyze progress and optimize trajectory.",
      color: "var(--primary)",
      hoverBorder: "hover:border-primary/50",
      justify: "md:justify-end",
      align: "md:items-end",
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
          Your Workflow, Supercharged
        </h2>
        <p className="text-muted/70 text-lg font-light tracking-wide font-mono max-w-2xl">
          Seamlessly integrate Polaris into your daily routine.
        </p>

        {/* Workflow Diagram */}
        <div className="relative w-full max-w-3xl py-12 px-4">
          {/* Connection Lines SVG */}
          <svg
            className="absolute inset-0 w-full h-full"
            fill="none"
            viewBox="0 0 800 500"
          >
            <path
              className="transition-colors duration-500 hover:stroke-primary-glow"
              d="M100,50 C200,50 200,150 300,150 L500,150 C600,150 600,250 700,250"
              stroke="var(--glass)"
              strokeDasharray="8 8"
              strokeWidth="2"
            />
            <path
              className="transition-colors duration-500 hover:stroke-primary"
              d="M700,250 C600,250 600,350 500,350 L300,350 C200,350 200,450 100,450"
              stroke="var(--glass)"
              strokeDasharray="8 8"
              strokeWidth="2"
            />
          </svg>

          {/* Workflow Steps */}
          <div className="relative z-10 flex flex-col gap-16 md:gap-24">
            {workflowSteps.map((step) => (
              <div
                key={step.title}
                className={`flex items-center ${step.justify}`}
              >
                <div
                  className={`bg-card/30 backdrop-blur-[8px] border border-glass p-6 rounded-xl flex flex-col ${step.align} gap-2 max-w-sm w-full relative group ${step.hoverBorder} transition-colors`}
                >
                  <step.icon
                    className="h-10 w-10 mb-2"
                    style={{ color: step.color }}
                  />
                  <h3 className="text-white text-2xl font-bold">
                    {step.title}
                  </h3>
                  <p className="text-muted/80 font-mono text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
