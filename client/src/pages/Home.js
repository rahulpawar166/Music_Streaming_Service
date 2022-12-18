import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import Loading from "../components/Loading";
import { AuthContext } from "../firebase/Auth";
import { Link } from "react-router-dom";
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  Grid,
  Box,
  makeStyles,
} from "@material-ui/core";

// const useStyles = makeStyles({
//   card: {
//     maxWidth: 250,
//     height: "auto",
//     marginLeft: "auto",
//     marginRight: "auto",
//     borderRadius: 5,
//     border: "1px solid #1e8678",
//     boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
//   },
//   titleHead: {
//     borderBottom: "1px solid #1e8678",
//     fontWeight: "bold",
//   },
//   grid: {
//     flexGrow: 1,
//     flexDirection: "row",
//   },
//   media: {
//     height: "200px",
//     width: "200px",
//     maxHeight: "200px",
//     maxWidth: "200px",
//   },
//   button: {
//     // color: "#1e8678",
//     fontWeight: "bold",
//     fontSize: 12,
//   },
// });

const Home = () => {
  // const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const [newReleasesData, setNewReleasesData] = useState(null);
  const [newReleasesLoading, setNewReleasesLoading] = useState(true);

  useEffect(() => {
    const fetchNewReleases = async () => {
      try {
        const userToken = await currentUser.getIdToken();
        const { data } = await axios.get("http://localhost:3008/albums/new", {
          headers: {
            FirebaseIdToken: userToken,
          },
        });
        setNewReleasesData(data);
        setNewReleasesLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    if (currentUser) fetchNewReleases();
  }, [currentUser]);

  const buildCard = (album) => {
    return (
      <Grid item key={album?.id}>
        <Card>
          <Link to={`/album/${album?.id}`}>
            <CardMedia
              component="img"
              image={album?.images[0]?.url}
              title="character image"
            />
            <CardHeader title={album?.name} />
          </Link>
        </Card>
      </Grid>
    );
  };

  if (newReleasesLoading) return <Loading />;
  else
    return (
      <Grid container xs={12}>
        <Grid item>
          <h2>New Releases</h2>
          <br />
          <Grid container>
            {newReleasesData?.map((release) => buildCard(release))}
          </Grid>
        </Grid>
        <Grid item>
          <h2>Recommended</h2>
          <br />
        </Grid>
      </Grid>
    );
};
export default Home;
