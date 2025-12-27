/**
 * Quick Links URL processing utilities
 * Handles domain name extraction and favicon URL generation
 */

/**
 * Extracts a readable domain name from a URL
 * Removes common prefixes like 'www.' and returns the main domain
 * 
 * @param url - The URL to extract the domain from
 * @returns The readable domain name, or empty string if invalid
 * 
 * @example
 * extractDomainName('https://www.github.com/user/repo') // 'github.com'
 * extractDomainName('https://docs.google.com/document') // 'docs.google.com'
 */
export function extractDomainName(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  const trimmedUrl = url.trim();

  try {
    const urlObj = new URL(trimmedUrl);
    let hostname = urlObj.hostname;

    // Remove 'www.' prefix for cleaner display
    if (hostname.startsWith('www.')) {
      hostname = hostname.slice(4);
    }

    return hostname;
  } catch {
    // Invalid URL format
    return '';
  }
}

/**
 * Generates a favicon URL using Google's Favicon API
 * Falls back to a default icon URL if the domain is invalid
 * 
 * @param url - The website URL to get the favicon for
 * @returns The favicon URL from Google's service
 * 
 * @example
 * getFaviconUrl('https://github.com') // 'https://www.google.com/s2/favicons?domain=github.com&sz=32'
 */
export function getFaviconUrl(url: string): string {
  const domain = extractDomainName(url);
  
  if (!domain) {
    // Return a default placeholder for invalid URLs
    return '';
  }

  // Use Google's Favicon API with size 32 for crisp display
  return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=32`;
}

/**
 * Validates if a string is a valid URL
 * 
 * @param url - The string to validate
 * @returns true if valid URL, false otherwise
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false;
  }

  try {
    const urlObj = new URL(url.trim());
    // Only allow http and https protocols
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Extracts a readable title from a URL
 * Uses the domain name and optionally the first path segment
 * 
 * @param url - The URL to extract a title from
 * @returns A readable title derived from the URL
 * 
 * @example
 * extractTitleFromUrl('https://github.com/user/repo') // 'GitHub'
 * extractTitleFromUrl('https://docs.google.com') // 'Docs Google'
 */
export function extractTitleFromUrl(url: string): string {
  const domain = extractDomainName(url);
  
  if (!domain) {
    return '';
  }

  // Split domain and capitalize each part
  const parts = domain.split('.');
  
  // Remove common TLDs for cleaner title
  const tlds = ['com', 'org', 'net', 'io', 'co', 'dev', 'app', 'ai'];
  const filteredParts = parts.filter(part => !tlds.includes(part.toLowerCase()));
  
  // Capitalize first letter of each part
  const capitalizedParts = filteredParts.map(part => 
    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  );

  return capitalizedParts.join(' ') || domain;
}
