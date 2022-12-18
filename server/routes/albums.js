const express = require("express");
const auth = require("../auth");
const data = require("../data");
const spotifyAxios = require("../spotifyAxios");
const router = express.Router();
const redis = require("redis");
const client = redis.createClient();
const flat = require("flat");
const unflatten = flat.unflatten;
const albumData = data.albumData;
const xss = require("xss");

client.connect().then(() => {});

router.get("/new", auth, async (req, res) => {
  try {
    let spotifyAxiosInstance = await spotifyAxios(req.firebaseUid);
    let exists = await client.exists("newreleases");
    if (exists) {
      const cached = await client.get("newreleases");
      return res.status(200).json(Object.values(unflatten(JSON.parse(cached))));
    } else {
      const { data } = await spotifyAxiosInstance.get(
        "https://api.spotify.com/v1/browse/new-releases",
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
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

// router.get("/:id", async (req, res) => {
//   try {
//     let id = req.params.id;
//     let exists = await client.hExists("albumdetails", id);
//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: e });
//   }
// });

module.exports = router;
