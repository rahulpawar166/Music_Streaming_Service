const express=require("express")
const data=require("../data");
const router = express.Router()
 const playlistData = data.playlistData
 const xss = require("xss");

//return playlist data
router.post("/playListData",async(req,res)=>{

  console.log("inside fetch route")
  //we use uid to create playlist for each user
  let uid=xss(req.body.uid)
  console.log("uid=",uid)

  if (!uid ||uid.trim() === "" ) {
    res.status(400).json({ errors: "uid is not valid " });
    return;
  }

  try{
    const fetch_data = await playlistData.getPlayListData(uid);
    return res.status(200).json(fetch_data);
    
  }catch(e){
    if (e) {
      res.status(404).json({ errors: e });
      return;
    } else {
      res.status(500).json({
        error: "Internal Server Error",
      });
      return;
    }
  }

})

router.post("/create", async(req,res)=>{
    console.log("inside create route")
    //we use uid to create playlist for each user
    let uid=xss(req.body.uid)
    
    console.log("uid=",uid)
    if (!uid ||uid.trim() === "" ) {
      res.status(400).json({ errors: "uid is not valid " });
      return;
    }

    try {
        
        const fetch_data = await playlistData.createPlaylist(uid);
        return res.status(200).json(fetch_data);

      } catch (e) {
        if (e) {
          res.status(404).json({ errors: e });
          return;
        } else {
          res.status(500).json({
            error: "Internal Server Error",
          });
          return;
        }
      }
})

router.post("/deleteTrack",async(req,res)=>{

  console.log("delete albums routes")

  const albumId = xss(req.body.albumId)
  const playlistId = xss(req.body.playlistId)
 
  console.log(playlistId,albumId)
  if (!albumId || albumId.trim() === "" ) {
    res.status(400).json({ errors: "albumId is not valid " });
    return;
  }
  if (!playlistId || playlistId.trim() === "" ) {
    res.status(400).json({ errors: "playlistId is not valid " });
    return;
  }
  
  console.log(playlistId,albumId)

  try {
      const fetch_data = await playlistData.deleteAlbum(
        playlistId,
        albumId
      );
      
      res.status(200).json(fetch_data);
      return;
    } catch (e) {
      if (e) {
        res.status(400).json({ errors: e });
        return;
      } else {
        res.status(500).json({
          error: "Internal Server Error",
        });
        return;
      }
    }
})

router.post("/addTrack",async(req,res)=>{

  console.log("add albums routes")
  const albumId = xss(req.body.albumId)
  const playlistId = xss(req.body.playlistId)

  if (!albumId || albumId.trim() === "" ) {
    res.status(400).json({ errors: "albumId is not valid " });
    return;
  }
  if (!playlistId || playlistId.trim() === "" ) {
    res.status(400).json({ errors: "playlistId is not valid " });
    return;
  }
  
  console.log(playlistId,albumId)

  try {
      const fetch_data = await playlistData.addAlbum(
        playlistId,
        albumId
      );
      
      res.status(200).json(fetch_data);
      return;
    } catch (e) {
      if (e) {
        res.status(400).json({ errors: e });
        return;
      } else {
        res.status(500).json({
          error: "Internal Server Error",
        });
        return;
      }
    }
})
module.exports=router