import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import { AuthContext } from "../firebase/Auth";
import { Link } from "react-router-dom";
import logo from "../icons/incognitomode2.png";
import FadeIn from 'react-fade-in';
import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Grid,
  Box,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles({

  logo: {
    marginTop: "20px",
    height: 100,
    width: 100,
  },

  card: {
    maxWidth: 250,
    height: "350px",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
    backgroundColor: "rgba(236, 219, 186, 0.2)"
  },
  title: {
    marginTop: "20px",
    color: "#346751",
  },
  subTitle: {
    color: "#C84B31",
    textAlign: "left",
    marginLeft: "70px"
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
  
  link: {
    textDecoration: "none"
  },
  trackLink: {
    textDecoration: "none"
  },
  button: {
    backgroundColor: "#ECDBBA",
    color: "#161616",
    '&:hover': {
      backgroundColor: "#FCDBBB",
      color: "#161616",
   }
  },
});

const Home = () => {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const [newReleasesData, setNewReleasesData] = useState(null);
  const [newReleasesLoading, setNewReleasesLoading] = useState(true);
  const [usersTop, setUsersTop] = useState(null);
  const [usersTopLoading, setUsersTopLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = await currentUser.getIdToken();
        const { data: albumData } = await axios.get(
          "http://localhost:3008/albums/new",
          {
            headers: {
              FirebaseIdToken: userToken,
            },
          },
        );
        setNewReleasesData(albumData.slice(0, 6));
        setNewReleasesLoading(false);
        const { data: topData } = await axios.get(
          "http://localhost:3008/me/top/tracks",
          {
            headers: {
              FirebaseIdToken: userToken,
            },
          },
        );
        setUsersTop(topData);
        setUsersTopLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    if (currentUser) fetchData();
  }, [currentUser]);

  const buildAlbumCard = (album) => {
    return (
      album && (
        
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={album.id}>
          <FadeIn>
          <Card className={classes.card} variant="outlined">
            <CardActions>
              <Link className={classes.link} to={`/album/${album.id}`}>
              <CardMedia
                  className={classes.media}
                  component="img"
                  image={album.images[0].url}
                  alt={album.name}
                />
                <CardHeader
                  className={classes.titleHead}
                  title={
                    album.name.length > 32
                      ? album.name.substring(0, 29) + "..."
                      : album.name.substring(0, 32)
                  }
                />
                
              </Link>
            </CardActions>
          </Card>
          </FadeIn>
        </Grid>
      )
    );
  };

  const buildTrackCard = (track) => {
    return (
      track && (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={track.id}>
          <FadeIn>
          <Card className={classes.card} variant="outlined">
            <CardActions>
              <Link className={classes.link} to={`/track/${track.id}`}>
              <CardMedia
                  className={classes.media}
                  component="img"
                  image={track.album.images[0].url}
                  alt={track.name}
                />

                <CardHeader
                  className={classes.titleHead}
                  title={
                    track.name.length > 32
                      ? track.name.substring(0, 29) + "..."
                      : track.name.substring(0, 32)
                  }
                />
                
              </Link>
            </CardActions>
          </Card>
          </FadeIn>
        </Grid>
      )
    );
  };

  if (newReleasesLoading || usersTopLoading) return <Loading />;
  else
    return (
      <div className="fancy-border">
        <img className={classes.logo} src={logo} alt="logo" width={100} height={100} />
        <h1 className={classes.title}>Home</h1>
        <Grid container xs={12}>
          <Grid item className={classes.grid}>
            <Button className={classes.button} href={`/Recommendations`}>Want New Music?</Button>

            <h2 className={classes.subTitle}>New Releases</h2>
            <Grid container className={classes.grid} spacing={5}>
              {newReleasesData &&
                newReleasesData.map((album) => buildAlbumCard(album))}
            </Grid>
          </Grid>
          <Grid item className={classes.grid}>
            <h2 className={classes.subTitle}>My Music</h2>
            <Grid container className={classes.grid} spacing={5}>
              {usersTop && usersTop.map((track) => buildTrackCard(track))}
            </Grid>
          </Grid>
        </Grid>
      </div>
    );
};
export default Home;
