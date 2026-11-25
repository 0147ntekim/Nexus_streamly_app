import Button from "./Button.jsx";
import styles from "./ErrorMessage.module.css";

function ErrorMessage({ message = "Something went wrong.", onRetry }) {
  return (
    <div className={styles.box} role="alert">
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export default ErrorMessage;