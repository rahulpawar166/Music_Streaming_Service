const playlists = require("../config/mongoCollections").playlists;
const spawnSync = require("child_process").spawnSync;
let { ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const download = require("download");

const createPlaylist = async (ownerId, name, public, tracks) => {
  const playlistCollection = await playlists();
  const result = await playlistCollection.insertOne({
    ownerId: ownerId,
    name: name || "New Playlist",
    cover: "/images/default-cover.jpg",
    public: public || false,
    tracks: tracks || [],
  });
  if (!result.acknowledged) throw `Inserting playlist ${name} failed`;
  return {
    _id: result.insertedId.toString(),
    name: name,
  };
};

const getPlaylist = async (ownerId, playlistId) => {
  const playlistCollection = await playlists();
  const result = await playlistCollection.findOne({
    _id: ObjectId(playlistId),
  });
  if (!result) throw `No playlist with id ${playlistId} found`;
  if (ownerId !== result.ownerId)
    throw `Playlist ${playlistId} does not belong to ${ownerId}`;
  return result;
};

const updatePlaylist = async (ownerId, playlistId, name, public, cover) => {
  const playlistCollection = await playlists();
  const result = await playlistCollection.findOneAndUpdate(
    {
      _id: ObjectId(playlistId),
      ownerId: ownerId,
    },
    {
      $set: {
        name: name,
        public: public,
        cover: cover,
      },
    },
    {
      returnDocument: "after",
    },
  );
  if (result.matchedCount === 0)
    throw `No playlist with id ${playlistId} found`;
  if (result.modifiedCount === 0)
    throw `Playlist with id ${playlistId} was not updated`;
  return result.value;
};

const deletePlaylist = async (ownerId, playlistId) => {
  const playlistCollection = await playlists();
  const result = await playlistCollection.deleteOne({
    _id: ObjectId(playlistId),
    ownerId: ownerId,
  });
  if (result.deletedCount < 1) throw `Deleting playlist ${playlistId} failed`;
  return { id: playlistId, deleted: true };
};

const addTrack = async (ownerId, playlistId, track) => {
  const playlistCollection = await playlists();
  const findResult = await playlistCollection.findOne({
    _id: ObjectId(playlistId),
    ownerId: ownerId,
  });
  if (!findResult) throw `No playlist with id ${playlistId} found`;
  if (findResult.tracks.find((dbTrack) => dbTrack.id === track.id)) {
    throw `That track is already in playlist with id ${playlistId}`;
  }
  const result = await playlistCollection.findOneAndUpdate(
    {
      _id: ObjectId(playlistId),
      ownerId: ownerId,
    },
    {
      $push: {
        tracks: track,
      },
    },
    {
      returnDocument: "after",
    },
  );
  if (result.modifiedCount === 0)
    throw `Track with id ${track.trackId} was not added to playlist with id ${playlistId}`;
  if (
    result.value.tracks.length === 1 ||
    result.value.tracks.length === 4 ||
    result.value.tracks.length === 9
  ) {
    let fileArray = [];
    await Promise.all(
      result.value.tracks.slice(0, 9).map(async (element) => {
        const imagePath = path.resolve("./", "images");
        const filename = `${element.id}.jpeg`;
        const fullFileName = path.resolve(imagePath, filename);
        fileArray.push(fullFileName);
        if (!fs.existsSync(fullFileName)) {
          await download(element.imageUrl, imagePath, {
            filename: filename,
          });
          return;
        }
        return;
      }),
    );
    let coverFilename = `cover-${result.value._id}.jpg`;
    let montageResult = spawnSync("magick", [
      "montage",
      ...fileArray,
      coverFilename,
    ]);
    console.log(montageResult);
    let mvResult = spawnSync("mv", [
      path.join(__dirname, "..", coverFilename),
      path.join(__dirname, "..", "..", "client", "public", "images"),
    ]);
    console.log(mvResult);
    const updateCoverResult = await playlistCollection.findOneAndUpdate(
      {
        _id: ObjectId(playlistId),
        ownerId: ownerId,
      },
      {
        $set: {
          cover: `/images/${coverFilename}`,
        },
      },
      {
        returnDocument: "after",
      },
    );
    return updateCoverResult.value;
  }
  return result.value;
};

const removeTrack = async (ownerId, playlistId, trackId) => {
  console.log("we reached backend with", ownerId, playlistId, trackId);
  const playlistCollection = await playlists();
  const result = await playlistCollection.findOneAndUpdate(
    {
      _id: ObjectId(playlistId),
      ownerId: ownerId,
    },
    {
      $pull: {
        tracks: { id: trackId },
      },
    },
    {
      returnDocument: "after",
    },
  );
  if (result.matchedCount === 0)
    throw `Playlist with id ${playlistId} was not found`;
  if (result.modifiedCount === 0)
    throw `Track with id ${trackId} was not removed from playlist with id ${playlistId}`;
  console.log(result);
  return result;
};

const getAllUserPlaylists = async (ownerId) => {
  const playlistCollection = await playlists();
  const result = await playlistCollection.find({
    ownerId: ownerId,
  });
  if (!result) throw `No playlists found for user ${ownerId}`;
  return result.toArray();
};

const getAllPublicPlaylists = async () => {
  const playlistCollection = await playlists();
  const result = await playlistCollection.find({
    public: true,
  });
  if (!result) throw `No public playlists found`;
  return result;
};

module.exports = {
  createPlaylist,
  getPlaylist,
  updatePlaylist,
  deletePlaylist,
  addTrack,
  removeTrack,
  getAllUserPlaylists,
  getAllPublicPlaylists,
};
