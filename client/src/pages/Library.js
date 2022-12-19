import React, { useContext, useEffect, useState } from "react";
import logo from "../icons/incognitomode2.png";
import axios from "axios";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { AuthContext } from "../firebase/Auth";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Grid,
  makeStyles,
} from "@material-ui/core";
import CreatePlaylistPopup from "../components/CreatePlaylistPopup";

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
    padding: "0.5rem",
    flexDirection: "row",
    flexGrow: 1,
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

const Playlists = () => {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const [userPlaylists, setUserPlaylists] = useState(null);
  const [userPlaylistsLoading, setUserPlaylistsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [popupOpened, setPopupOpened] = useState(false);

  const handlePopupOpened = () => {
    setPopupOpened(true);
  };

  const handlePopupClosed = () => {
    setPopupOpened(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = await currentUser.getIdToken();
        const { data: playlistData } = await axios.get(
          "http://localhost:3008/playlists/owned",
          {
            headers: {
              FirebaseIdToken: userToken,
            },
          },
        );
        console.log(playlistData);
        if (!playlistData) throw "No playlists were found for this user!";
        setUserPlaylists(playlistData);
        setUserPlaylistsLoading(false);
        setError(false);
      } catch (e) {
        console.error(e);
        setUserPlaylistsLoading(false);
        setError(true);
      }
    };
    if (currentUser) fetchData();
  }, [currentUser, popupOpened]);

  const buildPlaylistCard = (playlist) => {
    console.log(playlist);
    return (
      playlist && (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={playlist._id}>
          <Card className={classes.card} variant="outlined">
            <CardActions>
              <Link to={`/playlist/${playlist._id}`}>
                <CardHeader
                  className={classes.titleHead}
                  title={playlist.name}
                />
                <CardMedia
                  className={classes.media}
                  component="img"
                  image={playlist.cover}
                  alt={playlist.name}
                />
              </Link>
            </CardActions>
          </Card>
        </Grid>
      )
    );
  };

  if (userPlaylistsLoading) return <Loading />;
  else if (error) return <Error />;
  return (
    <div className="fancy-border">
      <CreatePlaylistPopup open={popupOpened} handleClose={handlePopupClosed} />
      <img className="logo" src={logo} alt="logo" width={100} height={100} />
      <h1>Library</h1>
      <Button variant="contained" onClick={handlePopupOpened}>
        Create Playlist
      </Button>
      <Grid container className={classes.grid} spacing={5}>
        {userPlaylists &&
          userPlaylists.map((playlist) => buildPlaylistCard(playlist))}
      </Grid>
    </div>
  );
};

export default Playlists;
