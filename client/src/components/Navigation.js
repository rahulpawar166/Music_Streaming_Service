import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Auth, AppUserLogout } from "../firebase/Firebase";
import { onAuthStateChanged } from "firebase/auth";
import NewRelease from "./NewRelease";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../App.css";
const auth = Auth();

const Navigation = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("userinnavbar", user);
        setUser(user);
        localStorage.setItem("user", JSON.stringify(user));

        setIsLoading(false);
      } else {
        localStorage.removeItem("user");
        setUser(null);
      }
    });
  }, []);

  return <div>{user ? <NavigationAuth /> : <NavigationNonAuth />}</div>;
};

const handleSignOut = (event) => {
  AppUserLogout();
  localStorage.removeItem("user");
  toast.info("Logged Out");
  // navigate("/");
  setTimeout(() => {
    window.location.reload();
  }, 1000);
};

const NavigationAuth = () => {
  return (
    <div>
      <nav className="navigation">
        <ul>
          <li>
            <NavLink to="/">Landing</NavLink>
          </li>
          <li>
            <NavLink to="/home">Home</NavLink>
          </li>
          <li>
            <NavLink to="/account">Account</NavLink>
          </li>
          <li>
            <NavLink to="/new-release">new-relese</NavLink>
          </li>
          <li>
            <NavLink to="/" onClick={handleSignOut}>
              Sign Out
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

const NavigationNonAuth = () => {
  return (
    <nav className="navigation">
      <ul>
        <li>
          <NavLink to="/">Landing</NavLink>
        </li>
        <li>
          <NavLink to="/userauth">Login</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
