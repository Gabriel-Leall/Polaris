/**
 * Media URL parsing and embed utilities for Spotify and YouTube integration
 */

// Types for parsed media sources
export interface SpotifyParsedUrl {
  type: 'playlist' | 'track' | 'album';
  id: string;
}

export interface YouTubeParsedUrl {
  videoId: string;
}

export interface MediaSource {
  id: string;
  type: 'spotify' | 'youtube';
  url: string;
  embedUrl: string;
  title?: string;
  artist?: string;
  thumbnail?: string;
}

/**
 * Parses a Spotify URL and extracts the type and ID
 * Handles formats:
 * - https://open.spotify.com/playlist/ID
 * - https://open.spotify.com/track/ID
 * - https://open.spotify.com/album/ID
 * - spotify:playlist:ID
 * - spotify:track:ID
 * - spotify:album:ID
 * 
 * @param url - The Spotify URL to parse
 * @returns Parsed result with type and id, or null if invalid
 */
export function parseSpotifyUrl(url: string): SpotifyParsedUrl | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmedUrl = url.trim();

  // Handle Spotify URI format (spotify:type:id)
  const uriMatch = trimmedUrl.match(/^spotify:(playlist|track|album):([a-zA-Z0-9]+)$/);
  if (uriMatch) {
    return {
      type: uriMatch[1] as 'playlist' | 'track' | 'album',
      id: uriMatch[2],
    };
  }

  // Handle web URL format (open.spotify.com/type/id)
  try {
    const urlObj = new URL(trimmedUrl);
    
    // Only accept http and https protocols
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return null;
    }
    
    // Check if it's the correct Spotify domain (open.spotify.com)
    const hostname = urlObj.hostname.replace('www.', '');
    if (hostname !== 'open.spotify.com') {
      return null;
    }

    // Parse the pathname: /playlist/ID, /track/ID, /album/ID
    const pathMatch = urlObj.pathname.match(/^\/(playlist|track|album)\/([a-zA-Z0-9]+)/);
    if (pathMatch) {
      return {
        type: pathMatch[1] as 'playlist' | 'track' | 'album',
        id: pathMatch[2],
      };
    }
  } catch {
    // Invalid URL format
    return null;
  }

  return null;
}


/**
 * Parses a YouTube URL and extracts the video ID
 * Handles formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://youtube.com/embed/VIDEO_ID
 * 
 * @param url - The YouTube URL to parse
 * @returns Parsed result with videoId, or null if invalid
 */
export function parseYouTubeUrl(url: string): YouTubeParsedUrl | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmedUrl = url.trim();

  try {
    const urlObj = new URL(trimmedUrl);
    
    // Only accept http and https protocols
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return null;
    }
    
    const hostname = urlObj.hostname.replace('www.', '');

    // Handle youtu.be short URLs
    if (hostname === 'youtu.be') {
      const videoId = urlObj.pathname.slice(1).split('/')[0];
      if (videoId && /^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
        return { videoId };
      }
      return null;
    }

    // Handle youtube.com URLs
    if (hostname === 'youtube.com') {
      // Handle /watch?v=VIDEO_ID format
      const vParam = urlObj.searchParams.get('v');
      if (vParam && /^[a-zA-Z0-9_-]{11}$/.test(vParam)) {
        return { videoId: vParam };
      }

      // Handle /embed/VIDEO_ID format
      const embedMatch = urlObj.pathname.match(/^\/embed\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch) {
        return { videoId: embedMatch[1] };
      }
    }
  } catch {
    // Invalid URL format
    return null;
  }

  return null;
}


/**
 * Generates an embed URL for a Spotify resource
 * 
 * @param type - The type of Spotify resource (playlist, track, album)
 * @param id - The Spotify resource ID
 * @returns The embed URL for iframe embedding
 */
export function generateSpotifyEmbedUrl(type: 'playlist' | 'track' | 'album', id: string): string {
  return `https://open.spotify.com/embed/${type}/${id}`;
}

/**
 * Generates an embed URL for a YouTube video
 * 
 * @param videoId - The YouTube video ID
 * @returns The embed URL for iframe embedding
 */
export function generateYouTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

/**
 * Parses any media URL (Spotify or YouTube) and generates the appropriate embed URL
 * 
 * @param url - The media URL to parse
 * @returns MediaSource object with embed URL, or null if invalid
 */
export function generateEmbedUrl(url: string): MediaSource | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  // Try Spotify first
  const spotifyResult = parseSpotifyUrl(url);
  if (spotifyResult) {
    return {
      id: spotifyResult.id,
      type: 'spotify',
      url: url.trim(),
      embedUrl: generateSpotifyEmbedUrl(spotifyResult.type, spotifyResult.id),
    };
  }

  // Try YouTube
  const youtubeResult = parseYouTubeUrl(url);
  if (youtubeResult) {
    return {
      id: youtubeResult.videoId,
      type: 'youtube',
      url: url.trim(),
      embedUrl: generateYouTubeEmbedUrl(youtubeResult.videoId),
    };
  }

  return null;
}

/**
 * Validates if a URL is a valid media URL (Spotify or YouTube)
 * 
 * @param url - The URL to validate
 * @returns true if valid, false otherwise
 */
export function isValidMediaUrl(url: string): boolean {
  return generateEmbedUrl(url) !== null;
}
