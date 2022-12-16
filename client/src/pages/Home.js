import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import logo from '../icons/incognitomode2.png';
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Grid,
  makeStyles,
} from "@material-ui/core";

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

const Home = () => {
  const classes = useStyles();
  const [musicAlbums, setMusicAlbums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);

  console.log("accessToken from Home: ", window.localStorage.getItem("token"));

  const getAlbums = async () => {
    const requestInit = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
    };

    try {
      const country= 'US';
      const offset=0;
      const limit=20;
      const response = await axios.get(
        `https://api.spotify.com/v1/browse/categories?country=${country}&offset=${offset}&limit=${limit}`,
        requestInit,
      );
      console.log(response)
      console.log(response.data.categories.items);
      setLoading(false);
      setFound(true);
      setMusicAlbums(response.data.categories.items);
    } catch (error) {
      setFound(false);
      setLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    getAlbums();
    // getPlayList()
  }, []);

  const buildCard = (album) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={album?.name}>
        <Card className={classes.card} variant="outlined">
          <CardActions>
            <Link to={`/Categories/${album?.id}`}>
              <CardHeader className={classes.titleHead} title={album?.name} />
              <CardMedia
                className={classes.media}
                component="img"
                image={album?.icons[0].url}
                title="character image"
              />
            </Link>
          </CardActions>
          {/* <Button className={classes.button}>Explore</Button> */}
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
      <div class="fancy-border">
        <img class="logo"src={logo} alt="logo" width={100} height={100}/>
        <h1>incognito.</h1>
        <h2>{"Browse Categories"}</h2>
        <br />
        <Grid container className={classes.grid} spacing={5}>
          {musicAlbums?.map((album) => buildCard(album))}
        </Grid>
      </div>
    );
};
export default Home;
