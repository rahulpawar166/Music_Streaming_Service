import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../firebase/Auth";
import axios from "axios";
import { Link } from "react-router-dom";
import FadeIn from 'react-fade-in';
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Grid,
  Box,
  makeStyles,
  Button,
} from "@material-ui/core";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import SearchSongs from "./SearchSongs";
import Error from "./Error";
import Loading from "./Loading";
import logo from "../icons/incognitomode2.png";

const useStyles = makeStyles({
  logo: {
    marginTop: "20px",
    height: 100,
    width: 100,
  },

  search: {
    width: "300px"
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
    marginLeft: "0px",
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

const Search = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    exists: false,
    message: "",
  });
  const { currentUser } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(undefined);
  const [found, setFound] = useState(false);
  const [musicAlbums, setMusicAlbums] = useState([]);

  const handleFileUpload = async (e) => {
    try {
      if (!e.target.files) return;
      const file = e.target.files[0];
      setSelectedFile(file);
      const formData = new FormData();
      formData.append("mp3File", file);
      const userToken = await currentUser.getIdToken();
      setLoading(true);
      const { data } = await axios.post(
        "http://localhost:3008/search/bymp3",
        formData,
        {
          headers: {
            FirebaseIdToken: userToken,
          },
        },
      );
      console.log(data);
      setSearchData(data);
      setLoading(false);
      setError({
        exists: false,
        message: "",
      });
    } catch (e) {
      console.error(e);
      setLoading(false);
      setError({
        exists: true,
        message: e.message,
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = await currentUser.getIdToken();
        const { data } = await axios.post(
          `http://localhost:3008/search`,
          {
            searchTerm: searchTerm || "Christmas",
          },
          {
            headers: { FirebaseIdToken: userToken },
          },
        );
        if (!data) throw "Failed to fetch search data!";
        setSearchData(data);
        setLoading(false);
        setError({
          exists: false,
          message: "",
        });
      } catch (e) {
        console.log(e);
        setLoading(false);
        setError({
          exists: true,
          message: e.message,
        });
      }
    };
    if (currentUser) fetchData();
  }, [currentUser, searchTerm]);

  const searchValue = async (value) => {
    setLoading(true);
    setSelectedFile(null);
    setSearchTerm(value);
  };

  const buildAlbumCard = (album) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={album?.id}>
        <FadeIn>
        <Card className={classes.card} variant="outlined">
          <CardActions>
            <Link className={classes.link} to={`/album/${album?.id}`}>
            <CardMedia
                className={classes.media}
                component="img"
                image={album?.images[0]?.url}
                title={album?.name}
              />
              <CardHeader className={classes.titleHead} title={album?.name > 30 ? album?.name.substring(0, 27) + "..." : album?.name.substring(0, 30)} />
              
            </Link>
          </CardActions>
        </Card>
        </FadeIn>
      </Grid>
    );
  };

  const buildTrackCard = (track) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={track?.id}>
        <FadeIn>
        <Card className={classes.card} variant="outlined">
          <CardActions>
            <Link className={classes.link} to={`/track/${track?.id}`}>
            <CardMedia
                className={classes.media}
                component="img"
                image={track?.album.images[0].url}
                title={track?.name}
              />
              <CardHeader className={classes.titleHead} title={track?.name > 30 ? track?.name.substring(0, 27) + "..." : track?.name.substring(0, 30)} />
              
            </Link>
          </CardActions>
        </Card>
        </FadeIn>
      </Grid>
    );
  };

  const buildArtistCard = (artist) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={artist?.id}>
        <FadeIn>
        <Card className={classes.card} variant="outlined">
          <CardActions>
            <Link className={classes.link} to={`/artist/${artist?.id}`}>
            <CardMedia
                className={classes.media}
                component="img"
                image={artist?.images[0]?.url}
                title={artist?.name}
              />
              <CardHeader className={classes.titleHead} title={artist?.name > 30 ? artist?.name.substring(0, 27) + "..." : artist?.name.substring(0, 30)
              } />
              
            </Link>
          </CardActions>
        </Card>
        </FadeIn>
      </Grid>
    );
  };

  if (error.exists) return <Error message={error.message} />;
  else {
    return (
      <div className="fancy-border">
        <a href="/"><img className={classes.logo} src={logo} alt="logo" width={100} height={100} /></a>
        <h1 className={classes.title}>Search</h1>
        <SearchSongs className={classes.search} searchValue={searchValue}/>
        <Box>
          <Button
           className={classes.button}
            component="label"
            variant="outlined"
            startIcon={<CloudUploadIcon />}
            sx={{ marginRight: "1rem" }}
          >
            Search by MP3
            <input
              type="file"
              accept=".mp3"
              hidden
              onChange={(e) => handleFileUpload(e)}
            />
          </Button>
          {selectedFile && `Selected: ${selectedFile.name}`}
        </Box>
        {loading ? (
          <Loading />
        ) : (
          <Grid container className={classes.grid} spacing={5}>
            {searchData.tracks && searchData.tracks.items && (
              <Grid item className={classes.grid}>
                <h2 className={classes.subTitle}>Tracks</h2>
                <Grid container className={classes.grid} spacing={5}>
                  {searchData.tracks.items.map((track) =>
                    buildTrackCard(track),
                  )}
                </Grid>
              </Grid>
            )}
            {searchData.albums && searchData.albums.items && (
              <Grid item className={classes.grid}>
                <h2 className={classes.subTitle}>Albums</h2>
                <Grid container className={classes.grid} spacing={5}>
                  {searchData.albums.items.map((album) =>
                    buildAlbumCard(album),
                  )}
                </Grid>
              </Grid>
            )}
            {searchData.artists && searchData.artists.items && (
              <Grid item className={classes.grid}>
                <h2 className={classes.subTitle}>Artists</h2>
                <Grid container className={classes.grid} spacing={5}>
                  {searchData.artists.items.map((artist) =>
                    buildArtistCard(artist),
                  )}
                </Grid>
              </Grid>
            )}
          </Grid>
        )}
      </div>
    );
  }
};
export default Search;
