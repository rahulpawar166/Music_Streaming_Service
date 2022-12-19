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
  const classes = useStyles();
  const [trackAlbums, setTrackAlbums] = useState();

  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);

  const getGenreSeeds = async () => {
    let seed_artists="4NHQUGzhtTLFvgF5SZesLK"
    let seed_tracks= "0c6xIDDpzE81m2q797ordA"
    let seed_genres = encodeURIComponent("rock,hip-hop,pop")
    const requestInit = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
    };

    try {
    const response = await axios.get(
        `https://api.spotify.com/v1/recommendations?seed_artists=${seed_artists}&seed_genres=${seed_genres}&seed_tracks=${seed_tracks}` ,
        requestInit
        )
    

      console.log("we get response");
      console.log("data=", response.data.tracks);

      setLoading(false);
      setFound(true);
      setTrackAlbums(response.data.tracks);
    } catch (error) {
      setFound(false);
      setLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    console.log("inside recommendations")
    getGenreSeeds();
  }, []);

  const buildCard = (track) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={track?.album.id}>
        <Card className={classes.card} variant="outlined">
        <CardActions>
        <Link to={`/AlbumSong/${track?.album.id}`}>
          
          <CardHeader className={classes.titleHead} title={track?.name} />
          <img src={track?.album.images[0].url} width={200} height={200}/>
          <br/>
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
