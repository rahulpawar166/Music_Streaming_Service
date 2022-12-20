import {
  Card,
  CardActions,
  Button,
  CardHeader,
  CardMedia,
  Grid,
  makeStyles,
} from "@material-ui/core";
import { Link } from "react-router-dom";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Error from "../components/Error";
import Loading from "../components/Loading";
import { AuthContext } from "../firebase/Auth";
import FadeIn from 'react-fade-in';

const useStyles = makeStyles({
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
    marginRight: "20px",
    marginTop: "20px",
    marginBottom: "20px"
  },
  media: {
    margin: "0 0 0 0",
  },

  link: {
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

const Category = () => {
  const classes = useStyles();
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [categoryData, setCategoryData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    exists: false,
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = await currentUser.getIdToken();
        const { data } = await axios.get(
          `http://localhost:3008/categories/${id}`,
          {
            headers: { FirebaseIdToken: userToken },
          },
        );
        if (!data) throw "Failed to fetch categories data!";
        setCategoryData(data);
        setLoading(false);
        setError({
          exists: false,
          message: "",
        });
      } catch (e) {
        setLoading(true);
        setError({
          exists: true,
          message: e.message,
        });
      }
    };
    if (currentUser) fetchData();
  }, [currentUser]);

  const buildCard = (playlist) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={playlist?.id}>
        <FadeIn>
        <Card className={classes.card} variant="outlined">
          <CardActions>
            <Link className={classes.link} to={`/categoryplaylist/${playlist?.id}`}>
              
            <CardMedia
                className={classes.media}
                component="img"
                image={playlist?.images[0]?.url}
                title={playlist?.name}
              />
              
              <CardHeader
                className={classes.titleHead}
                title={playlist?.name > 30 ? playlist?.name.substring(0, 27) + "..." : playlist?.name.substring(0, 30)}
              />
              
            </Link>
          </CardActions>
        </Card>
        </FadeIn>
      </Grid>
    );
  };

  if (error.exists) return <Error message={error.message} />;
  else if (loading) return <Loading />;
  else
    return (
      <div>
        <Grid container className={classes.grid} spacing={5}>
          {categoryData && categoryData.map((playlist) => buildCard(playlist))}
        </Grid>
      </div>
    );
};

export default Category;
