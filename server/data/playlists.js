const mongoCollections = require("../config/mongoCollections");
const playlists = mongoCollections.playlists;
const validate = require("./validate");
let { ObjectId } = require("mongodb");

let exportedMethods = {
  async createPlaylist(name = "New Playlist", description = "") {
    try {
      name = validate.checkName(name);
      description = validate.checkDescription(description);
      // ownerId = validate.checkId(ownerId);
      const newPlaylist = {
        ownerId: ownerId, //ObjectId(ownerId)
        name: name,
        description: description,
        thumbnail: "",
        public: false,
        tracks: [],
      };
      const playlistsCollection = await playlists();
      const insertedPlaylist = await playlistsCollection.insertOne(newPlaylist);
      if (insertedPlaylist.insertedCount === 0) {
        throw `insertion of playlist failed`;
      } else {
        return { insertedPlaylist: true };
      }
    } catch (e) {
      console.error(e);
    }
  },

  async addAlbum(playlistId, albumId) {
    let newObjId = ObjectId(playlistId);
    const playlistsCollection = await playlists();
    const fetch_data = await playlistsCollection.findOne({ _id: newObjId });
    if (fetch_data === null) throw "No playlist with that id";

    let updateSweets = await playlistsCollection.updateOne(
      { _id: newObjId },
      { $push: { albums: albumId } },
    );

    if (!updateSweets.matchedCount && !updateSweets.modifiedCount) {
      throw "Replay not created";
    }

    const output = await playlistsCollection.findOne({ _id: newObjId });
    return output;
  },
};
module.exports = exportedMethods;
