import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Player from "./Player";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Card, CardHeader, Grid, makeStyles, Button } from "@material-ui/core";

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
    // borderBottom: "1px solid #1e8678",
    // fontWeight: "bold",
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

const Lyrics = () => {
  const classes = useStyles();

  const { artist, trackName } = useParams();
  const [found, setFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lyricsData, setLyrics] = useState();
  const [playingTrack, setPlayingTrack] = useState();

  const showLyrics = async (artist, trackName) => {
    console.log("lyrics ");
    try {
      const { data } = await axios.get(
        `http://localhost:3008/lyrics/${artist}/${trackName}`,
      );
      console.log("lyrics", data);
      setLyrics(data);
      setFound(true);
      setLoading(false);
    } catch (error) {
      setFound(false);
      setLoading(false);
      console.log("error", error);
    }
  };

  useEffect(() => {
    console.log("inside Lyrics ");
    showLyrics(artist, trackName);
  }, [artist, trackName]);

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
        <h1> Lyrics</h1>
        <p className="lyrics">{lyricsData}</p>

        {/* <div><Player/></div> */}
      </div>
    );
};
export default Lyrics;
