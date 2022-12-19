const axios = require("axios");
const validate = require("./validate");
const mongoCollections = require("../config/mongoCollections");
const tracks = mongoCollections.tracks;

const getUserRecommendations = async () => {};

const getUserLikes = async () => {};

const removeFromLikes = async () => {};

const getSingleTrack = async () => {};

const getMultipleTracks = async () => {};

module.exports = {
  getUserRecommendations,
  getUserLikes,
  removeFromLikes,
  getSingleTrack,
  getMultipleTracks,
};
