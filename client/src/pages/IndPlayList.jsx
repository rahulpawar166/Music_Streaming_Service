// import React, { useEffect, useState,useContext } from "react";
// import axios from "axios";
// import { Link,useParams } from "react-router-dom";
// const IndPlayList=()=>{
//     const [allPlaylist,setAllPlaylist]=useState()
//     // const {PlaylistName}=useParams()

//     const getPlayList = async()=>{

//         try {
//           console.log("frontend getplaylist function")
//           const { data } = await axios.post(
//             `http://localhost:3008/playlist/playListData`,{uid:window.localStorage.getItem("currentUser")}
//           );
//           console.log(data)
//           //SET LIST OF ALBBUMS INSIDE PLAYLISTDATA
//           currentPlay(data.albums)
//         } catch (error) {
//           console.log("error", error);
//         }
//       }

//     useEffect(()=>{
//         getPlayList()
//     },[])
// }
// export default IndPlayList