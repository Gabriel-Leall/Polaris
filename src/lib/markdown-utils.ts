/**
 * Markdown utilities for Brain Dump widget
 * Supports markdown-style shortcuts: **bold**, _italic_, `code`
 */

export interface MarkdownShortcut {
  pattern: RegExp;
  type: 'bold' | 'italic' | 'code' | 'underline';
  wrapper: string;
}

/**
 * Markdown shortcut patterns
 * These are used for detecting and converting markdown syntax
 */
export const markdownShortcuts: MarkdownShortcut[] = [
  {
    pattern: /\*\*([^*]+)\*\*/g,
    type: 'bold',
    wrapper: '**',
  },
  {
    pattern: /__([^_]+)__/g,
    type: 'bold',
    wrapper: '__',
  },
  {
    pattern: /(?<!\*)\*([^*]+)\*(?!\*)/g,
    type: 'italic',
    wrapper: '*',
  },
  {
    pattern: /(?<!_)_([^_]+)_(?!_)/g,
    type: 'italic',
    wrapper: '_',
  },
  {
    pattern: /`([^`]+)`/g,
    type: 'code',
    wrapper: '`',
  },
];

/**
 * Parse markdown text and return detected formatting
 * @param text - The text to parse for markdown shortcuts
 * @returns Array of detected markdown patterns with their positions
 */
export interface MarkdownMatch {
  type: 'bold' | 'italic' | 'code' | 'underline';
  content: string;
  fullMatch: string;
  startIndex: number;
  endIndex: number;
}

export function parseMarkdownShortcuts(text: string): MarkdownMatch[] {
  const matches: MarkdownMatch[] = [];

  for (const shortcut of markdownShortcuts) {
    let match: RegExpExecArray | null;
    const regex = new RegExp(shortcut.pattern.source, 'g');
    
    while ((match = regex.exec(text)) !== null) {
      matches.push({
        type: shortcut.type,
        content: match[1],
        fullMatch: match[0],
        startIndex: match.index,
        endIndex: match.index + match[0].length,
      });
    }
  }

  // Sort by start index
  return matches.sort((a, b) => a.startIndex - b.startIndex);
}

/**
 * Convert markdown text to HTML
 * @param text - The markdown text to convert
 * @returns HTML string with formatting applied
 */
export function markdownToHtml(text: string): string {
  let html = text;

  // Bold: **text** or __text__
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/__([^_]+)__/g, '<strong>$1</strong>');

  // Italic: *text* or _text_ (not preceded/followed by same char)
  html = html.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '<em>$1</em>');
  html = html.replace(/(?<!_)_([^_]+)_(?!_)/g, '<em>$1</em>');

  // Code: `text`
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

  return html;
}

/**
 * Check if a string contains any markdown shortcuts
 * @param text - The text to check
 * @returns true if markdown shortcuts are detected
 */
export function hasMarkdownShortcuts(text: string): boolean {
  return markdownShortcuts.some(shortcut => shortcut.pattern.test(text));
}

/**
 * Get the markdown type from a wrapper string
 * @param wrapper - The markdown wrapper (e.g., '**', '_', '`')
 * @returns The formatting type or null if not recognized
 */
export function getMarkdownType(wrapper: string): 'bold' | 'italic' | 'code' | null {
  switch (wrapper) {
    case '**':
    case '__':
      return 'bold';
    case '*':
    case '_':
      return 'italic';
    case '`':
      return 'code';
    default:
      return null;
  }
}
