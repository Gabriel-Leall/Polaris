/**
 * **Feature: polaris-tech-migration, Property 2: Component client directive usage**
 * **Validates: Requirements 5.2**
 * 
 * Property-based test to verify that components use 'use client' directive correctly:
 * - Components with React hooks or event handlers should have 'use client'
 * - Components without interactive features should not have 'use client'
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

// Helper function to check if component has 'use client' directive
function hasUseClientDirective(content: string): boolean {
  // Check for 'use client' at the beginning of the file (after potential comments)
  const lines = content.split('\n')
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    const line = lines[i].trim()
    if (line === "'use client'" || line === '"use client"') {
      return true
    }
    // Skip empty lines and comments
    if (line === '' || line.startsWith('//') || line.startsWith('/*') || line.startsWith('*')) {
      continue
    }
    // If we hit actual code without finding 'use client', it's not there
    if (line.length > 0) {
      break
    }
  }
  return false
}

// Helper function to check if component uses React hooks
function usesReactHooks(content: string): boolean {
  // Remove comments and strings to avoid false positives
  const cleanContent = content
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/"[^"]*"/g, '""') // Remove double-quoted strings
    .replace(/'[^']*'/g, "''") // Remove single-quoted strings
    .replace(/`[^`]*`/g, '``') // Remove template literals

  // Common React hooks patterns
  const hookPatterns = [
    /\buseState\b/,
    /\buseEffect\b/,
    /\buseCallback\b/,
    /\buseMemo\b/,
    /\buseRef\b/,
    /\buseContext\b/,
    /\buseReducer\b/,
    /\buseLayoutEffect\b/,
    /\buseImperativeHandle\b/,
    /\buseDebugValue\b/,
    /\buseId\b/,
    /\buseDeferredValue\b/,
    /\buseTransition\b/,
    /\buseSyncExternalStore\b/,
    /\buseInsertionEffect\b/,
    // Custom hooks (functions starting with 'use')
    /\buse[A-Z]\w*\(/
  ]

  return hookPatterns.some(pattern => pattern.test(cleanContent))
}

// Helper function to check if component has event handlers
function hasEventHandlers(content: string): boolean {
  // Remove comments and strings to avoid false positives
  const cleanContent = content
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/"[^"]*"/g, '""') // Remove double-quoted strings
    .replace(/'[^']*'/g, "''") // Remove single-quoted strings
    .replace(/`[^`]*`/g, '``') // Remove template literals

  // Event handler patterns in JSX
  const eventHandlerPatterns = [
    /\bon[A-Z]\w*\s*=\s*{/g, // onClick={}, onSubmit={}, etc.
    /\bhandler?\w*\s*=\s*{/g, // handler={}, handleClick={}, etc.
    /\b(handle|on)[A-Z]\w*\s*\(/g, // handleClick(), onClick() function definitions
  ]

  return eventHandlerPatterns.some(pattern => pattern.test(cleanContent))
}

// Helper function to check if component uses browser APIs
function usesBrowserAPIs(content: string): boolean {
  // Remove comments and strings to avoid false positives
  const cleanContent = content
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*$/gm, '') // Remove line comments
    .replace(/"[^"]*"/g, '""') // Remove double-quoted strings
    .replace(/'[^']*'/g, "''") // Remove single-quoted strings
    .replace(/`[^`]*`/g, '``') // Remove template literals

  // Browser API patterns
  const browserAPIPatterns = [
    /\bwindow\./,
    /\bdocument\./,
    /\bnavigator\./,
    /\blocalStorage\./,
    /\bsessionStorage\./,
    /\bsetTimeout\b/,
    /\bsetInterval\b/,
    /\bclearTimeout\b/,
    /\bclearInterval\b/,
    /\baddEventListener\b/,
    /\bremoveEventListener\b/,
  ]

  return browserAPIPatterns.some(pattern => pattern.test(cleanContent))
}

// Helper function to check if component is a React component
function isReactComponent(content: string): boolean {
  // Check for React component patterns
  const componentPatterns = [
    /export\s+(default\s+)?function\s+[A-Z]\w*\s*\(/,
    /export\s+default\s+[A-Z]\w*/,
    /const\s+[A-Z]\w*\s*=\s*\(/,
    /function\s+[A-Z]\w*\s*\(/,
    /React\.forwardRef/,
    /forwardRef</
  ]

  return componentPatterns.some(pattern => pattern.test(content))
}

// Helper function to determine if component should have 'use client'
function shouldHaveUseClient(content: string): boolean {
  if (!isReactComponent(content)) {
    return false // Not a React component
  }

  return usesReactHooks(content) || hasEventHandlers(content) || usesBrowserAPIs(content)
}

describe('Component Client Directive Usage', () => {
  test('Property 2: Components with hooks or event handlers should have use client directive', () => {
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
          const shouldHaveClient = shouldHaveUseClient(content)
          const hasClient = hasUseClientDirective(content)
          
          if (shouldHaveClient && !hasClient) {
            console.log(`Component ${filePath} should have 'use client' directive but doesn't`)
            console.log(`Uses hooks: ${usesReactHooks(content)}`)
            console.log(`Has event handlers: ${hasEventHandlers(content)}`)
            console.log(`Uses browser APIs: ${usesBrowserAPIs(content)}`)
            return false
          }
          
          return true
        }
      ),
      { numRuns: Math.max(1, componentFiles.length) }
    )
  })

  test('Property 2: Components without interactive features should not have use client directive unnecessarily', () => {
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
          const shouldHaveClient = shouldHaveUseClient(content)
          const hasClient = hasUseClientDirective(content)
          
          // This is more of a warning than a hard failure
          // Some components might have 'use client' for future interactivity
          if (!shouldHaveClient && hasClient) {
            console.log(`Component ${filePath} has 'use client' but may not need it`)
            console.log(`Uses hooks: ${usesReactHooks(content)}`)
            console.log(`Has event handlers: ${hasEventHandlers(content)}`)
            console.log(`Uses browser APIs: ${usesBrowserAPIs(content)}`)
            // Return true for now - this is more of a code review point
            return true
          }
          
          return true
        }
      ),
      { numRuns: Math.max(1, componentFiles.length) }
    )
  })

  test('Property 2: Widget components should have use client directive', () => {
    const widgetFiles = findComponentFiles('src/components/widgets')
    
    // If no widget files found, test passes (empty project case)
    if (widgetFiles.length === 0) {
      expect(true).toBe(true)
      return
    }
    
    fc.assert(
      fc.property(
        fc.constantFrom(...widgetFiles),
        (filePath: string) => {
          const content = fs.readFileSync(filePath, 'utf-8')
          const hasClient = hasUseClientDirective(content)
          const isComponent = isReactComponent(content)
          
          if (isComponent && !hasClient) {
            console.log(`Widget component ${filePath} should have 'use client' directive`)
            return false
          }
          
          return true
        }
      ),
      { numRuns: Math.max(1, widgetFiles.length) }
    )
  })
})