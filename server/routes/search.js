const express = require("express");
const auth = require("../auth");
const spotifyAxios = require("../spotifyAxios");
const router = express.Router();
const redis = require("redis");
const client = redis.createClient();
const flat = require("flat");
const unflatten = flat.unflatten;

client.connect().then(() => {});

router.post("/", auth, async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm.toString();
    let query = new URLSearchParams({
      q: searchTerm,
      type: "album,artist,track",
    });
    let exists = await client.hExists("search", searchTerm);
    if (exists) {
      const cached = await client.hGet("search", searchTerm);
      return res.status(200).json(unflatten(JSON.parse(cached)));
    } else {
      const authAxios = await spotifyAxios(req.firebaseUid);
      const { data } = await authAxios.get(
        `https://api.spotify.com/v1/search?${query.toString()}`,
      );
      if (!data) throw "Spotify API returned no data";
      client.hSet("search", searchTerm, JSON.stringify(flat(data)));
      return res.status(200).json(data);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
});

module.exports = router;
