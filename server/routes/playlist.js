const express=require("express")
const data=require("../data");
const router = express.Router()
 const playlistData = data.playlistData

//return playlist data
router.get("/playListData",async(req,res)=>{

  try{
    const fetch_data = await playlistData.getAllPlayListData();
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


router.get("/create/:name", async(req,res)=>{
  
    console.log("insdie create route")
    // const playListId=req.params.playListId
    const name=req.params.name
    
    console.log("name",name)
    try {
        
        const fetch_data = await playlistData.createPlaylist(name);
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

router.get("/:playlistId/:albumId",async(req,res)=>{
  console.log("add albums routes")
  const albumId = req.params.albumId
  const playlistId = req.params.playlistId
  console.log(albumId,playlistId)
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