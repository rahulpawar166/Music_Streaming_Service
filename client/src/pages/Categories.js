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
import logo from "../icons/incognitomode2.png";
import FadeIn from "react-fade-in";

const useStyles = makeStyles({
  logo: {
    marginTop: "20px",
    height: 100,
    width: 100,
  },

  card: {
    maxWidth: 250,
    height: "300px",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 5,
    boxShadow: "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
    backgroundColor: "rgba(236, 219, 186, 0.2)",
  },
  title: {
    marginTop: "20px",
    color: "#008c00",
  },
  subTitle: {
    color: "#C84B31",
    textAlign: "left",
    marginLeft: "70px",
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
  },
  media: {
    margin: "0 0 0 0",
  },

  link: {
    textDecoration: "none",
  },
  button: {
    backgroundColor: "#ECDBBA",
    color: "#161616",
    "&:hover": {
      backgroundColor: "#FCDBBB",
      color: "#161616",
    },
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
        <FadeIn>
          <Card className={classes.card} variant="outlined">
            <CardActions>
              <Link className={classes.link} to={`/category/${category?.id}`}>
                <CardMedia
                  className={classes.media}
                  component="img"
                  image={category?.icons[0]?.url}
                  title="character image"
                />
                <CardHeader
                  className={classes.titleHead}
                  title={category?.name}
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
        <a href="/">
          <img
            className={classes.logo}
            src={logo}
            alt="logo"
            width={100}
            height={100}
          />
        </a>
        <h1 className={classes.title}>Categories</h1>
        <Grid container className={classes.grid} spacing={5}>
          {categoriesData &&
            categoriesData.map((category) => buildCard(category))}
        </Grid>
      </div>
    );
};

export default Categories;
