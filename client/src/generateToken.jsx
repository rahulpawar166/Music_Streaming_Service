import qs from "qs";
import axios from "axios";

const headers = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
  },
  auth: {
    username: process.env.REACT_APP_CLIENT_ID,
    password: process.env.REACT_APP_CLIENT_SECRET,
  },
};

// export const isTokenValid = (time = 0) => {
//   const currentTime = new Date().getTime();

//   return currentTime < time;
// };

//this token is helpful to call spotify api method

const generateToken = async () => {
  const response = await axios.post(
    `${process.env.REACT_APP_SPOTIFY_TOKEN_REQUEST}`,
    qs.stringify({
      grant_type: "client_credentials",
    }),
    headers,
  );

  // return {
  //   ...response.data,
  //   expires_in: new Date().getTime() + response.data.expires_in * 1000,
  // };
  return response.data.access_token;
};

export default generateToken;
