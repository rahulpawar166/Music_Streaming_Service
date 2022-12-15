const mongoCollections=require("../config/mongoCollections")
const playlist = mongoCollections.playlist
let {ObjectId} = require("mongodb")


let exportedMethods = {

    async createPlaylist(uid){

        console.log("inside data")
        if(!uid || uid.trim() === "") throw "please provide uid"
        uid=uid.trim()

        const playlist_detail ={
            _id:uid,
            albums:[],
        }
        
        const playlistCollection = await playlist()
        const exist_playlist = await playlistCollection.findOne({ _id:uid });
        //if this user playlist exist return
        if (exist_playlist)  return { insertedPlaylist: true }

        const insertedPlaylist = await playlistCollection.insertOne(playlist_detail)
        if (insertedPlaylist.insertedCount === 0) {
            throw `insertion of playlist failed`;
          } else {
            return { insertedPlaylist: true };
          }


    },

    async getAllPlayListData(){
      try {
        const playlistCollection = await playlist()
        const fetch_data = await playlistCollection.find({}).toArray();
        return fetch_data;
      } catch  {if(e)
        { throw { message :'Error in all PlayList'}}
      }
    },

    async deleteAlbum(playlistId, albumId){

        console.log("inside data")
        console.log("inside data add album",playlistId,albumId)

        if(!playlistId || playlistId.trim() === "") throw "please provide playlistId"
        playlistId=playlistId.trim()

        if(!albumId || albumId.trim() === "") throw "please provide albumId"
        albumId=albumId.trim()

        const playlistCollection = await playlist();
        const fetch_data = await playlistCollection.findOne({ _id: playlistId });
        console.log(fetch_data)
        if (fetch_data === null) throw "No playlist with this playlist id";

        let updateAlbum = await playlistCollection.updateOne(
          { _id: playlistId },
          { $pull: { albums: albumId } }
        );
          console.log(updateAlbum)
        if (!updateAlbum.matchedCount && !updateAlbum.modifiedCount) {
          throw "Not deleted";
        }
    
        const output = await playlistCollection.findOne({ _id: playlistId });
        return output;

    },

    async addAlbum(playlistId, albumId) {
        
        console.log("inside data")

        if(!playlistId || playlistId.trim() === "") throw "please provide playlistId"
        playlistId=playlistId.trim()

        if(!albumId || albumId.trim() === "") throw "please provide albumId"
        albumId=albumId.trim()


        console.log("inside data add album",playlistId,albumId)

        const playlistCollection = await playlist();
        const fetch_data = await playlistCollection.findOne({ _id: playlistId });
        console.log(fetch_data)
        if (fetch_data === null) throw "No playlist with this playlist id";

    
        let updateAlbum = await playlistCollection.updateOne(
          { _id: playlistId },
          { $push: { albums: albumId } }
        );
    
        if (!updateAlbum.matchedCount && !updateAlbum.modifiedCount) {
          throw "Replay not created";
        }
    
        const output = await playlistCollection.findOne({ _id: playlistId });
        return output;

      },



}

module.exports=exportedMethods;