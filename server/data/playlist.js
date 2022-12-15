const mongoCollections = require("../config/mongoCollections");
const playlist = mongoCollections.playlist;
let { ObjectId } = require("mongodb");
const uuid = require("uuid");

let exportedMethods = {
  async createPlaylist(name) {
    name = name.trim();
    console.log("inside data");
    const playlist_detail = {
      name: name,
      albums: [],
    };

    const playlistCollection = await playlist();
    const exist_playlist = await playlistCollection.findOne({ name: name });
    if (exist_playlist) throw `already playlist with this names`;
    const insertedPlaylist = await playlistCollection.insertOne(
      playlist_detail,
    );
    if (insertedPlaylist.insertedCount === 0) {
      throw `insertion of playlist failed`;
    } else {
      return { insertedPlaylist: true };
    }
  },

  async getAllPlayListData() {
    try {
      const playlistCollection = await playlist();
      const fetch_data = await playlistCollection.find({}).toArray();
      return fetch_data;
    } catch {
      if (e) {
        throw { message: "Error in all PlayList" };
      }
    }
  },

  async addAlbum(playlistId, albumId) {
    let newObjId = ObjectId(playlistId);
    console.log("inside data addalumb");
    const playlistCollection = await playlist();
    const fetch_data = await playlistCollection.findOne({ _id: newObjId });
    if (fetch_data === null) throw "No playlist with that id";

    let updateSweets = await playlistCollection.updateOne(
      { _id: newObjId },
      { $push: { albums: albumId } },
    );

    if (!updateSweets.matchedCount && !updateSweets.modifiedCount) {
      throw "Replay not created";
    }

    const output = await playlistCollection.findOne({ _id: newObjId });
    return output;
  },
};

module.exports = exportedMethods;
