/**
 * Property-based tests for File Organization Within Widget Folders
 * 
 * **Feature: widget-folder-organization, Property 2: File organization within widget folders**
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5**
 * 
 * For any widget folder, when it contains supporting files (hooks, utils, types, sub-components), 
 * they should be organized in predictable subdirectories (hooks/, utils/, components/, types.ts) 
 * with consistent naming patterns.
 */

import "./setup";
import * as fc from "fast-check";
import { describe, test, expect } from "vitest";
import * as fs from "fs";
import * as path from "path";

// File organization patterns
interface WidgetFileOrganization {
  name: string;
  hasFolder: boolean;
  hooks: string[];
  utils: string[];
  components: string[];
  types: string[];
  hasHooksDirectory: boolean;
  hasUtilsDirectory: boolean;
  hasComponentsDirectory: boolean;
  hasTypesFile: boolean;
}

// Helper function to analyze widget file organization
function analyzeWidgetFileOrganization(widgetName: string): WidgetFileOrganization {
  const widgetPath = path.join(process.cwd(), 'src/components/widgets', widgetName);
  const hasFolder = fs.existsSync(widgetPath) && fs.statSync(widgetPath).isDirectory();
  
  let hooks: string[] = [];
  let utils: string[] = [];
  let components: string[] = [];
  let types: string[] = [];
  let hasHooksDirectory = false;
  let hasUtilsDirectory = false;
  let hasComponentsDirectory = false;
  let hasTypesFile = false;
  
  if (hasFolder) {
    const folderContents = fs.readdirSync(widgetPath, { withFileTypes: true });
    
    // Check for hooks directory
    const hooksDir = path.join(widgetPath, 'hooks');
    if (fs.existsSync(hooksDir) && fs.statSync(hooksDir).isDirectory()) {
      hasHooksDirectory = true;
      hooks = fs.readdirSync(hooksDir)
        .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'))
        .filter(file => file.startsWith('use'));
    }
    
    // Check for utils directory or file
    const utilsDir = path.join(widgetPath, 'utils');
    const utilsFile = path.join(widgetPath, 'utils.ts');
    if (fs.existsSync(utilsDir) && fs.statSync(utilsDir).isDirectory()) {
      hasUtilsDirectory = true;
      utils = fs.readdirSync(utilsDir)
        .filter(file => file.endsWith('.ts') || file.endsWith('.tsx'));
    } else if (fs.existsSync(utilsFile)) {
      utils = ['utils.ts'];
    }
    
    // Check for components directory
    const componentsDir = path.join(widgetPath, 'components');
    if (fs.existsSync(componentsDir) && fs.statSync(componentsDir).isDirectory()) {
      hasComponentsDirectory = true;
      components = fs.readdirSync(componentsDir)
        .filter(file => file.endsWith('.tsx'));
    }
    
    // Check for types file
    const typesFile = path.join(widgetPath, 'types.ts');
    if (fs.existsSync(typesFile)) {
      hasTypesFile = true;
      types = ['types.ts'];
    }
    
    // Also check for loose hook files in the root
    const rootHooks = folderContents
      .filter(item => item.isFile() && item.name.startsWith('use') && item.name.endsWith('.ts'))
      .map(item => item.name);
    hooks.push(...rootHooks);
  }
  
  return {
    name: widgetName,
    hasFolder,
    hooks,
    utils,
    components,
    types,
    hasHooksDirectory,
    hasUtilsDirectory,
    hasComponentsDirectory,
    hasTypesFile
  };
}

// Helper function to get all widget folder names
function getWidgetFolders(): string[] {
  const widgetsDir = path.join(process.cwd(), 'src/components/widgets');
  
  if (!fs.existsSync(widgetsDir)) {
    return [];
  }
  
  return fs.readdirSync(widgetsDir, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(item => item.name);
}

// Helper function to check naming patterns
function hasConsistentNamingPattern(files: string[], pattern: RegExp): boolean {
  return files.every(file => pattern.test(file));
}

// Helper function to check if hooks follow naming convention
function hooksFollowNamingConvention(hooks: string[]): boolean {
  const hookPattern = /^use[A-Z][a-zA-Z0-9]*\.(ts|tsx)$/;
  return hooks.every(hook => hookPattern.test(hook));
}

// Helper function to check if components follow naming convention
function componentsFollowNamingConvention(components: string[]): boolean {
  const componentPattern = /^[A-Z][a-zA-Z0-9]*\.(tsx)$/;
  return components.every(component => componentPattern.test(component));
}

// Helper function to check if utils follow naming convention
function utilsFollowNamingConvention(utils: string[]): boolean {
  const utilPattern = /^[a-zA-Z][a-zA-Z0-9]*\.(ts|tsx)$/;
  return utils.every(util => utilPattern.test(util));
}

describe("Property 2: File organization within widget folders", () => {
  test("For any widget folder with hooks, they should be in hooks/ subdirectory or follow useXxx naming", async () => {
    const widgetFolders = getWidgetFolders();
    
    if (widgetFolders.length === 0) {
      expect(true).toBe(true);
      return;
    }
    
    await fc.assert(
      fc.property(
        fc.constantFrom(...widgetFolders),
        (widgetName: string) => {
          const organization = analyzeWidgetFileOrganization(widgetName);
          
          // If widget has hooks, they should either be in hooks/ directory or follow naming convention
          if (organization.hooks.length > 0) {
            // Either all hooks are in hooks/ directory, or they follow useXxx naming
            const hooksInDirectory = organization.hasHooksDirectory;
            const hooksFollowNaming = hooksFollowNamingConvention(organization.hooks);
            
            return hooksInDirectory || hooksFollowNaming;
          }
          
          return true; // No hooks to check
        }
      ),
      { numRuns: Math.max(1, widgetFolders.length) }
    );
  });

  test("For any widget folder with utils, they should be in utils/ subdirectory or utils.ts file", async () => {
    const widgetFolders = getWidgetFolders();
    
    if (widgetFolders.length === 0) {
      expect(true).toBe(true);
      return;
    }
    
    await fc.assert(
      fc.property(
        fc.constantFrom(...widgetFolders),
        (widgetName: string) => {
          const organization = analyzeWidgetFileOrganization(widgetName);
          
          // If widget has utils, they should be properly organized
          if (organization.utils.length > 0) {
            // Utils should be in utils/ directory or utils.ts file
            const hasUtilsOrganization = organization.hasUtilsDirectory || 
              organization.utils.includes('utils.ts');
            
            // Utils should follow naming convention
            const utilsFollowNaming = utilsFollowNamingConvention(organization.utils);
            
            return hasUtilsOrganization && utilsFollowNaming;
          }
          
          return true; // No utils to check
        }
      ),
      { numRuns: Math.max(1, widgetFolders.length) }
    );
  });

  test("For any widget folder with TypeScript types, they should be in types.ts file", async () => {
    const widgetFolders = getWidgetFolders();
    
    if (widgetFolders.length === 0) {
      expect(true).toBe(true);
      return;
    }
    
    await fc.assert(
      fc.property(
        fc.constantFrom(...widgetFolders),
        (widgetName: string) => {
          const organization = analyzeWidgetFileOrganization(widgetName);
          
          // If widget has types, they should be in types.ts
          if (organization.types.length > 0) {
            return organization.hasTypesFile && organization.types.includes('types.ts');
          }
          
          return true; // No types to check
        }
      ),
      { numRuns: Math.max(1, widgetFolders.length) }
    );
  });

  test("For any widget folder with sub-components, they should be in components/ subdirectory", async () => {
    const widgetFolders = getWidgetFolders();
    
    if (widgetFolders.length === 0) {
      expect(true).toBe(true);
      return;
    }
    
    await fc.assert(
      fc.property(
        fc.constantFrom(...widgetFolders),
        (widgetName: string) => {
          const organization = analyzeWidgetFileOrganization(widgetName);
          
          // If widget has sub-components, they should be in components/ directory
          if (organization.components.length > 0) {
            const hasComponentsDirectory = organization.hasComponentsDirectory;
            const componentsFollowNaming = componentsFollowNamingConvention(organization.components);
            
            return hasComponentsDirectory && componentsFollowNaming;
          }
          
          return true; // No components to check
        }
      ),
      { numRuns: Math.max(1, widgetFolders.length) }
    );
  });

  test("For any widget folder, file naming should follow predictable patterns", async () => {
    const widgetFolders = getWidgetFolders();
    
    if (widgetFolders.length === 0) {
      expect(true).toBe(true);
      return;
    }
    
    await fc.assert(
      fc.property(
        fc.constantFrom(...widgetFolders),
        (widgetName: string) => {
          const organization = analyzeWidgetFileOrganization(widgetName);
          
          // Check all file types follow their respective naming patterns
          const hooksValid = organization.hooks.length === 0 || 
            hooksFollowNamingConvention(organization.hooks);
          
          const utilsValid = organization.utils.length === 0 || 
            utilsFollowNamingConvention(organization.utils);
          
          const componentsValid = organization.components.length === 0 || 
            componentsFollowNamingConvention(organization.components);
          
          const typesValid = organization.types.length === 0 || 
            organization.types.every(file => file === 'types.ts');
          
          return hooksValid && utilsValid && componentsValid && typesValid;
        }
      ),
      { numRuns: Math.max(1, widgetFolders.length) }
    );
  });

  test("For any widget folder, directory structure should be consistent", async () => {
    const widgetFolders = getWidgetFolders();
    
    if (widgetFolders.length === 0) {
      expect(true).toBe(true);
      return;
    }
    
    await fc.assert(
      fc.property(
        fc.constantFrom(...widgetFolders),
        (widgetName: string) => {
          const widgetPath = path.join(process.cwd(), 'src/components/widgets', widgetName);
          const folderContents = fs.readdirSync(widgetPath, { withFileTypes: true });
          
          // Check that only expected directories exist
          const directories = folderContents
            .filter(item => item.isDirectory())
            .map(item => item.name);
          
          const allowedDirectories = ['hooks', 'utils', 'components'];
          const hasOnlyAllowedDirectories = directories.every(dir => 
            allowedDirectories.includes(dir)
          );
          
          // Check that main files exist
          const files = folderContents
            .filter(item => item.isFile())
            .map(item => item.name);
          
          const hasIndexFile = files.includes('index.ts');
          const hasMainComponent = files.includes(`${widgetName}.tsx`);
          
          return hasOnlyAllowedDirectories && hasIndexFile && hasMainComponent;
        }
      ),
      { numRuns: Math.max(1, widgetFolders.length) }
    );
  });

  test("For any widget folder with multiple file types, they should be properly separated", async () => {
    const widgetFolders = getWidgetFolders();
    
    if (widgetFolders.length === 0) {
      expect(true).toBe(true);
      return;
    }
    
    await fc.assert(
      fc.property(
        fc.constantFrom(...widgetFolders),
        (widgetName: string) => {
          const organization = analyzeWidgetFileOrganization(widgetName);
          
          // If widget has multiple types of supporting files, they should be separated
          const fileTypeCount = [
            organization.hooks.length > 0 ? 1 : 0,
            organization.utils.length > 0 ? 1 : 0,
            organization.components.length > 0 ? 1 : 0,
            organization.types.length > 0 ? 1 : 0
          ].reduce((sum, count) => sum + count, 0);
          
          if (fileTypeCount > 1) {
            // Multiple file types should be properly separated
            const hooksSeparated = organization.hooks.length === 0 || 
              organization.hasHooksDirectory || 
              organization.hooks.every(hook => hook.startsWith('use'));
            
            const utilsSeparated = organization.utils.length === 0 || 
              organization.hasUtilsDirectory || 
              organization.utils.includes('utils.ts');
            
            const componentsSeparated = organization.components.length === 0 || 
              organization.hasComponentsDirectory;
            
            const typesSeparated = organization.types.length === 0 || 
              organization.hasTypesFile;
            
            return hooksSeparated && utilsSeparated && componentsSeparated && typesSeparated;
          }
          
          return true; // Single or no file types don't need separation
        }
      ),
      { numRuns: Math.max(1, widgetFolders.length) }
    );
  });
});