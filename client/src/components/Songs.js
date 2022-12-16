import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
// import noImage from "../img/download.jpeg";
import {
  makeStyles,
  Card,
  CardContent,
  CardMedia,
  Typography,
  CardHeader,
} from "@material-ui/core";
import "../App.css";
const useStyles = makeStyles({
  card: {
    maxWidth: 550,
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
    height: "100%",
    width: "100%",
  },
  button: {
    color: "#1e8678",
    fontWeight: "bold",
    fontSize: 12,
  },
});

const Songs = () => {
    const [musicAlbumsData, setMusicAlbumsData] = useState([]);
    const classes = useStyles();
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [found, setFound] = useState(false);
    // const [searchData, setSearchData] = useState(undefined);
    let {id} = useParams();
    let card = null;
    console.log(
      "accessstoken from new release=",
      window.localStorage.getItem("token")
    );
  
    const Song = async () => {   
    const requestInit = {
            headers: {
              Authorization: `Bearer ${window.localStorage.getItem("token")}`,
              "Content-Type": "application/json",
              Accept: "application/json"
          },
      };
      
    try{ 
        if (!id) {
            setErrorMessage("ERROR: MUST PASS IN ID");
          }
        const response = await axios.get(
            `${process.env.REACT_APP_ALBUMS_URL}`+ `/${id}`,
            requestInit
        );
        // console.log(response);
        // console.log(response.data);

        setLoading(false);
        setFound(true);
        setMusicAlbumsData(response.data);
    } catch (e){
      console.log(e);
    }
  };
  
    useEffect(()=>{
      Song();

    }, [id]);

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  } else if (!found) {
    return <h1>404: not enough data for this page</h1>;
  } else {
    return (
      <Card className={classes.card} variant="outlined">
        <CardHeader className={classes.titleHead} title={musicAlbumsData.artists[0]?.name} />
        <CardMedia
          className={classes.media}
          component="img"
          image={
            musicAlbumsData.images[0]?.url
          }
          title="Album image"
        />
        <CardContent>
          <Typography variant="body2" color="textSecondary" component="span">
          <dl>
              <h2>
                <dt className="title">Album Name:</dt>
                {musicAlbumsData && musicAlbumsData.name ? (<dd>{musicAlbumsData.name}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </h2>
            </dl>
            <dl>
              <h2>
                <dt className="title">Number of Tracks: </dt>
                {musicAlbumsData && musicAlbumsData.total_tracks ? (<dd>{musicAlbumsData.total_tracks}</dd>
                ) : (
                  <dd>N/A</dd>
                )}
              </h2>
            </dl>
            <dl>
              <h2>
                <dt className="title">Album Tracks: </dt>
                {musicAlbumsData && musicAlbumsData?.tracks.items.length !== 0 ? (
                  musicAlbumsData?.tracks.items.map((c)=> {
                    return <dd>{c.name}<br/>
                    <audio controls preload="auto">
                        <source src={c.preview_url} type="audio/mpeg"/>
                    </audio></dd>
                  }) 
                ) : (
                   <dd>N/A</dd>
                )}
              </h2>
            </dl>
            <Link to="/search">
              Back to Search
            </Link>
          </Typography>
        </CardContent>
      </Card>
    );
  }
};

export default Songs;
