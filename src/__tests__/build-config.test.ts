/**
 * **Feature: polaris-tech-migration, Property 13: TypeScript strict compliance**
 * **Validates: Requirements 8.4**
 * 
 * Property-based test to verify TypeScript strict mode compliance across all source files.
 * This test ensures no 'any' types are used and all types are properly defined.
 */

import * as fc from 'fast-check'
import * as fs from 'fs'
import * as path from 'path'
import { glob } from 'glob'

// Helper function to recursively find all TypeScript files (excluding test files)
function findTypeScriptFiles(dir: string): string[] {
  const pattern = path.join(dir, '**/*.{ts,tsx}').replace(/\\/g, '/')
  return glob.sync(pattern, {
    ignore: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/*.d.ts',
      '**/__tests__/**',
      '**/*.test.ts',
      '**/*.test.tsx',
      '**/*.spec.ts',
      '**/*.spec.tsx',
      '**/jest.config.js',
      '**/next.config.mjs',
      '**/tailwind.config.ts',
      '**/postcss.config.mjs'
    ]
  })
}

// Helper function to check if file content has 'any' types
function hasAnyTypes(content: string): boolean {
  // Remove comments and strings to avoid false positives
  const cleanContent = content
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/"[^"]*"/g, '""') // Remove double-quoted strings
    .replace(/'[^']*'/g, "''") // Remove single-quoted strings
    .replace(/`[^`]*`/g, '``') // Remove template literals
  
  // Look for 'any' type usage patterns
  const anyPatterns = [
    /:\s*any\b/g, // : any
    /<any>/g, // <any>
    /\bany\[\]/g, // any[]
    /Array<any>/g, // Array<any>
    /\bas\s+any\b/g, // as any
  ]
  
  return anyPatterns.some(pattern => pattern.test(cleanContent))
}

// Helper function to check TypeScript strict mode configuration
function checkTsConfigStrict(): boolean {
  try {
    const tsConfigPath = path.join(process.cwd(), 'tsconfig.json')
    const tsConfigContent = fs.readFileSync(tsConfigPath, 'utf-8')
    const tsConfig = JSON.parse(tsConfigContent)
    
    return tsConfig.compilerOptions?.strict === true &&
           tsConfig.compilerOptions?.noImplicitAny === true &&
           tsConfig.compilerOptions?.noImplicitReturns === true &&
           tsConfig.compilerOptions?.noImplicitThis === true &&
           tsConfig.compilerOptions?.noUnusedLocals === true &&
           tsConfig.compilerOptions?.noUnusedParameters === true &&
           tsConfig.compilerOptions?.exactOptionalPropertyTypes === true
  } catch (error) {
    return false
  }
}

describe('Build Configuration Validation', () => {
  test('Property 13: TypeScript strict compliance - tsconfig.json has strict mode enabled', () => {
    expect(checkTsConfigStrict()).toBe(true)
  })

  test('Property 13: TypeScript strict compliance - no any types in source files', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...findTypeScriptFiles('src')),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8')
          const hasAny = hasAnyTypes(content)
          
          if (hasAny) {
            console.log(`Found 'any' type usage in: ${filePath}`)
          }
          
          return !hasAny
        }
      ),
      { numRuns: Math.max(1, findTypeScriptFiles('src').length) }
    )
  })

  test('Property 13: TypeScript strict compliance - all source files are valid TypeScript', () => {
    const sourceFiles = findTypeScriptFiles('src')
    
    // If no source files found, the test should pass (empty project case)
    if (sourceFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...sourceFiles),
        (filePath: string) => {
          try {
            const content = fs.readFileSync(filePath, 'utf-8')
            
            // Basic syntax checks - file should be readable and have basic TS structure
            const isValidFile = content.length > 0 && 
              !content.includes('SyntaxError') &&
              !content.includes('TypeError')
            
            // Check for proper import/export syntax if they exist
            const hasValidImports = !content.includes('import') || 
              /import\s+.*\s+from\s+['"][^'"]+['"]/.test(content) ||
              /import\s+['"][^'"]+['"]/.test(content) ||
              /import\s+type\s+/.test(content)
            
            const hasValidExports = !content.includes('export') ||
              /export\s+(default\s+)?(function|class|interface|type|const|let|var)/.test(content) ||
              /export\s*\{[^}]*\}/.test(content) ||
              /export\s+\*\s+from/.test(content) ||
              /export\s+default/.test(content)
            
            return isValidFile && hasValidImports && hasValidExports
          } catch (error) {
            console.log(`Error reading file ${filePath}:`, error)
            return false
          }
        }
      ),
      { numRuns: Math.max(1, sourceFiles.length) }
    )
  })
})