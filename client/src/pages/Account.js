import { useContext, useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { AuthContext } from "../firebase/Auth";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import Alert from "@material-ui/lab/Alert";
import { doSignOut } from "../firebase/FirebaseFunctions";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@material-ui/core";
import logo from "../icons/incognitomode2.png";
import ContactlessIcon from "@material-ui/icons/Contactless";

const useStyles = makeStyles({
  alert: {
    width: "40%",
    margin: "0 auto",
  },
  pageRoot: {},
  logo: {
    marginTop: "20px",
    height: 100,
    width: 100,
  },

  title: {
    marginTop: "20px",
    color: "#008c00",
  },
  subTitle: {
    color: "#C84B31",
    textAlign: "center",
  },
  signout: {
    backgroundColor: "#e31f5f",
    color: "#ffffff",
  },
  description: {
    color: "#ffffff",
    textAlign: "center",
  },

  connectSpotify: {
    color: "#5d0000",

    backgroundColor: "#02A82F",
    "&:hover": {
      backgroundColor: "#038B28",
    },
  },
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

  const disconnectSpotify = () => {
    removeCookie("spotify_connected");
  };

  const generateSpotifyToken = () => {
    const cookieState = Math.random().toString().substring(2, 18);
    const queryString = new URLSearchParams();
    Object.entries({
      response_type: "code",
      client_id: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
      scope:
        "user-read-email user-read-private user-read-recently-played user-read-playback-position user-top-read user-library-modify user-library-read streaming app-remote-control ugc-image-upload user-read-playback-state user-modify-playback-state",
      redirect_uri: process.env.REACT_APP_SPOTIFY_REDIRECT_URI,
      state: cookieState,
    }).map(([key, value]) => queryString.set(key, value));
    window.location.href =
      "https://accounts.spotify.com/authorize?" + queryString.toString();
  };
  let connected = cookies.spotify_connected === "true";
  return (
    <Box className={classes.pageRoot}>
      <a href="/">
        <img
          className={classes.logo}
          src={logo}
          alt="logo"
          width={100}
          height={100}
        />
      </a>
      <h1 className={classes.title}>Account</h1>
      <h2 className={classes.subTitle}>
        {currentUser ? `Hello ${currentUser.displayName},` : "Not logged in!"}
      </h2>
      <p className={classes.description}>
        Welcome to Incognito,
        <br />
        Incognito provides music streaming service, and to enjoy this music
        service we need your Spotify Premium <br />
        account to get connected with our server. So please take some moment and
        connect your Spotify Premium <br />
        acoount with us and enjoy seamless music streaming by Incognito!!!
      </p>
      {!connected && (
        <Alert className={classes.alert} severity="error">
          Please connect your Spotify account! Incognito requires a Spotify
          Premium plan to use!
        </Alert>
      )}
      <br />
      <Button
        className={classes.connectSpotify}
        variant={connected ? "contained" : "contained"}
        onClick={connected ? disconnectSpotify : generateSpotifyToken}
        startIcon={<ContactlessIcon />}
      >
        {connected ? "Disconnect Spotify" : "Connect your Spotify"}
      </Button>
      <br />
      <br />
      <Button
        className={classes.signout}
        variant="contained"
        color="secondary"
        onClick={handleSignOut}
      >
        Sign Out
      </Button>
    </Box>
  );
};

export default Account;
