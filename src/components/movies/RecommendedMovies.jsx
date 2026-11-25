import MovieRow from "./MovieRow.jsx";
import { useFetch } from "../../hooks/useFetch.js";
import { getMovieRecommendations } from "../../services/tmdb/movieService.js";

function RecommendedMovies({ movieId }) {
  const { data, isLoading, error, refetch } = useFetch(
    (signal) => getMovieRecommendations(movieId, signal),
    [movieId]
  );

  return (
    <MovieRow
      title="You might also like"
      movies={(data ?? []).slice(0, 12)}
      isLoading={isLoading}
      error={error}
      onRetry={refetch}
      emptyMessage="No recommendations are available for this movie."
    />
  );
}

export default RecommendedMovies;
