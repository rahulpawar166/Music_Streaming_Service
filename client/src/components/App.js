import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Helmet } from "react-helmet";
import SignUp from "../pages/SignUp";
import SignIn from "../pages/SignIn";
import ForgotPassword from "../pages/ForgotPassword";
import Account from "../pages/Account";
import Home from "../pages/Home";
import NewReleases from "../pages/NewReleases";
import Sidebar from "./Sidebar";
import Categories from "../pages/Categories";
import Player from "./Player";
import { makeStyles } from "@material-ui/core/styles";
import AlbumDetails from "../pages/AlbumDetails";
import PlayList from "../pages/PlayList";
import Search from "./Search";
import SpotifyCallback from "./SpotifyCallback";
import PrivateRoute from "./PrivateRoute";
import Lyrics from "./Lyrics";

import "../styles/App.css";
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
              <Route path="/search" element={<Search />} />
              <Route path="/new-releases" element={<NewReleases />} />
              <Route path="/categories/:id" element={<Categories />} />
              <Route path="/album/:id" element={<AlbumDetails />} />
              <Route path="/" element={<Home />} />
              <Route path="/playlists" element={<PlayList />} />
              <Route path="/lyrics/:artist/:trackName" element={<Lyrics />} />
              <Route path="/account" element={<Account />} />
              <Route path="/spotifycallback" element={<SpotifyCallback />} />
            </Route>
          </Routes>
        </main>
        {/* <Player /> */}
      </Router>
    </div>
  );
}

export default App;
