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
import React, { useContext, useEffect, useState } from "react";
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

const Categories = () => {
  const classes = useStyles();
  const { currentUser } = useContext(AuthContext);
  const [categoriesData, setCategoriesData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({
    exists: false,
    message: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = await currentUser.getIdToken();
        const { data } = await axios.get(`http://localhost:3008/categories`, {
          headers: { FirebaseIdToken: userToken },
        });
        if (!data) throw "Failed to fetch categories data!";
        setCategoriesData(data);
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

  const buildCard = (category) => {
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={category?.id}>
        <Card className={classes.card} variant="outlined">
          <CardActions>
            <Link to={`/category/${category?.id}`}>
              <CardHeader
                className={classes.titleHead}
                title={category?.name}
              />
              <CardMedia
                className={classes.media}
                component="img"
                image={category?.icons[0]?.url}
                title="character image"
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
          {categoriesData &&
            categoriesData.map((category) => buildCard(category))}
        </Grid>
      </div>
    );
};

export default Categories;
