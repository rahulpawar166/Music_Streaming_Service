import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Grid,
  makeStyles,
  Button,
} from "@material-ui/core";
import SearchSongs from "./SearchSongs";

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

const Search = () => {
  const [musicAlbums, setMusicAlbums] = useState([]);
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(undefined);
  let card = null;
  console.log(
    "accessstoken from new release=",
    window.localStorage.getItem("token"),
  );

  const getSearchSongs = async () => {
    const requestInit = {
      headers: {
        Authorization: `Bearer ${window.localStorage.getItem("token")}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    };

    try {
      setSearchTerm("christmas");
      console.log(`in fetch searchTerm: ${searchTerm}`);
      const query = encodeURIComponent(`${searchTerm}`); //encoding URL component does for query string
      // console.log(query)
      const response = await axios.get(
        `${process.env.REACT_APP_SEARCH_SONG}` + `?q=${query}&type=album`,
        requestInit,
      );
      setSearchData(response.data.albums.items);
      setLoading(false);
      setFound(true);
      setMusicAlbums(response.data.albums.items);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getSearchSongs();
  }, [searchTerm]);

  const searchValue = async (value) => {
    setSearchTerm(value);
  };

  const buildCard = (album) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={album?.id}>
        <Card className={classes.card} variant="outlined">
          <CardActions>
            <Link to={`/AlbumSong/${album?.id}`}>
              <CardHeader className={classes.titleHead} title={album?.name} />
              <CardMedia
                className={classes.media}
                component="img"
                image={album?.images[0]?.url}
                title="character image"
              />
            </Link>
          </CardActions>
          
        </Card>
      </Grid>
    );
  };

  if (searchTerm) {
    card =
      searchData &&
      searchData.map((song) => {
        // let {character} = characters;
        return buildCard(song);
      });
  }

  if (loading) {
    return (
      <div>
        <h2> {"Loading please wait for few second"}</h2>
        <h2> {"................................."}</h2>
      </div>
    );
  } else if (!found) {
    return <h1>404: not enough data for this page</h1>;
  } else {
    return (
      <div>
        <h1>{"Search Music"}</h1>
        <br />
        <SearchSongs searchValue={searchValue} />
        <Grid container className={classes.grid} spacing={5}>
          {musicAlbums?.map((album) => buildCard(album))}
        </Grid>
      </div>
    );
  }
};
export default Search;
