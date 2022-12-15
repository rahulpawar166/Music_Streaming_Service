const express = require("express");
const data = require("../data");
const validate = require("../data/validate");
const router = express.Router();
const playlistData = data.playlistData;

router.post("/new", async (req, res) => {
  try {
    const name = validate.checkName(req.body.name);
    const description = validate.checkDescription(req.body.description);
    const ownerId = validate.checkId(req.body.ownerId);
    const dbResult = await playlistData.createPlaylist(
      name,
      description,
      ownerId,
    );
    return res.status(200).json(dbResult);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e || "Internal Server Error" });
  }
});

router.post("/add", async (req, res) => {
  const playlistId = validate.checkId(req.params.playlistId);
  const trackId = validate.checkId(req.body.trackId);
  try {
    const dbResult = await playlistData.addAlbum(playlistId, trackId);
    return res.status(200).json(dbResult);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e || "Internal Server Error" });
  }
});

router.get("/", async(req, res) => {
  const ownerId
});

module.exports = router;
