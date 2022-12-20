const express = require("express");
const auth = require("../auth");
const spotifyAxios = require("../spotifyAxios");
const router = express.Router();
const redis = require("redis");
const client = redis.createClient();
const flat = require("flat");
const unflatten = flat.unflatten;

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
      if (id.length === 0){
        throw "Error: id cannot be an empty string or just spaces!";
      }
    let exists = await client.hExists("artistdetails", id);
    if (exists) {
      const cached = await client.hGet("artistdetails", id);
      return res.status(200).json(unflatten(JSON.parse(cached)));
    } else {
      const authAxios = await spotifyAxios(req.firebaseUid);
      const { data } = await authAxios.get(
        `https://api.spotify.com/v1/artists/${id}/albums`,
      );
      if (!data) throw "Spotify API returned no data";
      client.hSet("artistdetails", id, JSON.stringify(flat(data)), {
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
