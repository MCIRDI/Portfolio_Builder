const API_URL = import.meta.env.VITE_API_URL || "https://portfolio-builder-7i56.onrender.com";

export const getMediaUrl = (mediaPath) => {
  if (!mediaPath) return "";
  
  // If it's already a full URL, return as is
  if (mediaPath.startsWith('http')) {
    return mediaPath;
  }
  
  // If it starts with /, it's a relative path from backend
  if (mediaPath.startsWith('/')) {
    return `${API_URL}${mediaPath}`;
  }
  
  // Otherwise, assume it's a media file path
  return `${API_URL}/media/${mediaPath}`;
};
