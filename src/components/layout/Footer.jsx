import { Link } from "react-router-dom";
import Container from "./Container.jsx";
import styles from "./Footer.module.css";

function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        <div className={styles.grid}>
          <div>
            <p className={styles.brand}>STREAMLY</p>
            <p className={styles.muted}>
              A movie streaming interface built as a learning project.
            </p>
          </div>
          <nav className={styles.column} aria-label="Explore">
            <h3 className={styles.heading}>Explore</h3>
            <Link to="/browse">Browse</Link>
            <Link to="/subscription">Plans</Link>
          </nav>
          <nav className={styles.column} aria-label="Account">
            <h3 className={styles.heading}>Account</h3>
            <Link to="/login">Log in</Link>
            <Link to="/signup">Sign up</Link>
          </nav>
        </div>
        <p className={styles.legal}>
          © {new Date().getFullYear()} Streamly. Movie data provided by TMDB.
          This product uses the TMDB API but is not endorsed or certified by TMDB.
        </p>
      </Container>
    </footer>
  );
}

export default Footer;