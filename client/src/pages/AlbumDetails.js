import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Error from "../components/Error";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import PlayerContext from "../components/PlayerContext";
import { useParams } from "react-router-dom";
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
} from "@material-ui/core";
import { AuthContext } from "../firebase/Auth";
import TableContainer from "@mui/material/TableContainer";
import AddPlaylistPopup from "../components/AddPlaylistPopup";

const useStyles = makeStyles({
  albumImg: {
    width: "30%",
    height: "30%",
    objectFit: "cover",
    borderRadius: "20px",
  },

  title: {
    marginTop: "20px",
    color: "#008c00",
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
    weight: "bold",
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
const addToPlaylist = async (trackId, trackname, img_url) => {
  try {
    const { data } = await axios.post(
      `http://localhost:3008/playlist/addTrack`,
      {
        uid: window.localStorage.getItem("currentUser"),
        albumId: trackId,
        name: window.localStorage.getItem("currentPlaylist"),
        trackname: trackname,
        img_url: img_url,
      },
    );
  } catch (error) {
    console.log("error", error);
  }
};

const AlbumDetails = () => {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [albumDetails, setAlbumDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playingTrack, setPlayingTrack] = useContext(PlayerContext);
  const [popupOpened, setPopupOpened] = useState(false);

  const handlePopupOpened = () => {
    setPopupOpened(true);
  };

  const handlePopupClosed = () => {
    setPopupOpened(false);
  };

  const handleAddToPlaylist = async (track) => {
    const userToken = await currentUser.getIdToken();
    handlePopupOpened();
  };

  const handlePlayingTrack = (track) => {
    setPlayingTrack(track);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = await currentUser.getIdToken();
        const { data } = await axios.get(`http://localhost:3008/albums/${id}`, {
          headers: {
            FirebaseIdToken: userToken,
          },
        });
        if (!data) throw "Request for album details failed!";
        setAlbumDetails(data);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        console.error(e);
      }
    };
    if (currentUser) fetchData();
  }, [currentUser, id]);

  if (loading) return <Loading />;
  else if (error) return <Error message={error} />;
  else
    return (
      albumDetails && (
        <div key={albumDetails.id}>
          <h1 className={classes.title}>{albumDetails.name}</h1>

          <img
            className={classes.albumImg}
            src={albumDetails.images[0].url}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/no-image.jpg";
            }}
            alt={albumDetails.name}
          />
          {/* <p style={{ textAlign: "center" }}>
            Number of Tracks:{" "}
            {`${albumDetails.total_tracks} ${
              parseInt(albumDetails.total_tracks) === 1 ? "Song" : "Songs"
            }`}
          </p> */}
          <br />

          <TableContainer
            container="true"
            className={classes.tableContainer}
            spacing={5}
          >
            {/* {albumDetails.tracks.items.map((track) => */}
            <div style={{ maxWidth: "1500px" }}>
              {/* <h2 className={classes.subTitle} style={{ textAlign: "center" }}>Track</h2> */}
              <List className={classes.list} style={{ marginTop: "10px" }}>
                {albumDetails.tracks.items?.map((element, idx) => (
                  <div>
                    <AddPlaylistPopup
                      open={popupOpened}
                      handleClose={handlePopupClosed}
                      track={{ element }}
                    />
                    <ListItem className={classes.listItem} key={element?.id}>
                      <ListItemText
                        className={classes.link}
                        style={{ maxWidth: "25px" }}
                      >
                        {idx + 1}.
                      </ListItemText>
                      <ListItemText
                        style={{
                          maxWidth: "1150px",
                          textAlign: "start",
                          textDecoration: "none",
                        }}
                      >
                        <Link
                          className={classes.link}
                          to={`/track/${element?.id}`}
                        >
                          {element.name}
                        </Link>
                      </ListItemText>

                      <Button
                        className={classes.addToPlaylistBtn}
                        variant="contained"
                        style={{ textAlign: "start" }}
                        onClick={() => handleAddToPlaylist(element)}
                      >
                        Add To PlayList
                      </Button>

                      <br />
                      <Button
                        className={classes.playBtn}
                        onClick={() => handlePlayingTrack(element)}
                      >
                        Play
                      </Button>
                      <br />
                      <Button
                        className={classes.lyricsBtn}
                        href={`/lyrics/${encodeURIComponent(
                          albumDetails?.artists[0]?.name,
                        )}/${encodeURIComponent(element?.name)}`}
                      >
                        Lyrics
                      </Button>
                    </ListItem>
                  </div>
                ))}
              </List>
            </div>
            {/* buildCard(albumDetails.artists[0].name, track), */}
            {/* )} */}
          </TableContainer>
        </div>
      )
    );
};
export default AlbumDetails;
