import styles from "./AuthCard.module.css";

function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
        {children}
        {footer && <p className={styles.footer}>{footer}</p>}
      </div>
    </div>
  );
}

export default AuthCard;
