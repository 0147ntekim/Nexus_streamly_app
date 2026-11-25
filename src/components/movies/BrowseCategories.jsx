import MovieRow from "./MovieRow.jsx";
import { useFetch } from "../../hooks/useFetch.js";
import {
  getTrendingMovies,
  getPopularMovies,
  getTopRatedMovies,
} from "../../services/tmdb/movieService.js";

function BrowseCategories() {
  const trending = useFetch(getTrendingMovies);
  const popular = useFetch(getPopularMovies);
  const topRated = useFetch(getTopRatedMovies);

  return (
    <>
      <MovieRow
        title="Trending this week"
        movies={trending.data ?? []}
        isLoading={trending.isLoading}
        error={trending.error}
        onRetry={trending.refetch}
      />
      <MovieRow
        title="Popular"
        movies={popular.data ?? []}
        isLoading={popular.isLoading}
        error={popular.error}
        onRetry={popular.refetch}
      />
      <MovieRow
        title="Top rated"
        movies={topRated.data ?? []}
        isLoading={topRated.isLoading}
        error={topRated.error}
        onRetry={topRated.refetch}
      />
    </>
  );
}

export default BrowseCategories;