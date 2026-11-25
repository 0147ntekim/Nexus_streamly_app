import { Link } from "react-router-dom";
import { getImageUrl } from "../../utils/images.js";
import { formatYear, formatRating } from "../../utils/formatters.js";
import styles from "./MovieCard.module.css";

function MovieCard({ movie }) {
  const { id, title, poster_path, vote_average, release_date } = movie;
  const posterUrl = getImageUrl(poster_path, "w500");

  return (
    <Link to={`/movie/${id}`} className={styles.card}>
      <div className={styles.posterWrapper}>
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={`${title} poster`}
            loading="lazy"
            className={styles.poster}
          />
        ) : (
          <div className={styles.fallback}>{title}</div>
        )}
        <span className={styles.rating}>★ {formatRating(vote_average)}</span>
      </div>
      <div className={styles.info}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.year}>{formatYear(release_date)}</p>
      </div>
    </Link>
  );
}

export default MovieCard;