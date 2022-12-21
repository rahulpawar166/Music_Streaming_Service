import React, { useContext, useEffect, useState } from "react";
import logo from "../icons/incognitomode2.png";
import axios from "axios";
import Loading from "../components/Loading";
import Error from "../components/Error";
import { AuthContext } from "../firebase/Auth";
import { Link } from "react-router-dom";
import DeleteIcon from "@material-ui/icons/Delete";
import Button from "@material-ui/core/Button";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Grid,
  makeStyles,
} from "@material-ui/core";
import CreatePlaylistPopup from "../components/CreatePlaylistPopup";

const useStyles = makeStyles((theme) => ({
  logo: {
    marginTop: "20px",
    height: 100,
    width: 100,
  },
  card: {
    maxWidth: 250,
    // height: "350px",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
    backgroundColor: "rgba(236, 219, 186, 0.2)",
  },
  title: {
    marginTop: "20px",
    color: "#008c00",
  },
  subTitle: {
    color: "#C84B31",
    textAlign: "left",
    marginLeft: "70px",
  },
  titleHead: {
    color: "#ffffff",
    fontSize: "5px",
    textDecoration: "none",
    height: "auto",
    overflow: "hidden",
  },
  grid: {
    flexGrow: 1,
    marginTop: "20px",
    flexDirection: "row",
    marginLeft: "0px",
    marginRight: "20px",
  },
  media: {
    margin: "0 0 0 0",
  },

  link: {
    textDecoration: "none",
  },
  trackLink: {
    textDecoration: "none",
  },
  centerBtn: {
    marginBottom: theme.spacing(1),
  },
  button: {
    backgroundColor: "#ECDBBA",
    display: "inline-block",
    color: "#161616",
    "&:hover": {
      backgroundColor: "#FCDBBB",
      color: "#161616",
    },
  },
  deleteBtn: {
    backgroundColor: "#e31f5f",
    margin: "0 auto",
    color: "#ffffff",
    weight: "bold",
    "&:hover": {
      backgroundColor: "#E1114D",
    },
  },
}));

const Playlists = () => {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const [userPlaylists, setUserPlaylists] = useState(null);
  const [userPlaylistsLoading, setUserPlaylistsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [needsRefresh, setNeedsRefresh] = useState(true);
  const [popupOpened, setPopupOpened] = useState(false);

  const handlePopupOpened = () => {
    setPopupOpened(true);
  };

  const handlePopupClosed = () => {
    setNeedsRefresh(true);
    setPopupOpened(false);
  };

  const deletePlaylist = async (playlistId) => {
    const userToken = await currentUser.getIdToken();
    try {
      const { data: playlistData } = await axios.delete(
        `http://localhost:3008/playlists/${playlistId}`,
        {
          headers: {
            FirebaseIdToken: userToken,
          },
        },
      );
      setNeedsRefresh(true);
      if (!playlistData) throw "No playlists were found for this user!";
      setUserPlaylists(playlistData);
    } catch (error) {
      console.log("error", error);
    }
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
        setNeedsRefresh(false);
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
    if (currentUser && needsRefresh) fetchData();
  }, [currentUser, needsRefresh]);

  const buildPlaylistCard = (playlist) => {
    console.log(playlist);
    return (
      playlist && (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={playlist._id}>
          <Card className={classes.card} variant="outlined">
            <CardContent>
              <Link className={classes.link} to={`/playlist/${playlist._id}`}>
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
            </CardContent>
            <CardActions className={classes.centerBtn}>
              <Button
                className={classes.deleteBtn}
                onClick={() => deletePlaylist(playlist._id)}
              >
                <DeleteIcon />
              </Button>
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
      <img
        className={classes.logo}
        src={logo}
        alt="logo"
        width={100}
        height={100}
      />
      <h1 className={classes.title}>Library</h1>
      <Box>
        <Button
          className={classes.button}
          component="label"
          variant="contained"
          onClick={handlePopupOpened}
        >
          Create Playlist
        </Button>
      </Box>
      <Grid container className={classes.grid} spacing={5}>
        {userPlaylists?.map((playlist) => buildPlaylistCard(playlist))}
      </Grid>
    </div>
  );
};

export default Playlists;
