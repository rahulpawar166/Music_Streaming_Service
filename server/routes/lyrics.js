const express=require("express")
const data=require("../data");
const router = express.Router()
const lyricsFinder = require("lyrics-finder");

const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});




const lyricsData = data.lyricsData

router.get("/:artist/:track", async (req, res) => {
 
    try{
    let track = req.params.track
    let FlagInCache = await client.hExists("Lyricsresults", track)
    if (!FlagInCache) {
            //retrive data from the axios call made to comicssData
            let getLyricsData =(await lyricsFinder(req.params.artist, req.params.track)) || "No Lyrics Found"
            
            
            //Data is stored in hash storage using hset
            let Lyricsresults = await client.hSet("Lyricsresults", track, JSON.stringify(getLyricsData))
           
            res.json(getLyricsData)
        } 
        else {
             //if data is in cache retrive it from the hash storage
            let getLyricsData = await client.hGet("Lyricsresults", track)
            res.json(JSON.parse(getLyricsData))
        }
    
    //const lyrics = (await lyricsFinder(req.params.artist, req.params.track)) || "No Lyrics Found"
    //return res.status(200).json({ lyrics })

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