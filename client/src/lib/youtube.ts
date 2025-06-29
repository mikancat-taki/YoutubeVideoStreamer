// YouTube Video ID extraction functions based on ComfyUI-YouTubeVideoPlayer util.js
export function getYouTubeVideoId(url: string): string | null {
  let videoId = null;
  
  // Patterns for different YouTube URL formats
  const standardPattern = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*[?&]v=([^&]+)/;
  const shortPattern = /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([^?&]+)/;
  const embedPattern = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?&]+)/;
  const shortsPattern = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?&]+)/;
  
  let match = url.match(standardPattern);
  if (match && match[1]) {
    videoId = match[1];
  } else {
    match = url.match(shortPattern);
    if (match && match[1]) {
      videoId = match[1];
    } else {
      match = url.match(embedPattern);
      if (match && match[1]) {
        videoId = match[1];
      } else {
        match = url.match(shortsPattern);
        if (match && match[1]) {
          videoId = match[1];
        }
      }
    }
  }
  
  return videoId;
}

export function isValidYouTubeUrl(url: string): boolean {
  return getYouTubeVideoId(url) !== null;
}

export function createEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}`;
}

export function createWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

// Sample video data for quick start examples
export const sampleVideos = [
  {
    url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    title: "Classic YouTube Video",
    description: "Standard URL format"
  },
  {
    url: "https://youtu.be/9bZkp7q19f0",
    title: "Short URL Demo",
    description: "Short URL format"
  }
];
