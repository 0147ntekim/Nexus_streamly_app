import styles from "./Alert.module.css";

function Alert({ variant = "error", children }) {
  // variant: "error" | "success" | "info"
  return (
    <div
      className={`${styles.alert} ${styles[variant]}`}
      role={variant === "error" ? "alert" : "status"}
    >
      {children}
    </div>
  );
}

export default Alert;
