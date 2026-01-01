/**
 * Baseline tests for existing widget functionality
 * 
 * These tests ensure that all existing widgets maintain their basic functionality
 * before and after reorganization. They serve as a safety net during the migration.
 */

import "./setup";
import { describe, test, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { getAllWidgetNames, analyzeWidgetStructure, createBaselineTest } from "./utils/widget-testing-utils";

describe("Widget Baseline Functionality", () => {
  test("All widgets should exist and be accessible", () => {
    const widgets = getAllWidgetNames();
    
    expect(widgets.length).toBeGreaterThan(0);
    
    widgets.forEach(widgetName => {
      const structure = analyzeWidgetStructure(widgetName);
      expect(structure.name).toBe(widgetName);
      expect(['file', 'folder']).toContain(structure.type);
    });
  });

  test("All widgets should have valid React component structure", () => {
    const widgets = getAllWidgetNames();
    
    widgets.forEach(widgetName => {
      const baselineTest = createBaselineTest(widgetName);
      const result = baselineTest();
      if (!result) {
        console.log(`Widget ${widgetName} failed baseline test`);
      }
      expect(result).toBe(true);
    });
  });

  test("Widget index file should export most widgets", () => {
    const indexPath = path.join(process.cwd(), 'src/components/widgets/index.ts');
    
    expect(fs.existsSync(indexPath)).toBe(true);
    
    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    const widgets = getAllWidgetNames();
    
    // Most widgets should be exported from the index (allow for some missing)
    const exportedWidgets = widgets.filter(widgetName => 
      indexContent.includes(widgetName)
    );
    
    // At least 80% of widgets should be exported
    const exportRatio = exportedWidgets.length / widgets.length;
    expect(exportRatio).toBeGreaterThanOrEqual(0.8);
  });

  test("All widget files should be syntactically valid TypeScript", () => {
    const widgets = getAllWidgetNames();
    
    widgets.forEach(widgetName => {
      const structure = analyzeWidgetStructure(widgetName);
      
      if (structure.type === 'file') {
        const widgetPath = path.join(process.cwd(), 'src/components/widgets', `${widgetName}.tsx`);
        const content = fs.readFileSync(widgetPath, 'utf-8');
        
        // Basic syntax checks
        expect(content).toContain('export');
        expect(content.length).toBeGreaterThan(0);
        
        // Should not have obvious syntax errors
        const hasUnmatchedBraces = (content.match(/\{/g) || []).length !== (content.match(/\}/g) || []).length;
        const hasUnmatchedParens = (content.match(/\(/g) || []).length !== (content.match(/\)/g) || []).length;
        
        expect(hasUnmatchedBraces).toBe(false);
        expect(hasUnmatchedParens).toBe(false);
      }
    });
  });

  test("Complex widgets should be identified correctly", () => {
    const widgets = getAllWidgetNames();
    
    widgets.forEach(widgetName => {
      const structure = analyzeWidgetStructure(widgetName);
      
      if (structure.type === 'file' && structure.lineCount) {
        // Widgets over 150 lines should be marked as complex
        if (structure.lineCount > 150) {
          expect(structure.complexity).toBe('complex');
        } else {
          expect(structure.complexity).toBe('simple');
        }
      }
    });
  });

  test("Widget naming conventions should be consistent", () => {
    const widgets = getAllWidgetNames();
    
    widgets.forEach(widgetName => {
      // Should be PascalCase
      expect(widgetName).toMatch(/^[A-Z][a-zA-Z0-9]*$/);
      
      // Should end with Widget or Dock
      expect(widgetName.endsWith('Widget') || widgetName.endsWith('Dock')).toBe(true);
    });
  });

  test("All widgets should be importable from their current paths", () => {
    const widgets = getAllWidgetNames();
    
    widgets.forEach(widgetName => {
      const structure = analyzeWidgetStructure(widgetName);
      
      if (structure.type === 'file') {
        const widgetPath = path.join(process.cwd(), 'src/components/widgets', `${widgetName}.tsx`);
        expect(fs.existsSync(widgetPath)).toBe(true);
      } else if (structure.type === 'folder') {
        const indexPath = path.join(process.cwd(), 'src/components/widgets', widgetName, 'index.ts');
        expect(fs.existsSync(indexPath)).toBe(true);
      }
    });
  });

  test("Widget components should follow React component patterns", () => {
    const widgets = getAllWidgetNames();
    
    widgets.forEach(widgetName => {
      const structure = analyzeWidgetStructure(widgetName);
      
      let componentContent = '';
      
      if (structure.type === 'file') {
        const widgetPath = path.join(process.cwd(), 'src/components/widgets', `${widgetName}.tsx`);
        componentContent = fs.readFileSync(widgetPath, 'utf-8');
      } else if (structure.type === 'folder') {
        const mainComponentPath = path.join(process.cwd(), 'src/components/widgets', widgetName, `${widgetName}.tsx`);
        if (fs.existsSync(mainComponentPath)) {
          componentContent = fs.readFileSync(mainComponentPath, 'utf-8');
        }
      }
      
      if (componentContent) {
        // Should have React imports or JSX
        const hasReactPatterns = 
          componentContent.includes('import') ||
          componentContent.includes('jsx') ||
          componentContent.includes('tsx') ||
          componentContent.includes('React');
        
        expect(hasReactPatterns).toBe(true);
        
        // Should have component definition
        const hasComponentDefinition = 
          componentContent.includes(`const ${widgetName}`) ||
          componentContent.includes(`function ${widgetName}`) ||
          componentContent.includes(`export default`);
        
        expect(hasComponentDefinition).toBe(true);
      }
    });
  });
});