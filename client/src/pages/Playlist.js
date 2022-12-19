import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  makeStyles,
  Button,
} from "@material-ui/core";

import { AuthContext } from "../firebase/Auth";

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

const Playlist = () => {
  const classes = useStyles();
  const [trackData, setTrackData] = useState([]);
  const [playlistData, setPlayListData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);

  const getPlayList = async () => {
    try {
      const { data } = await axios.post(
        `http://localhost:3008/playlist/playListData`,
        { uid: window.localStorage.getItem("currentUser") },
      );
      console.log(data);
      //SET LIST OF ALBBUMS INSIDE PLAYLISTDATA
      setPlayListData(data.albums);
    } catch (error) {
      console.log("error", error);
    }
  };

  const getData = async () => {
    // debugger;
    console.log("inside playlist get data");
    const requestInit = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    };

    let trackId = playlistData;
    console.log("trackId", trackId);
    trackId = trackId.join(",");
    console.log(trackId);

    try {
      const response = await axios.get(
        `${process.env.REACT_APP_GET_TRACKS}?ids=${trackId}`,
        requestInit,
      );

      console.log("data=", response);
      setLoading(false);
      setFound(true);
      setTrackData(response.data.tracks);
    } catch (error) {
      setFound(false);
      setLoading(false);
      console.log(error);
    }
  };

  const deleteFromPlaylist = async (trackId) => {
    console.log("button clicked");

    try {
      const { data } = await axios.post(
        `http://localhost:3008/playlist/deleteTrack`,
        {
          playlistId: window.localStorage.getItem("currentUser"),
          albumId: trackId,
        },
      );
      setPlayListData(data.albums);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    getPlayList();
  }, []);

  useEffect(() => {
    if (playlistData.length > 0) {
      getData();
    } else {
      setFound(false);
      setLoading(false);
    }
  }, [playlistData]);

  const buildCard = (track) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={track?.id}>
        <Card className={classes.card} variant="outlined">
          <CardHeader className={classes.titleHead} title={track?.id} />
          <CardHeader className={classes.titleHead} title={track?.name} />

          <Button onClick={() => deleteFromPlaylist(track?.id)}>
            delete From PlayList
          </Button>
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
        <h1>{" tracks"}</h1>
        <br />
        <Grid container className={classes.grid} spacing={5}>
          {trackData?.map((track) => buildCard(track))}
        </Grid>
      </div>
    );
};
export default Playlist;
