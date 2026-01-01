/**
 * Widget Import Path Resolution Utilities
 * Handles import path resolution and validation for widget reorganization
 */

import * as fs from 'fs';
import * as path from 'path';
import { WIDGETS_BASE_PATH } from './widget-organization-utils';

export interface ImportPathResult {
  resolved: boolean;
  path: string;
  type: 'folder' | 'file';
  error?: string;
}

export interface ImportCompatibilityCheck {
  widgetName: string;
  oldPathWorks: boolean;
  newPathWorks: boolean;
  bothWork: boolean;
  errors: string[];
}

/**
 * Resolves import path for a widget, handling both folder and file structures
 */
export function resolveWidgetImport(widgetName: string): ImportPathResult {
  const folderPath = path.join(WIDGETS_BASE_PATH, widgetName);
  const filePath = path.join(WIDGETS_BASE_PATH, `${widgetName}.tsx`);
  
  // Check if widget uses folder structure
  if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
    const indexPath = path.join(folderPath, 'index.ts');
    if (fs.existsSync(indexPath)) {
      return {
        resolved: true,
        path: `@/components/widgets/${widgetName}`,
        type: 'folder'
      };
    } else {
      return {
        resolved: false,
        path: `@/components/widgets/${widgetName}`,
        type: 'folder',
        error: 'Folder exists but missing index.ts'
      };
    }
  }
  
  // Check if widget uses single file structure
  if (fs.existsSync(filePath)) {
    return {
      resolved: true,
      path: `@/components/widgets/${widgetName}`,
      type: 'file'
    };
  }
  
  return {
    resolved: false,
    path: `@/components/widgets/${widgetName}`,
    type: 'file',
    error: 'Widget not found'
  };
}

/**
 * Checks if both old and new import paths work for backward compatibility
 */
export function checkImportCompatibility(widgetName: string): ImportCompatibilityCheck {
  const errors: string[] = [];
  
  // Try to resolve the import path
  const importResult = resolveWidgetImport(widgetName);
  
  if (!importResult.resolved) {
    errors.push(importResult.error || 'Failed to resolve import');
  }
  
  // For now, both old and new paths should resolve to the same location
  // This is because we use the same import pattern: @/components/widgets/WidgetName
  const oldPathWorks = importResult.resolved;
  const newPathWorks = importResult.resolved;
  const bothWork = oldPathWorks && newPathWorks;
  
  return {
    widgetName,
    oldPathWorks,
    newPathWorks,
    bothWork,
    errors
  };
}

/**
 * Validates that TypeScript path aliases work correctly
 */
export function validateTypeScriptPaths(widgetName: string): {
  isValid: boolean;
  errors: string[];
  resolvedPath: string;
} {
  const errors: string[] = [];
  let resolvedPath = '';
  
  try {
    const importResult = resolveWidgetImport(widgetName);
    
    if (!importResult.resolved) {
      errors.push(`Import path does not resolve: ${importResult.path}`);
      return { isValid: false, errors, resolvedPath };
    }
    
    resolvedPath = importResult.path;
    
    // Check if the resolved path follows TypeScript alias conventions
    if (!resolvedPath.startsWith('@/')) {
      errors.push(`Import path should use @ alias: ${resolvedPath}`);
    }
    
    // Validate the physical path exists
    const physicalPath = resolvedPath.replace('@/', 'src/');
    const fullPath = path.resolve(physicalPath);
    
    if (importResult.type === 'folder') {
      const indexPath = path.join(fullPath, 'index.ts');
      if (!fs.existsSync(indexPath)) {
        errors.push(`Index file not found: ${indexPath}`);
      }
    } else {
      const filePath = `${fullPath}.tsx`;
      if (!fs.existsSync(filePath)) {
        errors.push(`Widget file not found: ${filePath}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      resolvedPath
    };
    
  } catch (error) {
    errors.push(`TypeScript path validation failed: ${error}`);
    return {
      isValid: false,
      errors,
      resolvedPath
    };
  }
}

/**
 * Updates import statements in a file to use new widget paths
 */
export function updateImportStatements(
  filePath: string,
  widgetMappings: Record<string, string>
): {
  success: boolean;
  updatedImports: string[];
  errors: string[];
} {
  const updatedImports: string[] = [];
  const errors: string[] = [];
  
  try {
    if (!fs.existsSync(filePath)) {
      errors.push(`File not found: ${filePath}`);
      return { success: false, updatedImports, errors };
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    let updatedContent = content;
    
    // Update import statements
    Object.entries(widgetMappings).forEach(([oldPath, newPath]) => {
      const importRegex = new RegExp(`from ['"]${oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`, 'g');
      const matches = content.match(importRegex);
      
      if (matches) {
        updatedContent = updatedContent.replace(importRegex, `from '${newPath}'`);
        updatedImports.push(`${oldPath} -> ${newPath}`);
      }
    });
    
    // Write updated content back to file
    if (updatedContent !== content) {
      fs.writeFileSync(filePath, updatedContent);
    }
    
    return {
      success: true,
      updatedImports,
      errors
    };
    
  } catch (error) {
    errors.push(`Failed to update imports: ${error}`);
    return {
      success: false,
      updatedImports,
      errors
    };
  }
}

/**
 * Scans all files in a directory for widget imports that need updating
 */
export function scanForWidgetImports(
  scanPath: string,
  widgetNames: string[]
): {
  filesToUpdate: string[];
  importCounts: Record<string, number>;
  errors: string[];
} {
  const filesToUpdate: string[] = [];
  const importCounts: Record<string, number> = {};
  const errors: string[] = [];
  
  const scanDirectory = (dirPath: string): void => {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      
      if (item.isDirectory()) {
        // Skip node_modules and other irrelevant directories
        if (!['node_modules', '.git', '.next', 'dist', 'build'].includes(item.name)) {
          scanDirectory(fullPath);
        }
      } else if (item.name.endsWith('.tsx') || item.name.endsWith('.ts')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        
        // Check for widget imports
        widgetNames.forEach(widgetName => {
          const importPattern = new RegExp(`from ['"]@/components/widgets/${widgetName}['"]`, 'g');
          const matches = content.match(importPattern);
          
          if (matches) {
            if (!filesToUpdate.includes(fullPath)) {
              filesToUpdate.push(fullPath);
            }
            importCounts[widgetName] = (importCounts[widgetName] || 0) + matches.length;
          }
        });
      }
    }
  };

  try {
    scanDirectory(scanPath);
    
    return {
      filesToUpdate,
      importCounts,
      errors
    };
    
  } catch (error) {
    errors.push(`Failed to scan for imports: ${error}`);
    return {
      filesToUpdate: [],
      importCounts: {},
      errors
    };
  }
}

/**
 * Validates that all widget imports in the main widgets index file are correct
 */
export function validateWidgetsIndexFile(): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  exports: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const exports: string[] = [];
  
  try {
    const indexPath = path.join(WIDGETS_BASE_PATH, 'index.ts');
    
    if (!fs.existsSync(indexPath)) {
      errors.push(`Widgets index file not found: ${indexPath}`);
      return { isValid: false, errors, warnings, exports };
    }
    
    const content = fs.readFileSync(indexPath, 'utf-8');
    const lines = content.split('\n');
    
    // Parse export statements
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('export') && trimmedLine.includes('from')) {
        exports.push(trimmedLine);
        
        // Extract widget name and path
        const match = trimmedLine.match(/export\s*{\s*default\s+as\s+(\w+)\s*}\s*from\s*['"]([^'"]+)['"]/);
        if (match) {
          const [, widgetName] = match;
          
          // Validate that the import path resolves
          const importResult = resolveWidgetImport(widgetName);
          if (!importResult.resolved) {
            errors.push(`Export on line ${index + 1} does not resolve: ${trimmedLine}`);
          }
        } else {
          warnings.push(`Could not parse export on line ${index + 1}: ${trimmedLine}`);
        }
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      exports
    };
    
  } catch (error) {
    errors.push(`Failed to validate widgets index: ${error}`);
    return {
      isValid: false,
      errors,
      warnings,
      exports
    };
  }
}

/**
 * Generates updated widgets index file content
 */
export function generateWidgetsIndexContent(widgetNames: string[]): string {
  const lines: string[] = [];
  
  // Add header comment
  lines.push('// Widget Components');
  lines.push('// Self-contained business logic components that consume Zustand stores');
  lines.push('// Examples: ZenTimerWidget, TasksWidget, BrainDumpWidget');
  lines.push('');
  
  // Add exports for each widget
  widgetNames.forEach(widgetName => {
    lines.push(`export { default as ${widgetName} } from "./${widgetName}";`);
  });
  
  lines.push('');
  
  return lines.join('\n');
}