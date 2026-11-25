import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout.jsx";
import ProtectedRoute from "../components/auth/ProtectedRoute.jsx";
import PublicOnlyRoute from "../components/auth/PublicOnlyRoute.jsx";

import Landing from "../pages/Landing.jsx";
import Login from "../pages/Login.jsx";
import Signup from "../pages/Signup.jsx";
import Home from "../pages/Home.jsx";
import Browse from "../pages/Browse.jsx";
import MovieDetails from "../pages/MovieDetails.jsx";
import Player from "../pages/Player.jsx";
import Subscription from "../pages/Subscription.jsx";
import Profile from "../pages/Profile.jsx";
import NotFound from "../pages/NotFound.jsx";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Landing />} />
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/watch/:id" element={<Player />} />
          <Route path="/subscription" element={<Subscription />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;