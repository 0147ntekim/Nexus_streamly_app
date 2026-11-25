import { useParams } from "react-router-dom";
import Container from "../components/layout/Container.jsx";
import Section from "../components/layout/Section.jsx";
import Button from "../components/common/Button.jsx";
import ErrorMessage from "../components/common/ErrorMessage.jsx";
import PlayerScreen from "../components/player/PlayerScreen.jsx";
import PlayerSkeleton from "../components/player/PlayerSkeleton.jsx";
import UpgradePrompt from "../components/subscription/UpgradePrompt.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useFetch } from "../hooks/useFetch.js";
import { getMovieDetails } from "../services/tmdb/movieService.js";
import { getPlaybackSource } from "../services/video/videoService.js";
import { libraryService } from "../services/libraryService.js";

function Player() {
  const { id } = useParams();
  return <PlayerForMovie key={id} id={id} />;
}

function PlayerForMovie({ id }) {
  const { user } = useAuth();

  const movieState = useFetch(
    (signal) => getMovieDetails(id, signal),
    [id]
  );

  const playbackState = useFetch(async () => {
    const [source, progress] = await Promise.all([
      getPlaybackSource(id),
      libraryService.getProgress(user.id, Number(id)),
    ]);
    return { source, progress };
  }, [id, user.id]);

  if (movieState.isLoading || playbackState.isLoading) {
    return <PlayerSkeleton />;
  }

  const failedState = movieState.error
    ? movieState
    : playbackState.error
      ? playbackState
      : null;

  if (failedState) {
    const { error, refetch } = failedState;
    if (error.code === "SUBSCRIPTION_REQUIRED") {
      return (
        <Container>
          <UpgradePrompt
            requiredPlan={error.details?.requiredPlan}
            movieId={id}
          />
        </Container>
      );
    }

    const isNotFound = error.status === 404;
    return (
      <Container>
        <Section
          title={isNotFound ? "Movie not found" : "Couldn't start playback"}
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

  const movie = movieState.data;
  const playback = playbackState.data;
  if (!movie || !playback) return null;

  const startTime =
    playback.progress && !playback.progress.completed
      ? playback.progress.positionSeconds
      : 0;

  return (
    <PlayerScreen movie={movie} source={playback.source} startTime={startTime} />
  );
}

export default Player;
