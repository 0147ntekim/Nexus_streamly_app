import Container from "../layout/Container.jsx";
import Skeleton from "../common/Skeleton.jsx";
import styles from "./MovieDetailsSkeleton.module.css";

function MovieDetailsSkeleton() {
  return (
    <section className={styles.header} role="status">
      <span className="sr-only">Loading movie details...</span>
      <Container>
        <div className={styles.layout}>
          <div className={styles.poster}>
            <Skeleton aspectRatio="2 / 3" />
          </div>
          <div className={styles.info}>
            <Skeleton height="2.5rem" width="60%" />
            <Skeleton height="1rem" width="35%" />
            <Skeleton height="1.5rem" width="45%" />
            <Skeleton height="5rem" />
            <Skeleton height="3rem" width="50%" />
          </div>
        </div>
      </Container>
    </section>
  );
}

export default MovieDetailsSkeleton;
