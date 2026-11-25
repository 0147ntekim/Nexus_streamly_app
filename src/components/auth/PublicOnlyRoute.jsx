import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth.js";
import PageLoader from "../common/PageLoader.jsx";

function PublicOnlyRoute() {
  const { isAuthenticated, isInitializing } = useAuth();
  const location = useLocation();

  if (isInitializing) return <PageLoader label="Checking your session..." />;
  if (isAuthenticated) {
    const from = location.state?.from;
    const destination = from ? `${from.pathname}${from.search}` : "/home";
    return <Navigate to={destination} replace />;
  }
  return <Outlet />;
}

export default PublicOnlyRoute;
