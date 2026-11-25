import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext.js";
import { authService } from "../services/authService.js";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    async function restoreSession() {
      try {
        const currentUser = await authService.getCurrentUser();
        if (!isCancelled) setUser(currentUser);
      } catch {
        if (!isCancelled) setUser(null);
      } finally {
        if (!isCancelled) setIsInitializing(false);
      }
    }

    restoreSession();
    return () => {
      isCancelled = true;
    };
  }, []);

  async function login(credentials) {
    const loggedInUser = await authService.login(credentials);
    setUser(loggedInUser);
    return loggedInUser;
  }

  async function signup(details) {
    return authService.register(details);
  }

  async function logout() {
    await authService.logout();
    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: user !== null,
    isInitializing,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
