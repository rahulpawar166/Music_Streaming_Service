import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./firebase/Auth";
import { CookiesProvider } from "react-cookie";

require("dotenv").config();
// console.log(process.env);
ReactDOM.render(
  <AuthProvider>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </AuthProvider>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
