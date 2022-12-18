import { useSearchParams, Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../firebase/Auth";
import axios from "axios";

const SpotifyCallback = (props) => {
  const { currentUser } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [cookies, setCookie] = useCookies(["spotify_access_token"]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateToken = async () => {
      const { data } = await axios.post(
        "http://localhost:3008/auth/spotify_access_token",
        {
          code: searchParams.get("code"),
        },
      );
      if (data.success) setLoading(false);
    };
    if (searchParams.has("code") && currentUser) generateToken();
  }, [searchParams, currentUser]);

  if (searchParams.has("error"))
    return <h1>Error: {searchParams.get("error")}</h1>;
  if (!searchParams.has("code")) return <h1>Error: No code</h1>;
  if (loading) return <h1>Loading...</h1>;
  if (cookies["spotify_access_token"])
    return <Navigate to="/" replace={true} />;
};

export default SpotifyCallback;
