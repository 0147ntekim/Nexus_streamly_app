import styles from "./FormField.module.css";

function FormField({ id, label, error, hint, rightElement, ...inputProps }) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const describedBy = [error ? errorId : null, hint ? hintId : null]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>{label}</label>
      <div className={`${styles.control} ${error ? styles.invalid : ""}`}>
        <input
          id={id}
          className={styles.input}
          aria-invalid={error ? "true" : "false"}
          aria-describedby={describedBy || undefined}
          {...inputProps}
        />
        {rightElement}
      </div>
      {hint && !error && <p id={hintId} className={styles.hint}>{hint}</p>}
      {error && <p id={errorId} className={styles.error}>{error}</p>}
    </div>
  );
}

export default FormField;
