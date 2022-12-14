import "../styles/App.css";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import generateToken from "../generateToken";
import { AuthProvider } from "../firebase/Auth";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import ForgotPassword from "../pages/ForgotPassword";
// import PrivateRoute from "./components/PrivateRoute";
import Home from "../pages/Home";
import NewReleases from "../pages/NewReleases";
import Sidebar from "./Sidebar";
import Player from "./Player";
import theme from "../styles/MuiTheme";
import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";
import AlbumSong from "../pages/AlbumSong";
import axios from "axios";
import PlayList from "../pages/PlayList";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
  },
}));

function App() {
  const [playListId, setPlayListId] = useState();

  const classes = useStyles();
  async function getToken() {
    let token = "";
    token = await generateToken();
    window.localStorage.setItem("token", token);
  }
  // Hook to generate token for Spotify's API and cache in localStorage
  useEffect(() => {
    getToken();
  }, []);

  const createPlaylist = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3008/playlist/create/myplayList`,
      );
      console.log(data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    createPlaylist();
  }, []);

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <Helmet>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Helmet>
        <div className={classes.root}>
          <Router>
            <Sidebar />
            <main className={classes.content}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/forgotpassword" element={<ForgotPassword />} />
                <Route path="/new-releases" element={<NewReleases />} />
                <Route path="/AlbumSong/:AlbumId" element={<AlbumSong />} />
                <Route path="/playlists" element={<PlayList />} />
              </Routes>
            </main>
            <Player />
          </Router>
        </div>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
