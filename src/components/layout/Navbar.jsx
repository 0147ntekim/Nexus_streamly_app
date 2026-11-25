import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import Button from "../common/Button.jsx";
import { useAuth } from "../../hooks/useAuth.js";
import styles from "./Navbar.module.css";

const NAV_LINKS = [
  { to: "/home", label: "Home" },
  { to: "/browse", label: "Browse" },
  { to: "/subscription", label: "Plans" },
  { to: "/profile", label: "Profile" },
];

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, isInitializing, logout } = useAuth();
  const navigate = useNavigate();

  const closeMenu = () => setIsMenuOpen(false);

  async function handleLogout() {
    closeMenu();
    await logout();
    navigate("/", { replace: true });
  }

  function renderAuthArea() {
    if (isInitializing) return null;

    if (isAuthenticated) {
      return (
        <>
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              onClick={closeMenu}
              className={({ isActive }) =>
                isActive ? `${styles.link} ${styles.active}` : styles.link
              }
            >
              {link.label}
            </NavLink>
          ))}
          <span className={styles.greeting}>Hi, {user.fullName.split(" ")[0]}</span>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            Log out
          </Button>
        </>
      );
    }

    return (
      <>
        <Button to="/login" variant="ghost" size="sm" onClick={closeMenu}>
          Log in
        </Button>
        <Button to="/signup" size="sm" onClick={closeMenu}>
          Sign up
        </Button>
      </>
    );
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link
          to={isAuthenticated ? "/home" : "/"}
          className={styles.logo}
          onClick={closeMenu}
        >
          STREAMLY
        </Link>

        <button
          type="button"
          className={styles.toggle}
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls="primary-nav"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>

        <nav
          id="primary-nav"
          className={`${styles.nav} ${isMenuOpen ? styles.open : ""}`}
        >
          {renderAuthArea()}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;