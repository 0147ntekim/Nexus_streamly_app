import Skeleton from "../common/Skeleton.jsx";
import styles from "./MovieCardSkeleton.module.css";

function MovieCardSkeleton() {
  return (
    <div className={styles.wrapper}>
      <Skeleton aspectRatio="2 / 3" />
      <Skeleton height="0.9rem" width="80%" />
      <Skeleton height="0.75rem" width="35%" />
    </div>
  );
}

export default MovieCardSkeleton;