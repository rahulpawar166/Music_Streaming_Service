const express = require("express");
const data = require("../data");
const validate = require("../data/validate");
const router = express.Router();
const playlistData = data.usersData;

router.post("/signup", async (req, res) => {
  try {
    username = validate.checkUsername(username);
  email = validate.checkEmail(email);
  validate.checkNewPassword(password, confirmPassword);
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

router.post("/login", async (req, res) => {
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
