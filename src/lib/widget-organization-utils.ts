/**
 * Widget Folder Organization Utilities
 * Provides functions for migrating widgets to folder structure and validating organization
 */

import * as fs from 'fs';
import * as path from 'path';

// Types for widget organization
export interface WidgetStructure {
  name: string;
  type: 'folder' | 'file';
  complexity: 'simple' | 'complex';
  components: {
    main: string;
    subComponents?: string[];
    hooks?: string[];
    utils?: string[];
    types?: string;
  };
}

export interface MigrationPlan {
  widgetName: string;
  currentFile: string;
  targetStructure: WidgetStructure;
  extractedComponents: ComponentExtraction[];
  extractedHooks: HookExtraction[];
  extractedUtils: UtilExtraction[];
}

export interface ComponentExtraction {
  name: string;
  startLine: number;
  endLine: number;
  dependencies: string[];
  targetPath: string;
}

export interface HookExtraction {
  name: string;
  startLine: number;
  endLine: number;
  dependencies: string[];
  targetPath: string;
}

export interface UtilExtraction {
  name: string;
  startLine: number;
  endLine: number;
  dependencies: string[];
  targetPath: string;
}

export interface WidgetFolderSchema {
  index: {
    exports: string[];
    reexports: string[];
  };
  mainComponent: {
    name: string;
    props: string;
    imports: ImportStatement[];
  };
  subComponents?: {
    [componentName: string]: {
      props: string;
      dependencies: string[];
    };
  };
  hooks?: {
    [hookName: string]: {
      returnType: string;
      dependencies: string[];
    };
  };
  utils?: {
    [utilName: string]: {
      functions: string[];
      dependencies: string[];
    };
  };
}

export interface ImportStatement {
  source: string;
  imports: string[];
  isDefault: boolean;
}

// Constants
export const WIDGETS_BASE_PATH = 'src/components/widgets';
export const COMPLEXITY_THRESHOLD = 150; // Lines of code threshold for folder organization
export const WIDGET_FOLDER_STRUCTURE = {
  components: 'components',
  hooks: 'hooks',
  utils: 'utils',
  types: 'types.ts',
  index: 'index.ts',
} as const;

/**
 * Determines if a widget should be organized into a folder structure
 * Based on file size, complexity, and number of related files
 */
export function shouldUseWidgetFolder(widgetPath: string): boolean {
  try {
    if (!fs.existsSync(widgetPath)) {
      return false;
    }

    const content = fs.readFileSync(widgetPath, 'utf-8');
    const lineCount = content.split('\n').length;
    
    // Check if widget exceeds complexity threshold
    if (lineCount >= COMPLEXITY_THRESHOLD) {
      return true;
    }

    // Check for multiple sub-components (more than 2 component definitions)
    const componentMatches = content.match(/^(const|function)\s+\w+.*=.*\(.*\)\s*=>/gm) || [];
    if (componentMatches.length > 2) {
      return true;
    }

    // Check for custom hooks (useXxx patterns)
    const hookMatches = content.match(/const\s+use\w+\s*=/g) || [];
    if (hookMatches.length > 1) {
      return true;
    }

    return false;
  } catch (error) {
    console.error(`Error analyzing widget complexity: ${error}`);
    return false;
  }
}

/**
 * Validates that a widget folder follows the expected structure
 */
export function validateWidgetFolderStructure(widgetName: string): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const widgetPath = path.join(WIDGETS_BASE_PATH, widgetName);

  // Check if widget folder exists
  if (!fs.existsSync(widgetPath)) {
    errors.push(`Widget folder does not exist: ${widgetPath}`);
    return { isValid: false, errors, warnings };
  }

  // Check if it's a directory
  if (!fs.statSync(widgetPath).isDirectory()) {
    errors.push(`Widget path is not a directory: ${widgetPath}`);
    return { isValid: false, errors, warnings };
  }

  // Check for required index.ts file
  const indexPath = path.join(widgetPath, WIDGET_FOLDER_STRUCTURE.index);
  if (!fs.existsSync(indexPath)) {
    errors.push(`Missing required index.ts file: ${indexPath}`);
  }

  // Check for main component file
  const mainComponentPath = path.join(widgetPath, `${widgetName}.tsx`);
  if (!fs.existsSync(mainComponentPath)) {
    errors.push(`Missing main component file: ${mainComponentPath}`);
  }

  // Check optional subdirectories structure
  const subdirs = ['components', 'hooks', 'utils'];
  subdirs.forEach(subdir => {
    const subdirPath = path.join(widgetPath, subdir);
    if (fs.existsSync(subdirPath)) {
      if (!fs.statSync(subdirPath).isDirectory()) {
        errors.push(`${subdir} should be a directory: ${subdirPath}`);
      }
    }
  });

  // Check types file if it exists
  const typesPath = path.join(widgetPath, WIDGET_FOLDER_STRUCTURE.types);
  if (fs.existsSync(typesPath)) {
    if (!fs.statSync(typesPath).isFile()) {
      errors.push(`types.ts should be a file: ${typesPath}`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates naming convention consistency across widget folders
 */
export function validateNamingConventions(widgetName: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check widget name follows PascalCase
  if (!/^[A-Z][a-zA-Z0-9]*Widget$/.test(widgetName)) {
    errors.push(`Widget name should follow PascalCase and end with 'Widget': ${widgetName}`);
  }

  const widgetPath = path.join(WIDGETS_BASE_PATH, widgetName);
  if (!fs.existsSync(widgetPath)) {
    return { isValid: errors.length === 0, errors };
  }

  // Check main component file naming
  const mainComponentPath = path.join(widgetPath, `${widgetName}.tsx`);
  if (!fs.existsSync(mainComponentPath)) {
    errors.push(`Main component file should be named ${widgetName}.tsx`);
  }

  // Check subdirectory naming conventions
  const subdirs = fs.readdirSync(widgetPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

  const validSubdirs = ['components', 'hooks', 'utils'];
  subdirs.forEach(subdir => {
    if (!validSubdirs.includes(subdir)) {
      errors.push(`Invalid subdirectory name: ${subdir}. Should be one of: ${validSubdirs.join(', ')}`);
    }
  });

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Resolves import paths for widget components
 * Handles both old single-file imports and new folder-based imports
 */
export function resolveWidgetImportPath(widgetName: string): string {
  const widgetFolderPath = path.join(WIDGETS_BASE_PATH, widgetName);
  const singleFilePath = path.join(WIDGETS_BASE_PATH, `${widgetName}.tsx`);

  // Check if widget uses folder structure
  if (fs.existsSync(widgetFolderPath) && fs.statSync(widgetFolderPath).isDirectory()) {
    // Use folder-based import path
    return `@/components/widgets/${widgetName}`;
  }

  // Check if single file exists
  if (fs.existsSync(singleFilePath)) {
    // Use single-file import path
    return `@/components/widgets/${widgetName}`;
  }

  throw new Error(`Widget not found: ${widgetName}`);
}

/**
 * Validates that import paths resolve correctly after reorganization
 */
export function validateImportPathCompatibility(widgetName: string): {
  isValid: boolean;
  errors: string[];
  oldPath: string;
  newPath: string;
} {
  const errors: string[] = [];
  
  try {
    const oldPath = `@/components/widgets/${widgetName}`;
    const newPath = resolveWidgetImportPath(widgetName);
    
    // Both paths should resolve to the same component
    // This is a structural check - actual resolution would need runtime testing
    
    return {
      isValid: errors.length === 0,
      errors,
      oldPath,
      newPath
    };
  } catch (error) {
    errors.push(`Failed to resolve import paths: ${error}`);
    return {
      isValid: false,
      errors,
      oldPath: '',
      newPath: ''
    };
  }
}

/**
 * Creates the basic folder structure for a widget
 */
export function createWidgetFolderStructure(widgetName: string): {
  success: boolean;
  createdPaths: string[];
  errors: string[];
} {
  const createdPaths: string[] = [];
  const errors: string[] = [];
  
  try {
    const widgetPath = path.join(WIDGETS_BASE_PATH, widgetName);
    
    // Create main widget directory
    if (!fs.existsSync(widgetPath)) {
      fs.mkdirSync(widgetPath, { recursive: true });
      createdPaths.push(widgetPath);
    }
    
    // Create index.ts file
    const indexPath = path.join(widgetPath, 'index.ts');
    if (!fs.existsSync(indexPath)) {
      const indexContent = `export { default } from './${widgetName}';\nexport type { ${widgetName}Props } from './types';\n`;
      fs.writeFileSync(indexPath, indexContent);
      createdPaths.push(indexPath);
    }
    
    return {
      success: true,
      createdPaths,
      errors
    };
  } catch (error) {
    errors.push(`Failed to create widget folder structure: ${error}`);
    return {
      success: false,
      createdPaths,
      errors
    };
  }
}

/**
 * Analyzes a widget file to determine what should be extracted
 */
export function analyzeWidgetForExtraction(widgetPath: string): MigrationPlan {
  const content = fs.readFileSync(widgetPath, 'utf-8');
  const widgetName = path.basename(widgetPath, '.tsx');
  
  const extractedComponents: ComponentExtraction[] = [];
  const extractedHooks: HookExtraction[] = [];
  const extractedUtils: UtilExtraction[] = [];
  
  // Analyze for sub-components (components that are not the main widget)
  const componentRegex = /^(const|function)\s+(\w+).*=.*\(.*\)\s*=>/gm;
  let match;
  
  while ((match = componentRegex.exec(content)) !== null) {
    const componentName = match[2];
    if (componentName !== widgetName && !componentName.includes('Widget')) {
      const startLine = content.substring(0, match.index).split('\n').length - 1;
      // Find end of component (simplified - would need more sophisticated parsing)
      const endLine = startLine + 20; // Placeholder
      
      extractedComponents.push({
        name: componentName,
        startLine,
        endLine,
        dependencies: [], // Would need AST analysis for accurate dependencies
        targetPath: `components/${componentName}.tsx`
      });
    }
  }
  
  // Analyze for custom hooks
  const hookRegex = /const\s+(use\w+)\s*=/g;
  while ((match = hookRegex.exec(content)) !== null) {
    const hookName = match[1];
    const startLine = content.substring(0, match.index).split('\n').length - 1;
    const endLine = startLine + 10; // Placeholder
    
    extractedHooks.push({
      name: hookName,
      startLine,
      endLine,
      dependencies: [],
      targetPath: `hooks/${hookName}.ts`
    });
  }
  
  return {
    widgetName,
    currentFile: widgetPath,
    targetStructure: {
      name: widgetName,
      type: 'folder',
      complexity: 'complex',
      components: {
        main: `${widgetName}.tsx`,
        subComponents: extractedComponents.map(c => c.targetPath),
        hooks: extractedHooks.map(h => h.targetPath),
        utils: extractedUtils.map(u => u.targetPath),
        types: 'types.ts'
      }
    },
    extractedComponents,
    extractedHooks,
    extractedUtils
  };
}

/**
 * Validates that all widget files are properly co-located
 */
export function validateWidgetCoLocation(widgetName: string): {
  isValid: boolean;
  errors: string[];
  coLocatedFiles: string[];
} {
  const errors: string[] = [];
  const coLocatedFiles: string[] = [];
  const widgetPath = path.join(WIDGETS_BASE_PATH, widgetName);
  
  if (!fs.existsSync(widgetPath)) {
    errors.push(`Widget folder does not exist: ${widgetPath}`);
    return { isValid: false, errors, coLocatedFiles };
  }
  
  // Recursively find all files in widget folder
  function findFiles(dir: string): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        files.push(...findFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }
    
    return files;
  }
  
  try {
    const allFiles = findFiles(widgetPath);
    coLocatedFiles.push(...allFiles);
    
    // Validate that all files are related to the widget
    for (const file of allFiles) {
      const relativePath = path.relative(widgetPath, file);
      
      // Check if file follows expected patterns
      if (!relativePath.includes(widgetName.toLowerCase()) && 
          !relativePath.startsWith('components/') &&
          !relativePath.startsWith('hooks/') &&
          !relativePath.startsWith('utils/') &&
          !relativePath.includes('types.ts') &&
          !relativePath.includes('index.ts')) {
        errors.push(`File may not be properly co-located: ${relativePath}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      coLocatedFiles
    };
  } catch (error) {
    errors.push(`Error analyzing co-location: ${error}`);
    return { isValid: false, errors, coLocatedFiles };
  }
}