const express = require("express");
const auth = require("../auth");
const spotifyAxios = require("../spotifyAxios");
const axios = require("axios");
const router = express.Router();
const redis = require("redis");
// const client = redis.createClient();
const flat = require("flat");
const unflatten = flat.unflatten;
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname.replace(" ", "-"));
  },
});
const upload = multer({
  storage: storage,
  //   fileFilter: (req, file, cb) => {
  //     console.log(file.mimetype);
  //     if (file.mimetype === "audio/mpeg") {
  //       cb(null, true);
  //     } else {
  //       cb(null, false);
  //       return cb(new Error("Only .mp3 files are allowed!"));
  //     }
  //   },
});
const fs = require("fs");
let client
if(process.env.REDISCLOUD_URL){
    let redisURL = url.parse(process.env.REDISCLOUD_URL);
    client = redis.createClient(redisURL)
} else {
  client = redis.createClient()
}
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

router.post("/bymp3", upload.single("mp3File"), auth, async (req, res) => {
  try {
    let mp3File = req.file;
    const fileContents = fs.createReadStream(`uploads/${mp3File.filename}`);
    let { data } = await axios({
      method: "POST",
      url: "https://api.audd.io/",
      data: {
        api_token: process.env.EXPRESS_APP_AUDDIO_API_TOKEN,
        file: fileContents,
        return: "spotify",
      },
      headers: {
        "Content-Type": "multipart/form-data",
        "Accept-Encoding": "gzip,deflate,compress",
      },
    });
    if (!data) throw "Audd.io API did not return any data!";
    data = data.result.spotify;
    return res.status(200).json({
      tracks: {
        items: [
          {
            name: data.name,
            id: data.id,
            album: {
              name: data.album.name,
              id: data.album.id,
              images: data.album.images,
            },
            artists: data.artists,
          },
        ],
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e });
  }
});

module.exports = router;
