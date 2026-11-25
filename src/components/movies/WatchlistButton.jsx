import { useState } from "react";
import Button from "../common/Button.jsx";
import { useWatchlist } from "../../hooks/useWatchlist.js";
import styles from "./WatchlistButton.module.css";

function WatchlistButton({ movie }) {
  const { isInWatchlist, isLoading, loadError, toggleWatchlist } = useWatchlist();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const isSaved = isInWatchlist(movie.id);

  async function handleClick() {
    setIsPending(true);
    setError("");
    try {
      await toggleWatchlist(movie);
    } catch {
      setError("Couldn't update your watchlist. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <Button
        variant={isSaved ? "secondary" : "ghost"}
        size="lg"
        onClick={handleClick}
        disabled={isPending || isLoading}
        aria-pressed={isSaved}
      >
        {isPending
          ? "Saving..."
          : isSaved
            ? "✓ In watchlist"
            : "+ Add to watchlist"}
      </Button>
      {(error || loadError) && (
        <p className={styles.error} role="alert">
          {error || loadError}
        </p>
      )}
    </div>
  );
}

export default WatchlistButton;
