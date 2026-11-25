import Section from "../layout/Section.jsx";
import ErrorMessage from "../common/ErrorMessage.jsx";
import MovieCard from "./MovieCard.jsx";
import MovieCardSkeleton from "./MovieCardSkeleton.jsx";
import styles from "./MovieRow.module.css";

const SKELETON_COUNT = 8;

function MovieRow({
  title,
  movies = [],
  isLoading = false,
  error = null,
  onRetry,
  emptyMessage = "No movies to show.",
}) {
  function renderContent() {
    if (isLoading) {
      return (
        <div className={styles.track}>
          {Array.from({ length: SKELETON_COUNT }, (_, index) => (
            <div className={styles.item} key={index}>
              <MovieCardSkeleton />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return <ErrorMessage message={error.message} onRetry={onRetry} />;
    }

    if (movies.length === 0) {
      return <p className={styles.empty}>{emptyMessage}</p>;
    }

    return (
      <div className={styles.track}>
        {movies.map((movie) => (
          <div className={styles.item} key={movie.id}>
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    );
  }

  return <Section title={title}>{renderContent()}</Section>;
}

export default MovieRow;