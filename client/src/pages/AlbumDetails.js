import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Card, CardHeader, Grid, makeStyles, Button } from "@material-ui/core";
import DefaultImage from "../img/DefaultImage.jpeg";
import { AuthContext } from "../firebase/Auth";
import Loading from "../components/Loading";

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
  const { currentUser } = useContext(AuthContext);
  //to get data of particular albums
  const { id } = useParams();
  const [playListId, setPlayListId] = useState();
  const [trackAlbums, setTrackAlbums] = useState();
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);

  const addToPlaylist = async (trackId) => {
    try {
      const { data } = await axios.post(
        `http://localhost:3008/playlist/addTrack`,
        {
          playlistId: currentUser.uid,
          albumId: trackId,
        },
      );
    } catch (error) {
      console.error(error);
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
        `${process.env.REACT_APP_URL_ALBUMS_ID_TRACKS}/${id}`,
        requestInit,
      );
      setLoading(false);
      setFound(true);
      setTrackAlbums(response.data);
    } catch (error) {
      setFound(false);
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    getAlbums();
  }, [currentUser, id]);

  const buildCard = (artist, track) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={track?.id}>
        <Card className={classes.card} variant="outlined">
          {/* <CardHeader className={classes.titleHead} title={track?.id} /> */}
          <CardHeader className={classes.titleHead} title={track?.name} />
          <br />
          <Button onClick={() => addToPlaylist(track?.id)}>
            Add To PlayList
          </Button>
          <Button>Play</Button>
          <br />
          <br />
          <Link to={`/Lyrics/${artist}/${track?.name}`}>Lyrics</Link>
        </Card>
      </Grid>
    );
  };

  if (loading) return <Loading />;
  else if (!found) {
    return <h1>404: not enough data for this page</h1>;
  } else
    return (
      <div>
        <h1>{trackAlbums?.name}</h1>

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
          {trackAlbums?.tracks?.items.map((track) =>
            buildCard(trackAlbums?.artists[0]?.name, track),
          )}
        </Grid>
      </div>
    );
};
export default AlbumSong;
