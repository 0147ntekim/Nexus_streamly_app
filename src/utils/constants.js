export const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
export const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
export const TMDB_IMAGE_BASE_URL = import.meta.env.VITE_TMDB_IMAGE_BASE_URL;

if (!TMDB_API_KEY) {
  console.warn(
    "VITE_TMDB_API_KEY is missing. Add it to your .env file and restart the dev server."
  );
}