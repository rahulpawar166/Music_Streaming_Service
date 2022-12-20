import { useSearchParams, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Error from "./Error";
import Loading from "./Loading";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../firebase/Auth";
import axios from "axios";

const SpotifyCallback = (props) => {
  const { currentUser } = useContext(AuthContext);
  const [cookies, setCookie, removeCookie] = useCookies(["spotify_connected"]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateToken = async () => {
      const userToken = await currentUser.getIdToken();
      const { data } = await axios.post(
        "http://localhost:3008/auth/spotify_access_token",
        {
          code: searchParams.get("code"),
        },
        {
          headers: {
            FirebaseIdToken: userToken,
          },
        },
      );
      if (data.success) {
        setCookie("spotify_connected", "true");
        setLoading(false);
        window.localStorage.setItem("accessToken", data.access_token)
      }
    };
    if (searchParams.has("code") && currentUser) generateToken();
  }, [searchParams, currentUser]);

  if (searchParams.has("error"))
    return <Error message={searchParams.get("error")} />;
  if (!searchParams.has("code")) return <Error message="No code" />;
  if (loading) return <Loading />;
  return <Navigate to="/" replace={true} />;
};

export default SpotifyCallback;
