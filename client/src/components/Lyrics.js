import axios from "axios";
import Paper from "@material-ui/core/Paper";
import { makeStyles, Typography } from "@material-ui/core";
import { AuthContext } from "../firebase/Auth";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Error from "./Error";
import Loading from "./Loading";
import { width } from "@mui/system";

const useStyles = makeStyles((theme) => ({
  lyricsPaper: {
    padding: theme.spacing(2),
    margin: "0 auto",
    marginTop: theme.spacing(2),
    width: "fit-content",
  },
  lyrics: {
    whiteSpace: "pre-line",
    color: "#ffffff",
  },
  title: {
    marginTop: "20px",
    color: "#008c00",
  },
}));

const Lyrics = () => {
  const classes = useStyles();
  const { artist, trackName } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [lyricsData, setLyrics] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLyrics = async () => {
      try {
        const { data } = await axios.post(`http://localhost:3008/lyrics`, {
          artist: decodeURIComponent(artist),
          trackName: decodeURIComponent(trackName),
        });
        if (data === "NO_LYRICS")
          throw "Unfortunately, lyrics could not be found for this track.";
        setLyrics(data);
        setLoading(false);
        setError(null);
      } catch (e) {
        setLoading(false);
        setError(e);
        console.error(e);
      }
    };
    if (currentUser && artist && trackName) fetchLyrics();
  }, [currentUser, artist, trackName]);

  if (loading) return <Loading />;
  else if (error) return <Error message={error} />;
  else
    return (
      <div>
        <Typography variant="h1" className={classes.title}>
          Lyrics
        </Typography>
        <Paper className={classes.lyricsPaper}>
          <Typography className={classes.lyrics} variant="body1">
            {lyricsData && lyricsData}
          </Typography>
        </Paper>
      </div>
    );
};
export default Lyrics;
