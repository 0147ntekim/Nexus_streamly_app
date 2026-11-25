import Container from "../layout/Container.jsx";
import Button from "../common/Button.jsx";
import WatchlistButton from "../movies/WatchlistButton.jsx";
import VideoPlayer from "./VideoPlayer.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import { usePlaybackProgress } from "../../hooks/usePlaybackProgress.js";
import { getImageUrl } from "../../utils/images.js";
import {
  formatYear,
  formatRating,
  formatRuntime,
} from "../../utils/formatters.js";
import styles from "./PlayerScreen.module.css";

function PlayerScreen({ movie, source, startTime }) {
  const { user } = useAuth();
  const { reportProgress, saveError } = usePlaybackProgress({
    movie,
    userId: user.id,
  });

  const poster = getImageUrl(movie.backdrop_path, "w1280");
  const metaText = [
    formatYear(movie.release_date),
    formatRuntime(movie.runtime),
    `★ ${formatRating(movie.vote_average)}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Container>
      <div className={styles.screen}>
        <VideoPlayer
          source={source}
          poster={poster}
          title={movie.title}
          startTime={startTime}
          onProgress={reportProgress}
        />

        <div className={styles.info}>
          <h1 className={styles.title}>{movie.title}</h1>
          <p className={styles.meta}>{metaText}</p>
          <p className={styles.overview}>
            {movie.overview || "No overview is available for this movie yet."}
          </p>

          {saveError && (
            <p className={styles.progressError} role="alert">
              {saveError}
            </p>
          )}

          {source.isDemo && (
            <p className={styles.notice}>
              Demo playback: this app does not have streaming rights to this
              title, so a freely licensed sample film plays instead.{" "}
              {source.attribution}. A licensed catalogue would be connected
              through the video provider.
            </p>
          )}

          <div className={styles.actions}>
            <Button to={`/movie/${movie.id}`} variant="secondary" size="lg">
              Movie details
            </Button>
            <WatchlistButton movie={movie} />
          </div>
        </div>
      </div>
    </Container>
  );
}

export default PlayerScreen;
