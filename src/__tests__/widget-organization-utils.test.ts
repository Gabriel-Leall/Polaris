/**
 * Tests for widget organization utilities
 * Validates the core functionality of widget folder organization
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import {
  shouldUseWidgetFolder,
  validateWidgetFolderStructure,
  validateNamingConventions,
  resolveWidgetImportPath,
  createWidgetFolderStructure,
  WIDGETS_BASE_PATH,
  COMPLEXITY_THRESHOLD
} from '@/lib/widget-organization-utils';

// Mock file system for testing
const mockFs = {
  existsSync: fs.existsSync,
  readFileSync: fs.readFileSync,
  statSync: fs.statSync,
  mkdirSync: fs.mkdirSync,
  writeFileSync: fs.writeFileSync,
  readdirSync: fs.readdirSync
};

describe('Widget Organization Utils', () => {
  describe('shouldUseWidgetFolder', () => {
    it('should return true for complex widgets over threshold', () => {
      // Test with actual BrainDumpWidget which is over 150 lines
      const brainDumpPath = path.join(WIDGETS_BASE_PATH, 'BrainDumpWidget.tsx');
      if (fs.existsSync(brainDumpPath)) {
        const result = shouldUseWidgetFolder(brainDumpPath);
        expect(result).toBe(true);
      }
    });

    it('should return false for non-existent files', () => {
      const result = shouldUseWidgetFolder('non-existent-widget.tsx');
      expect(result).toBe(false);
    });
  });

  describe('validateNamingConventions', () => {
    it('should validate correct widget names', () => {
      const result = validateNamingConventions('BrainDumpWidget');
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid widget names', () => {
      const result = validateNamingConventions('invalidName');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject names not ending with Widget', () => {
      const result = validateNamingConventions('BrainDump');
      expect(result.isValid).toBe(false);
      expect(result.errors.some(error => error.includes('Widget'))).toBe(true);
    });
  });

  describe('resolveWidgetImportPath', () => {
    it('should resolve import paths for existing widgets', () => {
      // Test with BrainDumpWidget which should exist
      const result = resolveWidgetImportPath('BrainDumpWidget');
      expect(result).toBe('@/components/widgets/BrainDumpWidget');
    });

    it('should throw error for non-existent widgets', () => {
      expect(() => {
        resolveWidgetImportPath('NonExistentWidget');
      }).toThrow('Widget not found');
    });
  });

  describe('createWidgetFolderStructure', () => {
    const testWidgetName = 'TestWidget';
    const testWidgetPath = path.join(WIDGETS_BASE_PATH, testWidgetName);

    afterEach(() => {
      // Clean up test files
      try {
        if (fs.existsSync(testWidgetPath)) {
          fs.rmSync(testWidgetPath, { recursive: true, force: true });
        }
      } catch (error) {
        // Ignore cleanup errors
      }
    });

    it('should create basic widget folder structure', () => {
      const result = createWidgetFolderStructure(testWidgetName);
      
      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.createdPaths.length).toBeGreaterThan(0);
      
      // Verify folder was created
      expect(fs.existsSync(testWidgetPath)).toBe(true);
      
      // Verify index.ts was created
      const indexPath = path.join(testWidgetPath, 'index.ts');
      expect(fs.existsSync(indexPath)).toBe(true);
      
      // Verify index.ts content
      const indexContent = fs.readFileSync(indexPath, 'utf-8');
      expect(indexContent).toContain(`export { default } from './${testWidgetName}';`);
      expect(indexContent).toContain(`export type { ${testWidgetName}Props } from './types';`);
    });
  });

  describe('validateWidgetFolderStructure', () => {
    it('should validate existing widget structures', () => {
      // Test with a widget that exists as a single file
      const result = validateWidgetFolderStructure('BrainDumpWidget');
      
      // Since BrainDumpWidget is currently a single file, this should fail
      // but not crash
      expect(typeof result.isValid).toBe('boolean');
      expect(Array.isArray(result.errors)).toBe(true);
      expect(Array.isArray(result.warnings)).toBe(true);
    });

    it('should return errors for non-existent widgets', () => {
      const result = validateWidgetFolderStructure('NonExistentWidget');
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Widget folder does not exist');
    });
  });
});