import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import Error from "../components/Error";
import Loading from "../components/Loading";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
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
  Divider ,
  ListItemText
} from "@material-ui/core";

// import { Card, CardHeader, Grid, makeStyles, Button } from "@material-ui/core";
import { AuthContext } from "../firebase/Auth"; 
// import Table from '@mui/material/Table';
// import TableBody from '@mui/material/TableBody';
// import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
// import TableHead from '@mui/material/TableHead';
// import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';
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
    fontWeight: "bold",
    fontSize: 12,
  },
});
const addToPlaylist = async (trackId,trackname,img_url) => {
    
  try {
    const { data } = await axios.post(
      `http://localhost:3008/playlist/addTrack`,{
        uid:window.localStorage.getItem("currentUser"),  
        albumId:trackId,
        name:window.localStorage.getItem("currentPlaylist"),
        trackname:trackname,
        img_url:img_url
      }
    );
  } catch (error) {
    console.log("error", error);
  }
};

const AlbumDetails = () => {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();
  const [albumDetails, setAlbumDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAddToPlaylist = async (trackId) => {
    return;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = await currentUser.getIdToken();
        const { data } = await axios.get(`http://localhost:3008/albums/${id}`, {
          headers: {
            FirebaseIdToken: userToken,
          },
        });
        if (!data) throw "Request for album details failed!";
        setAlbumDetails(data);
        setLoading(false);
      } catch (e) {
        setError(e.message);
        console.error(e);
      }
    };
    if (currentUser) fetchData();
  }, [currentUser, id]);

  // const buildCard = (artist, track) => {
  //   return (
  //     <div style={{ maxWidth: '500px' }}>
  //           <h1>Track</h1>
  //           <List style={{ marginTop: '30px' }}>
  //               {track?.map((element, idx) => (
                   
  //                       <ListItem key={element?.name}>
  //                           <ListItemText style={{ maxWidth: '25px' }}>{idx + 1}.</ListItemText>
  //                           <ListItemText style={{ textAlign: 'start' }} >{element?.name}</ListItemText>
  //                           <Button style={{textAlign: 'start'}} onClick={() => addToPlaylist(element?.id,element?.name)}>
  //                             Add To PlayList
  //                           </Button>
  //                       </ListItem>
                          
  //               ))}
  //           </List>
  //       </div>

  //     // <Table className="TrackTable" sx={{ maxWidth: 700 }} aria-label="simple table">
  //     // <TableHead title={track?.id}>
  //     //   <TableRow>
  //     //     <TableCell >Track:</TableCell>
  //     //     <TableCell style={{ maxWidth: '200px'}} component="th" scope="row">{track?.name}</TableCell>
  //     //     <Button style={{textAlign: 'start'}} onClick={() => addToPlaylist(track?.id,track?.name)}>
  //     //      Add To PlayList
  //     //    </Button>
  //     //    <Button>Play</Button>
  //     //    <Button href={`/Lyrics/${artist}/${track?.name}`}>Lyrics</Button>         
  //     //    </TableRow>
  //     // </TableHead>
  //     // <TableBody>
  //     //   </TableBody>
  //     // </Table>
  //     // <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={track?.id}>
  //     //   <Card className={classes.card} variant="outlined">
  //     //     {/* <CardHeader className={classes.titleHead} title={track?.id} /> */}
  //     //     <CardHeader className={classes.titleHead} title={track?.name} />
  //     //     <br />
  //     //     <Button onClick={() => handleAddToPlaylist(track?.id)}>
  //     //       Add To PlayList
  //     //     </Button>
  //     //     <Button>Play</Button>
  //     //     <br />
  //     //     <Link to={`/Lyrics/${artist}/${track?.name}`}>Lyrics</Link>
  //     //   </Card>
  //     // </Grid>
  //   );
  // };

  if (loading) return <Loading />;
  else if (error) return <Error message={error} />;
  else
    return (
      albumDetails && (
        <div key={albumDetails.id}>
          <h1>{albumDetails.name}</h1>

          <img
            className="Album"
            src={albumDetails.images[0].url}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/no-image.jpg";
            }}
            alt={albumDetails.name}
          />
          <p style={{textAlign: 'center'}}>
          Number of Tracks:  {`${albumDetails.total_tracks} ${
              parseInt(albumDetails.total_tracks) === 1 ? "Song" : "Songs"
            }`}
          </p>
          <br />
          <TableContainer container="true" className={classes.grid} spacing={5}>
            {/* {albumDetails.tracks.items.map((track) => */}
              <div style={{ maxWidth: '1500px' }}>
              <h1 style={{ textAlign: 'center' }}>Track</h1>
              <List style={{ marginTop: '30px' }}>
                  {albumDetails.tracks.items?.map((element, idx) => (
                    <ListItem key={element?.name}>
                        <ListItemText style={{ maxWidth: '25px' }}>{idx + 1}.</ListItemText>
                        <ListItemText style={{maxWidth: '1150px', textAlign: 'start' }} >{element?.name}</ListItemText>
                        <Button style={{textAlign: 'start'}} onClick={() => addToPlaylist(element?.id,element?.name)}>
                          Add To PlayList
                        </Button><br/>
                        <Button>
                          Play
                        </Button><br/>
                        <Button className="lyrics" href={`/Lyrics/${albumDetails?.artists[0]?.name}/${element?.name}`}>Lyrics</Button>         
                    </ListItem>
                  ))}
                  </List>
              </div>
               {/* buildCard(albumDetails.artists[0].name, track), */}
            {/* )} */}
          </TableContainer>
        </div>
      )
    );
};
export default AlbumDetails;
