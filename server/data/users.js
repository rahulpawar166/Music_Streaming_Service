const validate = require("./validate");
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;

// Stores the token used to refresh access for user's Spotify account
const storeRefreshToken = async (uid, token) => {
  const usersCollection = await users();
  const result = await usersCollection.updateOne(
    { uid: uid },
    { $set: { refresh_token: token } },
    { upsert: true },
  );
  if (!result) throw `Failed to update refresh token for user ${uid}`;
  return token;
};

const storeAccessToken = async (uid, token) => {
  const usersCollection = await users();
  const result = await usersCollection.updateOne(
    { uid: uid },
    { $set: { access_token: token } },
    { upsert: true },
  );
  if (!result) throw `Failed to update access token for user ${uid}`;
  return token;
};

// Retrieves the refresh token for a given user
const getRefreshToken = async (uid) => {
  const usersCollection = await users();
  const result = await usersCollection.findOne({ uid: uid });
  if (!result) throw `User ${uid} not found!`;
  return result.refresh_token;
};

const getAccessToken = async (uid) => {
  const usersCollection = await users();
  const result = await usersCollection.findOne({ uid: uid });
  if (!result) throw `User ${uid} not found!`;
  return result.access_token;
};

module.exports = {
  storeRefreshToken,
  storeAccessToken,
  getRefreshToken,
  getAccessToken,
};
