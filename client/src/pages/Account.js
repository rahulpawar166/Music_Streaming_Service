import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { AuthContext } from "../firebase/Auth";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles({
  alert: {
    width: "40%",
    margin: "0 auto",
  },
  pageRoot: {},
});

const Account = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["spotify_connected"]);
  const { currentUser } = useContext(AuthContext);

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
  let connected = cookies.spotify_connected === "true";
  return (
    <Box className={classes.pageRoot}>
      <h1>
        {currentUser
          ? `Username: ${currentUser.displayName}`
          : "Not logged in!"}
      </h1>
      {!connected && (
        <Alert className={classes.alert} severity="error">
          Please connect your Spotify account! Incognito requires a Spotify
          Premium plan to use!
        </Alert>
      )}
      <br />
      <Button
        variant={connected ? "disabled" : "contained"}
        onClick={generateSpotifyToken}
      >
        {connected ? "Spotify Connected!" : "Connect your Spotify"}
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
