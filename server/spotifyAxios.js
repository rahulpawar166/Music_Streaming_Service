const axios = require("axios");
const usersData = require("./data").usersData;

const refreshAccessToken = async (uid) => {
  const refreshToken = await usersData.getRefreshToken(uid);
  const { data } = await axios({
    url: "https://accounts.spotify.com/api/token",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${new Buffer(
        process.env.REACT_APP_SPOTIFY_CLIENT_ID +
          ":" +
          process.env.REACT_APP_SPOTIFY_CLIENT_SECRET,
      ).toString("base64")}`,
    },
    data: qs.stringify({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!data)
    throw `Failed to refresh access token: no response from Spotify API!`;
  await usersData.storeAccessToken(uid, data.access_token);
  return data.access_token;
};

const buildSpotifyAxiosInstance = async (uid) => {
  const spotifyAxiosInstance = axios.create();

  spotifyAxiosInstance.interceptors.request.use(
    async (config) => {
      const access_token = await usersData.getAccessToken(uid);
      if (access_token && !config.headers["Authorization"])
        config.headers["Authorization"] = `Bearer ${access_token}`;
      return config;
    },
    (error) => {
      Promise.reject(error);
    },
  );

  spotifyAxiosInstance.interceptors.response.use(
    async (response) => {
      return response;
    },
    async function (error) {
      if (error.response) {
        const originalRequest = error.config;
        if (
          (error.response.status === 403 || error.response.status === 401) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;
          const access_token = await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return axios(originalRequest);
        }
      }
      return Promise.reject(error);
    },
  );

  return spotifyAxiosInstance;
};

module.exports = buildSpotifyAxiosInstance;
