const express = require("express");
const lyricsFinder = require("lyrics-finder");
const router = express.Router();
const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});

router.post("/", async (req, res) => {
  try {
    let artist = req.body.artist;
    let track = req.body.trackName;
    let lyricsHash = Buffer.from(artist + ":" + track, "utf8").toString(
      "base64",
    );
    let FlagInCache = await client.hExists("lyrics", lyricsHash);
    if (!FlagInCache) {
      let lyricsData = (await lyricsFinder(artist, track)) || "NO_LYRICS";
      await client.hSet("lyrics", lyricsHash, JSON.stringify(lyricsData));
      return res.json(lyricsData);
    } else {
      let cached = await client.hGet("lyrics", lyricsHash, track);
      return res.json(JSON.parse(cached));
    }
  } catch (e) {
    return res.status(500).json({
      error: e.message || "Internal Server Error",
    });
  }
});

module.exports = router;
