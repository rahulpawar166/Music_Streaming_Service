const express=require("express")
const data=require("../data");
const router = express.Router()
const lyricsFinder = require("lyrics-finder");

const lyricsData = data.lyricsData

router.get("/:artist/:track", async (req, res) => {
 
    try{
  
    const lyrics = (await lyricsFinder(req.params.artist, req.params.track)) || "No Lyrics Found"
    return res.status(200).json({ lyrics })

    }
    catch(e){
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

  module.exports=router