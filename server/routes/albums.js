const express = require("express");
const auth = require("../auth");
const spotifyAxios = require("../spotifyAxios");
const router = express.Router();
const redis = require("redis");
const client = redis.createClient();
const flat = require("flat");
const unflatten = flat.unflatten;

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

router.get("/:id", auth, async (req, res) => {
  try {
    let id = req.params.id;
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
