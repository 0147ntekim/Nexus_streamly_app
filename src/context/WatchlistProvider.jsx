import { useEffect, useState } from "react";
import { WatchlistContext } from "./WatchlistContext.js";
import { useAuth } from "../hooks/useAuth.js";
import { libraryService } from "../services/libraryService.js";

function WatchlistProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  return (
    <WatchlistForUser key={userId ?? "logged-out"} userId={userId}>
      {children}
    </WatchlistForUser>
  );
}

function WatchlistForUser({ children, userId }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(Boolean(userId));
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!userId) return undefined;

    let isCancelled = false;

    async function loadWatchlist() {
      try {
        const list = await libraryService.getWatchlist(userId);
        if (!isCancelled) setItems(list);
      } catch (error) {
        if (!isCancelled) {
          setLoadError(error.message || "Couldn't load your watchlist.");
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }

    loadWatchlist();
    return () => {
      isCancelled = true;
    };
  }, [userId]);

  function isInWatchlist(movieId) {
    return items.some((item) => item.id === movieId);
  }

  async function toggleWatchlist(movie) {
    if (!userId) throw new Error("You must be logged in.");

    const updated = isInWatchlist(movie.id)
      ? await libraryService.removeFromWatchlist(userId, movie.id)
      : await libraryService.addToWatchlist(userId, movie);

    setItems(updated);
  }

  const value = {
    items,
    isLoading,
    loadError,
    isInWatchlist,
    toggleWatchlist,
  };

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
}

export default WatchlistProvider;
