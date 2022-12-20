import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
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
  Divider,
  ListItemText,
} from "@material-ui/core";

import { AuthContext } from "../firebase/Auth";
import DeleteIcon from "@material-ui/icons/Delete";

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

const Playlist = () => {
  const classes = useStyles();
  const [playlistData, setPlayListData] = useState();
  const [loading, setLoading] = useState(true);
  const [found, setFound] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const { id } = useParams();

  const getPlayList = async (id) => {
    try {
      const userToken = await currentUser.getIdToken();
      const { data } = await axios.get(
        `http://localhost:3008/playlists/${id}`,
        {
          headers: {
            FirebaseIdToken: userToken,
          },
        },
      );
      console.log(data);
      setPlayListData(data);
      setLoading(false);
      setFound(true);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      setFound(false);
    }
  };

  const deleteFromPlaylist = async (trackId) => {
    console.log("button clicked");
    const userToken = await currentUser.getIdToken();
    try {
      const { data } = await axios.patch(
        `http://localhost:3008/playlists/removefrom/${id}`,
        {
          trackId: trackId,
        },

        {
          headers: {
            FirebaseIdToken: userToken,
          },
        },
      );
      setPlayListData(data);
      setLoading(false);
      setFound(true);
      console.log(playlistData);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
      setFound(false);
    }
  };

  useEffect(() => {
    getPlayList(id);
  }, [id]);

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
        <h1>{" tracks"}</h1>
        <br />
        <div>
          <h1>Playlist : {playlistData?.name}</h1>
          <List style={{ marginTop: "30px" }}>
            {playlistData?.tracks?.map((element, idx) => (
              <ListItem key={element?.idx}>
                <ListItemText style={{ maxWidth: "25px", color: "white" }}>
                  {idx + 1}.
                </ListItemText>
                <ListItemText style={{ textAlign: "start", color: "white" }}>
                  {element?.name}
                </ListItemText>
                <a onClick={() => deleteFromPlaylist(element?.id)}>
                  <DeleteIcon />
                </a>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    );
};
export default Playlist;
