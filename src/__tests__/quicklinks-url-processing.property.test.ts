/**
 * Property-based tests for Quick Links URL processing utilities
 * 
 * **Feature: dashboard-layout-enhancement, Property 10: Quick Links URL processing**
 * **Validates: Requirements 5.3, 5.4**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  extractDomainName,
  getFaviconUrl,
  isValidUrl,
  extractTitleFromUrl,
} from '@/lib/quicklinks-utils';

// Arbitrary for valid domain names
const domainArb = fc.tuple(
  fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789'), { minLength: 1, maxLength: 15 }),
  fc.constantFrom('com', 'org', 'net', 'io', 'dev', 'app')
).map(([name, tld]) => `${name}.${tld}`);

// Arbitrary for valid URLs
const validUrlArb = fc.tuple(
  fc.constantFrom('https://', 'http://'),
  fc.boolean(), // whether to include www.
  domainArb,
  fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz0123456789-_/'), { minLength: 0, maxLength: 20 })
).map(([protocol, hasWww, domain, path]) => {
  const www = hasWww ? 'www.' : '';
  const cleanPath = path.startsWith('/') ? path : (path ? `/${path}` : '');
  return `${protocol}${www}${domain}${cleanPath}`;
});

describe('Property 10: Quick Links URL processing', () => {
  describe('extractDomainName', () => {
    it('should extract a non-empty domain from any valid URL', () => {
      fc.assert(
        fc.property(validUrlArb, (url) => {
          const domain = extractDomainName(url);
          
          // Should return a non-empty string
          expect(domain).toBeTruthy();
          expect(typeof domain).toBe('string');
        }),
        { numRuns: 100 }
      );
    });

    it('should remove www. prefix from domains', () => {
      fc.assert(
        fc.property(domainArb, (domain) => {
          const urlWithWww = `https://www.${domain}`;
          const result = extractDomainName(urlWithWww);
          
          // Should not start with www.
          expect(result.startsWith('www.')).toBe(false);
          expect(result).toBe(domain);
        }),
        { numRuns: 100 }
      );
    });

    it('should preserve subdomains other than www', () => {
      fc.assert(
        fc.property(
          fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'), { minLength: 2, maxLength: 10 }),
          domainArb,
          (subdomain, domain) => {
            // Skip if subdomain is 'www'
            if (subdomain === 'www') return;
            
            const url = `https://${subdomain}.${domain}`;
            const result = extractDomainName(url);
            
            // Should preserve the subdomain
            expect(result).toBe(`${subdomain}.${domain}`);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return empty string for invalid URLs', () => {
      fc.assert(
        fc.property(
          fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz '), { minLength: 1, maxLength: 20 }),
          (invalidUrl) => {
            // Only test strings that are definitely not valid URLs
            if (invalidUrl.includes('://')) return;
            
            const result = extractDomainName(invalidUrl);
            expect(result).toBe('');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('getFaviconUrl', () => {
    it('should return a valid Google Favicon API URL for valid URLs', () => {
      fc.assert(
        fc.property(validUrlArb, (url) => {
          const faviconUrl = getFaviconUrl(url);
          
          // Should return a Google Favicon API URL
          expect(faviconUrl).toContain('https://www.google.com/s2/favicons');
          expect(faviconUrl).toContain('domain=');
          expect(faviconUrl).toContain('sz=32');
        }),
        { numRuns: 100 }
      );
    });

    it('should include the correct domain in the favicon URL', () => {
      fc.assert(
        fc.property(domainArb, (domain) => {
          const url = `https://${domain}`;
          const faviconUrl = getFaviconUrl(url);
          
          // The domain should be encoded in the favicon URL
          expect(faviconUrl).toContain(encodeURIComponent(domain));
        }),
        { numRuns: 100 }
      );
    });

    it('should return empty string for invalid URLs', () => {
      fc.assert(
        fc.property(
          fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz '), { minLength: 1, maxLength: 20 }),
          (invalidUrl) => {
            // Only test strings that are definitely not valid URLs
            if (invalidUrl.includes('://')) return;
            
            const result = getFaviconUrl(invalidUrl);
            expect(result).toBe('');
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('isValidUrl', () => {
    it('should return true for valid http/https URLs', () => {
      fc.assert(
        fc.property(validUrlArb, (url) => {
          const result = isValidUrl(url);
          expect(result).toBe(true);
        }),
        { numRuns: 100 }
      );
    });

    it('should return false for non-http protocols', () => {
      fc.assert(
        fc.property(
          fc.constantFrom('ftp://', 'file://', 'mailto:', 'javascript:'),
          domainArb,
          (protocol, domain) => {
            const url = `${protocol}${domain}`;
            const result = isValidUrl(url);
            expect(result).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });
  });

  describe('extractTitleFromUrl', () => {
    it('should return a non-empty title for valid URLs', () => {
      fc.assert(
        fc.property(validUrlArb, (url) => {
          const title = extractTitleFromUrl(url);
          
          // Should return a non-empty string
          expect(title).toBeTruthy();
          expect(typeof title).toBe('string');
        }),
        { numRuns: 100 }
      );
    });

    it('should capitalize the first letter of domain parts', () => {
      fc.assert(
        fc.property(
          fc.stringOf(fc.constantFrom(...'abcdefghijklmnopqrstuvwxyz'), { minLength: 2, maxLength: 10 }),
          (name) => {
            const url = `https://${name}.com`;
            const title = extractTitleFromUrl(url);
            
            // First letter should be uppercase
            expect(title.charAt(0)).toBe(title.charAt(0).toUpperCase());
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should return empty string for invalid URLs', () => {
      const result = extractTitleFromUrl('not-a-url');
      expect(result).toBe('');
    });
  });
});
