import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  interpolateColors,
} from "remotion";
import { RotateCcw } from "lucide-react";

export const ZenTimerComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Float effect - up and down motion (6 second loop)
  const floatY = interpolate(
    frame % (6 * fps),
    [0, 3 * fps, 6 * fps],
    [0, -15, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Slide-down animation for timer (appears at 0.5s)
  const timerSlideY = interpolate(frame, [0.5 * fps, 2 * fps], [-50, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const timerOpacity = interpolate(frame, [0.5 * fps, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade in for protocol label (appears at 1.2s)
  const protocolOpacity = interpolate(frame, [1.2 * fps, 2 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const protocolScale = interpolate(frame, [1.2 * fps, 2 * fps], [0.9, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Pulse animation for glow and status
  const pulseOpacity = interpolate(
    frame % (2 * fps),
    [0, fps, 2 * fps],
    [0.3, 0.8, 0.3],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Count down logic: Start at 25:00 and go down
  // Real-time speed might be too boring, let's speed it up slightly for visual effect or keep it real
  // Let's do real seconds but start a bit into it to show change
  const startSeconds = 25 * 60; // 25:00
  // Let's make it count down faster visually for effect (1 real sec = 5 timer secs)
  // or just standard. User asked for "contador vai baixando".
  // Let's simulate a time warp where it counts down.
  const currentTotalSeconds = Math.max(
    0,
    startSeconds - Math.floor(frame / (fps / 2)),
  ); // 2x speed

  const minutes = Math.floor(currentTotalSeconds / 60);
  const seconds = currentTotalSeconds % 60;
  const timeDisplay = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  // Theme shift effect (Purple -> Blueish -> Purple)
  const accentColor = interpolateColors(
    frame,
    [0, 3 * fps, 6 * fps],
    ["#A855F7", "#6366F1", "#A855F7"],
  );

  const shadowColor = interpolateColors(
    frame,
    [0, 3 * fps, 6 * fps],
    [
      "rgba(168, 85, 247, 0.2)",
      "rgba(99, 102, 241, 0.2)",
      "rgba(168, 85, 247, 0.2)",
    ],
  );

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
              padding: "24px",
              paddingBottom: "32px",
              borderRadius: "24px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              width: "260px",
              backdropFilter: "blur(40px)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "40px",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "9999px",
                    background: accentColor,
                    boxShadow: "0 0 10px rgba(168, 85, 247, 0.8)",
                    opacity: pulseOpacity,
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    fontFamily: "monospace",
                    color: "rgba(233, 213, 255, 0.5)",
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                  }}
                >
                  Zen System
                </span>
              </div>
              <RotateCcw size={14} color="rgba(255, 255, 255, 0.2)" />
            </div>

            {/* Timer Display */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "32px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    height: "48px",
                    overflow: "hidden",
                    position: "relative",
                    minWidth: "140px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      transform: `translateY(${timerSlideY}px)`,
                      opacity: timerOpacity,
                      fontSize: "48px",
                      fontFamily: "monospace",
                      fontWeight: 900,
                      color: "white",
                      letterSpacing: "-0.05em",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  >
                    {timeDisplay}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "12px",
                    opacity: protocolOpacity,
                    transform: `scale(${protocolScale})`,
                  }}
                >
                  <span
                    style={{
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: "0.4em",
                      color: accentColor,
                      fontWeight: 900,
                      transition: "color 0.2s",
                    }}
                  >
                    Deep Focus
                  </span>
                  <div
                    style={{
                      width: "32px",
                      height: "1px",
                      background: shadowColor,
                    }}
                  />
                </div>
              </div>

              {/* Status Button */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                  width: "100%",
                  justifyContent: "center",
                  background: "rgba(255, 255, 255, 0.02)",
                  padding: "16px",
                  borderRadius: "16px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                }}
              >
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "9999px",
                    background: accentColor,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 0 20px rgba(168, 85, 247, 0.4)",
                  }}
                >
                  <div
                    style={{
                      width: "12px",
                      height: "12px",
                      background: "white",
                      borderRadius: "2px",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: "2px",
                  }}
                >
                  <span
                    style={{
                      fontSize: "9px",
                      textTransform: "uppercase",
                      letterSpacing: "0.2em",
                      fontWeight: 700,
                      color: accentColor,
                      opacity: pulseOpacity,
                    }}
                  >
                    Protocol Active
                  </span>
                  <span
                    style={{
                      fontSize: "10px",
                      color: "rgba(255, 255, 255, 0.4)",
                      fontFamily: "monospace",
                    }}
                  >
                    Session 01/04
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
