const express = require("express");
const router = express.Router();
const auth = require("../auth");
const playlistData = require("../data").playlistData;
const flat = require("flat");
const unflatten = flat.unflatten;

router.post("/create", auth, async (req, res) => {
  try {
    const dbResult = await playlistData.createPlaylist(
      req.firebaseUid,
      req.body.name || "Unnamed Playlist",
      req.body.public || false,
      req.body.tracks || [],
    );
    return res.status(201).json(dbResult);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e || "Internal server error" });
  }
});

router.patch("/:id", auth, async (req, res) => {
  try {
    let id = req.params.id;
    let name = req.body.name;
    let public = req.body.public;
    let cover = req.body.cover;
    const dbResult = await playlistData.updatePlaylist(
      req.firebaseUid,
      id,
      name,
      public,
      cover,
    );
    return res.status(201).json(dbResult);
  } catch (e) {
    return res.status(500).json({ error: e || "Internal server error" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    let id = req.params.id;
    const dbResult = await playlistData.deletePlaylist(req.firebaseUid, id);
    return res.sendStatus(204);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e || "Internal server error" });
  }
});

router.post("/addto/:id", auth, async (req, res) => {
  try {
    let id = req.params.id;
    let track = req.body.track;
    const dbResult = await playlistData.addTrack(req.firebaseUid, id, track);
    return res.status(201).json(dbResult);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e || "Internal server error" });
  }
});

router.patch("/removefrom/:id", auth, async (req, res) => {
  try {
    let id = req.params.id;
    let trackId = req.body.trackId;
    const dbResult = await playlistData.removeTrack(
      req.firebaseUid,
      id,
      trackId,
    );
    return res.status(201).json(dbResult);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e || "Internal server error" });
  }
});

router.get("/owned", auth, async (req, res) => {
  try {
    const dbResult = await playlistData.getAllUserPlaylists(req.firebaseUid);
    return res.status(200).json(dbResult);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e || "Internal server error" });
  }
});

router.get("/public", auth, async (req, res) => {
  try {
    const dbResult = await playlistData.getAllPublicPlaylists();
    return res.status(200).json(dbResult);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e || "Internal server error" });
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
    const dbResult = await playlistData.getPlaylist(req.firebaseUid, id);
    return res.status(200).json(dbResult);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e || "Internal server error" });
  }
});

module.exports = router;
