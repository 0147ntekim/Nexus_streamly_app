import { TMDB_API_KEY, TMDB_BASE_URL } from "../../utils/constants.js";

export class TmdbError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "TmdbError";
    this.status = status;
  }
}

function getFriendlyMessage(status) {
  if (status === 401) {
    return "The movie service rejected our API key. Check VITE_TMDB_API_KEY in your .env file.";
  }
  if (status === 404) return "We couldn't find what you were looking for.";
  if (status === 429) return "Too many requests. Please wait a moment and try again.";
  if (status >= 500) return "The movie service is having problems. Please try again later.";
  return "Something went wrong while loading movies.";
}

export async function tmdbRequest(endpoint, params = {}, signal) {
  if (!TMDB_API_KEY) {
    throw new TmdbError(
      "Missing TMDB API key. Add VITE_TMDB_API_KEY to your .env file and restart the dev server.",
      0
    );
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", "en-US");

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  let response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new TmdbError(
      "Couldn't reach the movie service. Check your internet connection.",
      0
    );
  }

  if (!response.ok) {
    throw new TmdbError(getFriendlyMessage(response.status), response.status);
  }

  return response.json();
}