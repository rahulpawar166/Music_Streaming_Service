import React, { useEffect, useState,useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {  Card, CardHeader, Grid, makeStyles, CardMedia, Button } from "@material-ui/core";
import DefaultImage from "../img/DefaultImage.jpg";
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

const CategoryPlaylist = () => {
  const classes = useStyles();
  // const {currentUser} = useContext(AuthContext);
  //to get data of particular albums
  const {playlistId}=useParams();
  // const [playListId, setPlayListId] = useState();
  const [trackAlbums, setTrackAlbums] = useState();
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);

  const addToPlaylist = async (trackId) => {
    
    try {
      const { data } = await axios.post(
        `http://localhost:3008/playlist/addTrack`,{
          playlistId:window.localStorage.getItem("currentUser"),  
          albumId:trackId
          
        }
      );
    } catch (error) {
      console.log("error", error);
    }
  };
  const getCategoriesPlaylist = async () => {
    const requestInit = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await axios.get(
        `https://api.spotify.com/v1/playlists/${playlistId}`,
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
    console.log("inside categories song")
    getCategoriesPlaylist();
  }, [playlistId]);
  

  const buildCard = (track) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={track?.track.id}>
        <Card className={classes.card} variant="outlined">
          {/* <CardHeader className={classes.titleHead} title={track?.id} /> */}
          <CardHeader className={classes.titleHead} title={track?.track.name} />
          <br />
          <span>{track?.track?.artists[0]?.name}</span>
          <br/>
          <br/>
          <Button onClick={() => addToPlaylist(track?.id)}>
            Add To PlayList
          </Button>
          <Button>Play</Button>
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
        <h1>{trackAlbums?.name}</h1>
        <img
        width={400}
        height={400}
          className="Album"
          src={trackAlbums?.images[0]?.url}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DefaultImage;
          }}
          alt="Album"
        />
        <br />
        <br />

        <Grid container className={classes.grid} spacing={5}>
          {trackAlbums?.tracks?.items.map((track) => buildCard(track))}
        </Grid>
      </div>
    );
};
export default CategoryPlaylist;
