import styles from "./PageLoader.module.css";

function PageLoader({ label = "Loading..." }) {
  return (
    <div className={styles.wrapper} role="status" aria-live="polite">
      <div className={styles.spinner} />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export default PageLoader;
