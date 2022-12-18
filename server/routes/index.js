const playlistRoutes = require("./playlist");
const spotifyAuthRoutes = require("./auth");
const albumRoutes = require("./albums");

const constructorMethod = (app) => {
  app.use("/auth", spotifyAuthRoutes);
  app.use("/playlist", playlistRoutes);
  app.use("/albums", albumRoutes);

  // Respond with 404 on undefined routes
  app.use("*", (req, res) => res.status(404).json({ error: "Not found" }));
};

module.exports = constructorMethod;
