# Landing Page Refactoring Guide

## Overview
This document serves as a guide for refactoring landing page code to match the Polaris design system and Next.js 14 architecture.

## File Location
- **Main Landing Page**: `src/app/landing/page.tsx`
- **Landing Components**: `src/components/landing/` (create as needed)

## Refactoring Checklist

### ✅ Design System Compliance
- [ ] Use Deep Midnight color palette (`bg-main`, `bg-card`, `primary`)
- [ ] Apply proper typography hierarchy (Inter/Geist Sans)
- [ ] Implement glass borders (`border-white/5`)
- [ ] Use correct border radius (`rounded-3xl` for cards)
- [ ] Add glow effects for primary actions (`shadow-[0_0_20px_rgba(99,102,241,0.5)]`)

### ✅ Architecture Standards
- [ ] Default to Server Components
- [ ] Add `'use client'` only when using hooks or event listeners
- [ ] Use proper TypeScript interfaces for props
- [ ] Follow component separation (ui/ vs widgets/ vs layout/)
- [ ] Implement proper error boundaries

### ✅ Code Quality
- [ ] Use functional components with arrow functions
- [ ] Destructure props properly
- [ ] Apply `cn()` utility for className merging
- [ ] Follow naming conventions (PascalCase for components)
- [ ] Add proper TypeScript types

### ✅ Performance & SEO
- [ ] Optimize images with Next.js Image component
- [ ] Add proper meta tags and structured data
- [ ] Implement lazy loading where appropriate
- [ ] Use Next.js font optimization

## Common Refactoring Patterns

### Before (Generic Landing Page)
```jsx
<div className="bg-black text-white">
  <button className="bg-blue-500 px-4 py-2 rounded">
    Get Started
  </button>
</div>
```

### After (Polaris Style)
```jsx
<div className="bg-main text-white">
  <button className="bg-primary hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] px-6 py-3 rounded-xl font-semibold transition-all duration-200">
    Get Started
  </button>
</div>
```

## Instructions for Use

1. **Paste Your Code**: Replace the placeholder content in `src/app/landing/page.tsx`
2. **Request Refactoring**: Ask me to refactor the code following Polaris guidelines
3. **Component Extraction**: I'll help extract reusable components to appropriate folders
4. **Testing**: We'll ensure the landing page works with your existing routing

## Notes
- The landing page should complement the main dashboard design
- Consider creating a separate layout if the landing page needs different navigation
- Maintain consistency with the existing Polaris brand and color scheme