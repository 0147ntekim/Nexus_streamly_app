import MovieCard from "./MovieCard.jsx";
import MovieCardSkeleton from "./MovieCardSkeleton.jsx";
import styles from "./MovieGrid.module.css";

const SKELETON_COUNT = 12;

function MovieGrid({
  movies = [],
  isLoading = false,
  emptyMessage = "No movies found.",
}) {
  if (isLoading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: SKELETON_COUNT }, (_, index) => (
          <MovieCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (movies.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <div className={styles.grid}>
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}

export default MovieGrid;