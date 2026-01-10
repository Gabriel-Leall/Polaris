export const extractVideoId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11
    ? match[2]
    : url.length === 11
    ? url
    : null;
};

export const getVideoMetadata = async (url: string) => {
  try {
    const videoId = extractVideoId(url);
    if (!videoId) return null;

    // Always use a canonical URL for oEmbed to ensure reliability
    const canonicalUrl = `https://www.youtube.com/watch?v=${videoId}`;
    const response = await fetch(
      `https://www.youtube.com/oembed?url=${canonicalUrl}&format=json`
    );

    if (!response.ok) return null;
    const data = await response.json();
    return {
      title: data.title,
      author: data.author_name,
    };
  } catch (error) {
    console.error("Error fetching video metadata:", error);
    return null;
  }
};
