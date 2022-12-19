import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../firebase/Auth";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { useNavigate } from "react-router-dom";

const Account = () => {
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  const handleSignOut = () => {
    doSignOut();
    navigate("/signin");
  };

  const generateSpotifyToken = () => {
    const cookieState = Math.random().toString().substring(2, 18);
    const queryString = new URLSearchParams();
    Object.entries({
      response_type: "code",
      client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
      scope:
        "user-read-email user-read-private user-read-recently-played user-read-playback-position user-top-read user-library-modify user-library-read streaming app-remote-control ugc-image-upload",
      redirect_uri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI,
      state: cookieState,
    }).map(([key, value]) => queryString.set(key, value));
    window.location.href =
      "https://accounts.spotify.com/authorize?" + queryString.toString();
  };

  return (
    <Box>
      <h1>
        {currentUser
          ? `Logged In As: ${currentUser.displayName}`
          : "Not logged in!"}
      </h1>
      <Button
        variant={spotifyConnected ? "disabled" : "contained"}
        onClick={generateSpotifyToken}
      >
        {spotifyConnected ? "Spotify Connected!" : "Connect your Spotify"}
      </Button>
      <br />
      <br />
      <Button variant="contained" color="secondary" onClick={handleSignOut}>
        Sign Out
      </Button>
    </Box>
  );
};

export default Account;
