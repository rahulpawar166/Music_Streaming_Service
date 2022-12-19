const express = require("express");
const auth = require("../auth");
const spotifyAxios = require("../spotifyAxios");
const router = express.Router();
const redis = require("redis");
const client = redis.createClient();
const flat = require("flat");
const unflatten = flat.unflatten;

client.connect().then(() => {});

router.get("/", auth, async (req, res) => {
  try {
    let spotifyAxiosInstance = await spotifyAxios(req.firebaseUid);
    let exists = await client.exists("categories");
    if (exists) {
      const cached = await client.get("categories");
      return res.status(200).json(Object.values(unflatten(JSON.parse(cached))));
    } else {
      const { data } = await spotifyAxiosInstance.get(
        "https://api.spotify.com/v1/browse/categories?country=US&limit=50",
      );
      if (!data) throw new Error("Spotify API returned no data!");
      client.set("categories", JSON.stringify(flat(data.categories.items)), {
        EX: 86400,
      });
      return res.status(200).json(data.categories.items);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
});

router.get("/:id", auth, async (req, res) => {
  try {
    let id = req.params.id;
    let spotifyAxiosInstance = await spotifyAxios(req.firebaseUid);
    let exists = await client.hExists("categorydetails", id);
    if (exists) {
      const cached = await client.hGet("categorydetails", id);
      return res.status(200).json(unflatten(JSON.parse(cached)));
    } else {
      const { data } = await spotifyAxiosInstance.get(
        `https://api.spotify.com/v1/browse/categories/${id}/playlists?country=US&limit=50`,
      );
      if (!data) throw new Error("Spotify API returned no data!");
      client.hSet(
        "categorydetails",
        id,
        JSON.stringify(flat(data.playlists.items)),
        {
          EX: 86400,
        },
      );
      return res.status(200).json(data.playlists.items);
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e });
  }
});

module.exports = router;
