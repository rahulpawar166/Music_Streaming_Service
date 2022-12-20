import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Error from "../components/Error";
import Loading from "../components/Loading";
import PlayerContext from "../components/PlayerContext";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Paper, makeStyles, Button, Typography } from "@material-ui/core";
import { AuthContext } from "../firebase/Auth";
import AddPlaylistPopup from "../components/AddPlaylistPopup";

const useStyles = makeStyles((theme) => ({
  trackPaper: {
    width: "fit-content",
    margin: "0 auto",
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    marginTop: theme.spacing(20),
    backgroundColor: "rgba(236, 219, 186, 0.2)",
  },
  trackImg: {
    width: "40%",
    height: "40%",
    objectFit: "cover",
    borderRadius: "20px",
    marginTop: "20px",
  },

  title: {
    marginTop: "20px",
    color: "#ffffff",
    fontSize: "40px",
  },
  subTitle: {
    color: "#A5A5A5",
    textAlign: "center",
    fontSize: "30px",
    marginTop: "10px",
    marginBottom: "10px",
  },

  link: {
    textDecoration: "none",
    color: "white",
  },

  addToPlaylistBtn: {
    backgroundColor: "#ECDBBA",

    marginTop: "20px",
    color: "#161616",
    "&:hover": {
      backgroundColor: "#FCDBBB",
      color: "#161616",
    },
  },

  playBtn: {
    color: "#ffffff",
    marginTop: "20px",
    marginLeft: "40px",
    backgroundColor: "#008a00",
    "&:hover": {
      backgroundColor: "#038B28",
    },
  },

  lyricsBtn: {
    backgroundColor: "#e31f5f",
    marginTop: "20px",
    marginLeft: "40px",
    color: "#ffffff",
    "&:hover": {
      backgroundColor: "#E1114D",
    },
  },
}));

const TrackDetails = () => {
  const classes = useStyles();
  const [playingTrack, setPlayingTrack] = useContext(PlayerContext);
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [trackDetails, setTrackDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState({
    exists: false,
    message: "",
  });
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
        const { data } = await axios.get(`http://localhost:3008/tracks/${id}`, {
          headers: {
            FirebaseIdToken: userToken,
          },
        });
        if (!data) throw "Request for track details failed!";
        setTrackDetails(data);
        setError({
          exists: false,
          message: "",
        });
        setLoading(false);
      } catch (e) {
        console.error(e);
        setLoading(false);
        setError({
          exists: true,
          message: e.message,
        });
      }
    };
    if (currentUser) fetchData();
  }, [currentUser, id]);

  if (loading) return <Loading />;
  else if (error.exists) return <Error message={error.message} />;
  else
    return (
      trackDetails && (
        <Paper variant="outlined" className={classes.trackPaper}>
          <AddPlaylistPopup
            open={popupOpened}
            handleClose={handlePopupClosed}
            track={{ trackDetails }}
          />
          <Typography className={classes.title} variant="h1">
            {trackDetails?.name}
          </Typography>
          <Typography className={classes.subTitle} variant="h2">
            {trackDetails?.artists[0]?.name}
          </Typography>
          <img
            className={classes.trackImg}
            src={trackDetails?.album?.images[0]?.url}
            alt={trackDetails?.name}
          />

          <br />
          <Button
            className={classes.addToPlaylistBtn}
            onClick={() => handleAddToPlaylist(trackDetails)}
          >
            Add To PlayList
          </Button>

          <Button
            className={classes.playBtn}
            onClick={() => handlePlayingTrack(trackDetails)}
          >
            Play
          </Button>

          <Button
            className={classes.lyricsBtn}
            href={`/lyrics/${encodeURIComponent(
              trackDetails?.artists[0]?.name,
            )}/${encodeURIComponent(trackDetails?.name)}`}
          >
            Lyrics
          </Button>
        </Paper>
      )
    );
};
export default TrackDetails;
