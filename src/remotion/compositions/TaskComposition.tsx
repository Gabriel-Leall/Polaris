import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";

export const TaskComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Float animation
  const floatY = interpolate(
    frame % (4 * fps),
    [0, 2 * fps, 4 * fps],
    [0, -10, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Card entrance animation
  const cardScale = interpolate(frame, [0, 30], [0.8, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const cardOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Checkbox pulse animation
  const checkPulse = interpolate(
    frame % (3 * fps),
    [0, fps, 2 * fps, 3 * fps],
    [0.5, 1, 0.7, 0.5],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Progress bar animation
  const progressWidth = interpolate(frame, [30, 120], [0, 65], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: "transparent" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          perspective: "1000px",
        }}
      >
        <div
          style={{
            transform: `translateY(${floatY}px) scale(${cardScale}) rotateX(55deg) rotateZ(-35deg)`,
            opacity: cardOpacity,
          }}
        >
          {/* Glassmorphism Card */}
          <div
            style={{
              width: "240px",
              height: "240px",
              background: "rgba(255, 255, 255, 0.08)",
              borderRadius: "24px",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(20px)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {/* Header with checkbox */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "6px",
                  border: "2px solid rgba(255, 255, 255, 0.3)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: `rgba(168, 85, 247, ${checkPulse * 0.4})`,
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    background: "#A855F7",
                    borderRadius: "2px",
                    opacity: checkPulse,
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "white",
                  fontFamily: "system-ui, sans-serif",
                }}
              >
                Complete project
              </span>
            </div>

            {/* Task details */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginTop: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span
                  style={{
                    fontSize: "10px",
                    color: "rgba(255, 255, 255, 0.5)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  Progress
                </span>
                <span
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "white",
                  }}
                >
                  65%
                </span>
              </div>
              <div
                style={{
                  width: "100%",
                  height: "6px",
                  background: "rgba(255, 255, 255, 0.1)",
                  borderRadius: "3px",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${progressWidth}%`,
                    height: "100%",
                    background:
                      "linear-gradient(90deg, #A855F7 0%, #6366F1 100%)",
                    borderRadius: "3px",
                    boxShadow: "0 0 10px rgba(168, 85, 247, 0.5)",
                  }}
                />
              </div>
            </div>

            {/* Priority tag */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  padding: "4px 8px",
                  background: "rgba(168, 85, 247, 0.2)",
                  borderRadius: "4px",
                  border: "1px solid rgba(168, 85, 247, 0.3)",
                }}
              >
                <span
                  style={{
                    fontSize: "9px",
                    color: "#A855F7",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  High Priority
                </span>
              </div>
              <div
                style={{
                  padding: "4px 8px",
                  background: "rgba(34, 197, 94, 0.2)",
                  borderRadius: "4px",
                  border: "1px solid rgba(34, 197, 94, 0.3)",
                }}
              >
                <span
                  style={{
                    fontSize: "9px",
                    color: "#22C55E",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Today
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};