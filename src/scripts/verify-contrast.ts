import fs from "fs";
import path from "path";

// Helper to parse HSL and calculate luminance
// Formula: https://www.w3.org/TR/WCAG20/#relativeluminancedef

function getLuminance(r: number, g: number, b: number) {
  const a = [r, g, b].map(function (v) {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

function hslToRgb(h: number, s: number, l: number) {
  s /= 100;
  l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
    m = l - c / 2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }
  return [
    Math.round((r + m) * 255),
    Math.round((g + m) * 255),
    Math.round((b + m) * 255),
  ];
}

function getContrastRatio(l1: number, l2: number) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Extract logical properties from globals.css
// Note: This is a simplified parser for the specific format in globals.css
const globalsCssPath = path.resolve(process.cwd(), "src/app/globals.css");
const cssContent = fs.readFileSync(globalsCssPath, "utf-8");

const lightModeBlock = cssContent.match(/:root\s*{([^}]*)}/)?.[1] || "";
const darkModeBlock = cssContent.match(/\.dark\s*{([^}]*)}/)?.[1] || "";

function parseVariables(block: string) {
  const vars: Record<string, number[]> = {};
  const lines = block.split("\n");
  for (const line of lines) {
    const match = line.match(/--([\w-]+):\s*([\d\s.%]+);/);
    if (match) {
      const [_, name, value] = match;
      // Parse HSL: "222 30% 95%" -> [222, 30, 95]
      const parts = value
        .trim()
        .split(" ")
        .map((v) => parseFloat(v));
      if (parts.length >= 3) {
        vars[name] = parts;
      }
    }
  }
  return vars;
}

const lightVars = parseVariables(lightModeBlock);
const darkVars = parseVariables(darkModeBlock);

function checkContrast(themeName: string, vars: Record<string, number[]>) {
  console.log(`\nChecking Contrast for ${themeName}:`);

  // Background vs Foreground (Text)
  if (vars["background"] && vars["foreground"]) {
    const bgRgb = hslToRgb(
      vars["background"][0],
      vars["background"][1],
      vars["background"][2],
    );
    const fgRgb = hslToRgb(
      vars["foreground"][0],
      vars["foreground"][1],
      vars["foreground"][2],
    );
    const bgLum = getLuminance(bgRgb[0], bgRgb[1], bgRgb[2]);
    const fgLum = getLuminance(fgRgb[0], fgRgb[1], fgRgb[2]);

    const ratio = getContrastRatio(bgLum, fgLum).toFixed(2);
    const status = parseFloat(ratio) >= 4.5 ? "PASS" : "FAIL";
    console.log(`[${status}] Background vs Foreground: ${ratio}:1`);
  }

  // Card vs Card Foreground
  if (vars["card"] && vars["card-foreground"]) {
    const bgRgb = hslToRgb(vars["card"][0], vars["card"][1], vars["card"][2]);
    const fgRgb = hslToRgb(
      vars["card-foreground"][0],
      vars["card-foreground"][1],
      vars["card-foreground"][2],
    );
    const bgLum = getLuminance(bgRgb[0], bgRgb[1], bgRgb[2]);
    const fgLum = getLuminance(fgRgb[0], fgRgb[1], fgRgb[2]);

    const ratio = getContrastRatio(bgLum, fgLum).toFixed(2);
    const status = parseFloat(ratio) >= 4.5 ? "PASS" : "FAIL";
    console.log(`[${status}] Card vs Card Foreground: ${ratio}:1`);
  }

  // Primary vs Primary Foreground
  if (vars["primary"] && vars["primary-foreground"]) {
    const bgRgb = hslToRgb(
      vars["primary"][0],
      vars["primary"][1],
      vars["primary"][2],
    );
    const fgRgb = hslToRgb(
      vars["primary-foreground"][0],
      vars["primary-foreground"][1],
      vars["primary-foreground"][2],
    );
    const bgLum = getLuminance(bgRgb[0], bgRgb[1], bgRgb[2]);
    const fgLum = getLuminance(fgRgb[0], fgRgb[1], fgRgb[2]);

    const ratio = getContrastRatio(bgLum, fgLum).toFixed(2);
    const status = parseFloat(ratio) >= 4.5 ? "PASS" : "FAIL";
    console.log(`[${status}] Primary vs Primary Foreground: ${ratio}:1`);
  }
}

checkContrast("Light Mode", lightVars);
checkContrast("Dark Mode", darkVars);
