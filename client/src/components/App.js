import "../styles/App.css";
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import generateToken, { isTokenValid } from "../generateToken";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home/Home";
import NewRelease from "../pages/NewReleases";
import ForgotPassword from "../pages/UserAuth/ForgotPassword";
import Sidebar from "./Sidebar";
import PlayerControls from "./PlayerControls";
import theme from "../styles/MuiTheme";
import { AuthProvider } from "../providers/AuthProvider";
import UserAuth from "../pages/UserAuth/UserAuth";
import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/core/styles";

// import PrivateRoute from "./components/PrivateRoute";

console.log(process.env.REACT_APP_ALBUMS_URL);

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    flexGrow: 1,
  },
}));

//this will return token for spotify api and we will store it inside local storage
function App() {
  const classes = useStyles();
  async function getToken() {
    let token = "";
    token = await generateToken();
    console.log("token", token);
    window.localStorage.setItem("token", token);
  }
  useEffect(() => {
    getToken();
  }, []);

  return (
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
              <Route path="/userauth" element={<UserAuth />} />
              <Route path="/forgotpassword" element={<ForgotPassword />} />
              <Route path="/new-release" element={<NewRelease />} />
            </Routes>
          </main>
          <footer>{/* <PlayerControls /> */}</footer>
        </Router>
      </div>
    </ThemeProvider>
  );
}

export default App;
