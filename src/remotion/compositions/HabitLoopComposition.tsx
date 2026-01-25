import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { Check } from "lucide-react";

export const HabitLoopComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Float effect - up and down motion (7 second loop)
  const floatY = interpolate(
    frame % (7 * fps),
    [0, 3.5 * fps, 7 * fps],
    [0, -10, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  const habits = [
    {
      name: "Deep Work",
      color: "#6366F1",
      completed: [true, true, true, true, true, true, true], // 7 day streak
    },
    {
      name: "Meditation",
      color: "#06B6D4",
      completed: [true, true, false, true, true, true, true],
    },
    {
      name: "Exercise",
      color: "#A855F7",
      completed: [true, false, true, true, true, true, false],
    },
  ];

  // Staggered animation for each habit row
  const getHabitOpacity = (index: number) => {
    return interpolate(
      frame,
      [fps * (0.5 + index * 0.3), fps * (1.5 + index * 0.3)],
      [0, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );
  };

  // Improved check animation: simulating user clicking one by one
  const getCheckState = (habitIndex: number, dayIndex: number) => {
    // Start checking after the row appears
    const rowStartTime = fps * (1.5 + habitIndex * 0.3);
    // Each check takes a bit of time, staged sequentially
    const checkTime = rowStartTime + dayIndex * 5; // Fast sequence

    const scale = interpolate(frame, [checkTime, checkTime + 5], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

    // Slight bounce effect
    const bounce = interpolate(
      frame,
      [checkTime + 5, checkTime + 10, checkTime + 15],
      [1, 1.2, 1],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      },
    );

    return { scale: scale * bounce, isVisible: frame > checkTime };
  };

  // Progress bar / Streak line animation
  const getLineProgress = (habitIndex: number) => {
    const rowStartTime = fps * (1.5 + habitIndex * 0.3);
    // Line draws as checks happen
    return interpolate(frame, [rowStartTime, rowStartTime + 40], [0, 100], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  };

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            transform: `translateY(${floatY}px) scale(1.3)`,
            position: "relative",
          }}
        >
          {/* Glow Effect Removed */}

          <div
            style={{
              position: "relative",
              background: "#0A0A16",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              padding: "20px",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              width: "320px",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "24px",
              }}
            >
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: "monospace",
                  color: "rgba(255, 255, 255, 0.4)",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                }}
              >
                Visual Streaks
              </span>
              <div
                style={{
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  background:
                    "linear-gradient(90deg, rgba(239, 68, 68, 0.1), rgba(249, 115, 22, 0.1))",
                  border: "1px solid rgba(249, 115, 22, 0.2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                }}
              >
                <span style={{ fontSize: "10px" }}>🔥</span>
                <span
                  style={{
                    fontSize: "9px",
                    background: "linear-gradient(90deg, #F87171, #FB923C)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  7d streak
                </span>
              </div>
            </div>

            {/* Habits List */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              {habits.map((habit, habitIndex) => (
                <div
                  key={habitIndex}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    opacity: getHabitOpacity(habitIndex),
                    position: "relative",
                  }}
                >
                  {/* Habit Header */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingLeft: "4px",
                      paddingRight: "4px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "11px",
                        color: "rgba(255, 255, 255, 0.8)",
                        fontWeight: 500,
                      }}
                    >
                      {habit.name}
                    </span>
                    <span
                      style={{
                        fontSize: "9px",
                        fontFamily: "monospace",
                        color: "rgba(255, 255, 255, 0.3)",
                      }}
                    >
                      {habit.completed.filter(Boolean).length}/7
                    </span>
                  </div>

                  {/* Connecting Line currently behind boxes */}
                  <div
                    style={{
                      position: "absolute",
                      top: "38px", // Center of boxes approx
                      left: "16px",
                      right: "16px",
                      height: "2px",
                      background: `linear-gradient(90deg, ${habit.color}40, ${habit.color}10)`,
                      width: `${getLineProgress(habitIndex)}%`,
                      zIndex: 0,
                      borderRadius: "2px",
                      opacity: 0.5,
                    }}
                  />

                  {/* Day Boxes */}
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {habit.completed.map((done, dayIndex) => {
                      const { scale, isVisible } = getCheckState(
                        habitIndex,
                        dayIndex,
                      );

                      // Progressive color intensity logic could go here if needed
                      // For now, simpler consistent color

                      return (
                        <div
                          key={dayIndex}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            display: "flex", // Always layout, but scale content
                            alignItems: "center",
                            justifyContent: "center",
                            background:
                              isVisible && done
                                ? "rgba(10, 10, 22, 0.9)" // Darker background to hide line
                                : "rgba(255, 255, 255, 0.03)",
                            border:
                              isVisible && done
                                ? `1px solid ${habit.color}`
                                : "1px solid rgba(255, 255, 255, 0.05)",
                            boxShadow:
                              isVisible && done
                                ? `0 0 10px ${habit.color}40`
                                : "none",
                            color: habit.color,
                            transition:
                              "border-color 0.2s, background-color 0.2s",
                          }}
                        >
                          <div
                            style={{
                              transform: `scale(${scale})`,
                              opacity: isVisible ? 1 : 0,
                            }}
                          >
                            {done && <Check size={16} strokeWidth={3} />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
