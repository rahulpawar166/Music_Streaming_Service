import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import { AuthContext } from "../firebase/Auth";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Grid,
  makeStyles,
} from "@material-ui/core";
import logo from "../icons/incognitomode2.png";
import { Link } from "react-router-dom";

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

const NewReleases = () => {
  const { currentUser } = useContext(AuthContext);
  const [newReleasesData, setNewReleasesData] = useState(null);
  const [newReleasesLoading, setNewReleasesLoading] = useState(true);
  const classes = useStyles();

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
        setNewReleasesData(albumData);
        setNewReleasesLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    if (currentUser) fetchData();
  }, [currentUser]);

  const buildAlbumCard = (album) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={album.id}>
        <Card className={classes.card} variant="outlined">
          <CardActions>
            <Link to={`/album/${album.id}`}>
              <CardHeader
                className={classes.titleHead}
                title={
                  album.name.length > 32
                    ? album.name.substring(0, 29) + "..."
                    : album.name.substring(0, 32)
                }
              />
              <CardMedia
                className={classes.media}
                component="img"
                image={album.images[0].url}
                alt={album.name}
              />
            </Link>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  if (newReleasesLoading) return <Loading />;
  else
    return (
      <div className="fancy-border">
        <img className="logo" src={logo} alt="logo" width={100} height={100} />
        <h1>New Releases</h1>
        <br />
        <Grid container className={classes.grid} spacing={5}>
          {newReleasesData
            ? newReleasesData.map((album) => buildAlbumCard(album))
            : ""}
        </Grid>
      </div>
    );
};

export default NewReleases;
