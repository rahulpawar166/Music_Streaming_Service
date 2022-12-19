import axios from "axios";
import React, { useState, useEffect } from "react";
import firebaseApp from "./Firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setUserLoading(false);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, userLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
