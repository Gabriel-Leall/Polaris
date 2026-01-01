/**
 * Widget Migration Utilities
 * Provides functions for migrating widgets from single files to folder structure
 */

import * as fs from 'fs';
import * as path from 'path';
import { 
  WIDGETS_BASE_PATH, 
  MigrationPlan, 
  ComponentExtraction, 
  HookExtraction,
  UtilExtraction 
} from './widget-organization-utils';

/**
 * Extracts a component from the main widget file
 */
export function extractComponent(
  sourceContent: string,
  extraction: ComponentExtraction
): string {
  const lines = sourceContent.split('\n');
  const componentLines = lines.slice(extraction.startLine, extraction.endLine + 1);
  
  // Generate imports based on dependencies
  const imports = generateImportsForComponent(extraction.dependencies);
  
  return `${imports}\n\n${componentLines.join('\n')}\n\nexport default ${extraction.name};\n`;
}

/**
 * Extracts a custom hook from the main widget file
 */
export function extractHook(
  sourceContent: string,
  extraction: HookExtraction
): string {
  const lines = sourceContent.split('\n');
  const hookLines = lines.slice(extraction.startLine, extraction.endLine + 1);
  
  // Generate imports based on dependencies
  const imports = generateImportsForHook(extraction.dependencies);
  
  return `${imports}\n\n${hookLines.join('\n')}\n`;
}

/**
 * Extracts utility functions from the main widget file
 */
export function extractUtil(
  sourceContent: string,
  extraction: UtilExtraction
): string {
  const lines = sourceContent.split('\n');
  const utilLines = lines.slice(extraction.startLine, extraction.endLine + 1);
  
  // Generate imports based on dependencies
  const imports = generateImportsForUtil(extraction.dependencies);
  
  return `${imports}\n\n${utilLines.join('\n')}\n`;
}

/**
 * Generates import statements for extracted components
 */
function generateImportsForComponent(dependencies: string[]): string {
  const imports: string[] = [];
  
  // Common React imports for components
  imports.push("import React from 'react';");
  
  // Add other dependencies as needed
  dependencies.forEach(dep => {
    if (dep.startsWith('@/')) {
      imports.push(`import { ${dep.split('/').pop()} } from '${dep}';`);
    }
  });
  
  return imports.join('\n');
}

/**
 * Generates import statements for extracted hooks
 */
function generateImportsForHook(dependencies: string[]): string {
  const imports: string[] = [];
  
  // Common React imports for hooks
  imports.push("import { useState, useEffect, useCallback } from 'react';");
  
  // Add other dependencies as needed
  dependencies.forEach(dep => {
    if (dep.startsWith('@/')) {
      imports.push(`import { ${dep.split('/').pop()} } from '${dep}';`);
    }
  });
  
  return imports.join('\n');
}

/**
 * Generates import statements for extracted utilities
 */
function generateImportsForUtil(dependencies: string[]): string {
  const imports: string[] = [];
  
  // Add dependencies as needed
  dependencies.forEach(dep => {
    if (dep.startsWith('@/')) {
      imports.push(`import { ${dep.split('/').pop()} } from '${dep}';`);
    }
  });
  
  return imports.join('\n');
}

/**
 * Creates the main component file after extraction
 */
export function createMainComponentFile(
  originalContent: string,
  migrationPlan: MigrationPlan
): string {
  let content = originalContent;
  
  // Remove extracted components, hooks, and utils
  // This is a simplified version - in practice, you'd need AST manipulation
  
  // Add imports for extracted items
  const imports: string[] = [];
  
  migrationPlan.extractedComponents.forEach(comp => {
    imports.push(`import ${comp.name} from './components/${comp.name}';`);
  });
  
  migrationPlan.extractedHooks.forEach(hook => {
    imports.push(`import { ${hook.name} } from './hooks/${hook.name}';`);
  });
  
  migrationPlan.extractedUtils.forEach(util => {
    imports.push(`import { ${util.name} } from './utils/${util.name}';`);
  });
  
  // Add imports at the top of the file
  const lines = content.split('\n');
  const importEndIndex = lines.findIndex(line => !line.startsWith('import') && !line.startsWith('//') && line.trim() !== '');
  
  lines.splice(importEndIndex, 0, ...imports);
  
  return lines.join('\n');
}

/**
 * Creates the index.ts file for the widget folder
 */
export function createIndexFile(widgetName: string, hasTypes: boolean = true): string {
  const exports: string[] = [];
  
  // Main component export
  exports.push(`export { default } from './${widgetName}';`);
  
  // Types export if types file exists
  if (hasTypes) {
    exports.push(`export type { ${widgetName}Props } from './types';`);
  }
  
  return exports.join('\n') + '\n';
}

/**
 * Creates the types.ts file for the widget
 */
export function createTypesFile(widgetName: string, originalContent: string): string {
  // Extract interface definitions from original content
  const interfaceRegex = /interface\s+(\w+)\s*{[^}]*}/g;
  const typeRegex = /type\s+(\w+)\s*=\s*[^;]+;/g;
  
  const interfaces: string[] = [];
  const types: string[] = [];
  
  let match;
  
  // Extract interfaces
  while ((match = interfaceRegex.exec(originalContent)) !== null) {
    interfaces.push(match[0]);
  }
  
  // Extract type definitions
  while ((match = typeRegex.exec(originalContent)) !== null) {
    types.push(match[0]);
  }
  
  const content: string[] = [];
  
  if (interfaces.length > 0) {
    content.push('// Interfaces');
    content.push(...interfaces);
    content.push('');
  }
  
  if (types.length > 0) {
    content.push('// Types');
    content.push(...types);
    content.push('');
  }
  
  // Add main component props interface if not found
  const hasMainProps = interfaces.some(iface => iface.includes(`${widgetName}Props`));
  if (!hasMainProps) {
    content.push(`export interface ${widgetName}Props {`);
    content.push('  className?: string;');
    content.push('}');
  }
  
  return content.join('\n') + '\n';
}

/**
 * Performs the complete migration of a widget to folder structure
 */
export async function migrateWidgetToFolder(migrationPlan: MigrationPlan): Promise<{
  success: boolean;
  createdFiles: string[];
  errors: string[];
}> {
  const createdFiles: string[] = [];
  const errors: string[] = [];
  
  try {
    const { widgetName, currentFile } = migrationPlan;
    const originalContent = fs.readFileSync(currentFile, 'utf-8');
    const widgetFolderPath = path.join(WIDGETS_BASE_PATH, widgetName);
    
    // Create widget folder
    if (!fs.existsSync(widgetFolderPath)) {
      fs.mkdirSync(widgetFolderPath, { recursive: true });
    }
    
    // Create subdirectories
    const subdirs = ['components', 'hooks', 'utils'];
    subdirs.forEach(subdir => {
      const subdirPath = path.join(widgetFolderPath, subdir);
      if (!fs.existsSync(subdirPath)) {
        fs.mkdirSync(subdirPath, { recursive: true });
      }
    });
    
    // Extract and create component files
    for (const extraction of migrationPlan.extractedComponents) {
      const componentContent = extractComponent(originalContent, extraction);
      const componentPath = path.join(widgetFolderPath, extraction.targetPath);
      fs.writeFileSync(componentPath, componentContent);
      createdFiles.push(componentPath);
    }
    
    // Extract and create hook files
    for (const extraction of migrationPlan.extractedHooks) {
      const hookContent = extractHook(originalContent, extraction);
      const hookPath = path.join(widgetFolderPath, extraction.targetPath);
      fs.writeFileSync(hookPath, hookContent);
      createdFiles.push(hookPath);
    }
    
    // Extract and create util files
    for (const extraction of migrationPlan.extractedUtils) {
      const utilContent = extractUtil(originalContent, extraction);
      const utilPath = path.join(widgetFolderPath, extraction.targetPath);
      fs.writeFileSync(utilPath, utilContent);
      createdFiles.push(utilPath);
    }
    
    // Create main component file
    const mainComponentContent = createMainComponentFile(originalContent, migrationPlan);
    const mainComponentPath = path.join(widgetFolderPath, `${widgetName}.tsx`);
    fs.writeFileSync(mainComponentPath, mainComponentContent);
    createdFiles.push(mainComponentPath);
    
    // Create types file
    const typesContent = createTypesFile(widgetName, originalContent);
    const typesPath = path.join(widgetFolderPath, 'types.ts');
    fs.writeFileSync(typesPath, typesContent);
    createdFiles.push(typesPath);
    
    // Create index file
    const indexContent = createIndexFile(widgetName, true);
    const indexPath = path.join(widgetFolderPath, 'index.ts');
    fs.writeFileSync(indexPath, indexContent);
    createdFiles.push(indexPath);
    
    return {
      success: true,
      createdFiles,
      errors
    };
    
  } catch (error) {
    errors.push(`Migration failed: ${error}`);
    return {
      success: false,
      createdFiles,
      errors
    };
  }
}

/**
 * Validates that a migration was successful
 */
export function validateMigration(migrationPlan: MigrationPlan): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const { widgetName } = migrationPlan;
  const widgetFolderPath = path.join(WIDGETS_BASE_PATH, widgetName);
  
  // Check that widget folder exists
  if (!fs.existsSync(widgetFolderPath)) {
    errors.push(`Widget folder was not created: ${widgetFolderPath}`);
    return { isValid: false, errors, warnings };
  }
  
  // Check that index.ts exists
  const indexPath = path.join(widgetFolderPath, 'index.ts');
  if (!fs.existsSync(indexPath)) {
    errors.push(`Index file was not created: ${indexPath}`);
  }
  
  // Check that main component exists
  const mainComponentPath = path.join(widgetFolderPath, `${widgetName}.tsx`);
  if (!fs.existsSync(mainComponentPath)) {
    errors.push(`Main component file was not created: ${mainComponentPath}`);
  }
  
  // Check extracted files
  migrationPlan.extractedComponents.forEach(comp => {
    const compPath = path.join(widgetFolderPath, comp.targetPath);
    if (!fs.existsSync(compPath)) {
      errors.push(`Component file was not created: ${compPath}`);
    }
  });
  
  migrationPlan.extractedHooks.forEach(hook => {
    const hookPath = path.join(widgetFolderPath, hook.targetPath);
    if (!fs.existsSync(hookPath)) {
      errors.push(`Hook file was not created: ${hookPath}`);
    }
  });
  
  migrationPlan.extractedUtils.forEach(util => {
    const utilPath = path.join(widgetFolderPath, util.targetPath);
    if (!fs.existsSync(utilPath)) {
      errors.push(`Util file was not created: ${utilPath}`);
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Rollback a widget migration
 */
export function rollbackMigration(migrationPlan: MigrationPlan): {
  success: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  try {
    const { widgetName } = migrationPlan;
    const widgetFolderPath = path.join(WIDGETS_BASE_PATH, widgetName);
    
    // Remove widget folder and all its contents
    if (fs.existsSync(widgetFolderPath)) {
      fs.rmSync(widgetFolderPath, { recursive: true, force: true });
    }
    
    return {
      success: true,
      errors
    };
    
  } catch (error) {
    errors.push(`Rollback failed: ${error}`);
    return {
      success: false,
      errors
    };
  }
}