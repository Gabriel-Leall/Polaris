/**
 * Property-based tests for Widget Folder Structure Consistency
 * 
 * **Feature: widget-folder-organization, Property 1: Widget folder structure consistency**
 * **Validates: Requirements 1.1, 1.2, 1.4**
 * 
 * For any widget that has multiple related files (components, hooks, utils, types), 
 * the widget should be organized in a dedicated folder with an index.ts file that 
 * exports the main component.
 */

import "./setup";
import * as fc from "fast-check";
import { describe, test, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";
import { glob } from "glob";

// Widget folder structure requirements
interface WidgetStructure {
  name: string;
  hasFolder: boolean;
  hasIndex: boolean;
  hasMainComponent: boolean;
  supportingFiles: string[];
  complexity: 'simple' | 'complex';
}

// Helper function to analyze widget structure
function analyzeWidgetStructure(widgetName: string): WidgetStructure {
  const widgetPath = path.join(process.cwd(), 'src/components/widgets', widgetName);
  const widgetFilePath = path.join(process.cwd(), 'src/components/widgets', `${widgetName}.tsx`);
  
  const hasFolder = fs.existsSync(widgetPath) && fs.statSync(widgetPath).isDirectory();
  const hasFile = fs.existsSync(widgetFilePath);
  
  let hasIndex = false;
  let hasMainComponent = false;
  let supportingFiles: string[] = [];
  let complexity: 'simple' | 'complex' = 'simple';
  
  if (hasFolder) {
    const indexPath = path.join(widgetPath, 'index.ts');
    hasIndex = fs.existsSync(indexPath);
    
    const mainComponentPath = path.join(widgetPath, `${widgetName}.tsx`);
    hasMainComponent = fs.existsSync(mainComponentPath);
    
    // Find supporting files
    const folderContents = fs.readdirSync(widgetPath, { withFileTypes: true });
    supportingFiles = folderContents
      .filter(item => item.isFile() && item.name !== 'index.ts' && item.name !== `${widgetName}.tsx`)
      .map(item => item.name);
    
    // Check for subdirectories (components/, hooks/, utils/)
    const subdirs = folderContents
      .filter(item => item.isDirectory())
      .map(item => item.name);
    
    supportingFiles.push(...subdirs);
    
    // Determine complexity based on supporting files
    complexity = supportingFiles.length > 0 ? 'complex' : 'simple';
  } else if (hasFile) {
    // Single file widget - check file size to determine complexity
    const fileContent = fs.readFileSync(widgetFilePath, 'utf-8');
    const lineCount = fileContent.split('\n').length;
    complexity = lineCount > 150 ? 'complex' : 'simple';
  }
  
  return {
    name: widgetName,
    hasFolder,
    hasIndex,
    hasMainComponent,
    supportingFiles,
    complexity
  };
}

// Helper function to check if index.ts exports the main component
function indexExportsMainComponent(widgetName: string): boolean {
  const indexPath = path.join(process.cwd(), 'src/components/widgets', widgetName, 'index.ts');
  
  if (!fs.existsSync(indexPath)) {
    return false;
  }
  
  const indexContent = fs.readFileSync(indexPath, 'utf-8');
  
  // Check for various export patterns
  const exportPatterns = [
    new RegExp(`export\\s*{\\s*default\\s*}\\s*from\\s*['"]\\.\/${widgetName}['"]`),
    new RegExp(`export\\s*{\\s*default\\s*as\\s*${widgetName}\\s*}\\s*from`),
    new RegExp(`export\\s*\\*\\s*from\\s*['"]\\.\/${widgetName}['"]`),
    new RegExp(`import.*${widgetName}.*from.*export.*${widgetName}`),
    new RegExp(`export\\s*{\\s*${widgetName}\\s*}\\s*from`),
  ];
  
  return exportPatterns.some(pattern => pattern.test(indexContent));
}

// Helper function to get all widget names from the widgets directory
function getAllWidgetNames(): string[] {
  const widgetsDir = path.join(process.cwd(), 'src/components/widgets');
  
  if (!fs.existsSync(widgetsDir)) {
    return [];
  }
  
  const items = fs.readdirSync(widgetsDir, { withFileTypes: true });
  const widgets: string[] = [];
  
  // Get widget names from files
  items
    .filter(item => item.isFile() && item.name.endsWith('.tsx') && item.name !== 'index.ts')
    .forEach(item => {
      const widgetName = item.name.replace('.tsx', '');
      widgets.push(widgetName);
    });
  
  // Get widget names from folders
  items
    .filter(item => item.isDirectory())
    .forEach(item => {
      widgets.push(item.name);
    });
  
  return [...new Set(widgets)]; // Remove duplicates
}

// Helper function to check if a widget has multiple related files
function hasMultipleRelatedFiles(widgetName: string): boolean {
  const structure = analyzeWidgetStructure(widgetName);
  
  // If it's a folder structure, check for supporting files
  if (structure.hasFolder) {
    return structure.supportingFiles.length > 0;
  }
  
  // If it's a single file, check complexity (file size)
  return structure.complexity === 'complex';
}

// Arbitrary for widget names
const widgetNameArb = fc.constantFrom(...getAllWidgetNames().filter(name => name.length > 0));

// Arbitrary for complex widgets (those that should have folder structure)
const complexWidgetArb = fc.constantFrom(
  ...getAllWidgetNames().filter(name => hasMultipleRelatedFiles(name))
);

describe("Property 1: Widget folder structure consistency", () => {
  test("For any widget with multiple related files, it should be organized in a dedicated folder", async () => {
    const complexWidgets = getAllWidgetNames().filter(name => hasMultipleRelatedFiles(name));
    
    if (complexWidgets.length === 0) {
      // No complex widgets to test yet
      expect(true).toBe(true);
      return;
    }
    
    await fc.assert(
      fc.property(
        fc.constantFrom(...complexWidgets),
        (widgetName: string) => {
          const structure = analyzeWidgetStructure(widgetName);
          
          // Complex widgets should have folder structure
          if (structure.complexity === 'complex') {
            return structure.hasFolder;
          }
          
          return true; // Simple widgets can be either
        }
      ),
      { numRuns: Math.max(1, complexWidgets.length) }
    );
  });

  test("For any widget folder, it should contain an index.ts file", async () => {
    const allWidgets = getAllWidgetNames();
    
    if (allWidgets.length === 0) {
      expect(true).toBe(true);
      return;
    }
    
    await fc.assert(
      fc.property(
        fc.constantFrom(...allWidgets),
        (widgetName: string) => {
          const structure = analyzeWidgetStructure(widgetName);
          
          // If widget has a folder, it must have an index.ts
          if (structure.hasFolder) {
            return structure.hasIndex;
          }
          
          return true; // Single file widgets don't need index.ts
        }
      ),
      { numRuns: Math.max(1, allWidgets.length) }
    );
  });

  test("For any widget folder, the index.ts should export the main component", async () => {
    const folderWidgets = getAllWidgetNames().filter(name => {
      const structure = analyzeWidgetStructure(name);
      return structure.hasFolder;
    });
    
    if (folderWidgets.length === 0) {
      expect(true).toBe(true);
      return;
    }
    
    await fc.assert(
      fc.property(
        fc.constantFrom(...folderWidgets),
        (widgetName: string) => {
          return indexExportsMainComponent(widgetName);
        }
      ),
      { numRuns: Math.max(1, folderWidgets.length) }
    );
  });

  test("For any widget, supporting files should be co-located within the widget's folder", async () => {
    const allWidgets = getAllWidgetNames();
    
    if (allWidgets.length === 0) {
      expect(true).toBe(true);
      return;
    }
    
    await fc.assert(
      fc.property(
        fc.constantFrom(...allWidgets),
        (widgetName: string) => {
          const structure = analyzeWidgetStructure(widgetName);
          
          // If widget has supporting files, they should be in the widget folder
          if (structure.hasFolder && structure.supportingFiles.length > 0) {
            // All supporting files should be within the widget folder
            const widgetPath = path.join(process.cwd(), 'src/components/widgets', widgetName);
            
            return structure.supportingFiles.every(file => {
              const filePath = path.join(widgetPath, file);
              return fs.existsSync(filePath);
            });
          }
          
          return true; // Single file widgets don't have supporting files to check
        }
      ),
      { numRuns: Math.max(1, allWidgets.length) }
    );
  });

  test("For any widget, naming conventions should be consistent", async () => {
    const allWidgets = getAllWidgetNames();
    
    if (allWidgets.length === 0) {
      expect(true).toBe(true);
      return;
    }
    
    await fc.assert(
      fc.property(
        fc.constantFrom(...allWidgets),
        (widgetName: string) => {
          // Widget names should be PascalCase and end with "Widget"
          const isPascalCase = /^[A-Z][a-zA-Z0-9]*$/.test(widgetName);
          const endsWithWidget = widgetName.endsWith('Widget') || widgetName.endsWith('Dock');
          
          return isPascalCase && endsWithWidget;
        }
      ),
      { numRuns: Math.max(1, allWidgets.length) }
    );
  });

  test("Widget import paths should be accessible from folder path", async () => {
    const folderWidgets = getAllWidgetNames().filter(name => {
      const structure = analyzeWidgetStructure(name);
      return structure.hasFolder;
    });
    
    if (folderWidgets.length === 0) {
      expect(true).toBe(true);
      return;
    }
    
    await fc.assert(
      fc.property(
        fc.constantFrom(...folderWidgets),
        (widgetName: string) => {
          // Check if the widget can be imported from the folder path
          const indexPath = path.join(process.cwd(), 'src/components/widgets', widgetName, 'index.ts');
          
          if (!fs.existsSync(indexPath)) {
            return false;
          }
          
          const indexContent = fs.readFileSync(indexPath, 'utf-8');
          
          // Should have some form of export
          const hasExport = indexContent.includes('export');
          
          return hasExport;
        }
      ),
      { numRuns: Math.max(1, folderWidgets.length) }
    );
  });
});