import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import ForgotPassword from "../pages/ForgotPassword";
import Account from "../pages/Account";
import Home from "../pages/Home";
import NewReleases from "../pages/NewReleases";
import Sidebar from "./Sidebar";
// import Player from "./Player";
import theme from "../styles/MuiTheme";
import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";
import AlbumSong from "../pages/AlbumSong";
import Categories from '../pages/Categories'
import Album from "@material-ui/icons/Album";
import axios from "axios";
import PlayList from "../pages/PlayList";
import Search from "./Search";
import SpotifyCallback from "./SpotifyCallback";
import PrivateRoute from "./PrivateRoute";
import SpotifyPrivateRoute from "./SpotifyPrivateRoute";
import Lyrics from "./Lyrics";
import IndPlayList from "../pages/IndPlayList";

import Lyrics from "./Lyrics"

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
  },
}));

function App() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Helmet>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Helmet>
      <Router>
        <Sidebar />
        <main className={classes.content}>
          <Routes>
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
            <Route element={<PrivateRoute />}>
              <Route path="/account" element={<Account />} />
              <Route path="/spotifycallback" element={<SpotifyCallback />} />
              <Route element={<SpotifyPrivateRoute />}>
                <Route path="/search" element={<Search />} />
                <Route path="/new-releases" element={<NewReleases />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/category/:id" element={<Category />} />
                <Route path="/album/:id" element={<AlbumDetails />} />
                <Route path="/" element={<Home />} />
                <Route path="/library" element={<Library />} />
                <Route path="/playlist/:id" element={<Playlist />} />
                <Route path="/lyrics/:artist/:trackName" element={<Lyrics />} />
              </Route>
              <Route
                path="/IndPlayList/:PlaylistName"
                element={<IndPlayList />}
              />
            </Route>
            <Route
              path="*"
              element={<Error message="Error 404: That page does not exist!" />}
            />
          </Routes>
        </main>
      </Router>
    </div>
  );
}

export default App;
