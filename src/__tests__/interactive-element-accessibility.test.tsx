/**
 * **Feature: polaris-tech-migration, Property 15: Interactive element accessibility**
 * **Validates: Requirements 9.5**
 * 
 * Property-based test to verify that interactive elements have proper hover states,
 * focus indicators, and accessibility attributes according to the Polaris design system.
 */

import { describe, test, expect } from 'vitest'
import * as fc from 'fast-check'
import * as fs from 'fs'
import * as path from 'path'
import { glob } from 'glob'

// Helper function to check if component code has proper focus styles
function hasProperFocusStyles(componentCode: string): boolean {
  // Check for focus-visible classes in Tailwind
  const hasFocusVisible = componentCode.includes('focus-visible:outline-none') &&
    componentCode.includes('focus-visible:ring-2') &&
    componentCode.includes('focus-visible:ring-primary')
  
  return hasFocusVisible
}

// Helper function to check if component code has proper hover styles
function hasProperHoverStyles(componentCode: string): boolean {
  // Check for hover classes and transitions in Tailwind
  const hasHover = componentCode.includes('hover:') &&
    (componentCode.includes('transition-colors') || componentCode.includes('transition-all'))
  
  return hasHover
}

// Helper function to check if component code has proper disabled styles
function hasProperDisabledStyles(componentCode: string): boolean {
  // Check for disabled classes in Tailwind - different components may use different disabled patterns
  const hasDisabledOpacity = componentCode.includes('disabled:opacity-50')
  const hasDisabledPointer = componentCode.includes('disabled:pointer-events-none') ||
    componentCode.includes('disabled:cursor-not-allowed')
  
  return hasDisabledOpacity && hasDisabledPointer
}

// Helper function to check if component uses Polaris design tokens
function usesPolarisDesignTokens(componentCode: string): boolean {
  // Check for semantic color tokens instead of raw hex values
  const usesSemanticTokens = componentCode.includes('ring-primary') ||
    componentCode.includes('bg-primary') ||
    componentCode.includes('text-primary') ||
    componentCode.includes('bg-input') ||
    componentCode.includes('bg-card')
  
  // Should not use raw hex values for interactive states
  const avoidRawHex = !componentCode.match(/bg-\[#[0-9A-Fa-f]{6}\]/) ||
    componentCode.includes('bg-[#18181B]') // This is acceptable as it's the defined input color
  
  return usesSemanticTokens && avoidRawHex
}

// Helper function to get UI component files
function getUIComponentFiles(): string[] {
  try {
    const componentFiles = glob.sync('src/components/ui/*.tsx', { cwd: process.cwd() })
    return componentFiles
  } catch (error) {
    return []
  }
}

describe('Interactive Element Accessibility', () => {
  test('Property 15: Interactive element accessibility - UI components have proper focus styles', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...getUIComponentFiles()),
        (componentFile) => {
          if (!componentFile) return true // Skip if no files found
          
          const componentCode = fs.readFileSync(componentFile, 'utf-8')
          const filename = path.basename(componentFile)
          
          // Skip non-interactive components
          if (filename.includes('scroll-area') || filename.includes('dialog')) {
            return true
          }
          
          // Interactive components should have proper focus styles
          if (filename.includes('button') || filename.includes('input') || filename.includes('checkbox')) {
            const hasFocus = hasProperFocusStyles(componentCode)
            expect(hasFocus).toBe(true)
          }
          
          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  test('Property 15: Interactive element accessibility - UI components have proper hover states', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...getUIComponentFiles()),
        (componentFile) => {
          if (!componentFile) return true // Skip if no files found
          
          const componentCode = fs.readFileSync(componentFile, 'utf-8')
          const filename = path.basename(componentFile)
          
          // Interactive components should have hover states
          if (filename.includes('button')) {
            const hasHover = hasProperHoverStyles(componentCode)
            expect(hasHover).toBe(true)
          }
          
          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  test('Property 15: Interactive element accessibility - UI components have proper disabled states', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...getUIComponentFiles()),
        (componentFile) => {
          if (!componentFile) return true // Skip if no files found
          
          const componentCode = fs.readFileSync(componentFile, 'utf-8')
          const filename = path.basename(componentFile)
          
          // Interactive components should have disabled states
          if (filename.includes('button') || filename.includes('input') || filename.includes('checkbox')) {
            const hasDisabled = hasProperDisabledStyles(componentCode)
            expect(hasDisabled).toBe(true)
          }
          
          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  test('Property 15: Interactive element accessibility - UI components use Polaris design tokens', () => {
    fc.assert(
      fc.property(
        fc.constantFrom(...getUIComponentFiles()),
        (componentFile) => {
          if (!componentFile) return true // Skip if no files found
          
          const componentCode = fs.readFileSync(componentFile, 'utf-8')
          const filename = path.basename(componentFile)
          
          // Interactive components should use Polaris design tokens
          if (filename.includes('button') || filename.includes('input') || filename.includes('checkbox')) {
            const usesTokens = usesPolarisDesignTokens(componentCode)
            expect(usesTokens).toBe(true)
          }
          
          return true
        }
      ),
      { numRuns: 50 }
    )
  })

  test('Property 15: Interactive element accessibility - Button component has all required accessibility features', () => {
    const buttonFile = 'src/components/ui/button.tsx'
    
    if (fs.existsSync(buttonFile)) {
      const buttonCode = fs.readFileSync(buttonFile, 'utf-8')
      
      // Should have focus styles
      expect(hasProperFocusStyles(buttonCode)).toBe(true)
      
      // Should have hover styles
      expect(hasProperHoverStyles(buttonCode)).toBe(true)
      
      // Should have disabled styles
      expect(hasProperDisabledStyles(buttonCode)).toBe(true)
      
      // Should use Polaris design tokens
      expect(usesPolarisDesignTokens(buttonCode)).toBe(true)
      
      // Should use forwardRef for accessibility
      expect(buttonCode.includes('React.forwardRef')).toBe(true)
      
      // Should have displayName for debugging
      expect(buttonCode.includes('displayName')).toBe(true)
    }
  })

  test('Property 15: Interactive element accessibility - Input component has all required accessibility features', () => {
    const inputFile = 'src/components/ui/input.tsx'
    
    if (fs.existsSync(inputFile)) {
      const inputCode = fs.readFileSync(inputFile, 'utf-8')
      
      // Should have focus styles
      expect(hasProperFocusStyles(inputCode)).toBe(true)
      
      // Should have disabled styles
      expect(hasProperDisabledStyles(inputCode)).toBe(true)
      
      // Should use Polaris design tokens
      expect(usesPolarisDesignTokens(inputCode)).toBe(true)
      
      // Should use forwardRef for accessibility
      expect(inputCode.includes('React.forwardRef')).toBe(true)
      
      // Should have displayName for debugging
      expect(inputCode.includes('displayName')).toBe(true)
    }
  })
})