import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Error from "../components/Error";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import PlayerContext from "../components/PlayerContext";
import { useParams } from "react-router-dom";
import AddPlaylistPopup from "../components/AddPlaylistPopup";

import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  makeStyles,
  Button,
  List,
  ListItem,
  Divider,
  ListItemText,
  ImageList,
} from "@material-ui/core";

// import { Card, CardHeader, Grid, makeStyles, Button } from "@material-ui/core";
import { AuthContext } from "../firebase/Auth";
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
import TableContainer from "@mui/material/TableContainer";
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';

const useStyles = makeStyles({
  albumImg: {
    width: "30%",
    height: "30%",
    objectFit: "cover",
    borderRadius: "20px",
  },

  title: {
    marginTop: "20px",
    color: "#ffffff",
  },
  subTitle: {
    color: "#C84B31",
    textAlign: "center",
  },

  link: {
    textDecoration: "none",
    color: "white",
  },

  addToPlaylistBtn: {
    backgroundColor: "#ECDBBA",
    color: "#161616",
    "&:hover": {
      backgroundColor: "#FCDBBB",
      color: "#161616",
    },
  },

  playBtn: {
    color: "#5d0000",
    marginLeft: "50px",
    backgroundColor: "#02A82F",
    "&:hover": {
      backgroundColor: "#038B28",
    },
  },

  lyricsBtn: {
    backgroundColor: "#e31f5f",
    marginLeft: "50px",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#E1114D",
    },
  },

  tableContainer: {
    backgroundColor: "#262626",
    marginLeft: "auto",
    marginTop: "30px",
  },
});

const CategoryPlaylist = () => {
  const classes = useStyles();
  //to get data of particular albums
  const { id } = useParams();
  const [trackAlbums, setTrackAlbums] = useState();
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const [playingTrack, setPlayingTrack] = useContext(PlayerContext);
  const [trackToAdd, setTrackToAdd] = useState(null);
  const [popupOpened, setPopupOpened] = useState(false);

  const handlePopupOpened = () => {
    setPopupOpened(true);
  };

  const handlePopupClosed = () => {
    setPopupOpened(false);
  };

  const handleAddToPlaylist = async (track) => {
    setTrackToAdd(track);
    handlePopupOpened();
  };

  const handlePlayingTrack = (track) => {
    setPlayingTrack(track);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = await currentUser.getIdToken();
        const { data } = await axios.get(
          `http://localhost:3008/categoryPlaylist/${id}`,
          {
            headers: {
              FirebaseIdToken: userToken,
            },
          },
        );
        console.log(id);
        if (!data) throw "Request for album details failed!";
        console.log(data);
        setTrackAlbums(data);
        setLoading(false);
        setFound(true);
      } catch (e) {
        setError(e.message);
        setFound(true);
      }
    };
    if (currentUser) fetchData();
  }, [currentUser, id]);

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  } else if (!found) return <Error message={"404: Resource not Found"} />;
  else
    return (
      trackAlbums && (
        <div key={trackAlbums.id}>
          <h1 className={classes.title}>{trackAlbums.name}</h1>
          {trackToAdd && (
            <AddPlaylistPopup
              open={popupOpened}
              handleClose={handlePopupClosed}
              track={{
                imageUrl: trackToAdd?.album.images[0].url,
                ...trackToAdd,
              }}
            />
          )}
          <br />
          <TableContainer
            container="true"
            className={classes.tableContainer}
            spacing={5}
          >
            {/* {albumDetails.tracks.items.map((track) => */}
            <div style={{ maxWidth: "1500px" }}>
              <h2 className={classes.subTitle} style={{ textAlign: "center" }}>
                Tracks
              </h2>
              <List className={classes.list} style={{ marginTop: "30px" }}>
                {trackAlbums.map((element, idx) => (
                  <ListItem
                    className={classes.listItem}
                    key={element?.track.name}
                  >
                    <ListItemText
                      className={classes.link}
                      style={{ maxWidth: "25px" }}
                    >
                      {idx + 1}.
                    </ListItemText>
                    <ListItemText
                      className={classes.link}
                      style={{ maxWidth: "1150px", textAlign: "start" }}
                    >
                      {element?.track.name} - {element?.track.artists[0].name}
                    </ListItemText>
                    {/* <Button
                      className={classes.addToPlaylistBtn}
                      style={{ textAlign: "start" }}
                      onClick={() =>
                        addToPlaylist(element?.track.id, element?.track.name)
                      }
                    >
                      Add To PlayList
                    </Button> */}
                    <Button
                      className={classes.addToPlaylistBtn}
                      variant="contained"
                      style={{ textAlign: "start" }}
                      onClick={() => handleAddToPlaylist(element?.track)}
                    >
                      Add To PlayList
                    </Button>
                    <br />
                    <Button
                      className={classes.playBtn}
                      onClick={() => handlePlayingTrack(element?.track)}
                    >
                      Play
                    </Button>
                    <br />
                    <Button
                      className={classes.lyricsBtn}
                      href={`/Lyrics/${encodeURIComponent(
                        trackAlbums?.artists?.name,
                      )}/${encodeURIComponent(element?.track.name)}`}
                    >
                      Lyrics
                    </Button>
                  </ListItem>
                ))}
              </List>
            </div>
          </TableContainer>
        </div>
      )
    );
};
export default CategoryPlaylist;
