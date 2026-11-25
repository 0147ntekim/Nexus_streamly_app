/**
 * ============================================================
 *  MOCK LIBRARY SERVICE: A LEARNING SIMULATION ONLY
 * ============================================================
 * This stores each user's watchlist in localStorage for this teaching app.
 * A real app would store this data in a backend so it follows the user
 * across devices.
 *
 *   getProgress(userId, movieId)                          -> Promise<Entry | null>
 *   saveProgress(userId, movie, positionSec, durationSec) -> Promise<Entry | null>
 */
const WATCHLISTS_KEY = "streamly_mock_watchlists";
const SIMULATED_DELAY_MS = 250;
const PROGRESS_KEY = "streamly_mock_progress";
const COMPLETED_THRESHOLD = 0.95;
const MIN_SAVE_SECONDS = 5;

const delay = (ms = SIMULATED_DELAY_MS) =>
  new Promise((resolve) => setTimeout(resolve, ms));

function readAll() {
  const raw = localStorage.getItem(WATCHLISTS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function writeAll(allWatchlists) {
  localStorage.setItem(WATCHLISTS_KEY, JSON.stringify(allWatchlists));
}

function toWatchlistItem(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
    addedAt: new Date().toISOString(),
  };
}

async function getWatchlist(userId) {
  await delay(200);
  return readAll()[userId] ?? [];
}

async function addToWatchlist(userId, movie) {
  await delay();
  const all = readAll();
  const current = all[userId] ?? [];

  if (current.some((item) => item.id === movie.id)) return current;

  const updated = [toWatchlistItem(movie), ...current];
  writeAll({ ...all, [userId]: updated });
  return updated;
}

async function removeFromWatchlist(userId, movieId) {
  await delay();
  const all = readAll();
  const current = all[userId] ?? [];

  const updated = current.filter((item) => item.id !== movieId);
  writeAll({ ...all, [userId]: updated });
  return updated;
}

function readProgressAll() {
  const raw = localStorage.getItem(PROGRESS_KEY);
  return raw ? JSON.parse(raw) : {};
}

function writeProgressAll(allProgress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(allProgress));
}

async function getProgress(userId, movieId) {
  return readProgressAll()[userId]?.[String(movieId)] ?? null;
}

async function saveProgress(userId, movie, positionSeconds, durationSeconds) {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) return null;

  const completed = positionSeconds / durationSeconds >= COMPLETED_THRESHOLD;
  if (!completed && positionSeconds < MIN_SAVE_SECONDS) return null;

  const all = readProgressAll();
  const userEntries = all[userId] ?? {};

  const entry = {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    backdrop_path: movie.backdrop_path,
    vote_average: movie.vote_average,
    release_date: movie.release_date,
    positionSeconds: Math.floor(positionSeconds),
    durationSeconds: Math.floor(durationSeconds),
    completed,
    updatedAt: new Date().toISOString(),
  };

  writeProgressAll({
    ...all,
    [userId]: { ...userEntries, [String(movie.id)]: entry },
  });
  return entry;
}

export const libraryService = {
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getProgress,
  saveProgress,
};
