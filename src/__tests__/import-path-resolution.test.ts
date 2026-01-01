/**
 * Import path resolution testing utilities
 * 
 * Tests that validate import paths work correctly before and after widget reorganization.
 * These tests ensure backward compatibility during the migration process.
 */

import "./setup";
import { describe, test, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { 
  getAllWidgetNames, 
  validateImportPath, 
  generateImportPathTests 
} from "./utils/widget-testing-utils";

describe("Import Path Resolution", () => {
  test("All current widget import paths should be resolvable", () => {
    const widgets = getAllWidgetNames();
    
    widgets.forEach(widgetName => {
      // Skip JobTracker related widgets
      if (widgetName.includes('JobTracker')) {
        return;
      }
      
      const importPath = `components/widgets/${widgetName}`;
      const isResolvable = validateImportPath(widgetName, importPath);
      
      expect(isResolvable).toBe(true);
    });
  });

  test("Widget imports should work from @/components/widgets path alias", () => {
    const widgets = getAllWidgetNames();
    
    widgets.forEach(widgetName => {
      // Skip JobTracker related widgets
      if (widgetName.includes('JobTracker')) {
        return;
      }
      
      // Check if widget file exists (for current single-file structure)
      const widgetFilePath = path.join(process.cwd(), 'src/components/widgets', `${widgetName}.tsx`);
      const widgetFolderPath = path.join(process.cwd(), 'src/components/widgets', widgetName);
      
      const fileExists = fs.existsSync(widgetFilePath);
      const folderExists = fs.existsSync(widgetFolderPath) && fs.statSync(widgetFolderPath).isDirectory();
      
      expect(fileExists || folderExists).toBe(true);
    });
  });

  test("Import path tests should generate valid test cases", () => {
    const importTests = generateImportPathTests();
    
    expect(importTests.length).toBeGreaterThan(0);
    
    importTests.forEach(test => {
      // Skip JobTracker related widgets
      if (test.widgetName.includes('JobTracker')) {
        return;
      }
      
      expect(test.widgetName).toBeTruthy();
      expect(test.oldPath).toBeTruthy();
      expect(test.newPath).toBeTruthy();
      expect(typeof test.isResolvable).toBe('boolean');
    });
  });

  test("Widget index exports should be accessible", () => {
    const indexPath = path.join(process.cwd(), 'src/components/widgets/index.ts');
    
    expect(fs.existsSync(indexPath)).toBe(true);
    
    const indexContent = fs.readFileSync(indexPath, 'utf-8');
    
    // Should have export statements
    expect(indexContent).toContain('export');
    
    // Should export main widgets (excluding JobTracker)
    const mainWidgets = ['BrainDumpWidget', 'QuickLinksWidget', 'TasksWidget', 'ZenTimerWidget'];
    
    mainWidgets.forEach(widgetName => {
      expect(indexContent).toContain(widgetName);
    });
  });

  test("TypeScript path aliases should resolve correctly", () => {
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
    
    expect(fs.existsSync(tsconfigPath)).toBe(true);
    
    const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf-8');
    const tsconfig = JSON.parse(tsconfigContent);
    
    // Should have path aliases configured
    expect(tsconfig.compilerOptions?.paths).toBeDefined();
    expect(tsconfig.compilerOptions?.paths['@/*']).toBeDefined();
  });

  test("Vitest config should support path aliases", () => {
    const vitestConfigPath = path.join(process.cwd(), 'vitest.config.ts');
    
    expect(fs.existsSync(vitestConfigPath)).toBe(true);
    
    const vitestContent = fs.readFileSync(vitestConfigPath, 'utf-8');
    
    // Should have alias configuration
    expect(vitestContent).toContain('alias');
    expect(vitestContent).toContain('@');
  });
});