router.get("/categories/", auth, async (req, res) => {
  try {
    let spotifyAxiosInstance = await spotifyAxios(req.firebaseUid);
    let exists = await client.exists("newreleases");
    if (exists) {
      const cached = await client.get("newreleases");
      return res.status(200).json(Object.values(unflatten(JSON.parse(cached))));
    } else {
      const { data } = await spotifyAxiosInstance.get(
        "https://api.spotify.com/v1/browse/categories?country=US",
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
