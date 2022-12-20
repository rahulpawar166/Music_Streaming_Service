import React, { useEffect, useState,useContext } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { Card, CardActions, CardHeader, Grid, makeStyles, CardMedia, Button } from "@material-ui/core";
// import { Default } from "react-toastify/dist/utils";
import { AuthProvider, AuthContext } from "../firebase/Auth";
// import { playlist } from "../../../server/config/mongoCollections";
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
    // color: "#1e8678",
    fontWeight: "bold",
    fontSize: 12,
  },
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
          <Card className={classes.card} variant="outlined">
          <CardActions>
            <Link to={`/album/${track?.album.id}`}>
              <CardHeader
                className={classes.titleHead}
                title={track?.album.name}
              />
              <CardMedia
                className={classes.media}
                component="img"
                image={track?.album.images[0]?.url}
                title="character image"
              />
              <span>{track?.album.artists[0].name}</span>
            </Link> 
          </CardActions>
        </Card>
      </Grid>
      
    );
  };

  if (loading) {
    return (
      <div>
        <h2> {"Loading please wait for few second"}</h2>
        <h2> {"................................."}</h2>
      </div>
    );
  } else if (!found) {
    return <h1>404: not enough data for this page</h1>;
  } else
    return (
      <div>
        <br />
        <h1>Recommendations</h1>
        <br />
        <Grid container className={classes.grid} spacing={5}>
          {trackAlbums?.map((track) => buildCard(track))}
          {/* <span>{trackAlbums?.artists.map((artist) => buildCard(artist))}</span> */}
        </Grid>
      </div>
    );
};
export default Recommendations;
