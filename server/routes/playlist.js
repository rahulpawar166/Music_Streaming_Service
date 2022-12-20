const express = require("express");
const data = require("../data");
const router = express.Router();
const playlistData = data.playlistData;
const axios = require("axios");
const xss = require("xss");
const flat = require("flat");
const unflatten = flat.unflatten;
const redis = require("redis");
const client = redis.createClient();
client.connect().then(() => {});

//return playlist data
router.post("/playListData", async (req, res) => {
  console.log("inside fetch route");
  //we use uid to create playlist for each user
  let uid = xss(req.body.uid);
  console.log("uid=", uid);

  if (!uid || uid.trim() === "") {
    res.status(400).json({ errors: "uid is not valid " });
    return;
  }

  try {
    const fetch_data = await playlistData.getPlayListData(uid);
    return res.status(200).json(fetch_data);
  } catch (e) {
    if (e) {
      res.status(404).json({ errors: e });
      return;
    } else {
      res.status(500).json({
        error: "Internal Server Error",
      });
      return;
    }
  }
});

//return particular playlist data
router.post("/indPlaylist", async (req, res) => {
  console.log("inside fetch route of individual post");
  //we use uid to create playlist for each user
  let uid = xss(req.body.uid);
  let name = xss(req.body.name);

  console.log("uid=", uid);

  if (!uid || uid.trim() === "") {
    res.status(400).json({ errors: "uid is not valid " });
    return;
  }

  if (!name || name.trim() === "") {
    res.status(400).json({ errors: "name is not valid " });
    return;
  }

  try {
    const fetch_data = await playlistData.getIndPlayListData(uid, name);
    return res.status(200).json(fetch_data);
  } catch (e) {
    if (e) {
      res.status(404).json({ errors: e });
      return;
    } else {
      res.status(500).json({
        error: "Internal Server Error",
      });
      return;
    }
  }
});

router.post("/create", async (req, res) => {
  console.log("inside create route");
  //we use uid to create playlist for each user
  let uid = xss(req.body.uid);

  console.log("uid=", uid);
  if (!uid || uid.trim() === "") {
    res.status(400).json({ errors: "uid is not valid " });
    return;
  }

  try {
    const fetch_data = await playlistData.createPlaylist(uid);
    return res.status(200).json(fetch_data);
  } catch (e) {
    if (e) {
      res.status(404).json({ errors: e });
      return;
    } else {
      res.status(500).json({
        error: "Internal Server Error",
      });
      return;
    }
  }
});

router.post("/addPlaylist", async (req, res) => {
  console.log("inside create playlist route");
  //we use name to create playlist for each user
  let name = xss(req.body.name);
  let uid = xss(req.body.uid);

  console.log("route", name, uid);

  if (!name || name.trim() === "") {
    res.status(400).json({ errors: "name is not valid " });
    return;
  }

  if (!uid || uid.trim() === "") {
    res.status(400).json({ errors: "uid is not valid " });
    return;
  }

  try {
    const fetch_data = await playlistData.addPlayList(uid, name);
    return res.status(200).json(fetch_data);
  } catch (e) {
    if (e) {
      console.log(e);
      res.status(404).json({ errors: e });
      return;
    } else {
      res.status(500).json({
        error: "Internal Server Error",
      });
      return;
    }
  }
});

router.post("/deletePlaylist", async (req, res) => {
  console.log("inside delete playlist route");
  //we use name to create playlist for each user
  let name = xss(req.body.name);
  let uid = xss(req.body.uid);

  if (!name || name.trim() === "") {
    res.status(400).json({ errors: "name is not valid " });
    return;
  }

  if (!uid || uid.trim() === "") {
    res.status(400).json({ errors: "uid is not valid " });
    return;
  }

  try {
    const fetch_data = await playlistData.deletePlaylist(uid, name);
    return res.status(200).json(fetch_data);
  } catch (e) {
    if (e) {
      console.log(e);
      res.status(404).json({ errors: e });
      return;
    } else {
      res.status(500).json({
        error: "Internal Server Error",
      });
      return;
    }
  }
});

router.post("/deleteTrack", async (req, res) => {
  console.log("delete albums routes");

  const uid = xss(req.body.uid);
  const name = xss(req.body.name);
  const albumId = xss(req.body.albumId);

  console.log(uid, name, albumId);

  if (!albumId || albumId.trim() === "") {
    res.status(400).json({ errors: "albumId is not valid " });
    return;
  }
  if (!uid || uid.trim() === "") {
    res.status(400).json({ errors: "uid is not valid " });
    return;
  }

  if (!name || name.trim() === "") {
    res.status(400).json({ errors: "name is not valid " });
    return;
  }

  console.log(uid, albumId, name);

  try {
    const fetch_data = await playlistData.deleteAlbum(uid, name, albumId);

    res.status(200).json(fetch_data);
    return;
  } catch (e) {
    if (e) {
      res.status(400).json({ errors: e });
      return;
    } else {
      res.status(500).json({
        error: "Internal Server Error",
      });
      return;
    }
  }
});

router.post("/addTrack", async (req, res) => {
  //uid refer to user id
  console.log("add albums routes");
  const albumId = xss(req.body.albumId);
  const uid = xss(req.body.uid);
  const name = xss(req.body.name);
  const trackname = xss(req.body.trackname);
  const img_url = xss(req.body.img_url);

  if (!albumId || albumId.trim() === "") {
    res.status(400).json({ errors: "albumId is not valid " });
    return;
  }
  if (!uid || uid.trim() === "") {
    res.status(400).json({ errors: "uid is not valid " });
    return;
  }
  if (!name || name.trim() === "") {
    res.status(400).json({ errors: "name is not valid " });
    return;
  }

  if (!trackname || trackname.trim() === "") {
    res.status(400).json({ errors: "trackname is not valid " });
    return;
  }

  console.log(uid, albumId, name);

  try {
    const fetch_data = await playlistData.addAlbum(
      uid,
      albumId,
      name,
      trackname,
      img_url,
    );

    res.status(200).json(fetch_data);
    return;
  } catch (e) {
    if (e) {
      res.status(400).json({ errors: e });
      return;
    } else {
      res.status(500).json({
        error: "Internal Server Error",
      });
      return;
    }
  }
});

router.get("/:albumId", async (req, res) => {
  //
  try {
    // console.log(1)
    const albumId = req.params.albumId;
    if (!ObjectId.isValid(albumId)) {
      return res.status(400).json({ error: "NO ALBUM WITH THAT ID FOUND" });
    }
    console.log(3);
    const getalbum = await playlistData.get(albumId);
    res.json(getalbum);
    res.status(200);
  } catch (e) {
    return res.status(400).json({ error: "ALBUM BY ID IS NOT FOUND" });
  }
});

module.exports = router;
