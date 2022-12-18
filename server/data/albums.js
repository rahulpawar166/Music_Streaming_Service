const mongoCollections = require("../config/mongoCollections");
const playlist = mongoCollections.playlist;
let { ObjectId } = require("mongodb");

const getNewReleases = async (access_token) => {};

module.exports = {
  getNewReleases,
};
