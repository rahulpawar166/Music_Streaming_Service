const express = require("express");
const auth = require("../auth");
const spotifyAxios = require("../spotifyAxios");
const router = express.Router();
const redis = require("redis");
const client = redis.createClient();
const flat = require("flat");
const unflatten = flat.unflatten;

client.connect().then(() => {});

router.get("/top/tracks", auth, async (req, res) => {
  try {
    let exists = await client.hExists("toptracks", req.firebaseUid);
    if (exists) {
      const cached = await client.hGet("toptracks", req.firebaseUid);
      return res.status(200).json(Object.values(unflatten(JSON.parse(cached))));
    } else {
      const authAxios = await spotifyAxios(req.firebaseUid);
      const { data } = await authAxios.get(
        "https://api.spotify.com/v1/me/top/tracks",
      );
      if (!data) throw "Spotify API returned no data";
      client.hSet(
        "toptracks",
        req.firebaseUid,
        JSON.stringify(flat(data.items)),
        {
          EX: 86400,
        },
      );
      return res.status(200).json(data.items);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
});

module.exports = router;
