import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Grid,
  makeStyles,
  Button,
} from "@material-ui/core";

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

const NewRelease = () => {
  const [musicAlbums, setMusicAlbums] = useState([]);
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);

  console.log(
    "accessstoken from new release=",
    window.localStorage.getItem("token"),
  );

  const getNewMusicAlbumReleases = async () => {
    const requestInit = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_NEW_RELEASE}`,
        requestInit,
      );
      console.log("we get response");
      console.log(response);
      setLoading(false);
      setFound(true);
      setMusicAlbums(response.data.albums.items);
      // console.log(musicAlbums);
    } catch (error) {
      setFound(false);
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getNewMusicAlbumReleases();
  }, []);

  const buildCard = (album) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={album?.id}>
        <Card className={classes.card} variant="outlined">
          <CardActions>
            <Link to={`/${album?.id}`}>
              <CardHeader className={classes.titleHead} title={album?.name} />

              <CardMedia
                className={classes.media}
                component="img"
                image={album?.images[0]?.url}
                title="character image"
              />
            </Link>
          </CardActions>
          <Button className={classes.button}>Add</Button>
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
        <h1>{"New Released Albums"}</h1>
        <br />
        <Grid container className={classes.grid} spacing={5}>
          {musicAlbums?.map((album) => buildCard(album))}
        </Grid>
        {/* <ul>
          {musicAlbums?.map((album) => (
            <li key={album.id}>{album.name}</li>
          ))} 
        </ul>*/}
      </div>
    );
};

export default NewRelease;
