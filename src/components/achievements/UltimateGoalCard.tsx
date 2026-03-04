"use client";

interface UltimateGoalCardProps {
  completed: number;
  total: number;
  percentage: number;
}

export function UltimateGoalCard({
  completed,
  total,
  percentage,
}: UltimateGoalCardProps) {
  return (
    <div className="mt-8 rounded-2xl bg-card border relative overflow-hidden group">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 max-w-3xl flex flex-col justify-center h-full">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-widest w-fit mb-4 border border-primary/20">
          Ultimate Goal
        </div>

        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4 tracking-tight">
          The Neural Mastermind
        </h2>

        {/* Description */}
        <p className="text-muted-foreground text-lg md:text-xl max-w-xl leading-relaxed mb-8">
          Unlock the ultimate badge of honor by completing all {total} core
          achievements. You are on the path to total cognitive dominance.
        </p>

        {/* Progress section */}
        <div className="space-y-4">
          {/* Progress label */}
          <div className="flex justify-between items-end text-sm font-medium text-muted-foreground">
            <span>
              {completed}/{total} Completed
            </span>
            <span className="text-primary">{percentage}%</span>
          </div>

          {/* Progress bar */}
          <div className="h-3 w-full bg-muted rounded-full overflow-hidden border border-border">
            <div
              className="h-full bg-primary shadow-glow transition-all duration-500"
              style={{ width: `${percentage}%` }}
            />
          </div>

          {/* Social proof */}
          <div className="flex gap-4 pt-2">
            <div className="flex -space-x-3">
              <div className="size-8 rounded-full border-2 border-background bg-teal-500" />
              <div className="size-8 rounded-full border-2 border-background bg-purple-500" />
              <div className="size-8 rounded-full border-2 border-background bg-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground flex items-center">
              Join others who have achieved Mastermind status this month.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
