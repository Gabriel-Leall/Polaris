/**
 * Testing utilities for widget organization validation
 * Provides helper functions for property-based testing of widget folder structures
 */

import * as fs from "fs";
import * as path from "path";

export interface WidgetStructure {
  name: string;
  type: 'folder' | 'file';
  complexity: 'simple' | 'complex';
  hasIndex: boolean;
  hasMainComponent: boolean;
  supportingFiles: string[];
  subdirectories: string[];
  lineCount?: number;
}

export interface ImportPathTest {
  widgetName: string;
  oldPath: string;
  newPath: string;
  isResolvable: boolean;
}

/**
 * Analyzes the structure of a widget (file or folder)
 */
export function analyzeWidgetStructure(widgetName: string): WidgetStructure {
  const widgetsDir = path.join(process.cwd(), 'src/components/widgets');
  const widgetFolderPath = path.join(widgetsDir, widgetName);
  const widgetFilePath = path.join(widgetsDir, `${widgetName}.tsx`);
  
  const hasFolder = fs.existsSync(widgetFolderPath) && fs.statSync(widgetFolderPath).isDirectory();
  const hasFile = fs.existsSync(widgetFilePath);
  
  if (hasFolder) {
    const folderContents = fs.readdirSync(widgetFolderPath, { withFileTypes: true });
    
    const hasIndex = fs.existsSync(path.join(widgetFolderPath, 'index.ts'));
    const hasMainComponent = fs.existsSync(path.join(widgetFolderPath, `${widgetName}.tsx`));
    
    const supportingFiles = folderContents
      .filter(item => item.isFile() && item.name !== 'index.ts' && item.name !== `${widgetName}.tsx`)
      .map(item => item.name);
    
    const subdirectories = folderContents
      .filter(item => item.isDirectory())
      .map(item => item.name);
    
    const complexity = (supportingFiles.length > 0 || subdirectories.length > 0) ? 'complex' : 'simple';
    
    return {
      name: widgetName,
      type: 'folder',
      complexity,
      hasIndex,
      hasMainComponent,
      supportingFiles,
      subdirectories
    };
  } else if (hasFile) {
    const fileContent = fs.readFileSync(widgetFilePath, 'utf-8');
    const lineCount = fileContent.split('\n').length;
    const complexity = lineCount > 150 ? 'complex' : 'simple';
    
    return {
      name: widgetName,
      type: 'file',
      complexity,
      hasIndex: false,
      hasMainComponent: true,
      supportingFiles: [],
      subdirectories: [],
      lineCount
    };
  }
  
  throw new Error(`Widget ${widgetName} not found`);
}

/**
 * Gets all widget names from the widgets directory
 */
export function getAllWidgetNames(): string[] {
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

/**
 * Checks if a widget has multiple related files (indicating it should be a folder)
 */
export function shouldBeFolder(widgetName: string): boolean {
  try {
    const structure = analyzeWidgetStructure(widgetName);
    return structure.complexity === 'complex';
  } catch {
    return false;
  }
}

/**
 * Validates import path resolution for a widget
 */
export function validateImportPath(widgetName: string, importPath: string): boolean {
  try {
    const fullPath = path.resolve(process.cwd(), 'src', importPath.replace('@/', ''));
    
    // Check if it's a direct file import
    if (fs.existsSync(`${fullPath}.tsx`)) {
      return true;
    }
    
    // Check if it's a folder with index.ts
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
      const indexPath = path.join(fullPath, 'index.ts');
      return fs.existsSync(indexPath);
    }
    
    return false;
  } catch {
    return false;
  }
}

/**
 * Checks if an index.ts file properly exports the main component
 */
export function indexExportsMainComponent(widgetName: string): boolean {
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
    new RegExp(`export\\s*{\\s*${widgetName}\\s*}\\s*from`),
    // Default export pattern
    new RegExp(`export\\s*{\\s*default\\s*}\\s*from\\s*['"]\\.\/${widgetName}['"]`),
  ];
  
  return exportPatterns.some(pattern => pattern.test(indexContent));
}

/**
 * Validates folder structure consistency
 */
export function validateFolderStructure(widgetName: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  try {
    const structure = analyzeWidgetStructure(widgetName);
    
    if (structure.type === 'folder') {
      // Check for required files
      if (!structure.hasIndex) {
        errors.push(`Missing index.ts file`);
      }
      
      if (!structure.hasMainComponent) {
        errors.push(`Missing main component file ${widgetName}.tsx`);
      }
      
      // Check index exports
      if (structure.hasIndex && !indexExportsMainComponent(widgetName)) {
        errors.push(`index.ts does not properly export main component`);
      }
      
      // Check subdirectory names
      const allowedSubdirs = ['hooks', 'utils', 'components'];
      const invalidSubdirs = structure.subdirectories.filter(dir => !allowedSubdirs.includes(dir));
      if (invalidSubdirs.length > 0) {
        errors.push(`Invalid subdirectories: ${invalidSubdirs.join(', ')}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  } catch (error) {
    return {
      isValid: false,
      errors: [`Failed to analyze widget structure: ${error}`]
    };
  }
}

/**
 * Creates baseline functionality tests for existing widgets
 */
export function createBaselineTest(widgetName: string): () => boolean {
  return () => {
    try {
      const structure = analyzeWidgetStructure(widgetName);
      
      // Basic checks that should always pass for existing widgets
      if (structure.type === 'file') {
        // File should exist and be readable
        const widgetPath = path.join(process.cwd(), 'src/components/widgets', `${widgetName}.tsx`);
        const content = fs.readFileSync(widgetPath, 'utf-8');
        
        // Should have a default export or named export
        const hasExport = content.includes('export default') || 
                         content.includes('export { default }') ||
                         content.includes(`export { ${widgetName} }`);
        
        // Should be a React component (has JSX or React patterns)
        const isReactComponent = content.includes('React') || 
                                content.includes('jsx') || 
                                content.includes('tsx') ||
                                content.includes('<') ||
                                content.includes('className') ||
                                content.includes('onClick');
        
        return hasExport && isReactComponent && content.length > 0;
      } else if (structure.type === 'folder') {
        // Folder structure should be valid
        const validation = validateFolderStructure(widgetName);
        return validation.isValid;
      }
      
      return false;
    } catch (error) {
      console.log(`Error testing ${widgetName}:`, error);
      return false;
    }
  };
}

/**
 * Generates test data for import path compatibility testing
 */
export function generateImportPathTests(): ImportPathTest[] {
  const widgets = getAllWidgetNames();
  const tests: ImportPathTest[] = [];
  
  widgets.forEach(widgetName => {
    const structure = analyzeWidgetStructure(widgetName);
    
    if (structure.type === 'folder') {
      // Test both old and new import paths
      tests.push({
        widgetName,
        oldPath: `@/components/widgets/${widgetName}`,
        newPath: `@/components/widgets/${widgetName}`,
        isResolvable: validateImportPath(widgetName, `components/widgets/${widgetName}`)
      });
    } else {
      // Single file widget
      tests.push({
        widgetName,
        oldPath: `@/components/widgets/${widgetName}`,
        newPath: `@/components/widgets/${widgetName}`,
        isResolvable: validateImportPath(widgetName, `components/widgets/${widgetName}`)
      });
    }
  });
  
  return tests;
}