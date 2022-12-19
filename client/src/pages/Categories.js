import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
  Link,
  Card,
  CardHeader,
  Grid,
  makeStyles,
  CardMedia,
  Button,
} from "@material-ui/core";
import { AuthProvider, AuthContext } from "../firebase/Auth";

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
  const { Id } = useParams();
  const [playListId, setPlayListId] = useState();
  const [trackAlbums, setTrackAlbums] = useState();
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);

  const getCategories = async () => {
    const requestInit = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/browse/categories/${Id}/playlists`,
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
    console.log("inside categories song");
    getCategories();
  }, [Id]);

  const buildCard = (track) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={track?.id}>
        <Card className={classes.card} variant="outlined">
          <CardHeader className={classes.titleHead} title={track?.name} />
          <span>{track?.description}</span>
          <CardMedia
            className={classes.media}
            component="img"
            image={track?.images[0]?.url}
            title="categories image"
          />
          <br />
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
        <br />
        <br />
        <Grid container className={classes.grid} spacing={5}>
          {trackAlbums?.playlists.items.map((track) => buildCard(track))}
        </Grid>
      </div>
    );
};
export default AlbumSong;
