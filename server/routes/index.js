// const { use } = require("./playlist");
const playlistRoutes = require("./playlist");
const lyricsRoutes = require("./lyrics")

const constructorMethod = (app) => {
  app.use("/playlist", playlistRoutes);
  app.use("/lyrics", lyricsRoutes)

  app.use("*", (request, response) => {
    response.status(404).json({
      error: "Not found",
    });
  });
};

module.exports = constructorMethod;