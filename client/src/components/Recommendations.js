import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Card, CardActions, CardHeader, Grid, makeStyles, CardMedia, Button } from "@material-ui/core";
// import { Default } from "react-toastify/dist/utils";
import { AuthProvider, AuthContext } from "../firebase/Auth";
// import { playlist } from "../../../server/config/mongoCollections";
import Loading from "./Loading"
import FadeIn from 'react-fade-in';
const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: "370px",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
    backgroundColor: "rgba(236, 219, 186, 0.2)"
  },
  title: {
    color: "#346751",
  },
  titleHead: {
    color: "#ffffff",
    fontSize: "5px",
    height: "auto",
    overflow: "hidden",
  },
  grid: {
    flexGrow: 1,
    flexDirection: "row",
    marginLeft: "20px",
    marginRight: "20px"
  },
  media: {
    margin: "0 0 0 0",
  },
  artist: {
    color: "#BDB5B4"
  },
  button: {
    fontWeight: "bold",
    fontSize: 12,
  },
  link: {
    textDecoration: "none"
  }
});

const Recommendations = () => {
  const { currentUser } = useContext(AuthContext);
  // const [newReleasesData, setNewReleasesData] = useState(null);
  // const [newReleasesLoading, setNewReleasesLoading] = useState(true);
  const [trackAlbums, setTrackAlbums] = useState();
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = await currentUser.getIdToken();
        const { data } = await axios.get(
          "http://localhost:3008/albums/recommendations",
          {
            headers: {
              FirebaseIdToken: userToken,
            },
          },
        );
        if (!data) throw "Failed to fetch search data!";
       console.log(data)
        setTrackAlbums(data);
        setLoading(false);
        setFound(true);
      } catch (error) {
        console.error(error);
        setFound(true)
        setLoading(false);
      }
    };
    if (currentUser) fetchData();
  }, [currentUser]);

  const buildCard = (track) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={track?.id}>
        <FadeIn>
          <Card className={classes.card} variant="outlined">
          <CardActions>
            <Link className={classes.link} to={`/album/${track?.album.id}`}>
            <CardMedia
                className={classes.media}
                component="img"
                image={track?.album.images[0]?.url}
                title="character image"
              />
              <CardHeader
                className= {classes.titleHead}
                title={
                  track?.album.name > 30 
                  ? track?.album.name.substring(0, 27) + "..." 
                  : track?.album.name.substring(0, 30)
                }
              />
              <span className={classes.artist}>{track?.album.artists[0].name}</span>
            </Link> 
          </CardActions>
        </Card>
        </FadeIn>
      </Grid>
      
    );
  };

  if (loading) {
    return (
      <Loading />
    );
  } else if (!found) {
    return <h1>404: not enough data for this page</h1>;
  } else
    return (
      <div>
        <br />
        <h1 className={classes.title}>Recommendations</h1>
        <br />
        <Grid container className={classes.grid} spacing={5}>
          {trackAlbums?.map((track) => buildCard(track))}
          {/* <span>{trackAlbums?.artists.map((artist) => buildCard(artist))}</span> */}
        </Grid>
      </div>
    );
};
export default Recommendations;
