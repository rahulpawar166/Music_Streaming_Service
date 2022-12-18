const express = require("express");
const axios = require("axios");
const qs = require("qs");
const auth = require("../auth");
const validate = require("../data/validate");
const usersData = require("../data").usersData;
const router = express.Router();

class AuthError extends Error {
  constructor(message, status) {
    super(`AuthError status code ${status || 400} | ${message}`);
    this.name = "AuthError";
    this.status = status || 400;
  }
}

router.post("/spotify_access_token", auth, async (req, res) => {
  try {
    const code = req.body.code || null;
    if (code === null) throw new AuthError("No code was received", 500);
    const { data } = await axios({
      url: "https://accounts.spotify.com/api/token",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${new Buffer(
          process.env.EXPRESS_APP_SPOTIFY_CLIENT_ID +
            ":" +
            process.env.EXPRESS_APP_SPOTIFY_CLIENT_SECRET,
        ).toString("base64")}`,
      },
      data: qs.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: process.env.EXPRESS_APP_SPOTIFY_REDIRECT_URI,
      }),
    });
    if (!data)
      throw `Failed to get access token: no response from Spotify API!`;
    // Store refresh token in user document
    await usersData.storeRefreshToken(req.firebaseUid, data.refresh_token);
    await usersData.storeAccessToken(req.firebaseUid, data.access_token);
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    return res.status(e.status || 400).json({ error: e.message });
  }
});

module.exports = router;
