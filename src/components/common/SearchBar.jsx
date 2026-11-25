import { useState } from "react";
import Button from "./Button.jsx";
import styles from "./SearchBar.module.css";

function SearchBar({
  onSearch,
  placeholder = "Search for a movie...",
  initialValue = "",
}) {
  const [query, setQuery] = useState(initialValue);

  function handleSubmit(event) {
    event.preventDefault();
    onSearch(query.trim());
  }

  function handleClear() {
    setQuery("");
    onSearch("");
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} role="search">
      <label htmlFor="movie-search" className="sr-only">
        Search movies
      </label>
      <input
        id="movie-search"
        type="search"
        className={styles.input}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={placeholder}
      />
      {query && (
        <button
          type="button"
          className={styles.clear}
          onClick={handleClear}
          aria-label="Clear search"
        >
          ✕
        </button>
      )}
      <Button type="submit" size="sm">
        Search
      </Button>
    </form>
  );
}

export default SearchBar;