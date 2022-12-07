import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navigation from "./components/Navigation";
import UserAuth from "./pages/UserAuth/UserAuth";
import ForgotPassword from "./pages/UserAuth/ForgotPassword";

// import PrivateRoute from "./components/PrivateRoute";
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navigation />
        </header>
      </div>
      <Routes>
        {/*<Route path="/" element={<Landing />} />
           <Route path="/home" element={<PrivateRoute />}>
            <Route path="/home" element={<Home />} />
          </Route>
          <Route path="/account" element={<PrivateRoute />}>
            <Route path="/account" element={<Account />} />
          </Route> */}
        <Route path="/userauth" element={<UserAuth />} />
        <Route path="/forgotpassword" element={<ForgotPassword />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
