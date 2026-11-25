import { TMDB_IMAGE_BASE_URL } from "./constants.js";

/**
 * Builds a full TMDB image URL.
 * TMDB returns only a path like "/abc123.jpg".
 * Sizes include: w185, w342, w500, w780, w1280, original.
 * Returns null when there's no image so components can show a fallback.
 */
export function getImageUrl(path, size = "w500") {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
}