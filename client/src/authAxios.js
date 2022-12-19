import axios from "axios";

let authAxios = axios.create();

authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("firebase_token");
    if (token) {
      config.headers.FirebaseIdToken = token;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);

export default authAxios;
