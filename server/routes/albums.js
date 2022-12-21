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

router.get("/new", auth, async (req, res) => {
  try {
    let exists = await client.exists("newreleases");
    if (exists) {
      const cached = await client.get("newreleases");
      return res.status(200).json(Object.values(unflatten(JSON.parse(cached))));
    } else {
      const authAxios = await spotifyAxios(req.firebaseUid);
      const { data } = await authAxios.get(
        "https://api.spotify.com/v1/browse/new-releases",
      );
      if (!data) throw "Spotify API returned no data";
      client.set("newreleases", JSON.stringify(flat(data.albums.items)), {
        EX: 86400,
      });
      return res.status(200).json(data.albums.items);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
});

router.get("/recommendations", auth, async (req, res) => {
  try {
    let exists = await client.hExists("recommendations", req.firebaseUid);
    if (exists) {
      const cached = await client.hGet("recommendations", req.firebaseUid);
      return res.status(200).json(Object.values(unflatten(JSON.parse(cached))));
    } else {
      const authAxios = await spotifyAxios(req.firebaseUid);
      const { data } = await authAxios.get(
        "https://api.spotify.com/v1/recommendations?seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=rock%2Chip-hop%2Cpop&seed_tracks=0c6xIDDpzE81m2q797ordA",
      );
      if (!data) throw "Spotify API returned no data";
      client.hSet(
        "recommendations",
        req.firebaseUid,
        JSON.stringify(flat(data.tracks)),
        {
          EX: 180,
        },
      );
      return res.status(200).json(data.tracks);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
});

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
    let exists = await client.hExists("albumdetails", id);
    if (exists) {
      const cached = await client.hGet("albumdetails", id);
      return res.status(200).json(unflatten(JSON.parse(cached)));
    } else {
      const authAxios = await spotifyAxios(req.firebaseUid);
      const { data } = await authAxios.get(
        `https://api.spotify.com/v1/albums/${id}`,
      );
      if (!data) throw "Spotify API returned no data";
      client.hSet("albumdetails", id, JSON.stringify(flat(data)), {
        EX: 86400,
      });
      return res.status(200).json(data);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
});

module.exports = router;
