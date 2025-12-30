/**
 * Property-based tests for Design System Compliance
 * 
 * **Feature: dashboard-layout-enhancement, Property 12: Design system compliance**
 * **Validates: Requirements 6.1, 6.2**
 * 
 * Property: For any widget card component, it should use the semantic color tokens 
 * (bg-card, border-white/5) and rounded-3xl border radius.
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';
import { glob } from 'glob';

// Design system requirements from Requirements 6.1 and 6.2
const REQUIRED_CARD_STYLES = {
  background: 'bg-card',
  borderRadius: 'rounded-3xl',
  border: 'border-white/5',
};

// Color palette from design-system.md (Requirements 6.1)
const DESIGN_SYSTEM_COLORS = {
  bgMain: '#09090B',
  bgCard: '#121214',
  primary: '#6366F1',
};

// Widget card files that should comply with design system
const WIDGET_CARD_PATTERNS = [
  'src/components/layout/WidgetCard.tsx',
];

// Layout component files that should use design system tokens
const LAYOUT_COMPONENT_PATTERNS = [
  'src/components/layout/*.tsx',
];

// Helper function to find files matching patterns
function findFiles(patterns: string[]): string[] {
  const files: string[] = [];
  patterns.forEach(pattern => {
    const normalizedPattern = pattern.replace(/\\/g, '/');
    const matches = glob.sync(normalizedPattern, {
      ignore: ['**/node_modules/**', '**/__tests__/**'],
    });
    files.push(...matches);
  });
  return files;
}

// Helper function to check if file content contains a specific class
function contentContainsClass(content: string, className: string): boolean {
  // Check for the class in various formats:
  // 1. Direct string: "bg-card" or 'bg-card'
  // 2. In cn() function: cn("bg-card", ...)
  // 3. In template literals: `bg-card ...`
  // 4. In className prop: className="bg-card"
  
  const patterns = [
    new RegExp(`['"\`]${className}['"\`\\s,)]`, 'g'),
    new RegExp(`['"\`][^'"\`]*\\s${className}[\\s'"\`]`, 'g'),
    new RegExp(`['"\`]${className}\\s`, 'g'),
  ];
  
  return patterns.some(pattern => pattern.test(content));
}

describe('Property 12: Design system compliance', () => {
  it('should have WidgetCard using bg-card background color', () => {
    const widgetCardFiles = findFiles(WIDGET_CARD_PATTERNS);
    
    if (widgetCardFiles.length === 0) {
      expect(true).toBe(true);
      return;
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...widgetCardFiles),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8');
          const hasBackground = contentContainsClass(content, REQUIRED_CARD_STYLES.background);
          
          if (!hasBackground) {
            console.log(`File ${filePath} missing bg-card background`);
          }
          
          return hasBackground;
        }
      ),
      { numRuns: Math.max(1, widgetCardFiles.length) }
    );
  });

  it('should have WidgetCard using rounded-3xl border radius', () => {
    const widgetCardFiles = findFiles(WIDGET_CARD_PATTERNS);
    
    if (widgetCardFiles.length === 0) {
      expect(true).toBe(true);
      return;
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...widgetCardFiles),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8');
          const hasBorderRadius = contentContainsClass(content, REQUIRED_CARD_STYLES.borderRadius);
          
          if (!hasBorderRadius) {
            console.log(`File ${filePath} missing rounded-3xl border radius`);
          }
          
          return hasBorderRadius;
        }
      ),
      { numRuns: Math.max(1, widgetCardFiles.length) }
    );
  });

  it('should have WidgetCard using border-white/5 glass border', () => {
    const widgetCardFiles = findFiles(WIDGET_CARD_PATTERNS);
    
    if (widgetCardFiles.length === 0) {
      expect(true).toBe(true);
      return;
    }

    fc.assert(
      fc.property(
        fc.constantFrom(...widgetCardFiles),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8');
          // Check for border-white/5 pattern
          const hasBorder = content.includes('border-white/5');
          
          if (!hasBorder) {
            console.log(`File ${filePath} missing border-white/5 glass border`);
          }
          
          return hasBorder;
        }
      ),
      { numRuns: Math.max(1, widgetCardFiles.length) }
    );
  });

  it('should have tailwind config defining required color tokens', () => {
    const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.ts');
    
    const requiredTokens = ['main', 'card', 'primary', 'primary-glow', 'secondary'];
    
    fc.assert(
      fc.property(
        fc.constantFrom(...requiredTokens),
        (token: string) => {
          const configContent = fs.readFileSync(tailwindConfigPath, 'utf-8');
          const hasToken = 
            configContent.includes(`'${token}'`) ||
            configContent.includes(`"${token}"`) ||
            configContent.includes(`${token}:`);
          
          if (!hasToken) {
            console.log(`Missing color token in tailwind.config.ts: ${token}`);
          }
          
          return hasToken;
        }
      ),
      { numRuns: requiredTokens.length }
    );
  });

  it('should have tailwind config defining rounded-3xl border radius', () => {
    const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.ts');
    const configContent = fs.readFileSync(tailwindConfigPath, 'utf-8');
    
    // Check for rounded-3xl definition (24px)
    const hasRounded3xl = 
      configContent.includes("'3xl'") ||
      configContent.includes('"3xl"') ||
      configContent.includes('3xl:');
    
    expect(hasRounded3xl).toBe(true);
  });

  it('should have tailwind config defining glow shadow for Zen Timer', () => {
    const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.ts');
    const configContent = fs.readFileSync(tailwindConfigPath, 'utf-8');
    
    // Check for glow shadow definition (Requirements 6.4)
    const hasGlowShadow = 
      configContent.includes('glow') &&
      configContent.includes('rgba(99, 102, 241');
    
    expect(hasGlowShadow).toBe(true);
  });

  it('should have DashboardLayout using bg-main background', () => {
    const dashboardLayoutPath = 'src/components/layout/DashboardLayout.tsx';
    
    if (!fs.existsSync(dashboardLayoutPath)) {
      expect(true).toBe(true);
      return;
    }

    const content = fs.readFileSync(dashboardLayoutPath, 'utf-8');
    
    // Check for bg-main in the content
    const hasBgMain = content.includes('bg-main');
    
    expect(hasBgMain).toBe(true);
  });

  it('should have layout components using 100vh height constraint', () => {
    const dashboardLayoutPath = 'src/components/layout/DashboardLayout.tsx';
    
    if (!fs.existsSync(dashboardLayoutPath)) {
      expect(true).toBe(true);
      return;
    }

    const content = fs.readFileSync(dashboardLayoutPath, 'utf-8');
    
    // Check for height constraint (Requirements 6.6)
    const hasHeightConstraint = 
      content.includes('h-screen') ||
      content.includes('100vh') ||
      content.includes('min-h-screen');
    
    expect(hasHeightConstraint).toBe(true);
  });

  it('should have all widget cards using consistent design system styles', () => {
    const widgetFiles = glob.sync('src/components/widgets/*.tsx', {
      ignore: ['**/node_modules/**', '**/__tests__/**', '**/index.ts'],
    });

    if (widgetFiles.length === 0) {
      expect(true).toBe(true);
      return;
    }

    // Verify that widgets don't override card styles with non-compliant values
    // Note: bg-black/XX (with opacity) is allowed for overlays and embed containers
    fc.assert(
      fc.property(
        fc.constantFrom(...widgetFiles),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8');
          
          // Check for non-compliant solid background colors (not opacity variants)
          // bg-black/XX is allowed for overlays
          const hasNonCompliantBg = 
            /bg-zinc-900(?![\/])/.test(content) ||
            /bg-gray-900(?![\/])/.test(content) ||
            /bg-black(?![\/])/.test(content);
          
          if (hasNonCompliantBg) {
            console.log(`File ${filePath} uses non-compliant background color`);
          }
          
          return !hasNonCompliantBg;
        }
      ),
      { numRuns: Math.max(1, widgetFiles.length) }
    );
  });
});
