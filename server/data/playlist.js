const mongoCollections = require("../config/mongoCollections");
const playlist = mongoCollections.playlist;
let { ObjectId } = require("mongodb");

let exportedMethods = {
  async createPlaylist(uid) {
    console.log("inside data");
    if (!uid || uid.trim() === "") throw "please provide uid";
    uid = uid.trim();

    const playlist_detail = {
      _id: uid,
      albums: [],
    };

    const playlistCollection = await playlist();
    const exist_playlist = await playlistCollection.findOne({ _id: uid });
    //if this user playlist exist return
    if (exist_playlist) return { insertedPlaylist: true };

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

  async deleteAlbum(playlistId, albumId) {
    console.log("inside data");
    console.log("inside data add album", playlistId, albumId);

    if (!playlistId || playlistId.trim() === "")
      throw "please provide playlistId";
    playlistId = playlistId.trim();

    if (!albumId || albumId.trim() === "") throw "please provide albumId";
    albumId = albumId.trim();

    const playlistCollection = await playlist();
    const fetch_data = await playlistCollection.findOne({ _id: playlistId });
    console.log(fetch_data);
    if (fetch_data === null) throw "No playlist with this playlist id";

    let updateAlbum = await playlistCollection.updateOne(
      { _id: playlistId },
      { $pull: { albums: albumId } },
    );
    console.log(updateAlbum);
    if (!updateAlbum.matchedCount && !updateAlbum.modifiedCount) {
      throw "Not deleted";
    }

    const output = await playlistCollection.findOne({ _id: playlistId });
    return output;
  },

  async addAlbum(playlistId, albumId) {
    console.log("inside data");

    if (!playlistId || playlistId.trim() === "")
      throw "please provide playlistId";
    playlistId = playlistId.trim();

    if (!albumId || albumId.trim() === "") throw "please provide albumId";
    albumId = albumId.trim();

    console.log("inside data add album", playlistId, albumId);

    const playlistCollection = await playlist();
    const fetch_data = await playlistCollection.findOne({ _id: playlistId });
    console.log(fetch_data);
    if (fetch_data === null) throw "No playlist with this playlist id";

    let updateAlbum = await playlistCollection.updateOne(
      { _id: playlistId },
      { $push: { albums: albumId } },
    );

    if (!updateAlbum.matchedCount && !updateAlbum.modifiedCount) {
      throw "Replay not created";
    }

    const output = await playlistCollection.findOne({ _id: playlistId });
    return output;
  },

  async getAllPlaylists() {
    // name=name.trim()
    // console.log("inside data")

    const playlistCollection = await playlist();
    const exist_playlist = await playlistCollection.find({}).toArray();
    if (!exist_playlist) throw `Unable to get all playlists`;

    for (let i = 0; i < playlistCollection.length; i++) {
      playlistCollection[i]["_id"] = playlistCollection[i]["_id"].toString();
    }
    return playlistCollection;
  },
  async get(playlistId) {
    const playlistCollection = await playlist();
    if (!playlistId) {
      throw "ERROR: ID DOES NOT EXIST";
    }
    if (typeof playlistId !== "string") {
      throw "ERROR: ID MUST BE A STRING";
    }
    if (playlistId.trim().length === 0) {
      throw "ERROR: ID CAN'T BE EMPTY STRING";
    }
    playlistId = playlistId.trim();
    if (!ObjectId.isValid(playlistId)) {
      throw "ERROR: NOT A VALID ID - DOESN'T EXIST!";
    }
    const getPlaylist = await playlistCollection.findOne({
      _id: ObjectId(playlistId),
    });
    if (!getPlaylist) {
      throw "ERROR: CAN'T FIND PLAYLIST BY ID";
    }
    getPlaylist._id = getPlaylist._id.toString();
    return getPlaylist;
  },

  async deletePlaylist(playlistId) {
    const playlistCollection = await playlist();
    const playlist = await get(playlistId);
    if (!playlistId) {
      throw "ERROR: ID MUST BE PROVIDED!";
    }
    if (typeof playlistId !== "string") {
      throw "ERROR: ID MUST BE A STRING";
    }
    if (playlistId.trim().length === 0) {
      throw "ERROR: ID CAN'T BE EMPTY STRING";
    }
    playlistId = playlistId.trim();
    if (!ObjectId.isValid(playlistId)) {
      throw "ERROR: NOT A VALID ID - DOESN'T EXIST!";
    }
    const deleteId = await playlistCollection.deleteOne({
      _id: ObjectId(playlistId),
    });
    if (deleteId.deletedCount === 0) {
      // if band can't be removed
      throw `ERROR: CAN'T DELETE PLAYLIST WITH ID OF ${playlistId}`;
    }

    return playlist.name + " has been successfully deleted!";
  },
};
