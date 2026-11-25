import Section from "../layout/Section.jsx";
import ErrorMessage from "../common/ErrorMessage.jsx";
import MovieGrid from "./MovieGrid.jsx";
import { useFetch } from "../../hooks/useFetch.js";
import { searchMovies } from "../../services/tmdb/movieService.js";

function SearchResults({ query }) {
  const { data, isLoading, error, refetch } = useFetch(
    (signal) => searchMovies(query, signal),
    [query]
  );

  if (error && !isLoading) {
    return <ErrorMessage message={error.message} onRetry={refetch} />;
  }

  return (
    <Section title={`Results for "${query}"`}>
      <MovieGrid
        movies={data ?? []}
        isLoading={isLoading}
        emptyMessage={`No movies found for "${query}". Try a different title.`}
      />
    </Section>
  );
}

export default SearchResults;