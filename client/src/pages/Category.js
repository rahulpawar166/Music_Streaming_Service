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
        <Card className={classes.card} variant="outlined">
          <CardActions>
            <Link to={`/categoryplaylist/${playlist?.id}`}>
              <CardHeader
                className={classes.titleHead}
                title={playlist?.name}
              />
              <CardMedia
                className={classes.media}
                component="img"
                image={playlist?.images[0]?.url}
                title={playlist?.name}
              />
            </Link>
          </CardActions>
        </Card>
      </Grid>
    );
  };

  if (error.exists) return <Error message={error.message} />;
  else if (loading) return <Loading />;
  else
    return (
      <div>
        <h1>Categories</h1>
        <Grid container className={classes.grid} spacing={5}>
          {categoryData && categoryData.map((playlist) => buildCard(playlist))}
        </Grid>
      </div>
    );
};

export default Category;
