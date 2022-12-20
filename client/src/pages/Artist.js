import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Error from "../components/Error";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import PlayerContext from "../components/PlayerContext";
import { useParams } from "react-router-dom";
import FadeIn from "react-fade-in";
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
  title: {
    fontSize: "40px",
    marginTop: "20px",
    color: "#008c00",
  },
});

const Artist = () => {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [artistDetails, setArtistDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = await currentUser.getIdToken();
        const { data } = await axios.get(
          `http://localhost:3008/artists/${id}`,
          {
            headers: {
              FirebaseIdToken: userToken,
            },
          },
        );
        if (!data) throw "Request for album details failed!";
        console.log(data.items);
        setArtistDetails(data.items);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        console.error(e);
      }
    };
    if (currentUser) fetchData();
  }, [currentUser, id]);

  const buildArtistCard = (artist) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={artist?.id}>
        <FadeIn>
          <Card className={classes.card} variant="outlined">
            <CardActions>
              <Link to={`/album/${artist?.id}`}>
                <CardHeader
                  className={classes.titleHead}
                  title={artist?.name}
                />

                <CardMedia
                  className={classes.media}
                  component="img"
                  image={artist?.images[0]?.url}
                  title="album image"
                />
              </Link>
            </CardActions>
          </Card>
        </FadeIn>
      </Grid>
    );
  };

  if (loading) return <Loading />;
  else if (error) return <Error message={error} />;
  else
    return (
      <div>
        <h1 className={classes.title}>Artists & their Albums</h1>
        <Grid container className={classes.grid} spacing={5}>
          {artistDetails &&
            artistDetails.map((artist) => buildArtistCard(artist))}
        </Grid>
      </div>
    );
};
export default Artist;
