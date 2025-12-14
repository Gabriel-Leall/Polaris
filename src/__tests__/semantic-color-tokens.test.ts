/**
 * **Feature: polaris-tech-migration, Property 4: Semantic color token usage**
 * **Validates: Requirements 4.3**
 * 
 * Property-based test to verify that components use semantic color tokens
 * (bg-main, bg-card, primary, etc.) rather than raw hex values or arbitrary Tailwind colors.
 */

import * as fc from 'fast-check'
import * as fs from 'fs'
import * as path from 'path'
import { glob } from 'glob'

// Define the semantic color tokens from the Polaris design system
const SEMANTIC_COLOR_TOKENS = [
  // Background tokens
  'main',
  'card', 
  'sidebar',
  'input',
  
  // Accent tokens
  'primary',
  'primary-glow',
  'secondary',
  
  // Status tokens
  'status-interview',
  'status-applied',
  'status-rejected',
  'status-pending',
  
  // Text tokens
  'muted',
  'code',
  
  // Border tokens
  'glass'
]

// Raw hex colors that should be replaced with semantic tokens
const RAW_HEX_COLORS = [
  '#09090B', // bg-main
  '#121214', // bg-card
  '#0C0C0E', // bg-sidebar
  '#18181B', // bg-input
  '#6366F1', // primary
  '#818CF8', // primary-glow
  '#A1A1AA', // secondary
  '#3B82F6', // status-applied
  '#EF4444', // status-rejected
  '#EAB308', // status-pending
  '#FFFFFF', // text-primary
  '#71717A'  // text-code
]

// Arbitrary Tailwind colors that should be replaced with semantic tokens
const ARBITRARY_TAILWIND_COLORS = [
  'bg-zinc-900',
  'bg-zinc-800',
  'bg-zinc-700',
  'bg-gray-900',
  'bg-gray-800',
  'text-zinc-400',
  'text-zinc-500',
  'text-indigo-500',
  'border-zinc-800',
  'border-gray-800'
]

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

// Helper function to extract className strings from component content
function extractClassNames(content: string): string[] {
  const classNamePatterns = [
    /className\s*=\s*["']([^"']+)["']/g,
    /className\s*=\s*{[^}]*["']([^"']+)["'][^}]*}/g,
    /className\s*=\s*{`([^`]+)`}/g,
    /cn\s*\([^)]*["']([^"']+)["'][^)]*\)/g
  ]
  
  const classNames: string[] = []
  
  classNamePatterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(content)) !== null) {
      // Split by spaces to get individual classes
      const classes = match[1].split(/\s+/).filter(cls => cls.length > 0)
      classNames.push(...classes)
    }
  })
  
  return classNames
}

// Helper function to check if a className uses raw hex colors
function usesRawHexColors(className: string): boolean {
  return RAW_HEX_COLORS.some(hex => 
    className.includes(hex.toLowerCase()) || 
    className.includes(hex.toUpperCase())
  )
}

// Helper function to check if a className uses arbitrary Tailwind colors instead of semantic tokens
function usesArbitraryTailwindColors(className: string): boolean {
  return ARBITRARY_TAILWIND_COLORS.some(arbitraryColor => 
    className.includes(arbitraryColor)
  )
}

// Helper function to check if a color-related className uses semantic tokens
function usesSemanticColorTokens(className: string): boolean {
  // Check if it's a color-related class
  const colorPrefixes = ['bg-', 'text-', 'border-', 'from-', 'to-', 'via-']
  const isColorClass = colorPrefixes.some(prefix => className.startsWith(prefix))
  
  if (!isColorClass) {
    return true // Non-color classes are fine
  }
  
  // Check if it uses semantic tokens
  return SEMANTIC_COLOR_TOKENS.some(token => className.includes(token))
}

describe('Semantic Color Token Usage', () => {
  test('Property 4: Components should not use raw hex colors in classNames', () => {
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
          const classNames = extractClassNames(content)
          
          const violatingClasses = classNames.filter(usesRawHexColors)
          
          if (violatingClasses.length > 0) {
            console.log(`File ${filePath} uses raw hex colors in classes: ${violatingClasses.join(', ')}`)
          }
          
          return violatingClasses.length === 0
        }
      ),
      { numRuns: Math.max(1, componentFiles.length) }
    )
  })

  test('Property 4: Components should use semantic tokens instead of arbitrary Tailwind colors', () => {
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
          const classNames = extractClassNames(content)
          
          const violatingClasses = classNames.filter(usesArbitraryTailwindColors)
          
          if (violatingClasses.length > 0) {
            console.log(`File ${filePath} uses arbitrary Tailwind colors instead of semantic tokens: ${violatingClasses.join(', ')}`)
          }
          
          return violatingClasses.length === 0
        }
      ),
      { numRuns: Math.max(1, componentFiles.length) }
    )
  })

  test('Property 4: Color-related classes should use semantic color tokens', () => {
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
          const classNames = extractClassNames(content)
          
          // Filter to only color-related classes
          const colorPrefixes = ['bg-', 'text-', 'border-', 'from-', 'to-', 'via-']
          const colorClasses = classNames.filter(className => 
            colorPrefixes.some(prefix => className.startsWith(prefix))
          )
          
          const nonSemanticClasses = colorClasses.filter(className => 
            !usesSemanticColorTokens(className) && 
            !className.includes('white/') && // Allow opacity variants like white/5
            !className.includes('black/') && // Allow opacity variants like black/10
            !className.includes('transparent') && // Allow transparent
            !className.includes('current') && // Allow currentColor
            !className.includes('inherit') && // Allow inherit
            !className.includes('text-white') && // Allow text-white as standard
            !className.includes('text-sm') && // Allow text sizing classes
            !className.includes('text-xs') && // Allow text sizing classes
            !className.includes('text-lg') && // Allow text sizing classes
            !className.includes('text-xl') && // Allow text sizing classes
            !className.includes('text-2xl') && // Allow text sizing classes
            !className.includes('text-3xl') && // Allow text sizing classes
            !className.includes('text-4xl') && // Allow text sizing classes
            !className.includes('text-5xl') && // Allow text sizing classes
            !className.includes('text-6xl') // Allow text sizing classes
          )
          
          if (nonSemanticClasses.length > 0) {
            console.log(`File ${filePath} uses non-semantic color classes: ${nonSemanticClasses.join(', ')}`)
          }
          
          return nonSemanticClasses.length === 0
        }
      ),
      { numRuns: Math.max(1, componentFiles.length) }
    )
  })

  test('Property 4: Tailwind config should define all required semantic color tokens', () => {
    const tailwindConfigPath = path.join(process.cwd(), 'tailwind.config.ts')
    
    try {
      const configContent = fs.readFileSync(tailwindConfigPath, 'utf-8')
      
      fc.assert(
        fc.property(
          fc.constantFrom(...SEMANTIC_COLOR_TOKENS),
          (token: string) => {
            const hasToken = configContent.includes(`'${token}'`) || 
                            configContent.includes(`"${token}"`) ||
                            configContent.includes(`${token}:`)
            
            if (!hasToken) {
              console.log(`Missing semantic color token in tailwind.config.ts: ${token}`)
            }
            
            return hasToken
          }
        ),
        { numRuns: SEMANTIC_COLOR_TOKENS.length }
      )
    } catch (error) {
      throw new Error(`Could not read tailwind.config.ts: ${error}`)
    }
  })
})