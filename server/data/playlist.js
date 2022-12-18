const mongoCollections=require("../config/mongoCollections")
const playlist = mongoCollections.playlist
let {ObjectId} = require("mongodb")


let string_Check = (string, var_Name) => {
  if (!string) throw `please provide ${var_Name}`;
  if (typeof string !== "string")
    throw `given parameter ${var_Name} is not string`;
  string = string.trim();
  if (string.length === 0) throw `please provide ${var_Name}`;
}

let exportedMethods = {

  //  this function create playlist for first time
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

    //this function will return playlist data
    async getPlayListData(uid){

      console.log("inside data")
      if(!uid || uid.trim() === "") throw "please provide uid"
      uid=uid.trim()
     
      const playlistCollection = await playlist()
      const fetch_data = await playlistCollection.findOne({ _id: uid });
      console.log(fetch_data)
      if (fetch_data === null) throw "No playlist with this playlist id";
      return fetch_data;
    
    },


//this function will add playlist in current user
async addPlayList(uid,name){

  console.log("inside data",name,uid)
  if(!uid || uid.trim() === "") throw "please provide uid"
  uid=uid.trim()

  string_Check(name, "name");
  name=name.toLowerCase().trim()

  //check user exists or not
  const playlistCollection = await playlist()
  const fetch_data = await playlistCollection.findOne({ _id: uid });
  console.log(fetch_data)
  if (fetch_data === null) throw "No user with this id";

  //chekc already playlist exist with this name or not
  playlist_arr=fetch_data.albums
  let check_exist=false
  playlist_arr.forEach((element)=>{
    if(element.name===name){
      check_exist=true
    }
    
  })

  if (check_exist) throw "playlist already exists with this name";
  
  const newReply = {
    name:name,
    tracks:[]
  };


  let updateSweets = await playlistCollection.updateOne(
    { _id: uid },
    { $push: { albums: newReply } }
  );

  if (!updateSweets.matchedCount && !updateSweets.modifiedCount) {
    throw " not created";
  }

  const output = await playlistCollection.findOne({ _id: uid });
  return output;

},

    // //this function will add playlist in current user
    // async addPlayList(uid,name){

    //   console.log("inside data")
    //   if(!uid || uid.trim() === "") throw "please provide uid"
    //   uid=uid.trim()

    //   string_Check(name, "name");
    //   name=name.toLowerCase().trim()

    //   //check user exists or not
    //   const playlistCollection = await playlist()
    //   const fetch_data = await playlistCollection.findOne({ _id: uid });
    //   console.log(fetch_data)
    //   if (fetch_data === null) throw "No user with this id";

    //   //chekc already playlist exist with this name or not
    //   const playList_arr=fetch_data.albums
    //   console.log((playList_arr))

    //   let check_exist=false
    //   playList_arr.forEach(element => {
    //     if (element.name===name){
    //       check_exist=true
    //     }
    //   });

    //   if (check_exist) throw "playlist already exists with this name";
      
    //   const newReply = {
    //     name:name,
    //     tracks:[]
    //   };
  

    //   let updateSweets = await playlistCollection.updateOne(
    //     { _id: uid },
    //     { $push: { albums: newReply } }
    //   );
  
    //   if (!updateSweets.matchedCount && !updateSweets.modifiedCount) {
    //     throw " not created";
    //   }
  
    //   const output = await playlistCollection.findOne({ _id: uid });
    //   return output;

    // },

    //this function will add playlist in current user
    async deletePlaylist(uid,name){

      console.log("inside data")
      if(!uid || uid.trim() === "") throw "please provide uid"
      uid=uid.trim()

      string_Check(name, "name");
      name=name.toLowerCase().trim()

      //check user exists or not
      const playlistCollection = await playlist()
      const fetch_data = await playlistCollection.findOne({ _id: uid });
      console.log(fetch_data)
      if (fetch_data === null) throw "No user with this id";

       //chekc already playlist exist with this name or not
  playlist_arr=fetch_data.albums
  let check_exist=false
  playlist_arr.forEach((element)=>{
    console.log(element.name,name,element.name===name)
    if(element.name===name){
      check_exist=true
    }
  })

  console.log(check_exist)
  if (!check_exist) throw "playlist does not exists with this name";

      let updateSweets = await playlistCollection.updateOne(
        { _id: uid },
        { $pull: { albums: { name: name } } }
      );
  
      console.log(updateSweets)
      if (!updateSweets.matchedCount && !updateSweets.modifiedCount) {
        throw "not deleted";
      }

      const output = await playlistCollection.findOne({ _id: uid });
      return output;

      

    },




    //this function delete song inside playlist
    async deleteAlbum(uid, albumId,name){

        console.log("inside data")
        console.log("inside data add album",uid,albumId,name)

        if(!uid || uid.trim() === "") throw "please provide uid"
        uid=uid.trim()

        if(!albumId || albumId.trim() === "") throw "please provide albumId"
        albumId=albumId.trim()

        string_Check(name, "name");
        name=name.toLowerCase().trim()

        const playlistCollection = await playlist();
        const fetch_data = await playlistCollection.findOne({ _id: uid });
        console.log(fetch_data)
        if (fetch_data === null) throw "No playlist with this playlist id";

        let playlist_arr=fetch_data.albums
        let playlist_check=false
        playlist_arr.forEach((element)=>{
          if(
            element.name===name
          ){
            playlist_check=true
          }
          
        })

        if(!playlist_check) throw `no playlist with this name`
        
        console.log("we reached here")

        let updateAlbum = await playlistCollection.updateOne(
          { _id: uid,"albums.name":name},
          { $pull: { "albums.$.tracks": {trackId:albumId} } }
        );
    
        if (!updateAlbum.matchedCount && !updateAlbum.modifiedCount) {
          throw "Replay not created";
        }
    
        const output = await playlistCollection.findOne({ _id: uid });
        return output;
    },

    ///this function add song to playlist
    async addAlbum(uid,albumId,name,trackname) {
        
        console.log("inside data")

        if(!uid || uid.trim() === "") throw "please provide uid"
        uid=uid.trim()

        if(!albumId || albumId.trim() === "") throw "please provide albumId"
        albumId=albumId.trim()

        string_Check(name, "name");
        name=name.toLowerCase().trim()

        string_Check(trackname, "trackname");
        trackname=trackname.toLowerCase().trim()

        console.log("inside data add album",uid,albumId,name)

        const playlistCollection = await playlist();
        const fetch_data = await playlistCollection.findOne({ _id: uid });
        console.log(fetch_data)
        if (fetch_data === null) throw "No playlist with this playlist id";

        let playlist_arr=fetch_data.albums
        let playlist_check=false
        playlist_arr.forEach((element)=>{
          if(
            element.name===name
          ){
            playlist_check=true
          }
          
        })

        if(!playlist_check) throw `no playlist with this name`
        
        console.log("we reached here")

        const newReply = {
          trackId:albumId,
          name:trackname 
        };


        let updateAlbum = await playlistCollection.updateOne(
          { _id: uid,"albums.name":name},
          { $push: { "albums.$.tracks": newReply } }
        );
    
        if (!updateAlbum.matchedCount && !updateAlbum.modifiedCount) {
          throw "Replay not created";
        }
    
        const output = await playlistCollection.findOne({ _id: uid });
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

    
      async get(playlistId) {
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
      
    //   async deletePlaylist(playlistId){
    //     const playlistCollection = await playlist();
    //     const playlist = await get(playlistId);
    //     if (!playlistId) {
    //         throw "ERROR: ID MUST BE PROVIDED!";
    //     }
    //     if (typeof playlistId !== 'string') {
    //         throw "ERROR: ID MUST BE A STRING";
    //     }
    //     if (playlistId.trim().length === 0) {
    //         throw "ERROR: ID CAN'T BE EMPTY STRING";
    //     }
    //     playlistId=playlistId.trim();
    //     if (!ObjectId.isValid(playlistId)) {
    //         throw "ERROR: NOT A VALID ID - DOESN'T EXIST!";
    //     }
    //     const deleteId = await playlistCollection.deleteOne({_id: ObjectId(playlistId)});
    //     if (deleteId.deletedCount === 0) { // if band can't be removed
    //         throw `ERROR: CAN'T DELETE PLAYLIST WITH ID OF ${playlistId}`;
    //     }
    
    //     return playlist.name + " has been successfully deleted!";


    // }
}

module.exports=exportedMethods;