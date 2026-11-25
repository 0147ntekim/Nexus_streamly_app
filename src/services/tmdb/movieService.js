import { tmdbRequest } from "./tmdbClient.js";

export async function getTrendingMovies(signal) {
  const data = await tmdbRequest("/trending/movie/week", {}, signal);
  return data.results;
}

export async function getPopularMovies(signal) {
  const data = await tmdbRequest("/movie/popular", {}, signal);
  return data.results;
}

export async function getTopRatedMovies(signal) {
  const data = await tmdbRequest("/movie/top_rated", {}, signal);
  return data.results;
}

export async function searchMovies(query, signal) {
  const data = await tmdbRequest(
    "/search/movie",
    { query, include_adult: false },
    signal
  );
  return data.results;
}