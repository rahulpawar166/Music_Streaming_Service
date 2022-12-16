const playlistRoutes = require("./playlist");

const constructorMethod = (app) => {
  console.log("inside index of routes")
  app.use("/playlist", playlistRoutes);

  app.use("*", (request, response) => {
    response.status(404).json({
      error: "Not found",
    });
  });
};

module.exports = constructorMethod;