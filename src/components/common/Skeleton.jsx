import styles from "./Skeleton.module.css";

function Skeleton({ width = "100%", height, aspectRatio, radius }) {
  return (
    <div
      className={styles.skeleton}
      style={{ width, height, aspectRatio, borderRadius: radius }}
      aria-hidden="true"
    />
  );
}

export default Skeleton;