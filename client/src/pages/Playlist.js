import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {
  makeStyles,
  Button,
  List,
  ListItem,
  TableContainer,
  ListItemText,
  Typography,
} from "@material-ui/core";
import PlayerContext from "../components/PlayerContext";
import { AuthContext } from "../firebase/Auth";
import DeleteIcon from "@material-ui/icons/Delete";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import Error from "../components/Error";
import Loading from "../components/Loading";

const useStyles = makeStyles({
  albumImg: {
    width: "30%",
    height: "30%",
    objectFit: "cover",
    borderRadius: "4px",
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
    color: "#ffffff",
    weight: "bold",
    marginLeft: "50px",
    backgroundColor: "#02A82F",
    "&:hover": {
      backgroundColor: "#038B28",
    },
  },
  deleteBtn: {
    backgroundColor: "#e31f5f",
    color: "#ffffff",
    weight: "bold",
    marginLeft: "50px",
    "&:hover": {
      backgroundColor: "#E1114D",
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

const Playlist = () => {
  const classes = useStyles();
  const [playlistData, setPlayListData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    exists: false,
    message: "",
  });
  const [needsRefresh, setNeedsRefresh] = useState(true);
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [playingTrack, setPlayingTrack] = useContext(PlayerContext);

  const handlePlayingTrack = (track) => {
    setPlayingTrack(track);
  };

  useEffect(() => {
    const getPlayList = async (id) => {
      try {
        const userToken = await currentUser.getIdToken();
        const { data } = await axios.get(
          `http://localhost:3008/playlists/${id}`,
          {
            headers: {
              FirebaseIdToken: userToken,
            },
          },
        );
        setPlayListData(data);
        setNeedsRefresh(false);
        setLoading(false);
        setError({ exists: false, message: "" });
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError({
          exists: true,
          message: "Failed to fetch playlist data! Whoops!",
        });
      }
    };
    if (currentUser && needsRefresh && id) getPlayList(id);
  }, [id, needsRefresh, currentUser]);

  const deleteFromPlaylist = async (trackId) => {
    try {
      const userToken = await currentUser.getIdToken();
      const { data } = await axios.patch(
        `http://localhost:3008/playlists/removefrom/${id}`,
        {
          trackId: trackId,
        },

        {
          headers: {
            FirebaseIdToken: userToken,
          },
        },
      );
      setNeedsRefresh(true);
      setError({ exists: false, message: "" });
    } catch (error) {
      console.error(error);
      setLoading(false);
      setError({
        exists: true,
        message: "Failed to delete track from playlist!",
      });
    }
  };

  if (error.exists) return <Error message={error.message} />;
  else if (loading) return <Loading />;
  else
    return (
      playlistData && (
        <div key={playlistData.id}>
          <h1 className={classes.title}>{playlistData?.name}</h1>
          <img
            className={classes.albumImg}
            src={playlistData.cover}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/default-cover.jpg";
            }}
            alt={playlistData.name + " Cover"}
          />
          <br />
          {playlistData.tracks ? (
            playlistData.tracks.map((element, idx) => (
              <TableContainer
                container="true"
                className={classes.tableContainer}
                spacing={5}
              >
                <div style={{ maxWidth: "1500px" }}>
                  <List className={classes.list} style={{ marginTop: "10px" }}>
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
                          {element?.name}
                        </Link>
                      </ListItemText>

                      <Button
                        className={classes.deleteBtn}
                        onClick={() => deleteFromPlaylist(element?.id)}
                      >
                        <DeleteIcon />
                      </Button>
                      <Button
                        className={classes.playBtn}
                        onClick={() => handlePlayingTrack(element)}
                      >
                        Play
                      </Button>
                      {/* <Button
                      className={classes.lyricsBtn}
                      href={`/lyrics/${encodeURIComponent(
                        albumDetails?.artists[0]?.name,
                      )}/${encodeURIComponent(element?.name)}`}
                    >
                      Lyrics
                    </Button> */}
                    </ListItem>
                  </List>
                </div>
              </TableContainer>
            ))
          ) : (
            <TableContainer
              container="true"
              className={classes.tableContainer}
              spacing={5}
            >
              <div style={{ maxWidth: "1500px" }}>
                <List className={classes.list} style={{ marginTop: "10px" }}>
                  <ListItem className={classes.listItem}>
                    <ListItemText
                      className={classes.link}
                      style={{ maxWidth: "25px" }}
                    >
                      0.{" "}
                    </ListItemText>
                    <ListItemText
                      style={{
                        maxWidth: "1150px",
                        textAlign: "start",
                        textDecoration: "none",
                      }}
                    >
                      Add some songs to start listening!
                    </ListItemText>
                  </ListItem>
                </List>
              </div>
            </TableContainer>
          )}
        </div>
      )
    );
};
export default Playlist;
