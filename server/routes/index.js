const playlistRoutes = require("./playlists");
const spotifyAuthRoutes = require("./auth");
const meRoutes = require("./me");
const albumRoutes = require("./albums");
const lyricsRoutes = require("./lyrics");
const categoriesRoutes = require("./categories");
const categoriesPlaylistRoutes = require("./categoryPlaylist");
const searchRoutes = require("./search");
const trackRoutes = require("./tracks");
const artistsRoutes = require("./artists");

const constructorMethod = (app) => {
  app.use("/playlists", playlistRoutes);
  app.use("/lyrics", lyricsRoutes);
  app.use("/auth", spotifyAuthRoutes);
  app.use("/albums", albumRoutes);
  app.use("/me", meRoutes);
  app.use("/categories", categoriesRoutes);
  app.use("/search", searchRoutes);
  app.use("/tracks", trackRoutes);
  app.use("/categoryPlaylist", categoriesPlaylistRoutes);
  app.use("/artists", artistsRoutes);

  // Respond with 404 on undefined routes
  app.use("*", (req, res) => res.status(404).json({ error: "Not found" }));
};

module.exports = constructorMethod;
