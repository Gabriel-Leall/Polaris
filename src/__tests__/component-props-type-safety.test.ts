/**
 * **Feature: polaris-tech-migration, Property 3: Component props type safety**
 * **Validates: Requirements 5.3**
 * 
 * Property-based test to verify that all components have proper TypeScript interfaces
 * for their props and no 'any' types are used in component definitions.
 */

import * as fc from 'fast-check'
import * as fs from 'fs'
import * as path from 'path'
import { glob } from 'glob'

// Helper function to find all component files
function findComponentFiles(dir: string): string[] {
  const pattern = path.join(dir, '**/*.{tsx,jsx}').replace(/\\/g, '/')
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
      '**/*.spec.jsx'
    ]
  })
}

// Helper function to check if a component has proper TypeScript interface for props
function hasProperPropsInterface(content: string): boolean {
  // Remove comments and strings to avoid false positives
  const cleanContent = content
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/"[^"]*"/g, '""') // Remove double-quoted strings
    .replace(/'[^']*'/g, "''") // Remove single-quoted strings
    .replace(/`[^`]*`/g, '``') // Remove template literals

  // Check for React component patterns
  const hasReactComponent = /export\s+(default\s+)?(function|const)\s+\w+/.test(cleanContent) ||
                           /React\.forwardRef/.test(cleanContent) ||
                           /forwardRef/.test(cleanContent)

  if (!hasReactComponent) {
    return true // Not a React component file
  }

  // Check if component has no props (simple component)
  const isSimpleComponent = /export\s+default\s+function\s+\w+\(\s*\)\s*{/.test(cleanContent)
  if (isSimpleComponent) {
    return true // Simple component with no props is fine
  }

  // Check for proper props interface patterns
  const hasPropsInterface = /interface\s+\w*Props\s*{/.test(cleanContent) ||
                           /type\s+\w*Props\s*=/.test(cleanContent) ||
                           /extends\s+React\.\w+HTMLAttributes/.test(cleanContent) ||
                           /extends\s+React\.ComponentPropsWithoutRef/.test(cleanContent) ||
                           /extends\s+React\.HTMLAttributes/.test(cleanContent)

  // Check if component accepts props parameter with proper typing
  const hasTypedPropsParam = /\(\s*{\s*[^}]*}\s*:\s*\w*Props/.test(cleanContent) ||
                            /\(\s*props\s*:\s*\w*Props/.test(cleanContent) ||
                            /forwardRef<[\s\S]*?,[\s\S]*?\w*Props[\s\S]*?>/.test(cleanContent)

  // If using forwardRef, it must have proper interface
  if (/forwardRef/.test(cleanContent)) {
    return hasPropsInterface && hasTypedPropsParam
  }

  // For regular components, if they accept props, they must have proper interface
  const acceptsProps = /\(\s*{\s*[^}]*}/.test(cleanContent) || /\(\s*props/.test(cleanContent)
  if (acceptsProps) {
    return hasPropsInterface && hasTypedPropsParam
  }

  return true // Component doesn't accept props, which is fine
}

// Helper function to check for 'any' types in component props
function hasAnyTypesInProps(content: string): boolean {
  // Remove comments and strings to avoid false positives
  const cleanContent = content
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/"[^"]*"/g, '""') // Remove double-quoted strings
    .replace(/'[^']*'/g, "''") // Remove single-quoted strings
    .replace(/`[^`]*`/g, '``') // Remove template literals

  // Look for 'any' type usage in props interfaces
  const propsInterfaceMatch = cleanContent.match(/interface\s+\w*Props\s*{[^}]*}/g)
  const propsTypeMatch = cleanContent.match(/type\s+\w*Props\s*=\s*{[^}]*}/g)
  
  const propsDefinitions = [...(propsInterfaceMatch || []), ...(propsTypeMatch || [])]
  
  if (propsDefinitions.length === 0) {
    return false // No props definitions found
  }

  // Check for 'any' types in props definitions
  const anyPatterns = [
    /:\s*any\b/g, // : any
    /<any>/g, // <any>
    /\bany\[\]/g, // any[]
    /Array<any>/g, // Array<any>
  ]

  return propsDefinitions.some(propsDef => 
    anyPatterns.some(pattern => pattern.test(propsDef))
  )
}

// Helper function to check if component uses React.forwardRef properly
function usesForwardRefProperly(content: string): boolean {
  const hasForwardRef = /React\.forwardRef|forwardRef/.test(content)
  
  if (!hasForwardRef) {
    return true // Not using forwardRef, which is fine
  }

  // If using forwardRef, check if it has proper type parameters (handle multiline)
  const hasProperForwardRefTypes = /forwardRef<[\s\S]*?,[\s\S]*?\w*Props[\s\S]*?>/.test(content) ||
                                  /React\.forwardRef<[\s\S]*?,[\s\S]*?\w*Props[\s\S]*?>/.test(content)

  return hasProperForwardRefTypes
}

// Helper function to check if component has proper displayName when using forwardRef
function hasDisplayNameWhenNeeded(content: string): boolean {
  const hasForwardRef = /React\.forwardRef|forwardRef/.test(content)
  
  if (!hasForwardRef) {
    return true // Not using forwardRef, displayName not required
  }

  // Check if displayName is set
  const hasDisplayName = /\.displayName\s*=/.test(content)
  
  return hasDisplayName
}

describe('Component Props Type Safety', () => {
  test('Property 3: All components should have proper TypeScript interfaces for props', () => {
    const componentFiles = findComponentFiles('src/components')
    
    // If no component files found, test passes (empty project case)
    if (componentFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...componentFiles),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8')
          const hasProperInterface = hasProperPropsInterface(content)
          
          if (!hasProperInterface) {
            console.log(`Component ${filePath} does not have proper props interface`)
          }
          
          return hasProperInterface
        }
      ),
      { numRuns: Math.max(1, componentFiles.length) }
    )
  })

  test('Property 3: Component props should not use any types', () => {
    const componentFiles = findComponentFiles('src/components')
    
    // If no component files found, test passes (empty project case)
    if (componentFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...componentFiles),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8')
          const hasAnyTypes = hasAnyTypesInProps(content)
          
          if (hasAnyTypes) {
            console.log(`Component ${filePath} uses 'any' types in props`)
          }
          
          return !hasAnyTypes
        }
      ),
      { numRuns: Math.max(1, componentFiles.length) }
    )
  })

  test('Property 3: Components using forwardRef should have proper type parameters', () => {
    const componentFiles = findComponentFiles('src/components')
    
    // If no component files found, test passes (empty project case)
    if (componentFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...componentFiles),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8')
          const usesForwardRefCorrectly = usesForwardRefProperly(content)
          
          if (!usesForwardRefCorrectly) {
            console.log(`Component ${filePath} uses forwardRef without proper type parameters`)
          }
          
          return usesForwardRefCorrectly
        }
      ),
      { numRuns: Math.max(1, componentFiles.length) }
    )
  })

  test('Property 3: Components using forwardRef should have displayName set', () => {
    const componentFiles = findComponentFiles('src/components')
    
    // If no component files found, test passes (empty project case)
    if (componentFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...componentFiles),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8')
          const hasDisplayName = hasDisplayNameWhenNeeded(content)
          
          if (!hasDisplayName) {
            console.log(`Component ${filePath} uses forwardRef but missing displayName`)
          }
          
          return hasDisplayName
        }
      ),
      { numRuns: Math.max(1, componentFiles.length) }
    )
  })
})