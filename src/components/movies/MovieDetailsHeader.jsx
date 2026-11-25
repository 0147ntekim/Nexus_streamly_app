import Container from "../layout/Container.jsx";
import Button from "../common/Button.jsx";
import WatchlistButton from "./WatchlistButton.jsx";
import { getImageUrl } from "../../utils/images.js";
import {
  formatYear,
  formatRating,
  formatRuntime,
  formatDate,
} from "../../utils/formatters.js";
import styles from "./MovieDetailsHeader.module.css";

function MovieDetailsHeader({ movie }) {
  const backdropUrl = getImageUrl(movie.backdrop_path, "w1280");
  const posterUrl = getImageUrl(movie.poster_path, "w500");
  const backgroundStyle = backdropUrl
    ? { backgroundImage: `url("${backdropUrl}")` }
    : undefined;

  const director = movie.credits?.crew?.find(
    (person) => person.job === "Director"
  );

  const metaText = [
    formatYear(movie.release_date),
    formatRuntime(movie.runtime),
    `★ ${formatRating(movie.vote_average)}`,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <section className={styles.header} style={backgroundStyle}>
      <div className={styles.overlay} />
      <Container>
        <div className={styles.layout}>
          <div className={styles.posterWrap}>
            {posterUrl ? (
              <img
                src={posterUrl}
                alt={`${movie.title} poster`}
                className={styles.poster}
              />
            ) : (
              <div className={styles.posterFallback}>{movie.title}</div>
            )}
          </div>

          <div className={styles.info}>
            <h1 className={styles.title}>{movie.title}</h1>
            {movie.tagline && <p className={styles.tagline}>{movie.tagline}</p>}
            <p className={styles.meta}>{metaText}</p>

            {movie.genres?.length > 0 && (
              <ul className={styles.genres}>
                {movie.genres.map((genre) => (
                  <li key={genre.id} className={styles.genre}>
                    {genre.name}
                  </li>
                ))}
              </ul>
            )}

            <p className={styles.overview}>
              {movie.overview || "No overview is available for this movie yet."}
            </p>

            <p className={styles.facts}>
              Released: {formatDate(movie.release_date)}
              {director && (
                <>
                  {" "}
                  · Directed by <strong>{director.name}</strong>
                </>
              )}
            </p>

            <div className={styles.actions}>
              <Button to={`/watch/${movie.id}`} size="lg">
                ▶ Play
              </Button>
              <WatchlistButton movie={movie} />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default MovieDetailsHeader;
