import { Navigate, Outlet } from "react-router-dom";
import React, { useContext } from "react";
import { AuthContext } from "../firebase/Auth";
import Loading from "./Loading";

const PrivateRoute = () => {
  const { currentUser, userLoading } = useContext(AuthContext);
  if (userLoading) return <Loading />;
  return currentUser ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
