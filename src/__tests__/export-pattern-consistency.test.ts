/**
 * **Feature: polaris-tech-migration, Property 6: Export pattern consistency**
 * **Validates: Requirements 5.5**
 * 
 * Property-based test to verify that utilities use named exports and components use default exports,
 * following consistent export patterns across the codebase.
 */

import * as fc from 'fast-check'
import * as fs from 'fs'
import * as path from 'path'
import { glob } from 'glob'

// Helper function to find all TypeScript/React files
function findSourceFiles(dir: string): string[] {
  const pattern = path.join(dir, '**/*.{ts,tsx}').replace(/\\/g, '/')
  return glob.sync(pattern, {
    ignore: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/__tests__/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/*.d.ts',
      '**/next.config.mjs',
      '**/tailwind.config.ts',
      '**/postcss.config.mjs'
    ]
  })
}

// Helper function to check if file is a React component
function isReactComponent(content: string): boolean {
  // Check for React component patterns
  const hasReactImport = /import\s+.*React/.test(content) || 
                        /import\s+.*from\s+['"]react['"]/.test(content)
  
  const hasJSXReturn = /return\s*\(?\s*</.test(content) ||
                      /return\s+</.test(content)
  
  const hasComponentFunction = /export\s+(default\s+)?function\s+[A-Z]/.test(content) ||
                              /const\s+[A-Z][a-zA-Z]*\s*=.*=>\s*\(?\s*</.test(content) ||
                              /React\.forwardRef/.test(content) ||
                              /forwardRef/.test(content)
  
  return (hasReactImport || hasJSXReturn) && hasComponentFunction
}

// Helper function to check if file contains utility functions
function isUtilityFile(content: string, filePath: string): boolean {
  // Check file path patterns for utilities
  const isInUtilsDir = /\/lib\/|\/utils\/|\/helpers\//.test(filePath)
  const isUtilsFile = /utils?\.ts$|helpers?\.ts$|constants?\.ts$/.test(filePath)
  
  // Check content patterns for utilities
  const hasUtilityExports = /export\s+(const|function|class)\s+[a-z]/.test(content)
  const hasNoJSX = !/return\s*\(?\s*</.test(content) && !/return\s+</.test(content)
  
  return (isInUtilsDir || isUtilsFile || hasUtilityExports) && hasNoJSX
}

// Helper function to check if component has default export
function hasDefaultExport(content: string): boolean {
  return /export\s+default/.test(content)
}

// Helper function to check if component has named export for the same component
function hasNamedExportForComponent(content: string): boolean {
  // Look for pattern like: export { ComponentName } or export default ComponentName; export { ComponentName }
  const defaultExportMatch = content.match(/export\s+default\s+(\w+)/)
  if (!defaultExportMatch) {
    return false
  }
  
  const componentName = defaultExportMatch[1]
  const namedExportPattern = new RegExp(`export\\s*{[^}]*\\b${componentName}\\b[^}]*}`)
  
  return namedExportPattern.test(content)
}

// Helper function to check if utility file uses named exports
function hasNamedExports(content: string): boolean {
  return /export\s+(const|function|class|interface|type)\s+/.test(content) ||
         /export\s*{[^}]+}/.test(content) ||
         /export\s+\*\s+from/.test(content)
}

// Helper function to check if utility file avoids default exports
function avoidsDefaultExport(content: string): boolean {
  return !/export\s+default/.test(content)
}

// Helper function to get file type for logging
function getFileType(content: string, filePath: string): string {
  if (isReactComponent(content)) {
    return 'React Component'
  } else if (isUtilityFile(content, filePath)) {
    return 'Utility File'
  } else {
    return 'Other'
  }
}

describe('Export Pattern Consistency', () => {
  test('Property 6: React components should use default exports', () => {
    const sourceFiles = findSourceFiles('src')
    
    // If no source files found, test passes (empty project case)
    if (sourceFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    // Filter to only React component files
    const componentFiles = sourceFiles.filter(filePath => {
      const content = fs.readFileSync(filePath, 'utf-8')
      return isReactComponent(content)
    })
    
    if (componentFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...componentFiles),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8')
          const hasDefault = hasDefaultExport(content)
          
          if (!hasDefault) {
            console.log(`React component ${filePath} should use default export`)
          }
          
          return hasDefault
        }
      ),
      { numRuns: Math.max(1, componentFiles.length) }
    )
  })

  test('Property 6: React components should also provide named exports for consistency', () => {
    const sourceFiles = findSourceFiles('src')
    
    // If no source files found, test passes (empty project case)
    if (sourceFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    // Filter to only React component files, excluding Next.js special files
    const componentFiles = sourceFiles.filter(filePath => {
      const content = fs.readFileSync(filePath, 'utf-8')
      const isComponent = isReactComponent(content)
      
      // Exclude Next.js special files that should only have default exports
      const isNextJsSpecialFile = (filePath.includes('/app/') || filePath.includes('\\app\\')) && 
        (filePath.endsWith('layout.tsx') || 
         filePath.endsWith('page.tsx') || 
         filePath.endsWith('loading.tsx') || 
         filePath.endsWith('error.tsx') || 
         filePath.endsWith('not-found.tsx') || 
         filePath.endsWith('global-error.tsx'))
      
      return isComponent && !isNextJsSpecialFile
    })
    
    if (componentFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...componentFiles),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8')
          const hasNamed = hasNamedExportForComponent(content)
          
          if (!hasNamed) {
            console.log(`React component ${filePath} should also provide named export for consistency`)
          }
          
          return hasNamed
        }
      ),
      { numRuns: Math.max(1, componentFiles.length) }
    )
  })

  test('Property 6: Utility files should use named exports', () => {
    const sourceFiles = findSourceFiles('src')
    
    // If no source files found, test passes (empty project case)
    if (sourceFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    // Filter to only utility files
    const utilityFiles = sourceFiles.filter(filePath => {
      const content = fs.readFileSync(filePath, 'utf-8')
      return isUtilityFile(content, filePath)
    })
    
    if (utilityFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...utilityFiles),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8')
          const hasNamed = hasNamedExports(content)
          
          if (!hasNamed) {
            console.log(`Utility file ${filePath} should use named exports`)
          }
          
          return hasNamed
        }
      ),
      { numRuns: Math.max(1, utilityFiles.length) }
    )
  })

  test('Property 6: Utility files should avoid default exports', () => {
    const sourceFiles = findSourceFiles('src')
    
    // If no source files found, test passes (empty project case)
    if (sourceFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    // Filter to only utility files
    const utilityFiles = sourceFiles.filter(filePath => {
      const content = fs.readFileSync(filePath, 'utf-8')
      return isUtilityFile(content, filePath)
    })
    
    if (utilityFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...utilityFiles),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8')
          const avoidsDefault = avoidsDefaultExport(content)
          
          if (!avoidsDefault) {
            console.log(`Utility file ${filePath} should avoid default exports and use named exports instead`)
          }
          
          return avoidsDefault
        }
      ),
      { numRuns: Math.max(1, utilityFiles.length) }
    )
  })

  test('Property 6: Index files should use re-exports for consistency', () => {
    const sourceFiles = findSourceFiles('src')
    
    // Filter to only index files
    const indexFiles = sourceFiles.filter(filePath => 
      /index\.(ts|tsx)$/.test(filePath)
    )
    
    if (indexFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...indexFiles),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8')
          
          // Index files should primarily use re-exports
          const hasReExports = /export\s+\*\s+from/.test(content) ||
                              /export\s*{[^}]+}\s*from/.test(content)
          
          // Allow index files to have their own exports too
          const hasOwnExports = /export\s+(const|function|class|interface|type)\s+/.test(content)
          
          const isValidIndexFile = hasReExports || hasOwnExports
          
          if (!isValidIndexFile) {
            console.log(`Index file ${filePath} should use re-exports or have its own exports`)
          }
          
          return isValidIndexFile
        }
      ),
      { numRuns: Math.max(1, indexFiles.length) }
    )
  })
})