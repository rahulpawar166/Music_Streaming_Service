import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Error from "../components/Error";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Card, CardHeader, Grid, makeStyles, Button } from "@material-ui/core";
import { AuthContext } from "../firebase/Auth";
import PlayerContext from "../components/PlayerContext";

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
    fontWeight: "bold",
    fontSize: 12,
  },
});

const AlbumDetails = () => {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [albumDetails, setAlbumDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playingTrack, setPlayingTrack] = useContext(PlayerContext);

  const handleAddToPlaylist = async (trackId) => {
    return;
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

  const buildCard = (artist, track) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={track?.id}>
        <Card className={classes.card} variant="outlined">
          {/* <CardHeader className={classes.titleHead} title={track?.id} /> */}
          <CardHeader className={classes.titleHead} title={track?.name} />
          <br />
          <Button onClick={() => handleAddToPlaylist(track?.id)}>
            Add To PlayList
          </Button>
          <Button onClick={() => handlePlayingTrack(track)}>Play</Button>
          <br />
          <Link to={`/Lyrics/${artist}/${track?.name}`}>Lyrics</Link>
        </Card>
      </Grid>
    );
  };

  if (loading) return <Loading />;
  else if (error) return <Error message={error} />;
  else
    return (
      albumDetails && (
        <div key={albumDetails.id}>
          <h1>{albumDetails.name}</h1>

          <img
            className="Album"
            src={albumDetails.images[0].url}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/no-image.jpg";
            }}
            alt={albumDetails.name}
          />
          <p>
            {`${albumDetails.total_tracks} ${
              parseInt(albumDetails.total_tracks) === 1 ? "Song" : "Songs"
            }`}
          </p>
          <br />
          <Grid container className={classes.grid} spacing={5}>
            {albumDetails.tracks.items.map((track) =>
              buildCard(albumDetails.artists[0].name, track),
            )}
          </Grid>
        </div>
      )
    );
};
export default AlbumDetails;
