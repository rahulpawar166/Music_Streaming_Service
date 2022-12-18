import React, { useEffect, useState,useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import {  Card, CardHeader, Grid, makeStyles, CardMedia, Button } from "@material-ui/core";
import DefaultImage from "../img/DefaultImage.jpeg";
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
  // const {currentUser} = useContext(AuthContext);
  //to get data of particular albums
  const {AlbumId}=useParams();
  const [playListId, setPlayListId] = useState();
  const [trackAlbums, setTrackAlbums] = useState();
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);


  const addToPlaylist = async (trackId,trackname) => {
    
    try {
      const { data } = await axios.post(
        `http://localhost:3008/playlist/addTrack`,{
          uid:window.localStorage.getItem("currentUser"),  
          albumId:trackId,
          name:window.localStorage.getItem("currentPlaylist"),
          trackname:trackname
        }
      );
    } catch (error) {
      console.log("error", error);
    }
  };

  // const getPlayList=async()=>{
  
  //   try {
  //     const { data } = await axios.get(
  //       `http://localhost:3008/playlist/playListData`
  //     );
  //     console.log(data)
  //     setPlayListId(data[0]._id)
  //   } catch (error) {
  //     console.log("error", error);
  //   }
  //  }


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
    console.log("inside album song ")
    getAlbums();
  }, [AlbumId]);

  const buildCard = (artist,track) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={track?.id}>
        <Card className={classes.card} variant="outlined">
          {/* <CardHeader className={classes.titleHead} title={track?.id} /> */}
          <CardHeader className={classes.titleHead} title={track?.name} />
          <br />
          <Button onClick={() => addToPlaylist(track?.id,track?.name)}>
            Add To PlayList
          </Button>
          <Button>Play</Button>
          <br/>
          <br/>
          <Button href={`/Lyrics/${artist}/${track?.name}`}>Lyrics</Button>
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
          className="Album"
          src={trackAlbums?.images[0]?.url}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = DefaultImage;
          }}
          alt="Album"
        />
        <br />
        {/* <Button>{trackAlbums?.artists[0]?.name}</Button> */}
        <Grid container className={classes.grid} spacing={5}>
          {trackAlbums?.tracks?.items.map((track) => buildCard(trackAlbums?.artists[0]?.name,track))}
        </Grid>
      </div>
    );
};
export default AlbumSong;
