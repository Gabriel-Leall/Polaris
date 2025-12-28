/**
 * Property-based tests for Markdown shortcut parsing
 * 
 * **Feature: dashboard-layout-enhancement, Property 8: Markdown shortcut parsing**
 * **Validates: Requirements 4.6**
 * 
 * For any text containing valid markdown shortcuts (**bold**, _italic_, `code`),
 * the parser should convert them to the corresponding HTML formatting.
 */

import "./setup";
import * as fc from "fast-check";
import { describe, test, expect } from "vitest";
import {
  parseMarkdownShortcuts,
  markdownToHtml,
  hasMarkdownShortcuts,
  getMarkdownType,
} from "@/lib/markdown-utils";

// Arbitrary for plain text without markdown special characters
const plainTextArb = fc.string({ minLength: 1, maxLength: 50 })
  .filter(s => !s.includes('*') && !s.includes('_') && !s.includes('`') && s.trim().length > 0);

// Arbitrary for text that can be wrapped in markdown
const wrappableTextArb = fc.string({ minLength: 1, maxLength: 30 })
  .filter(s => !s.includes('*') && !s.includes('_') && !s.includes('`') && !s.includes('<') && !s.includes('>') && s.trim().length > 0);

describe("Property 8: Markdown shortcut parsing", () => {
  describe("Bold markdown (**text** and __text__)", () => {
    test("For any text wrapped in **, markdownToHtml should produce <strong> tags", () => {
      fc.assert(
        fc.property(wrappableTextArb, (text) => {
          const markdown = `**${text}**`;
          const html = markdownToHtml(markdown);
          
          expect(html).toBe(`<strong>${text}</strong>`);
        }),
        { numRuns: 100 }
      );
    });

    test("For any text wrapped in __, markdownToHtml should produce <strong> tags", () => {
      fc.assert(
        fc.property(wrappableTextArb, (text) => {
          const markdown = `__${text}__`;
          const html = markdownToHtml(markdown);
          
          expect(html).toBe(`<strong>${text}</strong>`);
        }),
        { numRuns: 100 }
      );
    });

    test("parseMarkdownShortcuts should detect bold patterns", () => {
      fc.assert(
        fc.property(wrappableTextArb, (text) => {
          const markdown = `**${text}**`;
          const matches = parseMarkdownShortcuts(markdown);
          
          expect(matches.length).toBeGreaterThanOrEqual(1);
          expect(matches.some(m => m.type === 'bold')).toBe(true);
          expect(matches.some(m => m.content === text)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Italic markdown (*text* and _text_)", () => {
    test("For any text wrapped in single *, markdownToHtml should produce <em> tags", () => {
      fc.assert(
        fc.property(wrappableTextArb, (text) => {
          const markdown = `*${text}*`;
          const html = markdownToHtml(markdown);
          
          expect(html).toBe(`<em>${text}</em>`);
        }),
        { numRuns: 100 }
      );
    });

    test("For any text wrapped in single _, markdownToHtml should produce <em> tags", () => {
      fc.assert(
        fc.property(wrappableTextArb, (text) => {
          const markdown = `_${text}_`;
          const html = markdownToHtml(markdown);
          
          expect(html).toBe(`<em>${text}</em>`);
        }),
        { numRuns: 100 }
      );
    });

    test("parseMarkdownShortcuts should detect italic patterns", () => {
      fc.assert(
        fc.property(wrappableTextArb, (text) => {
          const markdown = `*${text}*`;
          const matches = parseMarkdownShortcuts(markdown);
          
          expect(matches.length).toBeGreaterThanOrEqual(1);
          expect(matches.some(m => m.type === 'italic')).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Code markdown (`text`)", () => {
    test("For any text wrapped in backticks, markdownToHtml should produce <code> tags", () => {
      fc.assert(
        fc.property(wrappableTextArb, (text) => {
          const markdown = `\`${text}\``;
          const html = markdownToHtml(markdown);
          
          expect(html).toBe(`<code>${text}</code>`);
        }),
        { numRuns: 100 }
      );
    });

    test("parseMarkdownShortcuts should detect code patterns", () => {
      fc.assert(
        fc.property(wrappableTextArb, (text) => {
          const markdown = `\`${text}\``;
          const matches = parseMarkdownShortcuts(markdown);
          
          expect(matches.length).toBeGreaterThanOrEqual(1);
          expect(matches.some(m => m.type === 'code')).toBe(true);
          expect(matches.some(m => m.content === text)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("hasMarkdownShortcuts detection", () => {
    test("For any text with bold markers, hasMarkdownShortcuts should return true", () => {
      fc.assert(
        fc.property(wrappableTextArb, (text) => {
          const markdown = `**${text}**`;
          expect(hasMarkdownShortcuts(markdown)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    test("For any text with italic markers, hasMarkdownShortcuts should return true", () => {
      fc.assert(
        fc.property(wrappableTextArb, (text) => {
          const markdown = `*${text}*`;
          expect(hasMarkdownShortcuts(markdown)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    test("For any text with code markers, hasMarkdownShortcuts should return true", () => {
      fc.assert(
        fc.property(wrappableTextArb, (text) => {
          const markdown = `\`${text}\``;
          expect(hasMarkdownShortcuts(markdown)).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    test("For any plain text without markers, hasMarkdownShortcuts should return false", () => {
      fc.assert(
        fc.property(plainTextArb, (text) => {
          expect(hasMarkdownShortcuts(text)).toBe(false);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("getMarkdownType utility", () => {
    test("getMarkdownType returns correct types for all wrappers", () => {
      expect(getMarkdownType('**')).toBe('bold');
      expect(getMarkdownType('__')).toBe('bold');
      expect(getMarkdownType('*')).toBe('italic');
      expect(getMarkdownType('_')).toBe('italic');
      expect(getMarkdownType('`')).toBe('code');
      expect(getMarkdownType('unknown')).toBe(null);
    });
  });

  describe("Mixed markdown content", () => {
    test("For any combination of bold and italic, both should be converted", () => {
      fc.assert(
        fc.property(wrappableTextArb, wrappableTextArb, (boldText, italicText) => {
          const markdown = `**${boldText}** and *${italicText}*`;
          const html = markdownToHtml(markdown);
          
          expect(html).toContain(`<strong>${boldText}</strong>`);
          expect(html).toContain(`<em>${italicText}</em>`);
        }),
        { numRuns: 100 }
      );
    });

    test("For any combination of all three types, all should be converted", () => {
      fc.assert(
        fc.property(wrappableTextArb, wrappableTextArb, wrappableTextArb, (boldText, italicText, codeText) => {
          const markdown = `**${boldText}** and *${italicText}* and \`${codeText}\``;
          const html = markdownToHtml(markdown);
          
          expect(html).toContain(`<strong>${boldText}</strong>`);
          expect(html).toContain(`<em>${italicText}</em>`);
          expect(html).toContain(`<code>${codeText}</code>`);
        }),
        { numRuns: 100 }
      );
    });
  });

  describe("Edge cases", () => {
    test("Empty content between markers should still be detected", () => {
      // Note: Empty content is filtered out by our arbitraries, but we test explicit cases
      const emptyBold = "****";
      const emptyItalic = "**";
      const emptyCode = "``";
      
      // These should not match because there's no content between markers
      expect(hasMarkdownShortcuts(emptyBold)).toBe(false);
      expect(hasMarkdownShortcuts(emptyItalic)).toBe(false);
      expect(hasMarkdownShortcuts(emptyCode)).toBe(false);
    });

    test("Nested markers should be handled", () => {
      // Bold containing text that looks like italic
      const nested = "**bold with * inside**";
      const html = markdownToHtml(nested);
      expect(html).toContain("<strong>");
    });
  });
});
