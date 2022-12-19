import { useCookies } from "react-cookie";
import { Navigate, Outlet } from "react-router-dom";

const SpotifyPrivateRoute = () => {
  const [cookies] = useCookies([]);
  return cookies.spotify_connected === "true" ? (
    <Outlet />
  ) : (
    <Navigate to="/account" />
  );
};

export default SpotifyPrivateRoute;
