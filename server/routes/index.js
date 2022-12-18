const playlistRoutes = require("./playlist");
const spotifyAuthRoutes = require("./auth");
const albumRoutes = require("./albums");
const lyricsRoutes = require("./lyrics");

const constructorMethod = (app) => {
  app.use("/playlist", playlistRoutes);
  app.use("/lyrics", lyricsRoutes);
  app.use("/auth", spotifyAuthRoutes);
  app.use("/albums", albumRoutes);

  // Respond with 404 on undefined routes
  app.use("*", (req, res) => res.status(404).json({ error: "Not found" }));
};

module.exports = constructorMethod;
