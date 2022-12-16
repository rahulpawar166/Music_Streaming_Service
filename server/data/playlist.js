const mongoCollections=require("../config/mongoCollections")
const playlist = mongoCollections.playlist
let {ObjectId} = require("mongodb")
const uuid = require('uuid')

let exportedMethods = {
    // async AlbumIDAPI() {
    //   const requestInit = {
    //     headers: {
    //       Authorization: `Bearer ${window.localStorage.getItem("token")}`,
    //       "Content-Type": "application/json",
    //     },
    //   };
    //     const { data } = await axios.get('https://api.spotify.com/v1/albums/')
    //     return data;
    // },
    async createPlaylist(name){

        name=name.trim()
        console.log("inside data")
        const playlist_detail ={
            name:name,
            albums:[],
        }
        
        const playlistCollection = await playlist()
        const exist_playlist = await playlistCollection.findOne({ name:name });
        if (exist_playlist) throw `already playlist with this names`;
        const insertedPlaylist = await playlistCollection.insertOne(playlist_detail)
        if (insertedPlaylist.insertedCount === 0) {
            throw `insertion of playlist failed`;
          } else {
            return { insertedPlaylist: true };
          }


    },

    // async getAllPlayListData(){
    //   try {
    //     const playlistCollection = await playlist()
    //     const fetch_data = await playlistCollection.find({}).toArray();
    //     return fetch_data;
    //   } catch  {if(e)
    //     { throw { message :'Error in all PlayList'}}
    //   }
    // },

    async addAlbum(playlistId, albumId) {
        
        let newObjId = ObjectId(playlistId);
        console.log("inside data addalumb")
        const playlistCollection = await playlist();
        const fetch_data = await playlistCollection.findOne({ _id: newObjId });
        if (fetch_data === null) throw "No playlist with that id";

    
        let updateSweets = await playlistCollection.updateOne(
          { _id: newObjId },
          { $push: { albums: albumId } }
        );
    
        if (!updateSweets.matchedCount && !updateSweets.modifiedCount) {
          throw "Replay not created";
        }
    
        const output = await playlistCollection.findOne({ _id: newObjId });
        return output;
      },

      async getAllPlaylists(){
        // name=name.trim()
        // console.log("inside data")
       
        const playlistCollection = await playlist()
        const exist_playlist = await playlistCollection.find({}).toArray();
        if (!exist_playlist) throw `Unable to get all playlists`;

        for (let i = 0; i < playlistCollection.length; i++) {
          playlistCollection[i]["_id"] = playlistCollection[i]["_id"].toString();
        }
        return playlistCollection;
    },
      async get(albumId) { // get the albums --- after songslist - go to song
        const playlistCollection = await playlist();
        console.log("help me")
        if (!albumId) {
          throw "ERROR: ID DOES NOT EXIST";
        }
        if (typeof albumId !== "string") {
          throw "ERROR: ID MUST BE A STRING";
        }
        if (albumId.trim().length === 0) {
          throw "ERROR: ID CAN'T BE EMPTY STRING";
        }
        albumId = albumId.trim();
        if (!ObjectId.isValid(albumId)) {
          throw "ERROR: NOT A VALID ID - DOESN'T EXIST!";
        }
        console.log("find id")

        const getPlaylist = await playlistCollection.findOne({
          _id: ObjectId(albumId),
        });
        console.log("did youfind id")

        if (!getPlaylist) {
          throw "ERROR: CAN'T FIND PLAYLIST BY ID";
        }
        getPlaylist._id = getPlaylist._id.toString();
        return getPlaylist;
      },
      
      async deletePlaylist(playlistId){
        const playlistCollection = await playlist();
        const playlist = await get(playlistId);
        if (!playlistId) {
            throw "ERROR: ID MUST BE PROVIDED!";
        }
        if (typeof playlistId !== 'string') {
            throw "ERROR: ID MUST BE A STRING";
        }
        if (playlistId.trim().length === 0) {
            throw "ERROR: ID CAN'T BE EMPTY STRING";
        }
        playlistId=playlistId.trim();
        if (!ObjectId.isValid(playlistId)) {
            throw "ERROR: NOT A VALID ID - DOESN'T EXIST!";
        }
        const deleteId = await playlistCollection.deleteOne({_id: ObjectId(playlistId)});
        if (deleteId.deletedCount === 0) { // if band can't be removed
            throw `ERROR: CAN'T DELETE PLAYLIST WITH ID OF ${playlistId}`;
        }
    
        return playlist.name + " has been successfully deleted!";


    }
}

module.exports=exportedMethods;