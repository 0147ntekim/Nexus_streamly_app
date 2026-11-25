import Container from "../layout/Container.jsx";
import Button from "../common/Button.jsx";
import Skeleton from "../common/Skeleton.jsx";
import { getImageUrl } from "../../utils/images.js";
import { formatYear, formatRating } from "../../utils/formatters.js";
import styles from "./HeroBanner.module.css";

function HeroBanner({ movie, isLoading = false, actions }) {
  if (isLoading) {
    return (
      <section className={styles.hero}>
        <Container>
          <div className={styles.content}>
            <Skeleton height="2.5rem" width="70%" />
            <Skeleton height="1rem" width="30%" />
            <Skeleton height="4rem" />
          </div>
        </Container>
      </section>
    );
  }

  if (!movie) return null;

  const backdropUrl = getImageUrl(movie.backdrop_path, "w1280");
  const backgroundStyle = backdropUrl
    ? { backgroundImage: `url("${backdropUrl}")` }
    : undefined;

  // NEW: default buttons used when the parent doesn't pass `actions`
  const defaultActions = (
    <>
      <Button to={`/watch/${movie.id}`} size="lg">
        ▶ Play
      </Button>
      <Button to={`/movie/${movie.id}`} variant="secondary" size="lg">
        More info
      </Button>
    </>
  );

  return (
    <section className={styles.hero} style={backgroundStyle}>
      <div className={styles.overlay} />
      <Container>
        <div className={styles.content}>
          <h1 className={styles.title}>{movie.title}</h1>
          <p className={styles.meta}>
            {formatYear(movie.release_date)} · ★ {formatRating(movie.vote_average)}
          </p>
          <p className={styles.overview}>{movie.overview}</p>
          <div className={styles.actions}>{actions ?? defaultActions}</div>
        </div>
      </Container>
    </section>
  );
}

export default HeroBanner;