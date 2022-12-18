// const lyricsFinder = require("lyrics-finder");

// let exportedMethods = {
//     async getlyrics(){

//         name=name.trim()
//         console.log("inside data")
//         const playlist_detail ={
//             name:name,
//             albums:[],
//         }

//         const playlistCollection = await playlist()
//         const exist_playlist = await playlistCollection.findOne({ name:name });
//         if (exist_playlist) throw `already playlist with this names`;
//         const insertedPlaylist = await playlistCollection.insertOne(playlist_detail)
//         if (insertedPlaylist.insertedCount === 0) {
//             throw `insertion of playlist failed`;
//           } else {
//             return { insertedPlaylist: true };
//           }

//     }

// }

// module.exports=exportedMethods;
