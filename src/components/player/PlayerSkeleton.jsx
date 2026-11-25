import Container from "../layout/Container.jsx";
import Skeleton from "../common/Skeleton.jsx";
import styles from "./PlayerSkeleton.module.css";

function PlayerSkeleton() {
  return (
    <Container>
      <div className={styles.wrapper} role="status">
        <span className="sr-only">Loading player...</span>
        <Skeleton aspectRatio="16 / 9" />
        <Skeleton height="2rem" width="50%" />
        <Skeleton height="1rem" width="30%" />
        <Skeleton height="4rem" />
      </div>
    </Container>
  );
}

export default PlayerSkeleton;
