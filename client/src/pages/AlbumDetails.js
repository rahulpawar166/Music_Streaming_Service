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
          <p style={{ textAlign: "center" }}>
            Number of Tracks:{" "}
            {`${albumDetails.total_tracks} ${
              parseInt(albumDetails.total_tracks) === 1 ? "Song" : "Songs"
            }`}
          </p>
          <br />
          <TableContainer container="true" className={classes.grid} spacing={5}>
            {/* {albumDetails.tracks.items.map((track) => */}
            <div style={{ maxWidth: "1500px" }}>
              <h1 style={{ textAlign: "center" }}>Track</h1>
              <List style={{ marginTop: "30px" }}>
                {albumDetails.tracks.items?.map((element, idx) => (
                  <ListItem key={element?.id}>
                    <ListItemText style={{ maxWidth: "25px" }}>
                      {idx + 1}.
                    </ListItemText>
                    <ListItemText
                      style={{
                        maxWidth: "1150px",
                        textAlign: "start",
                        textDecoration: "none",
                      }}
                    >
                      <Link to={`/track/${element?.id}`}>{element.name}</Link>
                    </ListItemText>
                    <Button
                      style={{ textAlign: "start" }}
                      onClick={() => addToPlaylist(element?.id, element?.name)}
                    >
                      Add To PlayList
                    </Button>
                    <br />
                    <Button onClick={() => handlePlayingTrack(element)}>
                      Play
                    </Button>
                    <br />
                    <Button
                      className="lyrics"
                      href={`/lyrics/${encodeURIComponent(
                        albumDetails?.artists[0]?.name,
                      )}/${encodeURIComponent(element?.name)}`}
                    >
                      Lyrics
                    </Button>
                  </ListItem>
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
