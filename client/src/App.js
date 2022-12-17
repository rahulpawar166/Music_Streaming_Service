import React, { useEffect } from "react";
import "./App.css";
import generateToken, { isTokenValid } from "./generateToken";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NewRelease from "./components/NewRelease";
import Navigation from "./components/Navigation";

import Home from "./components/Home";
import { AuthProvider } from "./providers/AuthProvider";

import UserAuth from "./pages/UserAuth/UserAuth";
import ForgotPassword from "./pages/UserAuth/ForgotPassword";
import Search from "./components/Search";



// import PrivateRoute from "./components/PrivateRoute";

console.log(process.env.REACT_APP_ALBUMS_URL);

//this will return token for spotify api and we will store it inside local storage
function App() {
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
    <Router>
      <div className="App">
        <header className="App-header">
          <Navigation />
        </header>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/userauth" element={<UserAuth />} />


        <Route path="/new-release" element={<NewRelease />} />
        <Route path="/search" element={<Search />} />
        <Route path="/forgotpassword" element={<ForgotPassword />}></Route>

      </Routes>
    </Router>
  );
}

export default App;
