import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card, CardHeader, Grid, makeStyles, Button } from "@material-ui/core";
// import { Default } from "react-toastify/dist/utils";
import DefaultImage from "../img/DefaultImage.jpeg";

const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: "auto",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    border: "1px solid #1e8678",
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
  },
  titleHead: {
    borderBottom: "1px solid #1e8678",
    fontWeight: "bold",
  },
  grid: {
    flexGrow: 1,
    flexDirection: "row",
  },
  media: {
    height: "200px",
    width: "200px",
    maxHeight: "200px",
    maxWidth: "200px",
  },
  button: {
    // color: "#1e8678",
    fontWeight: "bold",
    fontSize: 12,
  },
});

const AlbumSong = () => {
  const classes = useStyles();
  //to get data of particular albums
  const { AlbumId } = useParams();

  const [trackAlbums, setTrackAlbums] = useState();
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);

  const addToPlaylist = async (trackId) => {
    try {
      await axios.get(
        `http://localhost:3008/playlist/6393c998ba7131648ed117dc/${trackId}`,
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  const getAlbums = async () => {
    const requestInit = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_URL_ALBUMS_ID_TRACKS}/${AlbumId}`,
        requestInit,
      );

      console.log("we get response");
      console.log("data=", response.data);

      setLoading(false);
      setFound(true);
      setTrackAlbums(response.data);
    } catch (error) {
      setFound(false);
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getAlbums();
  }, [AlbumId]);

  const buildCard = (track) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={track?.id}>
        <Card className={classes.card} variant="outlined">
          <CardHeader className={classes.titleHead} title={track?.id} />
          <CardHeader className={classes.titleHead} title={track?.name} />
          <br />
          <Button onClick={() => addToPlaylist(track?.id)}>
            Add To PlayList
          </Button>
        </Card>
      </Grid>
    );
  };

  if (loading) {
    return (
      <div>
        <h2> {"Loading please wait for few second"}</h2>
        <h2> {"................................."}</h2>
      </div>
    );
  } else if (!found) {
    return <h1>404: not enough data for this page</h1>;
  } else
    return (
      <div>
        <h1>{" tracks"}</h1>

        {/* <CardMedia
                className={classes.media}
                component="img"
                image={
                    trackAlbums?.images[0]?.url
                    ? trackAlbums?.images[0]?.url
                    : DefaultImage
                }
                title="Album"
              />  */}

        <img
          className="Album"
          src={trackAlbums?.images[0]?.url}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DefaultImage;
          }}
          alt="Album"
        />

        <br />
        <Grid container className={classes.grid} spacing={5}>
          {trackAlbums?.tracks?.items.map((track) => buildCard(track))}
        </Grid>
      </div>
    );
};
export default AlbumSong;
