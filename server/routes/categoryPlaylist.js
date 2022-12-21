const express = require("express");
const auth = require("../auth");
const spotifyAxios = require("../spotifyAxios");
const router = express.Router();
const redis = require("redis");
// const client = redis.createClient();
const flat = require("flat");
const unflatten = flat.unflatten;
let client
if(process.env.REDISCLOUD_URL){
    let redisURL = url.parse(process.env.REDISCLOUD_URL);
    client = redis.createClient(redisURL)
} else {
  client = redis.createClient()
}
client.connect().then(() => {});

router.get("/:id", auth, async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) {
      return res.status(400).json({ error: "MUST INPUT ID" });
    }
    if (typeof id !== "string") {
      throw "Error: id must be a string!";
    }
    id = id.trim();
    if (id.length === 0) {
      throw "Error: id cannot be an empty string or just spaces!";
    }
    let spotifyAxiosInstance = await spotifyAxios(req.firebaseUid);
    let exists = await client.hExists("categoryPlaylist", id);
    if (exists) {
      const cached = await client.hGet("categoryPlaylist", id);
      return res.status(200).json(Object.values(unflatten(JSON.parse(cached))));
    } else {
      const { data } = await spotifyAxiosInstance.get(
        `https://api.spotify.com/v1/playlists/${id}`,
      );
      if (!data) throw new Error("Spotify API returned no data!");
      client.hSet(
        "categoryPlaylist",
        id,
        JSON.stringify(flat(data.tracks.items)),
        {
          EX: 86400,
        },
      );
      return res.status(200).json(data.tracks.items);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
});

module.exports = router;
