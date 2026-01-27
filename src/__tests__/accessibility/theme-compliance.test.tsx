import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";
import { glob } from "glob";

const FORBIDDEN_CLASSES = [
  "text-white",
  "bg-white",
  "bg-black",
  "text-black",
  "border-white",
  "border-black",
];

// Files to exclude from the check (e.g., specific UI components that *must* be white/black)
const EXCLUSIONS = [
  "src/app/globals.css", // CSS definitions
  "src/components/ui", // Shadcn UI components might have specific needs, check later if needed
  "src/__tests__/accessibility/theme-compliance.test.tsx",
];

describe("Theme Compliance", () => {
  it("should not use hardcoded color classes in key components", () => {
    const files = glob.sync("src/**/*.{tsx,ts}", {
      ignore: ["**/node_modules/**", "**/.next/**", ...EXCLUSIONS],
      cwd: process.cwd(),
      absolute: true,
    });

    const violations: string[] = [];

    files.forEach((file) => {
      const content = fs.readFileSync(file, "utf-8");

      // basic check for className="..." containing forbidden classes
      // This is a simple regex check, it might have false positives if the text is in content,
      // but for this task it's a good guardrail.
      FORBIDDEN_CLASSES.forEach((cls) => {
        const regex = new RegExp(`className=.*["'\`]${cls}(?!-).*?["'\`]`, "g");
        if (
          content.match(regex) ||
          content.includes(`"${cls}"`) ||
          content.includes(`'${cls}'`) ||
          content.includes(`\`${cls}\``)
        ) {
          // Refined check: ensure it's actually used as a class
          // We'll just check if the string exists in the file for now to be strict
          if (content.includes(cls)) {
            violations.push(
              `${path.relative(process.cwd(), file)} uses forbidden class: ${cls}`,
            );
          }
        }
      });
    });

    if (violations.length > 0) {
      console.error("\nTheme Compliance Violations:\n" + violations.join("\n"));
    }

    expect(violations).toEqual([]);
  });
});
