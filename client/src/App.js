import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Navigation from "./components/Navigation";
import UserAuth from "./components/UserAuth";

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
      </Routes>
    </Router>
  );
}

export default App;
