import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
} from "remotion";
import { Sparkles } from "lucide-react";

export const BrainDumpComposition: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Float effect - up and down motion (5 second loop)
  const floatY = interpolate(
    frame % (5 * fps),
    [0, 2.5 * fps, 5 * fps],
    [0, 15, 0],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  // Sequence of events
  // 0-1s: List items appear
  // 1s-4s: Code typing

  const codeStart = 1.2 * fps;

  // List opacity
  const listOpacity = interpolate(frame, [0, 0.5 * fps], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Cursor blink logic
  const cursorOpacity = interpolate(
    frame % (fps * 0.8),
    [0, fps * 0.4, fps * 0.8],
    [1, 0, 1],
  );

  // Lets do line-by-line reveal for simplicity and robustness
  // Line 1: const flow = {
  // Line 2:   state: 'deep-work',
  // Line 3:   duration: 1500
  // Line 4: };

  const line1End = codeStart + 0.5 * fps;
  const line2End = codeStart + 1.2 * fps;
  const line3End = codeStart + 2.0 * fps;

  const showLine1 = frame > codeStart;
  const showLine2 = frame > line1End;
  const showLine3 = frame > line2End;
  const showLine4 = frame > line3End;

  // Cursor position simulation
  // We'll place the cursor at the end of the active line
  let cursorTop = 270; // Default off
  let cursorLeft = 20;

  if (frame < codeStart) {
    cursorTop = 24; // Near "Deploy UI" roughly (top of code block is relative)
    // Actually we are inside relative code block container.
    // previous hardcoded values: "24px", "36px", "52px", "68px"
    cursorTop = 24;
    cursorLeft = 90;
  } else if (frame < line1End) {
    cursorTop = 24; // Line 1
    cursorLeft = 90 + (frame - codeStart) * 2; // Move right
  } else if (frame < line2End) {
    cursorTop = 36; // Line 2
    cursorLeft = 120 + (frame - line1End) * 3;
  } else if (frame < line3End) {
    cursorTop = 52; // Line 3
    cursorLeft = 100 + (frame - line2End) * 3;
  } else {
    cursorTop = 68; // Line 4
    cursorLeft = 25;
  }

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
            transform: `translateY(${floatY}px) scale(1.1)`,
            position: "relative",
          }}
        >
          {/* Glow Effect Removed */}

          <div
            style={{
              position: "relative",
              background: "rgba(10, 10, 22, 0.8)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              overflow: "hidden",
              width: "400px",
              backdropFilter: "blur(12px)",
            }}
          >
            {/* Header */}
            <div
              style={{
                height: "40px",
                borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                justifyContent: "space-between",
                background: "rgba(255, 255, 255, 0.02)",
              }}
            >
              <div style={{ display: "flex", gap: "6px" }}>
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "9999px",
                    background: "rgba(255, 255, 255, 0.1)",
                  }}
                />
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "9999px",
                    background: "rgba(255, 255, 255, 0.1)",
                  }}
                />
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "9999px",
                    background: "rgba(255, 255, 255, 0.1)",
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: "10px",
                  fontFamily: "monospace",
                  color: "rgba(255, 255, 255, 0.3)",
                }}
              >
                project-orbit.md
              </span>
            </div>

            {/* Editor Content */}
            <div
              style={{
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                fontFamily: "monospace",
              }}
            >
              {/* Title */}
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <span style={{ color: "rgb(129, 140, 248)" }}>#</span>
                <span
                  style={{
                    color: "white",
                    fontSize: "14px",
                    fontWeight: 700,
                  }}
                >
                  Interstellar Workflow
                </span>
              </div>

              {/* List Items */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "8px",
                  opacity: listOpacity,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "rgba(129, 140, 248, 0.5)" }}>-</span>
                  <span
                    style={{
                      color: "rgba(255, 255, 255, 0.7)",
                      fontSize: "12px",
                    }}
                  >
                    Define focus nodes
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "8px",
                  }}
                >
                  <span style={{ color: "rgba(129, 140, 248, 0.5)" }}>-</span>
                  <span
                    style={{
                      color: "rgb(129, 140, 248)",
                      fontSize: "12px",
                      fontWeight: 700,
                      textDecoration: "underline",
                      textDecorationColor: "rgba(129, 140, 248, 0.3)",
                      textUnderlineOffset: "4px",
                      fontStyle: "italic",
                    }}
                  >
                    Deploy UI components
                  </span>
                </div>
              </div>

              {/* Code Block */}
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  borderRadius: "8px",
                  padding: "12px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  minHeight: "80px",
                  position: "relative",
                }}
              >
                {/* Language Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "8px",
                    opacity: showLine1 ? 1 : 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: "9px",
                      color: "rgba(165, 180, 252, 0.5)",
                    }}
                  >
                    typescript
                  </span>
                  <Sparkles size={8} color="rgb(129, 140, 248)" />
                </div>

                {/* Code Content */}
                <div
                  style={{
                    fontSize: "10px",
                    lineHeight: 1.6,
                    whiteSpace: "pre",
                  }}
                >
                  {showLine1 && (
                    <div>
                      <span style={{ color: "rgb(192, 132, 252)" }}>const</span>{" "}
                      <span style={{ color: "rgb(96, 165, 250)" }}>flow</span>{" "}
                      <span style={{ color: "white" }}>=</span> {"{"}
                    </div>
                  )}
                  {showLine2 && (
                    <div>
                      &nbsp;&nbsp;
                      <span style={{ color: "rgb(165, 180, 252)" }}>state</span>
                      :{" "}
                      <span style={{ color: "rgb(251, 146, 60)" }}>
                        &apos;deep-work&apos;
                      </span>
                      ,
                    </div>
                  )}
                  {showLine3 && (
                    <div>
                      &nbsp;&nbsp;
                      <span style={{ color: "rgb(165, 180, 252)" }}>
                        duration
                      </span>
                      : <span style={{ color: "rgb(74, 222, 128)" }}>1500</span>
                    </div>
                  )}
                  {showLine4 && <div>{"}"};</div>}
                </div>

                {/* Absolute Cursor for Code Block */}
                <div
                  style={{
                    position: "absolute",
                    top: cursorTop,
                    left: cursorLeft,
                    width: "2px",
                    height: "12px",
                    background: "rgb(99, 102, 241)",
                    opacity: cursorOpacity,
                    transition: "top 0.1s, left 0.1s",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
