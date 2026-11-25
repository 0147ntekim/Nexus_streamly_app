import { useEffect } from "react";
import { useParams } from "react-router-dom";
import Container from "../components/layout/Container.jsx";
import Section from "../components/layout/Section.jsx";
import Button from "../components/common/Button.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import MovieDetailsHeader from "../components/movies/MovieDetailsHeader.jsx";
import MovieDetailsSkeleton from "../components/movies/MovieDetailsSkeleton.jsx";
import CastList from "../components/movies/CastList.jsx";
import RecommendedMovies from "../components/movies/RecommendedMovies.jsx";
import { useFetch } from "../hooks/useFetch.js";
import { getMovieDetails } from "../services/tmdb/movieService.js";

function MovieDetails() {
  const { id } = useParams();

  const { data: movie, isLoading, error, refetch } = useFetch(
    (signal) => getMovieDetails(id, signal),
    [id]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const isCurrentMovie = movie?.id?.toString() === id;

  if (isLoading || (!isCurrentMovie && !error)) {
    return <MovieDetailsSkeleton />;
  }

  if (error) {
    const isNotFound = error.status === 404;
    return (
      <Container>
        <Section
          title={isNotFound ? "Movie not found" : "Couldn't load this movie"}
        >
          <ErrorMessage
            message={error.message}
            onRetry={isNotFound ? undefined : refetch}
          />
          <p style={{ marginTop: "var(--space-3)" }}>
            <Button to="/browse" variant="secondary">
              Back to browse
            </Button>
          </p>
        </Section>
      </Container>
    );
  }

  if (!movie) return null;

  return (
    <>
      <MovieDetailsHeader movie={movie} />
      <Container>
        <Section title="Cast">
          <CastList cast={movie.credits?.cast ?? []} />
        </Section>
        <RecommendedMovies movieId={movie.id} />
      </Container>
    </>
  );
}

export default MovieDetails;