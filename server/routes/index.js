const playlistRoutes = require("./playlist");

const constructorMethod = (app) => {
  app.use("/playlist", playlistRoutes);

  app.use("*", (request, response) => {
    response.status(404).json({
      error: "Not found",
    });
  });
};

module.exports = constructorMethod;