import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Error from "../components/Error";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Paper, makeStyles, Button, Typography } from "@material-ui/core";
import { AuthContext } from "../firebase/Auth";
import { ThemeContext } from "@emotion/react";

const useStyles = makeStyles((theme) => ({
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
    height: "60vh",
    width: "auto",
  },
  button: {
    // color: "#1e8678",
    fontWeight: "bold",
    fontSize: 12,
  },
  trackPaper: {
    width: "fit-content",
    margin: "0 auto",
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
}));

const TrackDetails = () => {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [trackDetails, setTrackDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);
  const [error, setError] = useState({
    exists: false,
    message: "",
  });

  const handleAddToPlaylist = async (trackId) => {
    return;
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
        // if (!data) throw "Request for track details failed!";
        console.log(data);
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
  // else if (error) return <Error message={error} />;
  else
    return (
      trackDetails && (
        <Paper variant="outlined" className={classes.trackPaper}>
          <Typography variant="h2">{trackDetails?.name}</Typography>
          <Typography variant="h4">{trackDetails?.artists[0]?.name}</Typography>
          <img
            className={classes.media}
            src={trackDetails?.album?.images[0]?.url}
            alt={trackDetails?.name}
          />
          <p>Popularity: {trackDetails?.popularity}</p>
          <p>Length: {trackDetails?.duration_ms}</p>
          <p>Track Number: {trackDetails?.track_number}</p>
          <Button>Add To PlayList</Button>
          <br />
          <Button>Play</Button>
          <br />
          <Button
            className="lyrics"
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
