/**
 * **Feature: polaris-tech-migration, Property 5: ClassName merging in reusable components**
 * **Validates: Requirements 5.4**
 * 
 * Property-based test to verify that reusable UI components use the cn() utility
 * for className merging to allow proper className overrides.
 */

import * as fc from 'fast-check'
import * as fs from 'fs'
import * as path from 'path'
import { glob } from 'glob'

// Helper function to find all UI component files (reusable components)
function findUIComponentFiles(dir: string): string[] {
  const pattern = path.join(dir, 'components/ui/**/*.{tsx,jsx}').replace(/\\/g, '/')
  return glob.sync(pattern, {
    ignore: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/__tests__/**',
      '**/*.test.tsx',
      '**/*.test.jsx',
      '**/*.spec.tsx',
      '**/*.spec.jsx',
      '**/index.ts',
      '**/index.tsx'
    ]
  })
}

// Helper function to check if component accepts className prop
function acceptsClassNameProp(content: string): boolean {
  // Check if className is in the props destructuring or props interface
  const hasClassNameInDestructuring = /{\s*[^}]*className[^}]*}/.test(content)
  const hasClassNameInInterface = /className\?\s*:\s*string/.test(content)
  
  return hasClassNameInDestructuring || hasClassNameInInterface
}

// Helper function to check if component uses cn() utility for className merging
function usesCnUtility(content: string): boolean {
  // Check if cn() is imported
  const hasCnImport = /import\s*{[^}]*cn[^}]*}\s*from/.test(content)
  
  if (!hasCnImport) {
    return false
  }
  
  // Check if cn() is used in className assignment
  const usesCnInClassName = /className\s*=\s*{?\s*cn\s*\(/.test(content)
  
  return usesCnInClassName
}

// Helper function to check if component properly merges className with default classes
function properlyMergesClassName(content: string): boolean {
  // Look for cn() usage that includes className prop
  const cnUsageMatch = content.match(/cn\s*\([^)]+\)/g)
  
  if (!cnUsageMatch) {
    return false
  }
  
  // Check if any cn() usage includes className as a parameter
  return cnUsageMatch.some(cnUsage => {
    // Remove whitespace and newlines for easier matching
    const cleanUsage = cnUsage.replace(/\s+/g, ' ')
    
    // Check if className appears as a parameter in cn()
    return /,\s*className\s*\)/.test(cleanUsage) || 
           /\(\s*className\s*\)/.test(cleanUsage) ||
           /,\s*className\s*,/.test(cleanUsage)
  })
}

// Helper function to check if component has proper className prop forwarding
function hasProperClassNameForwarding(content: string): boolean {
  if (!acceptsClassNameProp(content)) {
    return true // If component doesn't accept className, it's fine
  }
  
  // Check if className is used in the component
  const usesClassName = /className\s*[=:]/.test(content)
  
  if (!usesClassName) {
    return false // Component accepts className but doesn't use it
  }
  
  // Check if cn() utility is used for merging
  return usesCnUtility(content)
}

// Helper function to extract cn() usage from component
function extractCnUsage(content: string): string[] {
  const cnPattern = /cn\s*\([^)]+\)/g
  const matches = content.match(cnPattern) || []
  return matches
}

describe('ClassName Merging in Reusable Components', () => {
  test('Property 5: UI components that accept className should use cn() utility', () => {
    const uiComponentFiles = findUIComponentFiles('src')
    
    // If no UI component files found, test passes (empty project case)
    if (uiComponentFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...uiComponentFiles),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8')
          const hasProperForwarding = hasProperClassNameForwarding(content)
          
          if (!hasProperForwarding) {
            console.log(`Component ${filePath} accepts className but doesn't use cn() utility properly`)
          }
          
          return hasProperForwarding
        }
      ),
      { numRuns: Math.max(1, uiComponentFiles.length) }
    )
  })

  test('Property 5: Components using cn() should properly merge default classes with className prop', () => {
    const uiComponentFiles = findUIComponentFiles('src')
    
    // If no UI component files found, test passes (empty project case)
    if (uiComponentFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...uiComponentFiles),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8')
          
          // Only test components that use cn()
          if (!usesCnUtility(content)) {
            return true // Component doesn't use cn(), skip this test
          }
          
          const properlyMerges = properlyMergesClassName(content)
          
          if (!properlyMerges) {
            console.log(`Component ${filePath} uses cn() but doesn't properly merge className with defaults`)
            console.log('cn() usage:', extractCnUsage(content))
          }
          
          return properlyMerges
        }
      ),
      { numRuns: Math.max(1, uiComponentFiles.length) }
    )
  })

  test('Property 5: All UI components should import cn utility if they use it', () => {
    const uiComponentFiles = findUIComponentFiles('src')
    
    // If no UI component files found, test passes (empty project case)
    if (uiComponentFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...uiComponentFiles),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8')
          
          // Check if cn() is used in the component
          const usesCn = /\bcn\s*\(/.test(content)
          
          if (!usesCn) {
            return true // Component doesn't use cn(), which is fine
          }
          
          // If cn() is used, it should be imported
          const hasCnImport = /import\s*{[^}]*cn[^}]*}\s*from\s*['"]@\/lib\/utils['"]/.test(content)
          
          if (!hasCnImport) {
            console.log(`Component ${filePath} uses cn() but doesn't import it from @/lib/utils`)
          }
          
          return hasCnImport
        }
      ),
      { numRuns: Math.max(1, uiComponentFiles.length) }
    )
  })

  test('Property 5: Components should not use string concatenation for className merging', () => {
    const uiComponentFiles = findUIComponentFiles('src')
    
    // If no UI component files found, test passes (empty project case)
    if (uiComponentFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...uiComponentFiles),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8')
          
          // Look for string concatenation patterns in className
          const hasStringConcatenation = /className\s*=\s*{?\s*['"`][^'"`]*['"`]\s*\+\s*/.test(content) ||
                                       /className\s*=\s*{?\s*\$\{[^}]*\}/.test(content) ||
                                       /className\s*=\s*{?\s*`[^`]*\$\{[^}]*\}[^`]*`/.test(content)
          
          if (hasStringConcatenation) {
            console.log(`Component ${filePath} uses string concatenation for className instead of cn() utility`)
          }
          
          return !hasStringConcatenation
        }
      ),
      { numRuns: Math.max(1, uiComponentFiles.length) }
    )
  })
})